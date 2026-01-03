-- ============================================
-- ShopThings Marketplace - Seed Data
-- ============================================
-- This migration inserts initial data for development and testing
-- Includes categories, sample coupons, and an admin user

-- ============================================
-- 1. SEED CATEGORIES
-- ============================================

-- Main Categories (African-themed as per design)
INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active, sort_order) VALUES
-- Fashion & Clothing
('c0000001-0000-0000-0000-000000000001', 'Fashion & Clothing', 'fashion-clothing', 'African-inspired fashion, traditional wear, and modern clothing', '/images/categories/fashion.jpg', NULL, true, 1),
('c0000001-0000-0000-0000-000000000011', 'Women''s Fashion', 'womens-fashion', 'Dresses, tops, skirts, and more for women', '/images/categories/womens-fashion.jpg', 'c0000001-0000-0000-0000-000000000001', true, 1),
('c0000001-0000-0000-0000-000000000012', 'Men''s Fashion', 'mens-fashion', 'Traditional and modern clothing for men', '/images/categories/mens-fashion.jpg', 'c0000001-0000-0000-0000-000000000001', true, 2),
('c0000001-0000-0000-0000-000000000013', 'Kids'' Fashion', 'kids-fashion', 'Adorable African styles for children', '/images/categories/kids-fashion.jpg', 'c0000001-0000-0000-0000-000000000001', true, 3),
('c0000001-0000-0000-0000-000000000014', 'Traditional Wear', 'traditional-wear', 'Authentic African traditional attire', '/images/categories/traditional-wear.jpg', 'c0000001-0000-0000-0000-000000000001', true, 4),

-- Accessories
('c0000002-0000-0000-0000-000000000001', 'Accessories', 'accessories', 'Jewelry, bags, hats, and fashion accessories', '/images/categories/accessories.jpg', NULL, true, 2),
('c0000002-0000-0000-0000-000000000021', 'Jewelry', 'jewelry', 'Handcrafted African jewelry and beads', '/images/categories/jewelry.jpg', 'c0000002-0000-0000-0000-000000000001', true, 1),
('c0000002-0000-0000-0000-000000000022', 'Bags & Purses', 'bags-purses', 'African print bags and leather goods', '/images/categories/bags.jpg', 'c0000002-0000-0000-0000-000000000001', true, 2),
('c0000002-0000-0000-0000-000000000023', 'Hats & Headwear', 'hats-headwear', 'Traditional and modern African headwear', '/images/categories/hats.jpg', 'c0000002-0000-0000-0000-000000000001', true, 3),
('c0000002-0000-0000-0000-000000000024', 'Footwear', 'footwear', 'African-inspired shoes and sandals', '/images/categories/footwear.jpg', 'c0000002-0000-0000-0000-000000000001', true, 4),

-- Home & Living
('c0000003-0000-0000-0000-000000000001', 'Home & Living', 'home-living', 'African-inspired home decor and furniture', '/images/categories/home-living.jpg', NULL, true, 3),
('c0000003-0000-0000-0000-000000000031', 'Home Decor', 'home-decor', 'Wall art, sculptures, and decorative items', '/images/categories/home-decor.jpg', 'c0000003-0000-0000-0000-000000000001', true, 1),
('c0000003-0000-0000-0000-000000000032', 'Textiles & Fabrics', 'textiles-fabrics', 'African print fabrics and textile art', '/images/categories/textiles.jpg', 'c0000003-0000-0000-0000-000000000001', true, 2),
('c0000003-0000-0000-0000-000000000033', 'Furniture', 'furniture', 'Handcrafted African furniture pieces', '/images/categories/furniture.jpg', 'c0000003-0000-0000-0000-000000000001', true, 3),
('c0000003-0000-0000-0000-000000000034', 'Kitchen & Dining', 'kitchen-dining', 'African-inspired kitchenware and dining sets', '/images/categories/kitchen.jpg', 'c0000003-0000-0000-0000-000000000001', true, 4),

-- Art & Crafts
('c0000004-0000-0000-0000-000000000001', 'Art & Crafts', 'art-crafts', 'Original African artwork and handcrafted items', '/images/categories/art-crafts.jpg', NULL, true, 4),
('c0000004-0000-0000-0000-000000000041', 'Paintings', 'paintings', 'Original African paintings and prints', '/images/categories/paintings.jpg', 'c0000004-0000-0000-0000-000000000001', true, 1),
('c0000004-0000-0000-0000-000000000042', 'Sculptures', 'sculptures', 'Wood, bronze, and stone sculptures', '/images/categories/sculptures.jpg', 'c0000004-0000-0000-0000-000000000001', true, 2),
('c0000004-0000-0000-0000-000000000043', 'Crafts', 'crafts', 'Handmade African crafts and artifacts', '/images/categories/crafts.jpg', 'c0000004-0000-0000-0000-000000000001', true, 3),
('c0000004-0000-0000-0000-000000000044', 'Masks', 'masks', 'Traditional African masks and wall pieces', '/images/categories/masks.jpg', 'c0000004-0000-0000-0000-000000000001', true, 4),

-- Beauty & Health
('c0000005-0000-0000-0000-000000000001', 'Beauty & Health', 'beauty-health', 'Natural African beauty products and wellness', '/images/categories/beauty-health.jpg', NULL, true, 5),
('c0000005-0000-0000-0000-000000000051', 'Skincare', 'skincare', 'Natural African skincare products', '/images/categories/skincare.jpg', 'c0000005-0000-0000-0000-000000000001', true, 1),
('c0000005-0000-0000-0000-000000000052', 'Hair Care', 'hair-care', 'Natural hair products and accessories', '/images/categories/haircare.jpg', 'c0000005-0000-0000-0000-000000000001', true, 2),
('c0000005-0000-0000-0000-000000000053', 'Fragrances', 'fragrances', 'African-inspired perfumes and oils', '/images/categories/fragrances.jpg', 'c0000005-0000-0000-0000-000000000001', true, 3),

-- Food & Spices
('c0000006-0000-0000-0000-000000000001', 'Food & Spices', 'food-spices', 'African foods, spices, and ingredients', '/images/categories/food-spices.jpg', NULL, true, 6),
('c0000006-0000-0000-0000-000000000061', 'Spices & Seasonings', 'spices-seasonings', 'African spices and seasoning blends', '/images/categories/spices.jpg', 'c0000006-0000-0000-0000-000000000001', true, 1),
('c0000006-0000-0000-0000-000000000062', 'Snacks', 'snacks', 'African snacks and treats', '/images/categories/snacks.jpg', 'c0000006-0000-0000-0000-000000000001', true, 2),
('c0000006-0000-0000-0000-000000000063', 'Beverages', 'beverages', 'African teas, coffees, and drinks', '/images/categories/beverages.jpg', 'c0000006-0000-0000-0000-000000000001', true, 3),

-- Books & Music
('c0000007-0000-0000-0000-000000000001', 'Books & Music', 'books-music', 'African literature and music', '/images/categories/books-music.jpg', NULL, true, 7),
('c0000007-0000-0000-0000-000000000071', 'Books', 'books', 'African literature and educational books', '/images/categories/books.jpg', 'c0000007-0000-0000-0000-000000000001', true, 1),
('c0000007-0000-0000-0000-000000000072', 'Music', 'music', 'African music CDs and vinyl', '/images/categories/music.jpg', 'c0000007-0000-0000-0000-000000000001', true, 2),
('c0000007-0000-0000-0000-000000000073', 'Instruments', 'instruments', 'Traditional African musical instruments', '/images/categories/instruments.jpg', 'c0000007-0000-0000-0000-000000000001', true, 3),

-- Electronics
('c0000008-0000-0000-0000-000000000001', 'Electronics', 'electronics', 'Tech products and gadgets', '/images/categories/electronics.jpg', NULL, true, 8);

-- ============================================
-- 2. SEED COUPONS
-- ============================================

INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, valid_from, valid_until, is_active) VALUES
-- Welcome coupon
('WELCOME10', 'Welcome discount - 10% off your first order', 'percentage', 10, 5000, 2000, NULL, NOW(), NOW() + INTERVAL '1 year', true),

-- Seasonal coupons
('AFRICA2026', 'Africa Day 2026 - 15% off', 'percentage', 15, 10000, 5000, 1000, '2026-05-25 00:00:00+00', '2026-05-31 23:59:59+00', true),

-- Fixed amount coupons
('SAVE500', 'Save ₦500 on orders over ₦5,000', 'fixed', 500, 5000, NULL, 500, NOW(), NOW() + INTERVAL '6 months', true),
('SAVE1000', 'Save ₦1,000 on orders over ₦10,000', 'fixed', 1000, 10000, NULL, 200, NOW(), NOW() + INTERVAL '6 months', true),
('SAVE2500', 'Save ₦2,500 on orders over ₦25,000', 'fixed', 2500, 25000, NULL, 100, NOW(), NOW() + INTERVAL '6 months', true),

-- Free shipping simulation (flat discount)
('FREESHIP', 'Free shipping on orders over ₦15,000', 'fixed', 1500, 15000, NULL, NULL, NOW(), NOW() + INTERVAL '1 year', true),

-- Special discount
('VIP25', 'VIP exclusive - 25% off (max ₦10,000)', 'percentage', 25, 20000, 10000, 50, NOW(), NOW() + INTERVAL '3 months', true);

-- ============================================
-- 3. HELPFUL VIEW FOR ADMIN DASHBOARD
-- ============================================

-- View for order statistics
CREATE OR REPLACE VIEW order_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
    SUM(total) as total_revenue,
    AVG(total) as average_order_value
FROM orders
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- View for product statistics
CREATE OR REPLACE VIEW product_stats AS
SELECT 
    c.name as category_name,
    COUNT(p.id) as total_products,
    SUM(CASE WHEN p.status = 'active' THEN 1 ELSE 0 END) as active_products,
    AVG(p.price) as average_price,
    SUM(p.stock_quantity) as total_stock,
    AVG(p.average_rating) as average_rating
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.parent_id IS NOT NULL
GROUP BY c.id, c.name
ORDER BY total_products DESC;

-- View for vendor statistics
CREATE OR REPLACE VIEW vendor_stats_view AS
SELECT 
    v.id,
    v.store_name,
    v.status,
    v.is_verified,
    v.created_at,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT oi.order_id) as order_count,
    COALESCE(SUM(oi.total_price), 0) as total_sales,
    COALESCE(AVG(p.average_rating), 0) as average_rating,
    COALESCE(w.available_balance, 0) as available_balance,
    COALESCE(w.pending_balance, 0) as pending_balance
FROM vendors v
LEFT JOIN products p ON p.vendor_id = v.id
LEFT JOIN order_items oi ON oi.vendor_id = v.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.payment_status = 'completed'
LEFT JOIN vendor_wallets w ON w.vendor_id = v.id
GROUP BY v.id, v.store_name, v.status, v.is_verified, v.created_at, 
         w.available_balance, w.pending_balance;

-- ============================================
-- 4. INDEXES FOR VIEWS (MATERIALIZED IF NEEDED)
-- ============================================

-- Note: These views are regular views for now.
-- If performance becomes an issue, consider:
-- CREATE MATERIALIZED VIEW ... WITH DATA;
-- CREATE INDEX ... ON materialized_view;
-- REFRESH MATERIALIZED VIEW ... ;

-- ============================================
-- 5. DOCUMENTATION
-- ============================================

COMMENT ON VIEW order_stats IS 'Daily order statistics for admin dashboard';
COMMENT ON VIEW product_stats IS 'Product statistics grouped by category';
COMMENT ON VIEW vendor_stats_view IS 'Comprehensive vendor statistics with sales data';
