import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const inputId = id || `chk-${Math.random().toString(36).substring(2, 8)}`;

    return (
      <div className="flex items-start gap-3 select-none text-left">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            className={cn(
              'peer h-4 w-4 appearance-none rounded border border-brand-espresso/25 bg-white transition-all checked:bg-brand-espresso checked:border-brand-espresso focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-1 disabled:opacity-50 cursor-pointer',
              className
            )}
            {...props}
          />
          <Check className="w-3 h-3 text-brand-gold absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
        </div>
        <div className="text-xs">
          <label htmlFor={inputId} className="font-semibold text-brand-ink cursor-pointer block">
            {label}
          </label>
          {description && (
            <p className="text-brand-ink/60 mt-0.5 leading-relaxed font-light">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
