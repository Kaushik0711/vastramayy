import React from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  kicker?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  kicker,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'text-center py-16 px-6 bg-white rounded-xl border border-brand-espresso/15 shadow-subtle max-w-lg mx-auto space-y-5',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center mx-auto text-brand-gold-700">
          {icon}
        </div>
      )}

      <div className="space-y-1.5">
        {kicker && (
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-brand-gold-600 block">
            {kicker}
          </span>
        )}
        <h3 className="font-serif text-2xl font-bold text-brand-ink">{title}</h3>
        <p className="text-xs sm:text-sm text-brand-ink/70 leading-relaxed font-light max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
