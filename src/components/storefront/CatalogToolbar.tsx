import React from 'react';
import { SlidersHorizontal, Grid2X2, Grid3X3, LayoutGrid } from 'lucide-react';
import { ProductFilterOptions } from '../../services/productService';

interface CatalogToolbarProps {
  totalCount: number;
  filteredCount: number;
  sortBy: ProductFilterOptions['sortBy'];
  onSortChange: (sort: ProductFilterOptions['sortBy']) => void;
  gridColumns: 2 | 3 | 4;
  onGridColumnsChange: (cols: 2 | 3 | 4) => void;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  totalCount,
  filteredCount,
  sortBy = 'featured',
  onSortChange,
  gridColumns,
  onGridColumnsChange,
  activeFilterCount,
  onOpenMobileFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-b border-brand-espresso/8">
      {/* Mobile Filter Toggle & Count */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-espresso/20 bg-white text-xs font-semibold text-brand-espresso shadow-xs hover:border-brand-gold"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-espresso text-brand-gold text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <span className="text-xs text-brand-ink/70 font-light">
          Showing <strong className="font-semibold text-brand-espresso">{filteredCount}</strong> of {totalCount} Heirlooms
        </span>
      </div>

      {/* Right Controls: Sort Select & Grid Columns Switcher */}
      <div className="flex items-center gap-4">
        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="catalog-sort" className="hidden sm:inline font-medium text-brand-ink/70">
            Sort by:
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as ProductFilterOptions['sortBy'])}
            className="bg-white border border-brand-espresso/20 rounded-lg px-3 py-2 text-xs font-semibold text-brand-espresso focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold cursor-pointer shadow-2xs"
          >
            <option value="featured">Recommended (Curated)</option>
            <option value="newest">New Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="bestselling">Best Sellers</option>
          </select>
        </div>

        {/* Desktop Grid Layout Toggles */}
        <div className="hidden md:flex items-center gap-1 border border-brand-espresso/15 rounded-lg p-1 bg-white shadow-2xs">
          <button
            onClick={() => onGridColumnsChange(2)}
            className={`p-1.5 rounded transition-colors ${
              gridColumns === 2 ? 'bg-brand-espresso text-brand-gold shadow-2xs' : 'text-brand-ink/50 hover:text-brand-ink'
            }`}
            title="2-Column Grid (Editorial Large)"
            aria-label="2-Column Grid"
          >
            <Grid2X2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onGridColumnsChange(3)}
            className={`p-1.5 rounded transition-colors ${
              gridColumns === 3 ? 'bg-brand-espresso text-brand-gold shadow-2xs' : 'text-brand-ink/50 hover:text-brand-ink'
            }`}
            title="3-Column Grid"
            aria-label="3-Column Grid"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onGridColumnsChange(4)}
            className={`p-1.5 rounded transition-colors ${
              gridColumns === 4 ? 'bg-brand-espresso text-brand-gold shadow-2xs' : 'text-brand-ink/50 hover:text-brand-ink'
            }`}
            title="4-Column Grid (Compact)"
            aria-label="4-Column Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
