// Re-export all types from database
export * from './database';

// Currency types
export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1550.0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
};

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Cart types
export interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    images: string[];
    stock_quantity: number;
    vendor: {
      id: string;
      store_name: string;
      is_verified: boolean;
    };
  };
}

export interface CartState {
  items: CartItemWithProduct[];
  isLoading: boolean;
  error: string | null;
}

// Product with relations
export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  stock_quantity: number;
  images: string[];
  status: string;
  average_rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  vendor: {
    id: string;
    store_name: string;
    logo_url: string | null;
    is_verified: boolean;
  };
}

// Order with items
export interface OrderWithItems {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  created_at: string;
  items: {
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: string[];
    };
  }[];
  shipping_address: {
    full_name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// Search and filter types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  vendor?: string;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface AuthState {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'buyer' | 'vendor' | 'admin';
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Vendor dashboard types
export interface VendorDashboardStats {
  totalSales: number;
  totalOrders: number;
  profileViews: number;
  salesChange: number;
  ordersChange: number;
  viewsChange: number;
}

export interface VendorOrderSummary {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  items_count: number;
}

// Admin dashboard types
export interface AdminDashboardStats {
  totalUsers: number;
  activeVendors: number;
  totalProducts: number;
  salesVolume: number;
  usersChange: number;
  vendorsChange: number;
  productsChange: number;
  salesChange: number;
}

// Social links type
export interface SocialLinks {
  tiktok?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  facebook?: string;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface FieldError {
  field: string;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
