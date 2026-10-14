import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ProductFilterOptions } from '../../services/productService';

interface ActiveFilterChipsProps {
  filters: ProductFilterOptions;
  totalResults: number;
  onRemoveFilter: (key: keyof ProductFilterOptions, value?: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  totalResults,
  onRemoveFilter,
  onClearAll,
}) => {
  const chips: { label: string; key: keyof ProductFilterOptions; value?: string }[] = [];

  // Category
  if (filters.categorySlug && filters.categorySlug !== 'all') {
    chips.push({
      label: `Category: ${filters.categorySlug.replace(/-/g, ' ')}`,
      key: 'categorySlug',
    });
  }

  // Subcategory
  if (filters.subcategorySlug && filters.subcategorySlug !== 'all') {
    chips.push({
      label: `Subcategory: ${filters.subcategorySlug.replace(/-/g, ' ')}`,
      key: 'subcategorySlug',
    });
  }

  // Price
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice ? `₹${filters.minPrice.toLocaleString('en-IN')}` : '₹0';
    const max = filters.maxPrice ? `₹${filters.maxPrice.toLocaleString('en-IN')}` : 'Any';
    chips.push({
      label: `Price: ${min} - ${max}`,
      key: 'minPrice',
    });
  }

  // Sizes
  if (filters.sizes && filters.sizes.length > 0) {
    filters.sizes.forEach((s) => {
      chips.push({
        label: `Size: ${s}`,
        key: 'sizes',
        value: s,
      });
    });
  }

  // Colors
  if (filters.colors && filters.colors.length > 0) {
    filters.colors.forEach((c) => {
      chips.push({
        label: `Color: ${c}`,
        key: 'colors',
        value: c,
      });
    });
  }

  // Fabrics
  if (filters.fabrics && filters.fabrics.length > 0) {
    filters.fabrics.forEach((f) => {
      chips.push({
        label: `Fabric: ${f}`,
        key: 'fabrics',
        value: f,
      });
    });
  }

  // Occasions
  if (filters.occasions && filters.occasions.length > 0) {
    filters.occasions.forEach((occ) => {
      chips.push({
        label: `Occasion: ${occ}`,
        key: 'occasions',
        value: occ,
      });
    });
  }

  // In Stock
  if (filters.inStockOnly) {
    chips.push({
      label: 'In Stock Only',
      key: 'inStockOnly',
    });
  }

  // On Sale
  if (filters.onSaleOnly) {
    chips.push({
      label: 'On Sale / Discounted',
      key: 'onSaleOnly',
    });
  }

  // Min Rating
  if (filters.minRating && filters.minRating > 0) {
    chips.push({
      label: `Rating: ${filters.minRating}★ & Up`,
      key: 'minRating',
    });
  }

  // Search Query
  if (filters.searchQuery) {
    chips.push({
      label: `Search: "${filters.searchQuery}"`,
      key: 'searchQuery',
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pt-2 pb-4 border-b border-brand-espresso/8 animate-fadeIn">
      <span className="text-xs font-semibold text-brand-ink/60 uppercase tracking-wider mr-1">
        Active Filters ({totalResults} {totalResults === 1 ? 'Piece' : 'Pieces'}):
      </span>

      {chips.map((chip, index) => (
        <span
          key={`${chip.key}-${chip.value || index}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-ivory-200 text-brand-espresso border border-brand-espresso/15 shadow-2xs hover:border-brand-gold/50 transition-colors"
        >
          <span className="capitalize">{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="p-0.5 rounded-full hover:bg-brand-espresso hover:text-white transition-colors"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-terracotta hover:underline ml-2"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};
