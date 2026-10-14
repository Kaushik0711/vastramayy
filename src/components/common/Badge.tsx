import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'gold'
    | 'espresso'
    | 'plum'
    | 'terracotta'
    | 'sage'
    | 'ivory'
    | 'arch'
    | 'outline'
    | 'navy'
    | 'maroon'
    | 'emerald'
    | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className,
}) => {
  const base = 'inline-flex items-center font-medium uppercase tracking-widest select-none transition-colors';

  const variants = {
    gold: 'bg-brand-gold-100 text-brand-gold-900 border border-brand-gold/40 rounded-full',
    espresso: 'bg-brand-espresso text-brand-ivory border border-brand-gold/30 rounded-full',
    navy: 'bg-brand-espresso text-brand-ivory border border-brand-gold/30 rounded-full',
    plum: 'bg-brand-plum text-brand-ivory border border-brand-gold/40 rounded-full',
    terracotta: 'bg-brand-terracotta/15 text-brand-terracotta border border-brand-terracotta/30 rounded-full',
    maroon: 'bg-brand-terracotta/15 text-brand-terracotta border border-brand-terracotta/30 rounded-full',
    sage: 'bg-brand-sage/15 text-brand-sage border border-brand-sage/30 rounded-full',
    emerald: 'bg-brand-sage/15 text-brand-sage border border-brand-sage/30 rounded-full',
    ivory: 'bg-brand-ivory text-brand-ink border border-brand-espresso/15 rounded-full',
    neutral: 'bg-brand-ivory text-brand-ink border border-brand-espresso/15 rounded-full',
    arch: 'bg-brand-gold text-brand-ink font-semibold rounded-t-lg rounded-b-xs border border-brand-gold-700/30 shadow-subtle',
    outline: 'border border-brand-gold text-brand-gold-700 bg-transparent rounded-full',
  };

  const sizes = {
    sm: 'text-[9px] sm:text-[10px] px-2.5 py-0.5',
    md: 'text-[11px] px-3 py-1',
  };

  return <span className={cn(base, variants[variant], sizes[size], className)}>{children}</span>;
};
