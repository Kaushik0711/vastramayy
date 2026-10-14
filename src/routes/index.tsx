import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StorefrontLayout } from '../components/layout/StorefrontLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CustomerGuard } from '../components/auth/CustomerGuard';

// Core Storefront Pages (Eagerly bundled for immediate initial render)
import { HomePage } from '../pages/storefront/HomePage';
import { ProductsPage } from '../pages/storefront/ProductsPage';
import { SearchPage } from '../pages/storefront/SearchPage';
import { ProductDetailPage } from '../pages/storefront/ProductDetailPage';
import { CartPage } from '../pages/storefront/CartPage';
import { CheckoutPage } from '../pages/storefront/CheckoutPage';
import { OrderSuccessPage } from '../pages/storefront/OrderSuccessPage';
import { WishlistPage } from '../pages/storefront/WishlistPage';
import {
  CustomerLoginPage,
  CustomerRegisterPage,
  CustomerForgotPasswordPage,
} from '../pages/storefront/AuthPages';
import { AccountPage } from '../pages/storefront/AccountPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Secondary Storefront Pages (Code-split)
const AboutPage = React.lazy(() =>
  import('../pages/storefront/StaticPages').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = React.lazy(() =>
  import('../pages/storefront/StaticPages').then((m) => ({ default: m.ContactPage }))
);
const FAQPage = React.lazy(() =>
  import('../pages/storefront/StaticPages').then((m) => ({ default: m.FAQPage }))
);
const PolicyPage = React.lazy(() =>
  import('../pages/storefront/StaticPages').then((m) => ({ default: m.PolicyPage }))
);
const DesignSystemShowcasePage = React.lazy(() =>
  import('../pages/storefront/DesignSystemShowcasePage').then((m) => ({
    default: m.DesignSystemShowcasePage,
  }))
);

// Admin Operational Pages (Code-split to isolate bundle from customer sessions)
const AdminLoginPage = React.lazy(() =>
  import('../pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = React.lazy(() =>
  import('../pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminProductsPage = React.lazy(() =>
  import('../pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage }))
);
const AdminInventoryPage = React.lazy(() =>
  import('../pages/admin/AdminInventoryPage').then((m) => ({ default: m.AdminInventoryPage }))
);
const AdminCategoriesPage = React.lazy(() =>
  import('../pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage }))
);
const AdminOrdersPage = React.lazy(() =>
  import('../pages/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage }))
);
const AdminReturnsPage = React.lazy(() =>
  import('../pages/admin/AdminReturnsPage').then((m) => ({ default: m.AdminReturnsPage }))
);
const AdminCustomersPage = React.lazy(() =>
  import('../pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage }))
);
const AdminPromotionsPage = React.lazy(() =>
  import('../pages/admin/AdminPromotionsPage').then((m) => ({ default: m.AdminPromotionsPage }))
);
const AdminReviewsPage = React.lazy(() =>
  import('../pages/admin/AdminReviewsPage').then((m) => ({ default: m.AdminReviewsPage }))
);
const AdminSettingsPage = React.lazy(() =>
  import('../pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3" role="status" aria-label="Loading page">
    <div className="w-10 h-10 rounded-full border-2 border-brand-gold/25 border-t-brand-gold animate-spin" />
    <span className="font-serif text-xs tracking-widest text-brand-espresso/60 uppercase">
      Loading Atelier Content...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Storefront Experience */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/men" element={<ProductsPage forcedGender="men" />} />
          <Route path="/women" element={<ProductsPage forcedGender="women" />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categorySlug" element={<ProductsPage />} />
          <Route path="/category/:categorySlug/:subcategorySlug" element={<ProductsPage />} />
          <Route path="/sale" element={<ProductsPage isSalePage={true} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/forgot-password" element={<CustomerForgotPasswordPage />} />
          <Route
            path="/account"
            element={
              <CustomerGuard>
                <AccountPage />
              </CustomerGuard>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/shipping" element={<PolicyPage type="shipping" />} />
          <Route path="/returns" element={<PolicyPage type="returns" />} />
          <Route path="/privacy" element={<PolicyPage type="privacy" />} />
          <Route path="/design-system" element={<DesignSystemShowcasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Experience */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="returns" element={<AdminReturnsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
