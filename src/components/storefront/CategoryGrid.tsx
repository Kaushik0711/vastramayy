import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const all = await categoryService.getAllCategories();
      setCategories(all.slice(0, 4));
    }
    load();
  }, []);

  const featuredCategories = categories;

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-vastra-gold-600 block mb-1">
            Curated Ensembles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-vastra-navy-900">
            Signature Festive Suites
          </h2>
        </div>
        <Link
          to="/products"
          className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-vastra-navy-900 hover:text-vastra-gold-600 border-b border-vastra-gold-400 pb-0.5"
        >
          <span>View All Collections</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-vastra-sand-border shadow-xs hover:shadow-luxury transition-all duration-500"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vastra-navy-950/90 via-vastra-navy-900/30 to-transparent" />
            
            <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-widest font-bold text-vastra-gold-300">
                {cat.gender} · {cat.itemCount} Designs
              </span>
              <h3 className="font-serif text-xl font-semibold text-vastra-sand-50 mt-1 group-hover:text-vastra-gold-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-vastra-sand-300 line-clamp-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
