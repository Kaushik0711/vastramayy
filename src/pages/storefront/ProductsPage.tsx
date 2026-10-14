import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { productService, ProductFilterOptions, CatalogFacets } from '../../services/productService';
import { Product, Category, ProductGender } from '../../types';
import { ProductCard } from '../../components/storefront/ProductCard';
import { CatalogBreadcrumb, BreadcrumbItem } from '../../components/storefront/CatalogBreadcrumb';
import { CatalogFilterSidebar } from '../../components/storefront/CatalogFilterSidebar';
import { MobileFilterDrawer } from '../../components/storefront/MobileFilterDrawer';
import { ActiveFilterChips } from '../../components/storefront/ActiveFilterChips';
import { CatalogToolbar } from '../../components/storefront/CatalogToolbar';
import { DepartmentHero } from '../../components/storefront/DepartmentHero';
import { Button } from '../../components/common/Button';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface ProductsPageProps {
  forcedGender?: ProductGender;
  isSalePage?: boolean;
}

const ITEMS_PER_PAGE = 9;

export const ProductsPage: React.FC<ProductsPageProps> = ({ forcedGender, isSalePage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams<{ categorySlug?: string; subcategorySlug?: string }>();

  // Determine effective department / category from route or query params
  const effectiveGender: ProductGender | 'all' =
    forcedGender || (searchParams.get('gender') as ProductGender) || 'all';

  const categorySlugParam = routeParams.categorySlug || searchParams.get('category') || undefined;
  const subcategorySlugParam = routeParams.subcategorySlug || searchParams.get('subcategory') || undefined;
  const isSaleOnlyParam = isSalePage || searchParams.get('sale') === 'true' || searchParams.get('onSale') === 'true';

  // State
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Layout states
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Memoize Filter Options parsed from URL query params
  const currentFilters: ProductFilterOptions = useMemo(() => {
    return {
      gender: effectiveGender,
      categorySlug: categorySlugParam,
      subcategorySlug: subcategorySlugParam,
      searchQuery: searchParams.get('q') || searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sizes: searchParams.getAll('size').length > 0 ? searchParams.getAll('size') : undefined,
      colors: searchParams.getAll('color').length > 0 ? searchParams.getAll('color') : undefined,
      fabrics: searchParams.getAll('fabric').length > 0 ? searchParams.getAll('fabric') : undefined,
      occasions: searchParams.getAll('occasion').length > 0 ? searchParams.getAll('occasion') : undefined,
      inStockOnly: searchParams.get('inStock') === 'true' ? true : undefined,
      onSaleOnly: isSaleOnlyParam ? true : undefined,
      minRating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      sortBy: (searchParams.get('sort') as ProductFilterOptions['sortBy']) || 'featured',
    };
  }, [searchParams, effectiveGender, categorySlugParam, subcategorySlugParam, isSaleOnlyParam]);

  // Load Categories & Filter Products
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setLoading(true);
      try {
        const [cats, all, filtered] = await Promise.all([
          productService.getCategories(),
          productService.getAllProducts(),
          productService.filterProducts(currentFilters),
        ]);

        if (isMounted) {
          const calculatedFacets = await productService.getFacets(filtered);
          setCategories(cats);
          setAllProducts(all);
          setFilteredProducts(filtered);
          setFacets(calculatedFacets);
          setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on filter change
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, [currentFilters]);

  // Handle URL filter updates
  const handleFilterChange = (updates: Partial<ProductFilterOptions>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === 'all') {
        const paramName =
          key === 'sizes'
            ? 'size'
            : key === 'colors'
            ? 'color'
            : key === 'fabrics'
            ? 'fabric'
            : key === 'occasions'
            ? 'occasion'
            : key;
        next.delete(paramName);
      } else if (Array.isArray(val)) {
        const paramName =
          key === 'sizes'
            ? 'size'
            : key === 'colors'
            ? 'color'
            : key === 'fabrics'
            ? 'fabric'
            : key === 'occasions'
            ? 'occasion'
            : key;
        next.delete(paramName);
        val.forEach((item) => next.append(paramName, item));
      } else if (key === 'inStockOnly') {
        if (val) next.set('inStock', 'true');
        else next.delete('inStock');
      } else if (key === 'onSaleOnly') {
        if (val) next.set('sale', 'true');
        else next.delete('sale');
      } else if (key === 'minRating') {
        if (val) next.set('rating', String(val));
        else next.delete('rating');
      } else {
        next.set(key, String(val));
      }
    });

    setSearchParams(next);
  };

  const handleRemoveFilter = (key: keyof ProductFilterOptions, val?: string) => {
    const next = new URLSearchParams(searchParams);
    if (key === 'sizes' && val) {
      const current = next.getAll('size').filter((s) => s !== val);
      next.delete('size');
      current.forEach((s) => next.append('size', s));
    } else if (key === 'colors' && val) {
      const current = next.getAll('color').filter((c) => c !== val);
      next.delete('color');
      current.forEach((c) => next.append('color', c));
    } else if (key === 'fabrics' && val) {
      const current = next.getAll('fabric').filter((f) => f !== val);
      next.delete('fabric');
      current.forEach((f) => next.append('fabric', f));
    } else if (key === 'occasions' && val) {
      const current = next.getAll('occasion').filter((o) => o !== val);
      next.delete('occasion');
      current.forEach((o) => next.append('occasion', o));
    } else if (key === 'minPrice' || key === 'maxPrice') {
      next.delete('minPrice');
      next.delete('maxPrice');
    } else if (key === 'inStockOnly') {
      next.delete('inStock');
    } else if (key === 'onSaleOnly') {
      next.delete('sale');
      next.delete('onSale');
    } else if (key === 'minRating') {
      next.delete('rating');
    } else if (key === 'categorySlug') {
      next.delete('category');
      next.delete('subcategory');
    } else if (key === 'subcategorySlug') {
      next.delete('subcategory');
    } else if (key === 'searchQuery') {
      next.delete('q');
      next.delete('search');
    } else {
      next.delete(String(key));
    }
    setSearchParams(next);
  };

  const handleClearAllFilters = () => {
    const next = new URLSearchParams();
    if (forcedGender) {
      // Keep forced gender for /men and /women
    } else if (searchParams.get('gender')) {
      next.set('gender', searchParams.get('gender')!);
    }
    setSearchParams(next);
  };

  // Find active Category object if selected
  const activeCategory = useMemo(() => {
    if (!categorySlugParam) return undefined;
    return categories.find((c) => c.slug === categorySlugParam);
  }, [categories, categorySlugParam]);

  // Construct Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const trail: BreadcrumbItem[] = [];

    if (forcedGender === 'men' || effectiveGender === 'men') {
      trail.push({ label: "Men's Suite", link: '/men' });
    } else if (forcedGender === 'women' || effectiveGender === 'women') {
      trail.push({ label: "Women's Couture", link: '/women' });
    } else {
      trail.push({ label: 'All Curations', link: '/products' });
    }

    if (activeCategory) {
      trail.push({
        label: activeCategory.name,
        link: `/products?category=${activeCategory.slug}`,
      });
    }

    if (subcategorySlugParam) {
      const sub = activeCategory?.subcategories.find((s) => s.slug === subcategorySlugParam);
      trail.push({
        label: sub?.name || subcategorySlugParam.replace(/-/g, ' '),
      });
    }

    if (isSalePage) {
      trail.push({ label: 'Festive Sale & Privileges' });
    }

    return trail;
  }, [forcedGender, effectiveGender, activeCategory, subcategorySlugParam, isSalePage]);

  // Active filter count for badge
  const activeFilterCount = [
    categorySlugParam,
    subcategorySlugParam,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    currentFilters.sizes?.length,
    currentFilters.colors?.length,
    currentFilters.fabrics?.length,
    currentFilters.occasions?.length,
    currentFilters.inStockOnly,
    currentFilters.onSaleOnly,
    currentFilters.minRating,
    currentFilters.searchQuery,
  ].filter(Boolean).length;

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Breadcrumbs */}
      <CatalogBreadcrumb items={breadcrumbs} />

      {/* 2. Department or Category Editorial Hero */}
      <DepartmentHero
        gender={effectiveGender}
        category={activeCategory}
        totalCount={filteredProducts.length}
        categories={categories}
        selectedCategorySlug={categorySlugParam}
        onSelectCategory={(slug) => handleFilterChange({ categorySlug: slug, subcategorySlug: undefined })}
      />

      {/* 3. Active Filter Chips Bar */}
      <ActiveFilterChips
        filters={currentFilters}
        totalResults={filteredProducts.length}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* 4. Toolbar: Sorting, View Switches, Mobile Filter Action */}
      <CatalogToolbar
        totalCount={allProducts.length}
        filteredCount={filteredProducts.length}
        sortBy={currentFilters.sortBy}
        onSortChange={(sort) => handleFilterChange({ sortBy: sort })}
        gridColumns={gridColumns}
        onGridColumnsChange={setGridColumns}
        activeFilterCount={activeFilterCount}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
      />

      {/* 5. Main Content Layout: Sticky Filter Sidebar + Responsive Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sticky Filter Sidebar */}
        {facets && (
          <div className="hidden lg:block lg:col-span-3 sticky top-28 bg-white p-5 rounded-2xl border border-brand-espresso/12 shadow-subtle">
            <CatalogFilterSidebar
              filters={currentFilters}
              facets={facets}
              categories={categories}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
            />
          </div>
        )}

        {/* Product Grid Area */}
        <div className={facets ? 'lg:col-span-9' : 'lg:col-span-12'}>
          {loading ? (
            <div
              className={`grid gap-4 sm:gap-6 ${
                gridColumns === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : gridColumns === 4
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                  : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-brand-ivory-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="space-y-10">
              <div
                className={`grid gap-4 sm:gap-6 ${
                  gridColumns === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : gridColumns === 4
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Pagination Pattern */}
              {hasMore && (
                <div className="pt-6 border-t border-brand-espresso/10 text-center space-y-3">
                  <p className="text-xs text-brand-ink/60 font-light">
                    Showing {visibleProducts.length} of {filteredProducts.length} Heirloom Masterpieces
                  </p>

                  <div className="w-48 h-1 bg-brand-espresso/10 rounded-full mx-auto overflow-hidden">
                    <div
                      className="h-full bg-brand-gold transition-all duration-300"
                      style={{
                        width: `${Math.round((visibleProducts.length / filteredProducts.length) * 100)}%`,
                      }}
                    />
                  </div>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="border-brand-espresso/25 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold"
                  >
                    Load More Masterpieces
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-brand-espresso/12 shadow-luxury max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center mx-auto text-brand-gold-600">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-medium text-brand-espresso">
                  No Curations Match Selected Filters
                </h3>
                <p className="text-xs sm:text-sm text-brand-ink/70 font-light max-w-md mx-auto leading-relaxed">
                  Try broadening your price brackets, colors, or fabrics to discover handcrafted garments tailored for your celebration.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 items-center justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleClearAllFilters}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  className="bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold"
                >
                  Reset All Filters
                </Button>
                <Link to="/products">
                  <Button
                    variant="secondary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="border-brand-espresso/20 text-brand-espresso"
                  >
                    View Entire Catalog
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Mobile Off-Canvas Filter Drawer */}
      {facets && (
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={currentFilters}
          facets={facets}
          categories={categories}
          totalFilteredCount={filteredProducts.length}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAllFilters}
        />
      )}
    </div>
  );
};
