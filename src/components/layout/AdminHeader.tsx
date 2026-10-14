import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, Menu } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileSidebar }) => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('products')) return 'Garment Catalog & SKUs';
    if (path.includes('inventory')) return 'Inventory & Stock Audits';
    if (path.includes('categories')) return 'Category Hierarchy';
    if (path.includes('orders')) return 'Orders & BlueDart Dispatch';
    if (path.includes('returns')) return 'Return Requests & Quality Claims';
    if (path.includes('customers')) return 'Patron Relationship Directory';
    if (path.includes('promotions')) return 'Promotions & Privilege Coupons';
    if (path.includes('reviews')) return 'Patron Review Moderation';
    if (path.includes('settings')) return 'Store Settings & Operations';
    return 'Executive Operations Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-brand-espresso/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-brand-espresso/70 hover:text-brand-espresso rounded-lg md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[11px] text-brand-espresso/50">
            <Link to="/admin/dashboard" className="hover:text-brand-espresso">
              Atelier Admin
            </Link>
            <span>/</span>
            <span className="text-brand-espresso/80 font-medium capitalize">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </span>
          </div>
          <h2 className="font-serif text-lg font-bold text-brand-espresso hidden sm:block">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right: Actions, Notifications, Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-brand-espresso/60 hover:text-brand-espresso hover:bg-brand-espresso/5 rounded-full transition-colors relative"
            aria-label="Admin notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-terracotta rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-brand-espresso/10 p-4 space-y-3 animate-fade-in z-50 text-xs">
              <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-2">
                <span className="font-bold text-brand-espresso">Atelier Alerts</span>
                <span className="text-[10px] bg-brand-gold/20 text-brand-espresso font-semibold px-2 py-0.5 rounded">
                  2 New
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 space-y-0.5">
                  <p className="font-semibold text-amber-950">Low Stock Notice</p>
                  <p className="text-[11px] text-amber-800">
                    Varanasi Royal Brocade Sherwani (Size 42) has reached 3 remaining pieces.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200/60 space-y-0.5">
                  <p className="font-semibold text-blue-950">New Return Request Registered</p>
                  <p className="text-[11px] text-blue-800">
                    Order #VAST-2026-8812 initiated a return for sizing discrepancy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-brand-espresso/10" />

        {/* Admin Profile */}
        {admin && (
          <div className="flex items-center gap-3">
            <img
              src={
                admin.avatarUrl ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'
              }
              alt={admin.name}
              className="w-8 h-8 rounded-full object-cover border border-brand-gold"
            />
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-brand-espresso">{admin.name}</p>
              <p className="text-[10px] uppercase font-semibold text-brand-gold">
                {admin.role.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-brand-espresso/50 hover:text-brand-terracotta hover:bg-brand-espresso/5 rounded-full transition-colors ml-1"
              title="Sign Out of Admin"
              aria-label="Sign Out of Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
