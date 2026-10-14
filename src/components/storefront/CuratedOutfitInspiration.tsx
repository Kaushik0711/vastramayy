import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { HOMEPAGE_CONFIG, OutfitLookItem } from '../../data/homepageConfig';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';

export const CuratedOutfitInspiration: React.FC = () => {
  const { outfitInspirations } = HOMEPAGE_CONFIG;
  const [selectedLookIndex, setSelectedLookIndex] = useState(0);
  const activeLook: OutfitLookItem = outfitInspirations[selectedLookIndex];

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddPiece = (piece: OutfitLookItem['ensembleItems'][0], e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: piece.productId,
      variantId: `${piece.productId}-def`,
      name: piece.productName,
      slug: piece.productSlug,
      image: piece.image,
      size: 'Standard Fit',
      colorName: 'Curated Ensemble Tone',
      price: piece.price,
      quantity: 1,
      stockAvailable: 10,
    });
    showToast(`Added ${piece.productName} to your shopping bag.`, 'success');
  };

  const handleAddEntireLook = () => {
    activeLook.ensembleItems.forEach((piece) => {
      addToCart({
        productId: piece.productId,
        variantId: `${piece.productId}-def`,
        name: piece.productName,
        slug: piece.productSlug,
        image: piece.image,
        size: 'Standard Fit',
        colorName: 'Curated Ensemble Tone',
        price: piece.price,
        quantity: 1,
        stockAvailable: 10,
      });
    });
    showToast(`Added all ${activeLook.ensembleItems.length} pieces of "${activeLook.lookTitle}" to your bag.`, 'success');
  };

  const totalLookPrice = activeLook.ensembleItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <section className="py-16 sm:py-24 bg-brand-ivory-100/60 border-t border-brand-espresso/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-gold-600" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600">
                Styled In The Atelier
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-brand-ink">
              Curated Outfit Inspiration{' '}
              <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-brand-gold font-normal block sm:inline-block -mt-1 sm:-mt-2">
                Shop The Look
              </span>
            </h2>
          </div>

          {/* Look Selector Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border border-brand-espresso/15 shadow-2xs self-start md:self-auto">
            {outfitInspirations.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => setSelectedLookIndex(idx)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  selectedLookIndex === idx
                    ? 'bg-brand-espresso text-brand-gold shadow-xs'
                    : 'text-brand-ink/70 hover:text-brand-ink'
                }`}
              >
                Look 0{idx + 1}: {look.occasion.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Outfit Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-brand-espresso/12 p-6 sm:p-10 shadow-luxury">
          {/* Left Column: Styled Editorial Model Photography */}
          <div className="lg:col-span-6 relative aspect-[3/4] rounded-2xl overflow-hidden border border-brand-espresso/15 shadow-subtle group">
            <img
              src={activeLook.heroImage}
              alt={activeLook.lookTitle}
              className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/80 via-transparent to-transparent" />

            {/* Floating Occasion Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-espresso/90 backdrop-blur-md text-brand-gold border border-brand-gold/30 text-xs font-semibold uppercase tracking-wider shadow-md">
                {activeLook.occasion}
              </span>
            </div>

            {/* Bottom Tagline on Photo */}
            <div className="absolute bottom-6 inset-x-6 z-10 text-brand-ivory">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
                Atelier Ensemble
              </span>
              <h3 className="font-serif text-2xl font-medium mt-1 text-brand-ivory">
                {activeLook.lookTitle}
              </h3>
              <p className="text-xs text-brand-ivory/80 font-light mt-1">
                {activeLook.tagline}
              </p>
            </div>
          </div>

          {/* Right Column: Look Breakdown & Ensemble Pieces */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-600 block mb-1">
                Ensemble Harmony Breakdown
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-brand-ink">
                {activeLook.lookTitle}
              </h3>
              <p className="text-xs sm:text-sm text-brand-ink/70 leading-relaxed font-light mt-2">
                {activeLook.story}
              </p>
            </div>

            {/* Constituent Pieces List */}
            <div className="space-y-3 pt-2">
              {activeLook.ensembleItems.map((piece) => (
                <div
                  key={piece.productId}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-brand-espresso/10 hover:border-brand-gold/50 bg-brand-ivory-50/50 hover:bg-white transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={piece.image}
                      alt={piece.productName}
                      className="w-14 h-16 rounded-lg object-cover object-top border border-brand-espresso/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold-600 block">
                        {piece.role}
                      </span>
                      <Link
                        to={`/product/${piece.productSlug}`}
                        className="font-serif text-sm font-semibold text-brand-ink hover:text-brand-gold-600 truncate block transition-colors"
                      >
                        {piece.productName}
                      </Link>
                      <span className="text-xs font-semibold text-brand-espresso mt-0.5 block">
                        ₹{piece.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleAddPiece(piece, e)}
                    className="shrink-0 p-2.5 rounded-lg border border-brand-espresso/20 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold hover:border-brand-espresso transition-colors"
                    title="Add piece to bag"
                    aria-label={`Add ${piece.productName} to bag`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Ensemble Price & Add Entire Look CTA */}
            <div className="pt-4 border-t border-brand-espresso/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-brand-ink/60 uppercase tracking-widest block font-medium">
                  Complete Look Total ({activeLook.ensembleItems.length} Pieces)
                </span>
                <span className="font-serif text-2xl font-bold text-brand-espresso">
                  ₹{totalLookPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddEntireLook}
                rightIcon={<ShoppingBag className="w-4 h-4" />}
                className="bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold shadow-md"
              >
                Add Entire Look to Bag
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
