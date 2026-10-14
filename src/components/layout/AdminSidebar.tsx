import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  ShoppingBag,
  RotateCcw,
  Users,
  Tag,
  Star,
  Settings,
  ExternalLink,
  Crown,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const menuGroups = [
    {
      group: 'Catalog & Stock',
      items: [
        { label: 'Executive Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Garment Catalog', icon: Package, path: '/admin/products' },
        { label: 'Inventory & Audits', icon: Boxes, path: '/admin/inventory' },
        { label: 'Category Hierarchy', icon: FolderTree, path: '/admin/categories' },
      ],
    },
    {
      group: 'Orders & Service',
      items: [
        { label: 'Orders & Dispatch', icon: ShoppingBag, path: '/admin/orders' },
        { label: 'Returns & Claims', icon: RotateCcw, path: '/admin/returns' },
        { label: 'Patron Directory', icon: Users, path: '/admin/customers' },
      ],
    },
    {
      group: 'Growth & Config',
      items: [
        { label: 'Coupons & Privileges', icon: Tag, path: '/admin/promotions' },
        { label: 'Review Moderation', icon: Star, path: '/admin/reviews' },
        { label: 'Atelier Settings', icon: Settings, path: '/admin/settings' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-brand-espresso border-r border-brand-gold/20 flex flex-col shrink-0 min-h-screen text-brand-ivory z-30">
      {/* Brand & Atelier Badge */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold shadow">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wider uppercase">
              Vastramay
            </h1>
            <p className="text-[10px] text-brand-gold font-bold tracking-widest uppercase">
              Atelier Command
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-white/60 hover:text-white md:hidden"
            aria-label="Close admin menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-brand-gold/80">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all',
                      isActive
                        ? 'bg-brand-gold text-brand-espresso font-bold shadow-md'
                        : 'text-brand-ivory/70 hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Quick link back to Storefront */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-brand-ivory/80 hover:text-brand-gold hover:bg-white/10 transition-colors border border-brand-gold/30"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-brand-gold" />
            <span>Storefront Live</span>
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
            Active
          </span>
        </Link>
      </div>
    </aside>
  );
};
