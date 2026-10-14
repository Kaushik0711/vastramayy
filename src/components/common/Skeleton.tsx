import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
  shape?: 'rectangle' | 'circle' | 'arch';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, shape = 'rectangle' }) => {
  const shapeClasses = {
    rectangle: 'rounded-md',
    circle: 'rounded-full',
    arch: 'arch-frame',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-brand-ivory-200/80 border border-brand-espresso/5',
        shapeClasses[shape],
        className
      )}
    />
  );
};
