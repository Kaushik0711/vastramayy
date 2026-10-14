import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface CatalogBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const CatalogBreadcrumb: React.FC<CatalogBreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-brand-ink/60">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-brand-gold-600 transition-colors"
            title="Return to Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-brand-ink/30 shrink-0" />
              {isLast || !item.link ? (
                <span className="font-semibold text-brand-espresso truncate max-w-[180px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-brand-gold-600 transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
