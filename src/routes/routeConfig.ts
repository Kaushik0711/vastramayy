/**
 * Centralized Type-Safe Route Paths for Vastramay
 */
export const ROUTES = {
  // Storefront
  HOME: '/',
  MEN: '/men',
  WOMEN: '/women',
  PRODUCTS: '/products',
  CATEGORY: (categorySlug: string) => `/category/${categorySlug}`,
  SUBCATEGORY: (categorySlug: string, subcategorySlug: string) => `/category/${categorySlug}/${subcategorySlug}`,
  SEARCH: '/search',
  SALE: '/sale',
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,
  WISHLIST: '/wishlist',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  ACCOUNT: '/account',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQS: '/faqs',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  PRIVACY: '/privacy',
  DESIGN_SYSTEM: '/design-system',

  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SETTINGS: '/admin/settings',
} as const;
