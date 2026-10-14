export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  type: 'home' | 'office' | 'other';
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  addresses: Address[];
  measurements?: {
    chest?: number; // in inches
    waist?: number;
    hip?: number;
    shoulder?: number;
    kurtaLength?: number;
    sleeveLength?: number;
  };
  totalOrdersCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  lifetimeValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}
