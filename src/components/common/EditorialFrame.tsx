import React from 'react';
import { cn } from '../../utils/cn';

export interface EditorialFrameProps {
  imageSrc: string;
  imageAlt: string;
  shape?: 'arch' | 'rectangle' | 'squircle';
  annotation?: string;
  kicker?: string;
  aspectRatio?: 'portrait' | 'square' | 'tall';
  floatingOffset?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const EditorialFrame: React.FC<EditorialFrameProps> = ({
  imageSrc,
  imageAlt,
  shape = 'arch',
  annotation,
  kicker,
  aspectRatio = 'portrait',
  floatingOffset = true,
  className,
  children,
}) => {
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    tall: 'aspect-[9/16]',
  };

  const shapeClasses = {
    arch: 'arch-frame',
    rectangle: 'rounded-lg',
    squircle: 'rounded-2xl',
  };

  return (
    <div className={cn('relative group', className)}>
      {/* 3D Offset Gold Background Card */}
      {floatingOffset && (
        <div
          className={cn(
            'absolute inset-0 bg-brand-gold/15 border border-brand-gold/30 translate-x-3 translate-y-3 -z-10 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4',
            shapeClasses[shape]
          )}
        />
      )}

      {/* Main Image Frame */}
      <div
        className={cn(
          'relative overflow-hidden bg-brand-espresso/10 border border-brand-gold/40 shadow-elevated transition-transform duration-500 group-hover:-translate-y-1',
          aspectClasses[aspectRatio],
          shapeClasses[shape]
        )}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Kicker Tag */}
        {kicker && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-brand-espresso/80 backdrop-blur-md text-brand-gold text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-sm border border-brand-gold/30">
              {kicker}
            </span>
          </div>
        )}

        {/* Custom Overlay Children */}
        {children}
      </div>

      {/* Floating Handwritten Annotation Note */}
      {annotation && (
        <div className="absolute -bottom-4 right-2 sm:right-6 z-20 pointer-events-none select-none">
          <span className="font-cursive text-2xl sm:text-3xl text-brand-gold drop-shadow-md">
            {annotation}
          </span>
        </div>
      )}
    </div>
  );
};
