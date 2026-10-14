import React, { useState, useRef } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../common/Badge';
import { modalBackdropVariants, modalSurfaceVariants } from '../../styles/motionTokens';

interface ProductImageGalleryProps {
  images: {
    primary: string;
    gallery: string[];
  };
  productName: string;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  discountPercentage?: number;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  isNewArrival,
  isBestseller,
  discountPercentage,
}) => {
  const galleryList = images.gallery.length > 0 ? images.gallery : [images.primary];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const activeImage = galleryList[activeIndex] || images.primary;
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryList.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Display with Hover Magnify */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
        className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-brand-espresso/15 bg-brand-ivory shadow-luxury cursor-zoom-in"
      >
        <img
          src={activeImage}
          alt={`${productName} view ${activeIndex + 1}`}
          className={`w-full h-full object-cover object-top transition-transform duration-300 ${
            isHovering ? 'scale-150' : 'scale-100'
          }`}
          style={
            isHovering
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
        />

        {/* Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isNewArrival && (
            <Badge variant="espresso" size="sm">
              New Arrival
            </Badge>
          )}
          {isBestseller && (
            <Badge variant="gold" size="sm">
              Bestseller
            </Badge>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-terracotta text-white shadow-xs">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Fullscreen Zoom Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-brand-espresso hover:bg-white shadow-md transition-all duration-300 opacity-90 group-hover:opacity-100"
          title="Open Fullscreen Lightbox"
          aria-label="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails Row */}
      {galleryList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                activeIndex === idx
                  ? 'border-brand-gold shadow-md scale-102'
                  : 'border-brand-espresso/15 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-brand-espresso/90 backdrop-blur-md"
              onClick={() => setIsLightboxOpen(false)}
            />

            <motion.div
              variants={modalSurfaceVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-4xl max-h-[90vh] z-10 flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-brand-gold transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lightbox Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-brand-gold/40 shadow-2xl bg-black">
                <img
                  src={activeImage}
                  alt={`${productName} lightbox`}
                  className="max-h-[80vh] w-auto object-contain"
                />

                {galleryList.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 hover:text-brand-gold transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 hover:text-brand-gold transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <span className="text-white/70 text-xs mt-3">
                Image {activeIndex + 1} of {galleryList.length} · {productName}
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
