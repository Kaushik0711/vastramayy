import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-vastra-charcoal-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-vastra-charcoal-400 pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              'w-full bg-white text-vastra-charcoal-900 placeholder:text-vastra-charcoal-400 text-sm rounded-md border border-vastra-sand-border py-2.5 px-3.5 transition-all duration-200 focus:outline-none focus:border-vastra-gold-400 focus:ring-1 focus:ring-vastra-gold-400 disabled:opacity-50 disabled:bg-vastra-sand-100',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-vastra-maroon-600 focus:border-vastra-maroon-600 focus:ring-vastra-maroon-600',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-vastra-charcoal-400 pointer-events-none" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-xs text-vastra-maroon-600 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-vastra-charcoal-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
