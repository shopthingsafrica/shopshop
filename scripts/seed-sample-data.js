#!/usr/bin/env node

/**
 * Seed sample data for ShopThings marketplace
 * Creates sample vendors, products, and orders for testing
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data
const SAMPLE_VENDORS = [
  {
    store_name: 'Accra Textiles',
    description: 'Authentic Ghanaian textiles and traditional wear',
    contact_email: 'info@accratextiles.com',
    contact_phone: '+233 24 123 4567',
    address: 'Makola Market, Accra, Ghana',
    is_verified: true,
    status: 'approved',
    business_type: 'textile',
    logo_url: '/images/sellers/accra-textiles.jpg',
    banner_url: '/images/banners/accra-textiles-banner.jpg',
  },
  {
    store_name: 'Lagos Fashion House',
    description: 'Contemporary African fashion and accessories',
    contact_email: 'hello@lagosfashion.com',
    contact_phone: '+234 80 987 6543',
    address: 'Victoria Island, Lagos, Nigeria',
    is_verified: true,
    status: 'approved',
    business_type: 'fashion',
    logo_url: '/images/sellers/lagos-fashion.jpg',
    banner_url: '/images/banners/lagos-fashion-banner.jpg',
  },
  {
    store_name: 'Nairobi Crafts Co.',
    description: 'Handmade crafts and home decor from Kenya',
    contact_email: 'orders@nairobicrafts.co.ke',
    contact_phone: '+254 70 555 1234',
    address: 'Westlands, Nairobi, Kenya',
    is_verified: true,
    status: 'approved',
    business_type: 'crafts',
    logo_url: '/images/sellers/nairobi-crafts.jpg',
    banner_url: '/images/banners/nairobi-crafts-banner.jpg',
  },
  {
    store_name: 'Cape Town Artisans',
    description: 'South African art and handcrafted jewelry',
    contact_email: 'art@capetownartisans.co.za',
    contact_phone: '+27 21 456 7890',
    address: 'V&A Waterfront, Cape Town, South Africa',
    is_verified: true,
    status: 'approved',
    business_type: 'art',
    logo_url: '/images/sellers/capetown-artisans.jpg',
    banner_url: '/images/banners/capetown-artisans-banner.jpg',
  },
  {
    store_name: 'Addis Beauty',
    description: 'Natural beauty products and skincare from Ethiopia',
    contact_email: 'info@addisbeauty.et',
    contact_phone: '+251 91 123 4567',
    address: 'Bole, Addis Ababa, Ethiopia',
    is_verified: false,
    status: 'approved',
    business_type: 'beauty',
    logo_url: '/images/sellers/addis-beauty.jpg',
    banner_url: '/images/banners/addis-beauty-banner.jpg',
  },
];

const SAMPLE_PRODUCTS = [
  // Accra Textiles Products
  {
    name: 'Traditional Kente Cloth',
    description: 'Authentic handwoven Kente cloth from Ghana. Perfect for special occasions and cultural celebrations. Each piece tells a unique story through its intricate patterns and vibrant colors.',
    price: 15000,
    compare_at_price: 18000,
    stock_quantity: 25,
    sku: 'AT-KENTE-001',
    weight: 0.5,
    dimensions: '200x150x2',
    status: 'active',
    is_featured: true,
    tags: 'kente, traditional, ghana, handwoven, cultural',
    images: ['/images/products/kente-cloth-1.jpg', '/images/products/kente-cloth-2.jpg'],
  },
  {
    name: 'Ankara Print Fabric',
    description: 'High-quality Ankara print fabric, perfect for making dresses, shirts, and accessories. Vibrant colors and authentic African patterns.',
    price: 3500,
    compare_at_price: 4000,
    stock_quantity: 50,
    sku: 'AT-ANKARA-001',
    weight: 0.3,
    dimensions: '300x110x1',
    status: 'active',
    is_featured: false,
    tags: 'ankara, fabric, print, african, colorful',
    images: ['/images/products/ankara-fabric-1.jpg', '/images/products/ankara-fabric-2.jpg'],
  },
  
  // Lagos Fashion House Products
  {
    name: 'Modern Dashiki Shirt',
    description: 'Contemporary take on the traditional Dashiki. Made with premium cotton and featuring modern cuts while maintaining authentic African aesthetics.',
    price: 8500,
    compare_at_price: 10000,
    stock_quantity: 30,
    sku: 'LFH-DASH-001',
    weight: 0.4,
    dimensions: '30x25x5',
    status: 'active',
    is_featured: true,
    tags: 'dashiki, shirt, modern, cotton, fashion',
    images: ['/images/products/dashiki-shirt-1.jpg', '/images/products/dashiki-shirt-2.jpg'],
  },
  {
    name: 'African Print Dress',
    description: 'Elegant African print dress perfect for both casual and formal occasions. Features a flattering A-line cut and beautiful traditional patterns.',
    price: 12000,
    compare_at_price: 15000,
    stock_quantity: 20,
    sku: 'LFH-DRESS-001',
    weight: 0.6,
    dimensions: '35x30x8',
    status: 'active',
    is_featured: true,
    tags: 'dress, african print, elegant, formal, casual',
    images: ['/images/products/african-dress-1.jpg', '/images/products/african-dress-2.jpg'],
  },
  
  // Nairobi Crafts Co. Products
  {
    name: 'Handwoven Basket Set',
    description: 'Beautiful set of 3 handwoven baskets made by skilled artisans in Kenya. Perfect for home organization and decoration.',
    price: 6500,
    compare_at_price: 8000,
    stock_quantity: 15,
    sku: 'NCC-BASKET-001',
    weight: 1.2,
    dimensions: '40x40x30',
    status: 'active',
    is_featured: false,
    tags: 'basket, handwoven, home decor, organization, kenya',
    images: ['/images/products/basket-set-1.jpg', '/images/products/basket-set-2.jpg'],
  },
  {
    name: 'Wooden Sculpture',
    description: 'Intricately carved wooden sculpture representing African wildlife. Each piece is unique and tells a story of African heritage.',
    price: 18000,
    compare_at_price: 22000,
    stock_quantity: 8,
    sku: 'NCC-SCULP-001',
    weight: 2.5,
    dimensions: '25x15x40',
    status: 'active',
    is_featured: true,
    tags: 'sculpture, wood, carving, wildlife, art',
    images: ['/images/products/wood-sculpture-1.jpg', '/images/products/wood-sculpture-2.jpg'],
  },
  
  // Cape Town Artisans Products
  {
    name: 'Beaded Jewelry Set',
    description: 'Stunning beaded jewelry set including necklace, earrings, and bracelet. Made with traditional South African beading techniques.',
    price: 9500,
    compare_at_price: 12000,
    stock_quantity: 12,
    sku: 'CTA-JEWEL-001',
    weight: 0.2,
    dimensions: '15x10x5',
    status: 'active',
    is_featured: true,
    tags: 'jewelry, beaded, necklace, earrings, bracelet',
    images: ['/images/products/beaded-jewelry-1.jpg', '/images/products/beaded-jewelry-2.jpg'],
  },
  {
    name: 'African Art Print',
    description: 'High-quality art print featuring contemporary African art. Perfect for home or office decoration.',
    price: 4500,
    compare_at_price: 6000,
    stock_quantity: 25,
    sku: 'CTA-PRINT-001',
    weight: 0.3,
    dimensions: '50x40x2',
    status: 'active',
    is_featured: false,
    tags: 'art print, contemporary, decoration, wall art',
    images: ['/images/products/art-print-1.jpg', '/images/products/art-print-2.jpg'],
  },
  
  // Addis Beauty Products
  {
    name: 'Shea Butter Skincare Set',
    description: 'Natural skincare set made with pure Ethiopian shea butter. Includes moisturizer, lip balm, and body butter.',
    price: 7500,
    compare_at_price: 9000,
    stock_quantity: 40,
    sku: 'AB-SHEA-001',
    weight: 0.8,
    dimensions: '20x15x10',
    status: 'active',
    is_featured: true,
    tags: 'shea butter, skincare, natural, moisturizer, beauty',
    images: ['/images/products/shea-butter-set-1.jpg', '/images/products/shea-butter-set-2.jpg'],
  },
  {
    name: 'Ethiopian Coffee Scrub',
    description: 'Exfoliating coffee scrub made with premium Ethiopian coffee beans. Perfect for smooth, glowing skin.',
    price: 3500,
    compare_at_price: 4500,
    stock_quantity: 35,
    sku: 'AB-COFFEE-001',
    weight: 0.4,
    dimensions: '12x12x8',
    status: 'active',
    is_featured: false,
    tags: 'coffee scrub, exfoliating, ethiopian coffee, skincare',
    images: ['/images/products/coffee-scrub-1.jpg', '/images/products/coffee-scrub-2.jpg'],
  },
];

async function createSampleUsers() {
  console.log('👥 Creating sample users...');
  
  const users = [
    {
      email: 'customer@shopthings.com',
      password: 'Customer123!',
      role: 'customer',
      full_name: 'John Customer',
    },
    {
      email: 'vendor@shopthings.com', 
      password: 'Vendor123!',
      role: 'vendor',
      full_name: 'Jane Vendor',
    },
    {
      email: 'admin@shopthings.com',
      password: 'Admin123!',
      role: 'admin',
      full_name: 'Admin User',
    },
  ];
  
  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      });
      
      if (error) {
        console.log(`⚠️  User ${user.email} might already exist:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email}`);
        
        // Update profile with role
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: user.full_name,
            role: user.role,
            email: user.email,
          });
      }
    } catch (error) {
      console.log(`❌ Failed to create user ${user.email}:`, error.message);
    }
  }
}

async function createSampleVendors() {
  console.log('🏪 Creating sample vendors...');
  
  // Get vendor user ID
  const { data: vendorUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'vendor@shopthings.com')
    .single();
  
  if (!vendorUser) {
    console.log('❌ Vendor user not found');
    return [];
  }
  
  const vendorIds = [];
  
  for (const vendor of SAMPLE_VENDORS) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          ...vendor,
          user_id: vendorUser.id,
        })
        .select()
        .single();
      
      if (error) {
        console.log(`❌ Failed to create vendor ${vendor.store_name}:`, error.message);
      } else {
        console.log(`✅ Created vendor: ${vendor.store_name}`);
        vendorIds.push(data.id);
      }
    } catch (error) {
      console.log(`❌ Error creating vendor ${vendor.store_name}:`, error.message);
    }
  }
  
  return vendorIds;
}

async function createSampleProducts(vendorIds) {
  console.log('📦 Creating sample products...');
  
  if (vendorIds.length === 0) {
    console.log('❌ No vendors available for products');
    return [];
  }
  
  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name');
  
  if (!categories || categories.length === 0) {
    console.log('❌ No categories found');
    return [];
  }
  
  const productIds = [];
  
  for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
    const product = SAMPLE_PRODUCTS[i];
    const vendorId = vendorIds[i % vendorIds.length];
    
    // Assign category based on product type
    let categoryId = categories[0].id; // Default
    if (product.tags.includes('fashion') || product.tags.includes('dress') || product.tags.includes('shirt')) {
      const fashionCat = categories.find(c => c.name.toLowerCase().includes('fashion'));
      if (fashionCat) categoryId = fashionCat.id;
    } else if (product.tags.includes('beauty') || product.tags.includes('skincare')) {
      const beautyCat = categories.find(c => c.name.toLowerCase().includes('beauty'));
      if (beautyCat) categoryId = beautyCat.id;
    } else if (product.tags.includes('art') || product.tags.includes('craft')) {
      const artCat = categories.find(c => c.name.toLowerCase().includes('art'));
      if (artCat) categoryId = artCat.id;
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          vendor_id: vendorId,
          category_id: categoryId,
          average_rating: Math.random() * 2 + 3, // Random rating between 3-5
          review_count: Math.floor(Math.random() * 50) + 5, // Random reviews 5-55
        })
        .select()
        .single();
      
      if (error) {
        console.log(`❌ Failed to create product ${product.name}:`, error.message);
      } else {
        console.log(`✅ Created product: ${product.name}`);
        productIds.push(data.id);
      }
    } catch (error) {
      console.log(`❌ Error creating product ${product.name}:`, error.message);
    }
  }
  
  return productIds;
}

async function createSampleOrders(productIds) {
  console.log('🛒 Creating sample orders...');
  
  if (productIds.length === 0) {
    console.log('❌ No products available for orders');
    return;
  }
  
  // Get customer user ID
  const { data: customerUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'customer@shopthings.com')
    .single();
  
  if (!customerUser) {
    console.log('❌ Customer user not found');
    return;
  }
  
  const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
  
  for (let i = 0; i < 10; i++) {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    
    try {
      const { data: product } = await supabase
        .from('products')
        .select('price, vendor_id')
        .eq('id', productId)
        .single();
      
      if (!product) continue;
      
      const total = product.price * quantity;
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: customerUser.id,
          vendor_id: product.vendor_id,
          status,
          total_amount: total,
          shipping_address: {
            name: 'John Customer',
            address: '123 Main Street',
            city: 'Lagos',
            state: 'Lagos State',
            country: 'Nigeria',
            postal_code: '100001',
          },
        })
        .select()
        .single();
      
      if (error) {
        console.log(`❌ Failed to create order:`, error.message);
        continue;
      }
      
      // Create order item
      await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: productId,
          quantity,
          price: product.price,
        });
      
      console.log(`✅ Created order #${order.id} (${status})`);
    } catch (error) {
      console.log(`❌ Error creating order:`, error.message);
    }
  }
}

async function createSampleReviews(productIds) {
  console.log('⭐ Creating sample reviews...');
  
  if (productIds.length === 0) {
    console.log('❌ No products available for reviews');
    return;
  }
  
  // Get customer user ID
  const { data: customerUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'customer@shopthings.com')
    .single();
  
  if (!customerUser) {
    console.log('❌ Customer user not found');
    return;
  }
  
  const sampleReviews = [
    { rating: 5, comment: 'Excellent quality! Exactly as described. Fast shipping.' },
    { rating: 4, comment: 'Good product, nice packaging. Would recommend.' },
    { rating: 5, comment: 'Beautiful craftsmanship. Very happy with my purchase.' },
    { rating: 4, comment: 'Great value for money. Good quality materials.' },
    { rating: 5, comment: 'Outstanding! Exceeded my expectations.' },
    { rating: 3, comment: 'Decent product but shipping took longer than expected.' },
    { rating: 4, comment: 'Nice design and good quality. Happy customer.' },
    { rating: 5, comment: 'Perfect! Will definitely buy again.' },
  ];
  
  for (let i = 0; i < Math.min(productIds.length, 15); i++) {
    const productId = productIds[i];
    const review = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    
    try {
      await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: customerUser.id,
          rating: review.rating,
          comment: review.comment,
        });
      
      console.log(`✅ Created review for product ${productId}`);
    } catch (error) {
      console.log(`❌ Error creating review:`, error.message);
    }
  }
}

async function seedSampleData() {
  console.log('🌱 Starting ShopThings Sample Data Seeding\n');
  
  try {
    // Create sample users
    await createSampleUsers();
    
    // Wait a bit for user creation to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create sample vendors
    const vendorIds = await createSampleVendors();
    
    // Create sample products
    const productIds = await createSampleProducts(vendorIds);
    
    // Create sample orders
    await createSampleOrders(productIds);
    
    // Create sample reviews
    await createSampleReviews(productIds);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SAMPLE DATA SEEDING COMPLETE!');
    console.log('='.repeat(50));
    console.log(`✅ Created ${SAMPLE_VENDORS.length} vendors`);
    console.log(`✅ Created ${SAMPLE_PRODUCTS.length} products`);
    console.log('✅ Created sample orders and reviews');
    console.log('\n📋 Test Accounts:');
    console.log('👤 Customer: customer@shopthings.com / Customer123!');
    console.log('🏪 Vendor: vendor@shopthings.com / Vendor123!');
    console.log('👑 Admin: admin@shopthings.com / Admin123!');
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedSampleData();
}

module.exports = { seedSampleData };