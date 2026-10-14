import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const list = await categoryService.getAllCategories();
        setCategories(list);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    load();
  }, []);

  const filteredCategories = categories.filter((c) => {
    if (selectedGender === 'all') return true;
    return c.gender === selectedGender;
  });

  const handleToggleActive = async (id: string) => {
    const updated = await categoryService.toggleCategoryActive(id);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    showToast(`Category status updated to ${updated.isActive ? 'Active' : 'Inactive'}.`, 'success');
  };

  const handleDelete = async (category: Category) => {
    try {
      await categoryService.deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      showToast(`Category "${category.name}" removed successfully.`, 'info');
      setDeleteError(null);
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete category.');
    }
  };

  const handleSave = async (data: Partial<Category> & { name: string; slug: string; gender: Category['gender'] }) => {
    const saved = await categoryService.saveCategory(data);
    const updatedList = await categoryService.getAllCategories();
    setCategories(updatedList);
    setIsEditorOpen(false);
    showToast(`Category "${saved.name}" saved successfully.`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Taxonomy & Hierarchy
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Category Hierarchy
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Organize Men and Women departmental categories, subcategories, and landing campaigns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingCategory(null);
              setIsEditorOpen(true);
            }}
          >
            Add New Category
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'men', 'women'] as const).map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGender(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              selectedGender === g
                ? 'bg-brand-espresso text-brand-ivory'
                : 'bg-white border border-brand-espresso/15 text-brand-espresso/70 hover:border-brand-espresso/30'
            }`}
          >
            {g === 'all' ? 'All Departments' : `${g}'s Department`}
          </button>
        ))}
      </div>

      {/* Safety Deletion Error Alert */}
      {deleteError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1 text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="font-bold">Category Safety Deletion Blocked</h5>
            <p className="text-[11px] text-rose-800 leading-relaxed">{deleteError}</p>
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="text-rose-600 hover:text-rose-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Display Order</th>
                <th className="py-3 px-4">Active State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.heroBannerImage}
                        alt={c.name}
                        className="w-12 h-10 object-cover rounded bg-brand-ivory border border-brand-espresso/10"
                      />
                      <div>
                        <p className="font-bold text-brand-espresso font-serif">{c.name}</p>
                        <p className="text-[11px] text-brand-espresso/60 line-clamp-1">
                          {c.description || 'Artisanal handcrafted luxury collection'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-brand-espresso/80">/{c.slug}</td>

                  <td className="py-3.5 px-4">
                    <span className="capitalize font-semibold text-brand-espresso">{c.gender}</span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-brand-espresso">#{c.displayOrder}</td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(c.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        c.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-brand-espresso/10 text-brand-espresso/50'
                      }`}
                    >
                      {c.isActive ? 'Active on Storefront' : 'Inactive / Hidden'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/category/${c.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-brand-espresso/5 text-brand-espresso/50 hover:text-brand-gold"
                        title="View Category Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => {
                          setEditingCategory(c);
                          setIsEditorOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-brand-espresso/5 text-brand-espresso/50 hover:text-brand-espresso"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 rounded hover:bg-rose-50 text-brand-espresso/50 hover:text-brand-terracotta"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Editor Modal */}
      {isEditorOpen && (
        <CategoryEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          initialCategory={editingCategory}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// --- Category Editor Sub-Component ---
interface CategoryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory: Category | null;
  onSave: (data: any) => Promise<void>;
}

const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onSave,
}) => {
  const [name, setName] = useState(initialCategory?.name || '');
  const [slug, setSlug] = useState(initialCategory?.slug || '');
  const [description, setDescription] = useState(initialCategory?.description || '');
  const [gender, setGender] = useState<Category['gender']>(initialCategory?.gender || 'men');
  const [displayOrder, setDisplayOrder] = useState(initialCategory?.displayOrder || 1);
  const [heroBannerImage, setHeroBannerImage] = useState(
    initialCategory?.heroBannerImage ||
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
  );
  const [isActive, setIsActive] = useState(initialCategory?.isActive ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }
    if (!slug.trim()) {
      showToast('URL slug is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: initialCategory?.id,
        name,
        slug,
        description,
        gender,
        displayOrder,
        heroBannerImage,
        isActive,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-espresso/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-espresso/10 animate-fade-in space-y-5 text-xs">
        <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-espresso">
              {initialCategory ? `Edit: ${initialCategory.name}` : 'Create New Category'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-espresso/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Category Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Wedding Sherwanis"
              required
            />
            <Input
              label="URL Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="wedding-sherwanis"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-espresso mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Editorial category introduction..."
              className="w-full bg-brand-ivory/40 border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-espresso mb-1">
                Department
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-brand-ivory/50 border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
              >
                <option value="men">Men's Department</option>
                <option value="women">Women's Department</option>
              </select>
            </div>

            <Input
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
              required
            />
          </div>

          <Input
            label="Hero Banner Image URL"
            value={heroBannerImage}
            onChange={(e) => setHeroBannerImage(e.target.value)}
            placeholder="https://..."
            required
          />

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
            />
            <span className="font-semibold text-brand-espresso">Active and visible in mega-menu & catalog</span>
          </label>

          <div className="flex gap-2 justify-end pt-3 border-t border-brand-espresso/10">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
