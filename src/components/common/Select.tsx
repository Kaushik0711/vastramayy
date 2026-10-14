import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-white text-brand-ink text-sm rounded-md border border-brand-espresso/15 py-2.5 pl-3.5 pr-10 transition-all duration-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold disabled:opacity-50 disabled:bg-brand-ivory/50 cursor-pointer',
              error && 'border-brand-terracotta focus:border-brand-terracotta focus:ring-brand-terracotta',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-brand-ink/40 absolute right-3.5 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-brand-terracotta font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-brand-ink/60">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
