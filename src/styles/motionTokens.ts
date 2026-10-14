/**
 * VASTRAMAY LUXURY MOTION DESIGN SYSTEM TOKENS
 * 
 * Formal motion tokens for fashion storytelling, interaction feedback,
 * 3D layering, and WCAG-compliant reduced-motion support.
 */

import { Variants, Transition } from 'framer-motion';

// 1. Duration Tokens (seconds)
export const MOTION_DURATIONS = {
  instant: 0.1,    // Micro-interactions, toggle states
  fast: 0.2,       // Button presses, tooltips, badge reveals
  normal: 0.35,    // Drawers, dropdowns, modal entrances
  deliberate: 0.5, // Product gallery image transitions, filters
  editorial: 0.75, // Hero entrances, brand story reveals, large visual layers
  slow: 1.0,       // Ambient background subtle loops
} as const;

// 2. Curated Easing Curves
// We use custom cubic-bezier curves calibrated for luxury fashion aesthetics.
export const MOTION_EASINGS = {
  // Ultra-silky luxury deceleration (starts briskly, smoothly settles)
  luxury: [0.16, 1, 0.3, 1] as const,
  // Editorial fluid movement
  editorial: [0.25, 1, 0.5, 1] as const,
  // Balanced standard ease-in-out
  smooth: [0.4, 0, 0.2, 1] as const,
  // Responsive interactive snap
  snap: [0.05, 0.7, 0.1, 1.0] as const,
} as const;

// 3. Spring Configurations
export const MOTION_SPRINGS = {
  // Soft luxury bounce (used for wishlist hearts & badges)
  gentle: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
    mass: 0.8,
  } as Transition,
  // Snappy feedback (for quick add, swatch selection)
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    mass: 0.5,
  } as Transition,
} as const;

// 4. Distance Tokens (pixels)
export const MOTION_DISTANCES = {
  micro: 4,
  subtle: 8,
  standard: 16,
  reveal: 24,
  editorial: 40,
} as const;

// 5. Standard Reusable Framer Motion Variants
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: MOTION_DISTANCES.reveal,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.deliberate,
      ease: MOTION_EASINGS.luxury,
      delay: customDelay,
    },
  }),
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.luxury,
      delay: customDelay,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: MOTION_DISTANCES.standard,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.luxury,
    },
  },
};

// 6. Drawers & Modals Motion Variants
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.luxury,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.smooth,
    },
  },
};

export const modalSurfaceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: MOTION_DISTANCES.subtle,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.luxury,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: MOTION_DISTANCES.subtle,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.smooth,
    },
  },
};

export const drawerSlideRightVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0.8,
  },
  visible: {
    x: '0%',
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.luxury,
    },
  },
  exit: {
    x: '100%',
    opacity: 0.8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.smooth,
    },
  },
};

// 7. Storefront Page Transition Variants
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: MOTION_DISTANCES.subtle,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.luxury,
    },
  },
  exit: {
    opacity: 0,
    y: -MOTION_DISTANCES.micro,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.smooth,
    },
  },
};

// 8. Reduced Motion Variant Overrides (WCAG AAA)
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_DURATIONS.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATIONS.instant },
  },
};
