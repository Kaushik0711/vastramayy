import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTaxNotice?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  discountPercentage,
  size = 'md',
  showTaxNotice = false,
  className,
}) => {
  const sizeClasses = {
    sm: {
      price: 'text-sm font-bold',
      original: 'text-xs',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      price: 'text-base sm:text-lg font-bold',
      original: 'text-xs sm:text-sm',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      price: 'text-xl sm:text-2xl font-extrabold',
      original: 'text-sm sm:text-base',
      badge: 'text-xs px-2.5 py-0.5',
    },
    xl: {
      price: 'text-2xl sm:text-3xl font-extrabold',
      original: 'text-base sm:text-lg',
      badge: 'text-xs px-2.5 py-1',
    },
  };

  const calculatedDiscount =
    discountPercentage ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined);

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline flex-wrap gap-2.5">
        <span className={cn('text-brand-ink tracking-tight', sizeClasses[size].price)}>
          {formatCurrency(price)}
        </span>

        {originalPrice && originalPrice > price && (
          <span className={cn('text-brand-ink/40 line-through font-normal', sizeClasses[size].original)}>
            {formatCurrency(originalPrice)}
          </span>
        )}

        {calculatedDiscount && calculatedDiscount > 0 && (
          <span className={cn('bg-brand-terracotta/15 text-brand-terracotta font-semibold uppercase tracking-wider rounded-sm', sizeClasses[size].badge)}>
            {calculatedDiscount}% Off
          </span>
        )}
      </div>

      {showTaxNotice && (
        <span className="text-[10px] text-brand-ink/50 uppercase tracking-widest mt-1">
          MRP inclusive of all taxes
        </span>
      )}
    </div>
  );
};
