import React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeadingProps {
  kicker?: string;
  title: string;
  cursiveAccent?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'split';
  action?: React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  cursiveAccent,
  subtitle,
  align = 'left',
  action,
  theme = 'light',
  className,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'mb-10 sm:mb-14',
        align === 'center' && 'text-center max-w-2xl mx-auto',
        align === 'split' && 'flex flex-col md:flex-row md:items-end justify-between gap-6',
        className
      )}
    >
      <div className={cn(align === 'split' ? 'max-w-2xl' : '')}>
        {/* Kicker Tag */}
        {kicker && (
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] select-none',
                isDark ? 'text-brand-gold' : 'text-brand-gold-600'
              )}
            >
              {kicker}
            </span>
          </div>
        )}

        {/* Title with Cursive Accent */}
        <h2
          className={cn(
            'font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15]',
            isDark ? 'text-brand-ivory' : 'text-brand-ink'
          )}
        >
          {title}{' '}
          {cursiveAccent && (
            <span
              className={cn(
                'font-cursive text-4xl sm:text-5xl md:text-6xl font-normal block sm:inline-block sm:ml-2 -mt-1 sm:-mt-2',
                isDark ? 'text-brand-gold' : 'text-brand-gold'
              )}
            >
              {cursiveAccent}
            </span>
          )}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={cn(
              'text-xs sm:text-sm font-light leading-relaxed mt-2.5 max-w-xl',
              isDark ? 'text-brand-ivory/70' : 'text-brand-ink/70'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Element for Split layout */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
