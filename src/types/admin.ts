export type AdminRole = 'super_admin' | 'catalog_manager' | 'order_manager' | 'customer_support';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowthPercent: number;
  ordersGrowthPercent: number;
  lowStockCount: number;
  pendingReturnsCount: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}
