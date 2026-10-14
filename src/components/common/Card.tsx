import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  borderGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  borderGlow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-vastra-sand-border p-6 shadow-sm transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:shadow-luxury',
        borderGlow && 'hover:border-vastra-gold-400/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
