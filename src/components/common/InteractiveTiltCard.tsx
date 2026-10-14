import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees (default: 4.5)
  perspective?: number; // CSS perspective in pixels (default: 1000)
  glareOpacity?: number; // Max glare highlight opacity (default: 0.15)
  scaleOnHover?: number; // Scale on hover (default: 1.015)
  disabled?: boolean;
}

export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 4.5,
  perspective = 1000,
  glareOpacity = 0.15,
  scaleOnHover = 1.015,
  disabled = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Detect if fine pointer (mouse/trackpad) is supported
  const [isFinePointer, setIsFinePointer] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(pointer: fine)');
      setIsFinePointer(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsFinePointer(e.matches);
      };

      mediaQuery.addEventListener?.('change', handleChange);
      return () => {
        mediaQuery.removeEventListener?.('change', handleChange);
      };
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || prefersReducedMotion || !isFinePointer || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Normalize to -0.5 to +0.5
      const pctX = mouseX / width - 0.5;
      const pctY = mouseY / height - 0.5;

      // Calculate tilt angles (reversed for natural depth feel)
      const rotateX = -pctY * maxTilt;
      const rotateY = pctX * maxTilt;

      setTransformStyle(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1)`
      );

      // Glare highlight tracking
      setGlarePosition({
        x: Math.round((mouseX / width) * 100),
        y: Math.round((mouseY / height) * 100),
        opacity: glareOpacity,
      });
    },
    [disabled, prefersReducedMotion, isFinePointer, maxTilt, perspective, scaleOnHover, glareOpacity]
  );

  const handleMouseEnter = useCallback(() => {
    if (disabled || prefersReducedMotion || !isFinePointer) return;
    setIsHovered(true);
  }, [disabled, prefersReducedMotion, isFinePointer]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smoothly reset
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, [perspective]);

  // Clean fallback when reduced motion or touch device
  if (prefersReducedMotion || !isFinePointer || disabled) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Dynamic Ambient Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-inherit overflow-hidden transition-opacity duration-300"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(185, 155, 105, 0.12) 40%, transparent 80%)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
};
