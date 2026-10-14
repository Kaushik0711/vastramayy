import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontFooter } from './StorefrontFooter';
import { CartDrawer } from '../common/CartDrawer';
import { ScrollToTop } from '../common/ScrollToTop';
import { pageTransitionVariants, reducedMotionVariants } from '../../styles/motionTokens';

export const StorefrontLayout: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col bg-brand-ivory-50 selection:bg-brand-gold/30 selection:text-brand-ink overflow-x-clip w-full">
      <ScrollToTop />
      <StorefrontHeader />
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={prefersReducedMotion ? reducedMotionVariants : pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full pointer-events-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
};
