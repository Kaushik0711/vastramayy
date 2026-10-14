import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, History, Sparkles, Frown } from 'lucide-react';
import { productService, ProductFilterOptions, CatalogFacets } from '../../services/productService';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/storefront/ProductCard';
import { CatalogBreadcrumb } from '../../components/storefront/CatalogBreadcrumb';
import { CatalogFilterSidebar } from '../../components/storefront/CatalogFilterSidebar';
import { MobileFilterDrawer } from '../../components/storefront/MobileFilterDrawer';
import { ActiveFilterChips } from '../../components/storefront/ActiveFilterChips';
import { CatalogToolbar } from '../../components/storefront/CatalogToolbar';
import { Button } from '../../components/common/Button';

const RECENT_SEARCHES_KEY = 'vastramay_recent_searches';
const POPULAR_QUERIES = [
  'Banarasi Brocade',
  'Chanderi Silk',
  'Gota Patti Lehenga',
  'Royal Sherwani',
  'Bundi Jacket',
  'Raw Silk Kurti',
  'Gurkha Trouser',
  'Mulberry Silk Shirt',
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || searchParams.get('search') || '';

  const [inputVal, setInputVal] = useState(currentQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [loading, setLoading] = useState(true);

  // Layout & Mobile filter states
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read current filters from URL params
  const currentFilters: ProductFilterOptions = useMemo(() => {
    return {
      searchQuery: currentQuery || undefined,
      gender: (searchParams.get('gender') as ProductFilterOptions['gender']) || undefined,
      categorySlug: searchParams.get('category') || undefined,
      subcategorySlug: searchParams.get('subcategory') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sizes: searchParams.getAll('size').length > 0 ? searchParams.getAll('size') : undefined,
      colors: searchParams.getAll('color').length > 0 ? searchParams.getAll('color') : undefined,
      fabrics: searchParams.getAll('fabric').length > 0 ? searchParams.getAll('fabric') : undefined,
      occasions: searchParams.getAll('occasion').length > 0 ? searchParams.getAll('occasion') : undefined,
      inStockOnly: searchParams.get('inStock') === 'true' ? true : undefined,
      onSaleOnly: searchParams.get('onSale') === 'true' ? true : undefined,
      minRating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      sortBy: (searchParams.get('sort') as ProductFilterOptions['sortBy']) || 'featured',
    };
  }, [searchParams, currentQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse recent searches:', e);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save recent searches:', e);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Sync input value when query param changes
  useEffect(() => {
    setInputVal(currentQuery);
    if (currentQuery) {
      saveRecentSearch(currentQuery);
    }
  }, [currentQuery]);

  // Load catalog and filter products
  useEffect(() => {
    async function loadSearchData() {
      setLoading(true);
      try {
        const [cats, allProds, filtered] = await Promise.all([
          productService.getCategories(),
          productService.getAllProducts(),
          productService.filterProducts(currentFilters),
        ]);

        const calculatedFacets = await productService.getFacets(filtered);
        setCategories(cats);
        setAllProducts(allProds);
        setFilteredProducts(filtered);
        setFacets(calculatedFacets);
      } catch (err) {
        console.error('Failed to run search query:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSearchData();
  }, [currentFilters]);

  // Handle Search Input Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (inputVal.trim()) {
      next.set('q', inputVal.trim());
      saveRecentSearch(inputVal.trim());
    } else {
      next.delete('q');
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleQuerySelect = (term: string) => {
    setInputVal(term);
    const next = new URLSearchParams(searchParams);
    next.set('q', term);
    saveRecentSearch(term);
    setSearchParams(next);
  };

  const handleClearInput = () => {
    setInputVal('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.delete('search');
    setSearchParams(next);
  };

  // Update filters in URL
  const handleFilterChange = (updates: Partial<ProductFilterOptions>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === 'all') {
        next.delete(key === 'sizes' ? 'size' : key === 'colors' ? 'color' : key === 'fabrics' ? 'fabric' : key === 'occasions' ? 'occasion' : key);
      } else if (Array.isArray(val)) {
        const paramName = key === 'sizes' ? 'size' : key === 'colors' ? 'color' : key === 'fabrics' ? 'fabric' : key === 'occasions' ? 'occasion' : key;
        next.delete(paramName);
        val.forEach((item) => next.append(paramName, item));
      } else if (key === 'inStockOnly') {
        if (val) next.set('inStock', 'true');
        else next.delete('inStock');
      } else if (key === 'onSaleOnly') {
        if (val) next.set('onSale', 'true');
        else next.delete('onSale');
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
      next.delete('onSale');
    } else if (key === 'minRating') {
      next.delete('rating');
    } else if (key === 'searchQuery') {
      next.delete('q');
      next.delete('search');
      setInputVal('');
    } else {
      next.delete(String(key));
    }
    setSearchParams(next);
  };

  const handleClearAllFilters = () => {
    const next = new URLSearchParams();
    if (currentQuery) next.set('q', currentQuery);
    setSearchParams(next);
  };

  const activeFilterCount = [
    currentFilters.categorySlug,
    currentFilters.subcategorySlug,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    currentFilters.sizes?.length,
    currentFilters.colors?.length,
    currentFilters.fabrics?.length,
    currentFilters.occasions?.length,
    currentFilters.inStockOnly,
    currentFilters.onSaleOnly,
    currentFilters.minRating,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <CatalogBreadcrumb
        items={[
          { label: 'Search Results' },
          ...(currentQuery ? [{ label: `"${currentQuery}"` }] : []),
        ]}
      />

      {/* Search Input Box */}
      <div className="mb-10 max-w-3xl mx-auto text-center space-y-4">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block">
          The Atelier Catalog Search
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-brand-ink">
          Search the Collection
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-brand-ink/40 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search by weave, silhouette, SKU, or celebration (e.g. Banarasi, Sherwani, 38)..."
              className="w-full bg-white border border-brand-espresso/20 rounded-full pl-12 pr-28 py-3.5 text-sm sm:text-base text-brand-espresso placeholder-brand-ink/40 shadow-subtle focus:outline-hidden focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
              autoFocus
            />

            {inputVal && (
              <button
                type="button"
                onClick={handleClearInput}
                className="absolute right-20 p-1 text-brand-ink/40 hover:text-brand-ink"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 px-5 py-2 rounded-full bg-brand-espresso hover:bg-brand-gold text-brand-gold hover:text-brand-espresso text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Search
            </button>
          </div>
        </form>

        {/* Recent Searches & Popular Suggestions */}
        <div className="space-y-3 pt-2">
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-ink/50 uppercase tracking-wider">
                <History className="w-3 h-3" />
                <span>Recent:</span>
              </span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuerySelect(term)}
                  className="px-2.5 py-1 rounded-full bg-brand-ivory-200 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold text-xs font-medium transition-colors border border-brand-espresso/10"
                >
                  {term}
                </button>
              ))}
              <button
                onClick={clearRecentSearches}
                className="text-[10px] text-brand-terracotta hover:underline ml-1 font-semibold"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gold-600 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Trending:</span>
            </span>
            {POPULAR_QUERIES.map((query) => (
              <button
                key={query}
                onClick={() => handleQuerySelect(query)}
                className="px-2.5 py-1 rounded-full bg-white text-brand-ink/80 hover:border-brand-gold hover:text-brand-gold-600 text-xs font-medium transition-colors border border-brand-espresso/12 shadow-2xs"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-6">
        {/* Active Filter Chips */}
        <ActiveFilterChips
          filters={currentFilters}
          totalResults={filteredProducts.length}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Toolbar */}
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

        {/* Catalog Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
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
                className={`grid gap-6 ${
                  gridColumns === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : gridColumns === 4
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-96 bg-brand-ivory-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  gridColumns === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : gridColumns === 4
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-brand-espresso/12 shadow-luxury max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center mx-auto text-brand-gold-600">
                  <Frown className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-medium text-brand-espresso">
                    No Masterpieces Found
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-ink/70 font-light max-w-md mx-auto leading-relaxed">
                    We could not find any curations matching{' '}
                    {currentQuery ? <strong className="font-semibold text-brand-espresso">"{currentQuery}"</strong> : 'your selected filters'}.
                    Try adjusting your criteria or discover our signature suites below.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3 items-center justify-center">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleClearAllFilters}
                    className="bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold"
                  >
                    Reset Filters
                  </Button>
                  <Link to="/men">
                    <Button
                      variant="secondary"
                      size="md"
                      className="border-brand-espresso/20 text-brand-espresso"
                    >
                      Shop Men's Suite
                    </Button>
                  </Link>
                  <Link to="/women">
                    <Button
                      variant="secondary"
                      size="md"
                      className="border-brand-espresso/20 text-brand-espresso"
                    >
                      Shop Women's Couture
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Off-Canvas Filter Drawer */}
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
