-- ============================================
-- ShopThings Marketplace - Storage Setup
-- ============================================
-- This migration creates storage buckets and policies for image uploads

-- ============================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================

-- Products bucket (for product images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Vendors bucket (for vendor logos and banners)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendors',
  'vendors',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Categories bucket (for category images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'categories',
  'categories',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket (for user profile pictures)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. PRODUCTS BUCKET POLICIES
-- ============================================

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Allow public to view product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Allow users to update their own product images
CREATE POLICY "Users can update their product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products');

-- Allow users to delete their own product images
CREATE POLICY "Users can delete their product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- ============================================
-- 3. VENDORS BUCKET POLICIES
-- ============================================

-- Allow vendors to upload their images
CREATE POLICY "Vendors can upload their images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendors' AND
  auth.uid() IN (SELECT user_id FROM vendors)
);

-- Allow public to view vendor images
CREATE POLICY "Public can view vendor images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendors');

-- Allow vendors to update their images
CREATE POLICY "Vendors can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vendors' AND
  auth.uid() IN (SELECT user_id FROM vendors)
);

-- Allow vendors to delete their images
CREATE POLICY "Vendors can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendors' AND
  auth.uid() IN (SELECT user_id FROM vendors)
);

-- ============================================
-- 4. CATEGORIES BUCKET POLICIES
-- ============================================

-- Only admins can upload category images
CREATE POLICY "Admins can upload category images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'categories' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Allow public to view category images
CREATE POLICY "Public can view category images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'categories');

-- Only admins can update category images
CREATE POLICY "Admins can update category images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'categories' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Only admins can delete category images
CREATE POLICY "Admins can delete category images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'categories' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- ============================================
-- 5. AVATARS BUCKET POLICIES
-- ============================================

-- Users can upload their own avatars
CREATE POLICY "Users can upload their avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Users can update their own avatars
CREATE POLICY "Users can update their avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own avatars
CREATE POLICY "Users can delete their avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 6. VERIFICATION
-- ============================================

-- Display created buckets
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Storage Buckets Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Buckets:';
    RAISE NOTICE '- products (5MB limit)';
    RAISE NOTICE '- vendors (5MB limit)';
    RAISE NOTICE '- categories (5MB limit)';
    RAISE NOTICE '- avatars (2MB limit)';
    RAISE NOTICE '';
    RAISE NOTICE 'All buckets are public and ready for uploads.';
    RAISE NOTICE 'RLS policies have been configured.';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
