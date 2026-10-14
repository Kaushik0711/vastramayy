import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-20 h-20 rounded-full bg-vastra-gold-50 border border-vastra-gold-300 flex items-center justify-center text-vastra-gold-600">
        <Compass className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-vastra-gold-600">404 — Heirloom Lost</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-vastra-navy-900">Page Not Found</h1>
        <p className="text-sm text-vastra-charcoal-600 max-w-md mx-auto font-light leading-relaxed">
          The requested page or collection does not exist or has been relocated within the atelier.
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="md">
            Return to Storefront
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Browse Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
};
