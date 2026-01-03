-- ============================================
-- ShopThings Marketplace - Row Level Security Policies
-- ============================================
-- This migration sets up RLS policies for all tables
-- Ensures data isolation and proper access control

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. HELPER FUNCTIONS
-- ============================================

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user is the vendor owner
CREATE OR REPLACE FUNCTION is_vendor_owner(vendor_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM vendors 
        WHERE id = vendor_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get current user's vendor ID
CREATE OR REPLACE FUNCTION get_my_vendor_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM vendors 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- 3. PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
    ON profiles FOR UPDATE
    USING (is_admin());

-- Profiles are created via trigger on auth.users insert (see functions migration)
CREATE POLICY "Service role can insert profiles"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- ============================================
-- 4. VENDORS POLICIES
-- ============================================

-- Anyone can view approved vendors
CREATE POLICY "Anyone can view approved vendors"
    ON vendors FOR SELECT
    USING (status = 'approved');

-- Vendor owners can view their own vendor profile
CREATE POLICY "Owners can view own vendor"
    ON vendors FOR SELECT
    USING (user_id = auth.uid());

-- Admins can view all vendors
CREATE POLICY "Admins can view all vendors"
    ON vendors FOR SELECT
    USING (is_admin());

-- Users can create their own vendor profile
CREATE POLICY "Users can create vendor"
    ON vendors FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Vendor owners can update their store
CREATE POLICY "Owners can update own vendor"
    ON vendors FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Admins can update any vendor
CREATE POLICY "Admins can update any vendor"
    ON vendors FOR UPDATE
    USING (is_admin());

-- ============================================
-- 5. CATEGORIES POLICIES
-- ============================================

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
    ON categories FOR SELECT
    USING (is_active = true);

-- Admins can view all categories
CREATE POLICY "Admins can view all categories"
    ON categories FOR SELECT
    USING (is_admin());

-- Admins can insert categories
CREATE POLICY "Admins can insert categories"
    ON categories FOR INSERT
    WITH CHECK (is_admin());

-- Admins can update categories
CREATE POLICY "Admins can update categories"
    ON categories FOR UPDATE
    USING (is_admin());

-- Admins can delete categories
CREATE POLICY "Admins can delete categories"
    ON categories FOR DELETE
    USING (is_admin());

-- ============================================
-- 6. PRODUCTS POLICIES
-- ============================================

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
    ON products FOR SELECT
    USING (status = 'active');

-- Vendors can view their own products (any status)
CREATE POLICY "Vendors can view own products"
    ON products FOR SELECT
    USING (is_vendor_owner(vendor_id));

-- Admins can view all products
CREATE POLICY "Admins can view all products"
    ON products FOR SELECT
    USING (is_admin());

-- Vendors can insert their own products
CREATE POLICY "Vendors can insert products"
    ON products FOR INSERT
    WITH CHECK (is_vendor_owner(vendor_id));

-- Vendors can update their own products
CREATE POLICY "Vendors can update own products"
    ON products FOR UPDATE
    USING (is_vendor_owner(vendor_id))
    WITH CHECK (is_vendor_owner(vendor_id));

-- Admins can update any product
CREATE POLICY "Admins can update any product"
    ON products FOR UPDATE
    USING (is_admin());

-- Vendors can delete their own draft products
CREATE POLICY "Vendors can delete own draft products"
    ON products FOR DELETE
    USING (is_vendor_owner(vendor_id) AND status = 'draft');

-- Admins can delete any product
CREATE POLICY "Admins can delete any product"
    ON products FOR DELETE
    USING (is_admin());

-- ============================================
-- 7. CART ITEMS POLICIES
-- ============================================

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
    ON cart_items FOR SELECT
    USING (user_id = auth.uid());

-- Users can add to their own cart
CREATE POLICY "Users can add to own cart"
    ON cart_items FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own cart items
CREATE POLICY "Users can update own cart"
    ON cart_items FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can remove from their own cart
CREATE POLICY "Users can remove from own cart"
    ON cart_items FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- 8. ADDRESSES POLICIES
-- ============================================

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
    ON addresses FOR SELECT
    USING (user_id = auth.uid());

-- Users can add their own addresses
CREATE POLICY "Users can add own addresses"
    ON addresses FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
    ON addresses FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
    ON addresses FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- 9. ORDERS POLICIES
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (user_id = auth.uid());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    USING (is_admin());

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
    ON orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Admins can update any order
CREATE POLICY "Admins can update any order"
    ON orders FOR UPDATE
    USING (is_admin());

-- ============================================
-- 10. ORDER ITEMS POLICIES
-- ============================================

-- Users can view their own order items
CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Vendors can view order items for their products
CREATE POLICY "Vendors can view their order items"
    ON order_items FOR SELECT
    USING (is_vendor_owner(vendor_id));

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
    ON order_items FOR SELECT
    USING (is_admin());

-- Order items are created with orders (service role)
CREATE POLICY "Service role can insert order items"
    ON order_items FOR INSERT
    WITH CHECK (true);

-- ============================================
-- 11. VENDOR WALLETS POLICIES
-- ============================================

-- Vendors can view their own wallet
CREATE POLICY "Vendors can view own wallet"
    ON vendor_wallets FOR SELECT
    USING (is_vendor_owner(vendor_id));

-- Admins can view all wallets
CREATE POLICY "Admins can view all wallets"
    ON vendor_wallets FOR SELECT
    USING (is_admin());

-- Wallets are created automatically (service role)
CREATE POLICY "Service role can manage wallets"
    ON vendor_wallets FOR ALL
    USING (true);

-- ============================================
-- 12. WALLET TRANSACTIONS POLICIES
-- ============================================

-- Vendors can view their own transactions
CREATE POLICY "Vendors can view own transactions"
    ON wallet_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM vendor_wallets 
            WHERE vendor_wallets.id = wallet_transactions.wallet_id 
            AND is_vendor_owner(vendor_wallets.vendor_id)
        )
    );

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
    ON wallet_transactions FOR SELECT
    USING (is_admin());

-- Transactions are created by system (service role)
CREATE POLICY "Service role can manage transactions"
    ON wallet_transactions FOR ALL
    USING (true);

-- ============================================
-- 13. PAYMENT METHODS POLICIES
-- ============================================

-- Vendors can view their own payment methods
CREATE POLICY "Vendors can view own payment methods"
    ON payment_methods FOR SELECT
    USING (is_vendor_owner(vendor_id));

-- Vendors can add their own payment methods
CREATE POLICY "Vendors can add payment methods"
    ON payment_methods FOR INSERT
    WITH CHECK (is_vendor_owner(vendor_id));

-- Vendors can update their own payment methods
CREATE POLICY "Vendors can update own payment methods"
    ON payment_methods FOR UPDATE
    USING (is_vendor_owner(vendor_id))
    WITH CHECK (is_vendor_owner(vendor_id));

-- Vendors can delete their own payment methods
CREATE POLICY "Vendors can delete own payment methods"
    ON payment_methods FOR DELETE
    USING (is_vendor_owner(vendor_id));

-- ============================================
-- 14. WISHLIST ITEMS POLICIES
-- ============================================

-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist"
    ON wishlist_items FOR SELECT
    USING (user_id = auth.uid());

-- Users can add to their own wishlist
CREATE POLICY "Users can add to own wishlist"
    ON wishlist_items FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can remove from their own wishlist
CREATE POLICY "Users can remove from own wishlist"
    ON wishlist_items FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- 15. REVIEWS POLICIES
-- ============================================

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    USING (true);

-- Users can create reviews for their orders
CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_id 
            AND orders.user_id = auth.uid()
            AND orders.status = 'delivered'
        )
    );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (user_id = auth.uid());

-- Admins can delete any review
CREATE POLICY "Admins can delete any review"
    ON reviews FOR DELETE
    USING (is_admin());

-- ============================================
-- 16. COUPONS POLICIES
-- ============================================

-- Anyone can view active, valid coupons (for validation)
CREATE POLICY "Anyone can view active coupons"
    ON coupons FOR SELECT
    USING (
        is_active = true AND 
        valid_from <= NOW() AND 
        valid_until > NOW() AND
        (usage_limit IS NULL OR used_count < usage_limit)
    );

-- Admins can view all coupons
CREATE POLICY "Admins can view all coupons"
    ON coupons FOR SELECT
    USING (is_admin());

-- Admins can manage coupons
CREATE POLICY "Admins can insert coupons"
    ON coupons FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admins can update coupons"
    ON coupons FOR UPDATE
    USING (is_admin());

CREATE POLICY "Admins can delete coupons"
    ON coupons FOR DELETE
    USING (is_admin());
