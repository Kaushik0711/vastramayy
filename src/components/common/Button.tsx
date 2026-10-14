import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'espresso'
    | 'plum'
    | 'terracotta'
    | 'outline'
    | 'gold-outline'
    | 'ghost'
    | 'editorial'
    | 'secondary'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wider';

    const variants = {
      primary:
        'bg-brand-gold text-brand-ink hover:bg-[#A88A58] active:scale-[0.99] shadow-subtle hover:shadow-gold-glow font-semibold',
      espresso:
        'bg-brand-espresso text-brand-ivory hover:bg-[#482D28] border border-brand-gold/30 active:scale-[0.99] shadow-subtle font-semibold',
      secondary:
        'bg-brand-espresso text-brand-ivory hover:bg-[#482D28] border border-brand-gold/30 active:scale-[0.99] shadow-subtle font-semibold',
      plum:
        'bg-brand-plum text-brand-ivory hover:bg-[#4E1F47] border border-brand-gold/40 active:scale-[0.99] shadow-subtle font-semibold',
      terracotta:
        'bg-brand-terracotta text-white hover:bg-[#9B483F] active:scale-[0.99] shadow-subtle font-semibold',
      danger:
        'bg-brand-terracotta text-white hover:bg-[#9B483F] active:scale-[0.99] shadow-subtle font-semibold',
      outline:
        'border border-brand-espresso/25 bg-transparent text-brand-ink hover:border-brand-espresso hover:bg-brand-espresso/5 font-medium',
      'gold-outline':
        'border border-brand-gold/60 bg-transparent text-brand-gold-700 hover:border-brand-gold hover:bg-brand-gold/10 font-semibold',
      ghost:
        'bg-transparent text-brand-ink/80 hover:bg-brand-espresso/5 hover:text-brand-ink font-medium',
      editorial:
        'bg-transparent text-brand-ink hover:text-brand-gold px-0 py-1 rounded-none border-b border-brand-ink hover:border-brand-gold font-serif text-base tracking-widest uppercase transition-colors',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded uppercase font-semibold tracking-widest',
      md: 'text-xs sm:text-sm px-5 py-2.5 rounded-md font-semibold',
      lg: 'text-sm sm:text-base px-7 py-3.5 rounded-md font-semibold tracking-wide',
    };

    // If variant is editorial, let it use its custom padding
    const sizeClasses = variant === 'editorial' ? '' : sizes[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizeClasses, className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
