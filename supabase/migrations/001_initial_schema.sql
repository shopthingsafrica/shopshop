-- ============================================
-- ShopThings Marketplace - Initial Schema
-- ============================================
-- This migration creates all database tables for the ShopThings marketplace
-- Run: supabase db push or supabase migration up

-- ============================================
-- 1. ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. CREATE CUSTOM ENUM TYPES
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('buyer', 'vendor', 'admin');

-- Vendor status
CREATE TYPE vendor_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Product status
CREATE TYPE product_status AS ENUM ('draft', 'pending', 'active', 'rejected', 'archived');

-- Order status
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Transaction type for vendor wallets
CREATE TYPE transaction_type AS ENUM ('sale', 'withdrawal', 'refund', 'adjustment');

-- Transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Discount type for coupons
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- ============================================
-- 3. CREATE TABLES
-- ============================================

-- --------------------------------------------
-- 3.1 Profiles (extends auth.users)
-- --------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    preferred_currency TEXT NOT NULL DEFAULT 'NGN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- --------------------------------------------
-- 3.2 Vendors
-- --------------------------------------------
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    store_description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    status vendor_status NOT NULL DEFAULT 'pending',
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for vendor queries
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_is_verified ON vendors(is_verified);

-- --------------------------------------------
-- 3.3 Categories
-- --------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for category queries
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- --------------------------------------------
-- 3.4 Products
-- --------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    compare_at_price DECIMAL(12, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sku TEXT,
    images JSONB DEFAULT '[]',
    status product_status NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    average_rating DECIMAL(3, 2) NOT NULL DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for product queries
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_average_rating ON products(average_rating DESC);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- --------------------------------------------
-- 3.5 Cart Items
-- --------------------------------------------
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Prevent duplicate product entries per user
    UNIQUE(user_id, product_id)
);

-- Indexes for cart queries
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- --------------------------------------------
-- 3.6 Addresses
-- --------------------------------------------
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for address queries
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);

-- --------------------------------------------
-- 3.7 Orders
-- --------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    shipping_cost DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
    tax DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
    total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    shipping_address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
    billing_address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
    coupon_code TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- --------------------------------------------
-- 3.8 Order Items
-- --------------------------------------------
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12, 2) NOT NULL CHECK (total_price >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for order items queries
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_vendor_id ON order_items(vendor_id);

-- --------------------------------------------
-- 3.9 Vendor Wallets
-- --------------------------------------------
CREATE TABLE vendor_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
    available_balance DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (available_balance >= 0),
    pending_balance DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (pending_balance >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for wallet queries
CREATE INDEX idx_vendor_wallets_vendor_id ON vendor_wallets(vendor_id);

-- --------------------------------------------
-- 3.10 Wallet Transactions
-- --------------------------------------------
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES vendor_wallets(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    status transaction_status NOT NULL DEFAULT 'pending',
    reference TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for transaction queries
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- --------------------------------------------
-- 3.11 Payment Methods (for vendor withdrawals)
-- --------------------------------------------
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'bank_transfer', 'paypal', 'mobile_money', etc.
    details JSONB NOT NULL, -- Bank account details, etc.
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for payment method queries
CREATE INDEX idx_payment_methods_vendor_id ON payment_methods(vendor_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);

-- --------------------------------------------
-- 3.12 Wishlist Items
-- --------------------------------------------
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Prevent duplicate wishlist entries
    UNIQUE(user_id, product_id)
);

-- Indexes for wishlist queries
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);

-- --------------------------------------------
-- 3.13 Reviews
-- --------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- One review per product per order
    UNIQUE(user_id, product_id, order_id)
);

-- Indexes for review queries
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- --------------------------------------------
-- 3.14 Coupons
-- --------------------------------------------
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL CHECK (discount_value > 0),
    min_purchase DECIMAL(12, 2) CHECK (min_purchase IS NULL OR min_purchase >= 0),
    max_discount DECIMAL(12, 2) CHECK (max_discount IS NULL OR max_discount >= 0),
    usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Ensure valid date range
    CONSTRAINT valid_date_range CHECK (valid_until > valid_from)
);

-- Indexes for coupon queries
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_valid_from ON coupons(valid_from);
CREATE INDEX idx_coupons_valid_until ON coupons(valid_until);

-- ============================================
-- 4. COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE vendors IS 'Vendor/seller information and store details';
COMMENT ON TABLE categories IS 'Product categories with hierarchical structure';
COMMENT ON TABLE products IS 'Product listings with pricing and inventory';
COMMENT ON TABLE cart_items IS 'Shopping cart items per user';
COMMENT ON TABLE addresses IS 'User delivery and billing addresses';
COMMENT ON TABLE orders IS 'Customer orders with payment and shipping info';
COMMENT ON TABLE order_items IS 'Individual items within an order';
COMMENT ON TABLE vendor_wallets IS 'Vendor wallet for earnings and withdrawals';
COMMENT ON TABLE wallet_transactions IS 'Transaction history for vendor wallets';
COMMENT ON TABLE payment_methods IS 'Vendor payout methods (bank accounts, etc.)';
COMMENT ON TABLE wishlist_items IS 'User saved/favorite products';
COMMENT ON TABLE reviews IS 'Product reviews and ratings';
COMMENT ON TABLE coupons IS 'Discount codes and promotional offers';
