import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  fadeInUpVariants,
  fadeInVariants,
  staggerContainerVariants,
  reducedMotionVariants,
  MOTION_DURATIONS,
  MOTION_EASINGS,
} from '../../styles/motionTokens';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-up' | 'fade' | 'stagger' | 'scale';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  once = true,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.div
        variants={reducedMotionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'stagger') {
    return (
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-40px' }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'scale') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once, margin: '-40px' }}
        transition={{
          duration: MOTION_DURATIONS.deliberate,
          ease: MOTION_EASINGS.luxury,
          delay,
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  const selectedVariants = variant === 'fade' ? fadeInVariants : fadeInUpVariants;

  return (
    <motion.div
      variants={selectedVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
