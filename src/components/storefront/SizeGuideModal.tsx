import React, { useState, useEffect } from 'react';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductGender } from '../../types';
import { modalBackdropVariants, modalSurfaceVariants } from '../../styles/motionTokens';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGender?: ProductGender;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultGender = 'men',
}) => {
  const [activeGender, setActiveGender] = useState<'men' | 'women'>(
    defaultGender === 'women' ? 'women' : 'men'
  );
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  const menSizesInches = [
    { size: '38 (S)', chest: '38 - 40', waist: '32 - 34', shoulder: '17.5', length: '42' },
    { size: '40 (M)', chest: '40 - 42', waist: '34 - 36', shoulder: '18.0', length: '43' },
    { size: '42 (L)', chest: '42 - 44', waist: '36 - 38', shoulder: '18.5', length: '44' },
    { size: '44 (XL)', chest: '44 - 46', waist: '38 - 40', shoulder: '19.0', length: '44.5' },
    { size: '46 (XXL)', chest: '46 - 48', waist: '40 - 42', shoulder: '19.5', length: '45' },
  ];

  const womenSizesInches = [
    { size: 'XS (34)', bust: '32 - 34', waist: '26 - 28', hip: '36 - 38', length: '42' },
    { size: 'S (36)', bust: '34 - 36', waist: '28 - 30', hip: '38 - 40', length: '42' },
    { size: 'M (38)', bust: '36 - 38', waist: '30 - 32', hip: '40 - 42', length: '43' },
    { size: 'L (40)', bust: '38 - 40', waist: '32 - 34', hip: '42 - 44', length: '43' },
    { size: 'XL (42)', bust: '40 - 42', waist: '34 - 36', hip: '44 - 46', length: '44' },
  ];

  const convertToCm = (val: string) => {
    return val
      .split(' - ')
      .map((n) => Math.round(parseFloat(n) * 2.54))
      .join(' - ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-brand-espresso/70 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Surface */}
          <motion.div
            variants={modalSurfaceVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-espresso/15 overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
        {/* Header */}
        <div className="p-6 border-b border-brand-espresso/10 flex items-center justify-between bg-brand-ivory-50">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-brand-gold-600" />
            <h2 className="font-serif text-2xl font-semibold text-brand-espresso">
              Atelier Size & Measurement Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-espresso/10 text-brand-espresso transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Controls: Department Toggle & Unit Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center p-1 bg-brand-ivory-200 rounded-full border border-brand-espresso/10">
              <button
                onClick={() => setActiveGender('men')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeGender === 'men'
                    ? 'bg-brand-espresso text-brand-gold shadow-xs'
                    : 'text-brand-ink/70 hover:text-brand-ink'
                }`}
              >
                Men's Sizing
              </button>
              <button
                onClick={() => setActiveGender('women')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeGender === 'women'
                    ? 'bg-brand-espresso text-brand-gold shadow-xs'
                    : 'text-brand-ink/70 hover:text-brand-ink'
                }`}
              >
                Women's Sizing
              </button>
            </div>

            <div className="flex items-center gap-1 border border-brand-espresso/15 rounded-lg p-0.5 bg-white text-xs font-medium">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded transition-colors ${
                  unit === 'in' ? 'bg-brand-espresso text-brand-gold font-bold' : 'text-brand-ink/60'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded transition-colors ${
                  unit === 'cm' ? 'bg-brand-espresso text-brand-gold font-bold' : 'text-brand-ink/60'
                }`}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto rounded-xl border border-brand-espresso/15">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-ivory-100 text-brand-espresso uppercase font-bold tracking-wider border-b border-brand-espresso/10">
                {activeGender === 'men' ? (
                  <tr>
                    <th className="p-3">Standard Size</th>
                    <th className="p-3">To Fit Chest ({unit})</th>
                    <th className="p-3">Natural Waist ({unit})</th>
                    <th className="p-3">Shoulder ({unit})</th>
                    <th className="p-3">Length ({unit})</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-3">Standard Size</th>
                    <th className="p-3">Bust ({unit})</th>
                    <th className="p-3">Waist ({unit})</th>
                    <th className="p-3">Hip Flared ({unit})</th>
                    <th className="p-3">Length ({unit})</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-brand-espresso/8 font-light text-brand-ink/80">
                {activeGender === 'men'
                  ? menSizesInches.map((row) => (
                      <tr key={row.size} className="hover:bg-brand-ivory-50">
                        <td className="p-3 font-semibold text-brand-espresso">{row.size}</td>
                        <td className="p-3">{unit === 'in' ? row.chest : convertToCm(row.chest)}</td>
                        <td className="p-3">{unit === 'in' ? row.waist : convertToCm(row.waist)}</td>
                        <td className="p-3">{unit === 'in' ? row.shoulder : convertToCm(row.shoulder)}</td>
                        <td className="p-3">{unit === 'in' ? row.length : convertToCm(row.length)}</td>
                      </tr>
                    ))
                  : womenSizesInches.map((row) => (
                      <tr key={row.size} className="hover:bg-brand-ivory-50">
                        <td className="p-3 font-semibold text-brand-espresso">{row.size}</td>
                        <td className="p-3">{unit === 'in' ? row.bust : convertToCm(row.bust)}</td>
                        <td className="p-3">{unit === 'in' ? row.waist : convertToCm(row.waist)}</td>
                        <td className="p-3">{unit === 'in' ? row.hip : convertToCm(row.hip)}</td>
                        <td className="p-3">{unit === 'in' ? row.length : convertToCm(row.length)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* The 2-Inch Margin Atelier Guarantee Card */}
          <div className="p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-gold-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-brand-espresso uppercase tracking-wider">
                Vastramay 2-Inch Internal Fit Margin Guarantee
              </h4>
              <p className="text-brand-ink/80 font-light leading-relaxed">
                All Vastramay tailored garments are engineered with 2 inches of generous internal seam allowance. If you ever require personal adjustments after receiving your garment, your local tailor can alter it easily without compromising stitch integrity.
              </p>
            </div>
          </div>

          {/* How to Measure Guide */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-lg font-medium text-brand-espresso">
              How to Measure Accurately
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-ink/80 font-light">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-brand-espresso block">Chest / Bust:</strong>
                  Measure around the fullest part of your chest, keeping tape horizontal.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-brand-espresso block">Waist:</strong>
                  Measure at your natural waistline, where your trousers or lehenga sits.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-brand-espresso block">Shoulders:</strong>
                  Measure from the tip of one shoulder bone across the back to the other.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-brand-espresso block">Length:</strong>
                  Measure from the highest point of the shoulder down to the desired hemline.
                </div>
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
