/**
 * Vastramay Category Management Service
 * Supports CRUD, reordering, activation/deactivation, and deletion safety checks.
 */

import { storage } from './storageAdapter';
import { MOCK_CATEGORIES } from '../data/categories';
import { productService } from './productService';
import { Category } from '../types';

const CATEGORIES_STORAGE_KEY = 'categories';

export const categoryService = {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return await storage.getItem<Category[]>(CATEGORIES_STORAGE_KEY, MOCK_CATEGORIES);
  },

  /**
   * Get category by ID or slug
   */
  async getCategoryById(idOrSlug: string): Promise<Category | undefined> {
    const categories = await this.getAllCategories();
    return categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  },

  /**
   * Create or update a category
   */
  async saveCategory(categoryData: Partial<Category> & { name: string; slug: string; gender: Category['gender'] }): Promise<Category> {
    const categories = await this.getAllCategories();
    const existingIndex = categories.findIndex((c) => c.id === categoryData.id || c.slug === categoryData.slug);

    if (existingIndex >= 0) {
      // Update existing
      categories[existingIndex] = {
        ...categories[existingIndex],
        ...categoryData,
      };
      await storage.setItem(CATEGORIES_STORAGE_KEY, categories);
      return categories[existingIndex];
    } else {
      // Create new
      const newCategory: Category = {
        id: categoryData.id || `cat-${Date.now()}`,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || '',
        gender: categoryData.gender,
        parentId: categoryData.parentId,
        displayOrder: categoryData.displayOrder ?? categories.length + 1,
        isActive: categoryData.isActive ?? true,
        image:
          categoryData.heroBannerImage ||
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
        heroBannerImage:
          categoryData.heroBannerImage ||
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
        featured: categoryData.featured ?? false,
        itemCount: 0,
        subcategories: categoryData.subcategories || [],
      };
      categories.push(newCategory);
      await storage.setItem(CATEGORIES_STORAGE_KEY, categories);
      return newCategory;
    }
  },

  /**
   * Toggle category active status
   */
  async toggleCategoryActive(categoryId: string): Promise<Category> {
    const categories = await this.getAllCategories();
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) throw new Error('Category not found');

    categories[index].isActive = !categories[index].isActive;
    await storage.setItem(CATEGORIES_STORAGE_KEY, categories);
    return categories[index];
  },

  /**
   * Delete category with strict safety validation
   * Prevents deleting any category that still has active products.
   */
  async deleteCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
    const categories = await this.getAllCategories();
    const category = categories.find((c) => c.id === categoryId);
    if (!category) throw new Error('Category not found');

    // Check if products still use this category
    const products = await productService.getAllProducts();
    const assignedProducts = products.filter(
      (p) => p.categorySlug === category.slug || p.subcategorySlug === category.slug
    );

    if (assignedProducts.length > 0) {
      throw new Error(
        `Cannot delete "${category.name}" because ${assignedProducts.length} active garment(s) are currently assigned to it. Reassign or delete those products before removing this category.`
      );
    }

    const filtered = categories.filter((c) => c.id !== categoryId);
    await storage.setItem(CATEGORIES_STORAGE_KEY, filtered);
    return { success: true, message: `Category "${category.name}" removed successfully.` };
  },

  /**
   * Reset categories to defaults
   */
  async resetToDefaults(): Promise<void> {
    await storage.setItem(CATEGORIES_STORAGE_KEY, MOCK_CATEGORIES);
  },
};
