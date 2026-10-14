import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Check } from 'lucide-react';
import { ProductFilterOptions, CatalogFacets } from '../../services/productService';
import { Category } from '../../types';

interface CatalogFilterSidebarProps {
  filters: ProductFilterOptions;
  facets: CatalogFacets;
  categories: Category[];
  onFilterChange: (newFilters: Partial<ProductFilterOptions>) => void;
  onClearAll: () => void;
}

export const CatalogFilterSidebar: React.FC<CatalogFilterSidebarProps> = ({
  filters,
  facets,
  categories,
  onFilterChange,
  onClearAll,
}) => {
  // Collapsible accordion states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    categories: true,
    price: true,
    size: true,
    color: true,
    fabric: true,
    occasion: false,
    rating: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePricePreset = (min?: number, max?: number) => {
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const handleSizeToggle = (size: string) => {
    const current = filters.sizes || [];
    const next = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
    onFilterChange({ sizes: next.length > 0 ? next : undefined });
  };

  const handleColorToggle = (color: string) => {
    const current = filters.colors || [];
    const next = current.includes(color) ? current.filter((c) => c !== color) : [...current, color];
    onFilterChange({ colors: next.length > 0 ? next : undefined });
  };

  const handleFabricToggle = (fabric: string) => {
    const current = filters.fabrics || [];
    const next = current.includes(fabric) ? current.filter((f) => f !== fabric) : [...current, fabric];
    onFilterChange({ fabrics: next.length > 0 ? next : undefined });
  };

  const handleOccasionToggle = (occ: string) => {
    const current = filters.occasions || [];
    const next = current.includes(occ) ? current.filter((o) => o !== occ) : [...current, occ];
    onFilterChange({ occasions: next.length > 0 ? next : undefined });
  };

  // Filter categories relevant to gender if gender is selected
  const visibleCategories = filters.gender && filters.gender !== 'all'
    ? categories.filter((c) => c.gender === filters.gender)
    : categories;

  return (
    <aside className="w-full space-y-6 text-brand-espresso select-none">
      {/* Header with Title and Clear Action */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-espresso/15">
        <h3 className="font-serif text-lg font-medium text-brand-espresso">
          Refine By
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs uppercase tracking-wider font-semibold text-brand-terracotta hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* 1. Quick Toggles: In Stock & On Sale */}
      <div className="space-y-3 pb-4 border-b border-brand-espresso/10">
        <label className="flex items-center justify-between text-xs font-semibold cursor-pointer group">
          <span className="text-brand-ink group-hover:text-brand-gold-600 transition-colors">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked || undefined })}
            className="w-4 h-4 rounded text-brand-espresso focus:ring-brand-gold accent-brand-espresso"
          />
        </label>

        <label className="flex items-center justify-between text-xs font-semibold cursor-pointer group">
          <span className="text-brand-ink group-hover:text-brand-gold-600 transition-colors">
            On Sale / Discounted
          </span>
          <input
            type="checkbox"
            checked={Boolean(filters.onSaleOnly)}
            onChange={(e) => onFilterChange({ onSaleOnly: e.target.checked || undefined })}
            className="w-4 h-4 rounded text-brand-espresso focus:ring-brand-gold accent-brand-espresso"
          />
        </label>
      </div>

      {/* 2. Categories & Subcategories */}
      <div className="pb-4 border-b border-brand-espresso/10">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
        >
          <span>Category</span>
          {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.categories && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => onFilterChange({ categorySlug: undefined, subcategorySlug: undefined })}
              className={`w-full text-left text-xs py-1 px-2 rounded transition-colors flex items-center justify-between ${
                !filters.categorySlug
                  ? 'bg-brand-espresso text-brand-gold font-bold shadow-2xs'
                  : 'text-brand-ink/80 hover:bg-brand-ivory-200'
              }`}
            >
              <span>All Categories</span>
              <span className="text-[10px] opacity-75">{facets.totalCount}</span>
            </button>

            {visibleCategories.map((cat) => {
              const isSelected = filters.categorySlug === cat.slug;
              return (
                <div key={cat.id} className="space-y-1">
                  <button
                    onClick={() =>
                      onFilterChange({
                        categorySlug: isSelected ? undefined : cat.slug,
                        subcategorySlug: undefined,
                      })
                    }
                    className={`w-full text-left text-xs py-1 px-2 rounded transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-espresso text-brand-gold font-bold shadow-2xs'
                        : 'text-brand-ink/80 hover:bg-brand-ivory-200'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-75 ml-1">{cat.itemCount}</span>
                  </button>

                  {/* Subcategories if category is selected */}
                  {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="pl-4 space-y-1 border-l-2 border-brand-gold/40 ml-2 my-1 animate-fadeIn">
                      {cat.subcategories.map((sub) => {
                        const isSubSelected = filters.subcategorySlug === sub.slug;
                        return (
                          <button
                            key={sub.id}
                            onClick={() =>
                              onFilterChange({
                                subcategorySlug: isSubSelected ? undefined : sub.slug,
                              })
                            }
                            className={`w-full text-left text-[11px] py-0.5 px-2 rounded transition-colors flex items-center justify-between ${
                              isSubSelected
                                ? 'bg-brand-gold/30 text-brand-espresso font-semibold'
                                : 'text-brand-ink/70 hover:text-brand-ink'
                            }`}
                          >
                            <span className="truncate">{sub.name}</span>
                            {sub.itemCount && (
                              <span className="text-[9px] opacity-60 ml-1">{sub.itemCount}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Price Filter */}
      <div className="pb-4 border-b border-brand-espresso/10">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
        >
          <span>Price Range</span>
          {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.price && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handlePricePreset(undefined, 5000)}
                className={`py-1.5 px-2 rounded border text-center transition-colors ${
                  filters.maxPrice === 5000 && !filters.minPrice
                    ? 'border-brand-espresso bg-brand-espresso text-brand-gold font-semibold'
                    : 'border-brand-espresso/15 hover:border-brand-gold'
                }`}
              >
                Under ₹5,000
              </button>
              <button
                onClick={() => handlePricePreset(5000, 15000)}
                className={`py-1.5 px-2 rounded border text-center transition-colors ${
                  filters.minPrice === 5000 && filters.maxPrice === 15000
                    ? 'border-brand-espresso bg-brand-espresso text-brand-gold font-semibold'
                    : 'border-brand-espresso/15 hover:border-brand-gold'
                }`}
              >
                ₹5k – ₹15k
              </button>
              <button
                onClick={() => handlePricePreset(15000, 30000)}
                className={`py-1.5 px-2 rounded border text-center transition-colors ${
                  filters.minPrice === 15000 && filters.maxPrice === 30000
                    ? 'border-brand-espresso bg-brand-espresso text-brand-gold font-semibold'
                    : 'border-brand-espresso/15 hover:border-brand-gold'
                }`}
              >
                ₹15k – ₹30k
              </button>
              <button
                onClick={() => handlePricePreset(30000, undefined)}
                className={`py-1.5 px-2 rounded border text-center transition-colors ${
                  filters.minPrice === 30000 && !filters.maxPrice
                    ? 'border-brand-espresso bg-brand-espresso text-brand-gold font-semibold'
                    : 'border-brand-espresso/15 hover:border-brand-gold'
                }`}
              >
                Above ₹30,000
              </button>
            </div>

            {/* Custom Min / Max inputs */}
            <div className="flex items-center gap-2 pt-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-ink/50">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    onFilterChange({
                      minPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full bg-white border border-brand-espresso/20 rounded pl-6 pr-2 py-1 text-xs text-brand-espresso"
                />
              </div>
              <span className="text-xs text-brand-ink/40">–</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-ink/50">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    onFilterChange({
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full bg-white border border-brand-espresso/20 rounded pl-6 pr-2 py-1 text-xs text-brand-espresso"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Sizes Filter */}
      {facets.sizes.length > 0 && (
        <div className="pb-4 border-b border-brand-espresso/10">
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
          >
            <span>Size</span>
            {openSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.size && (
            <div className="flex flex-wrap gap-1.5">
              {facets.sizes.map((s) => {
                const isSelected = (filters.sizes || []).includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSizeToggle(s.id)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 border ${
                      isSelected
                        ? 'bg-brand-espresso text-brand-gold border-brand-espresso shadow-xs'
                        : 'bg-white text-brand-ink/80 border-brand-espresso/15 hover:border-brand-gold'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[9px] opacity-60 ml-1">({s.count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Colors Filter (Swatches) */}
      {facets.colors.length > 0 && (
        <div className="pb-4 border-b border-brand-espresso/10">
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
          >
            <span>Tone & Palette</span>
            {openSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.color && (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {facets.colors.map((c) => {
                const isSelected = (filters.colors || []).includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleColorToggle(c.id)}
                    className={`flex items-center gap-2 p-1.5 rounded text-xs text-left transition-colors border ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/15 font-semibold text-brand-espresso'
                        : 'border-transparent hover:bg-brand-ivory-200 text-brand-ink/80'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs flex items-center justify-center"
                      style={{ backgroundColor: c.colorHex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white drop-shadow-xs" />}
                    </span>
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Fabrics / Handlooms */}
      {facets.fabrics.length > 0 && (
        <div className="pb-4 border-b border-brand-espresso/10">
          <button
            onClick={() => toggleSection('fabric')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
          >
            <span>Fabric & Weave</span>
            {openSections.fabric ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.fabric && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {facets.fabrics.map((f) => {
                const isSelected = (filters.fabrics || []).includes(f.id);
                return (
                  <label
                    key={f.id}
                    className="flex items-center justify-between text-xs cursor-pointer p-1 rounded hover:bg-brand-ivory-200 text-brand-ink/80"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFabricToggle(f.id)}
                        className="w-3.5 h-3.5 rounded text-brand-espresso focus:ring-brand-gold accent-brand-espresso"
                      />
                      <span>{f.label}</span>
                    </div>
                    <span className="text-[10px] text-brand-ink/40">({f.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. Occasions */}
      {facets.occasions.length > 0 && (
        <div className="pb-4 border-b border-brand-espresso/10">
          <button
            onClick={() => toggleSection('occasion')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
          >
            <span>Celebration & Occasion</span>
            {openSections.occasion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.occasion && (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {facets.occasions.map((occ) => {
                const isSelected = (filters.occasions || []).includes(occ.id);
                return (
                  <label
                    key={occ.id}
                    className="flex items-center justify-between text-xs cursor-pointer p-1 rounded hover:bg-brand-ivory-200 text-brand-ink/80"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOccasionToggle(occ.id)}
                        className="w-3.5 h-3.5 rounded text-brand-espresso focus:ring-brand-gold accent-brand-espresso"
                      />
                      <span>{occ.label}</span>
                    </div>
                    <span className="text-[10px] text-brand-ink/40">({occ.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 8. Rating Filter */}
      <div className="pb-4 border-b border-brand-espresso/10">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-gold-600 transition-colors mb-3"
        >
          <span>Customer Rating</span>
          {openSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.rating && (
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => onFilterChange({ minRating: filters.minRating === 4.5 ? undefined : 4.5 })}
              className={`w-full flex items-center justify-between p-1.5 rounded transition-colors ${
                filters.minRating === 4.5
                  ? 'bg-brand-espresso text-brand-gold font-semibold'
                  : 'hover:bg-brand-ivory-200 text-brand-ink/80'
              }`}
            >
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-medium text-brand-ink">4.5 & Above</span>
              </div>
            </button>
            <button
              onClick={() => onFilterChange({ minRating: filters.minRating === 4.0 ? undefined : 4.0 })}
              className={`w-full flex items-center justify-between p-1.5 rounded transition-colors ${
                filters.minRating === 4.0
                  ? 'bg-brand-espresso text-brand-gold font-semibold'
                  : 'hover:bg-brand-ivory-200 text-brand-ink/80'
              }`}
            >
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-medium text-brand-ink">4.0 & Above</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
