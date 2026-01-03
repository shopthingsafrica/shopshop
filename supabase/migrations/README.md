# ShopThings Database Migrations

This folder contains Supabase database migrations for the ShopThings African marketplace.

## Migration Files

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Creates all tables with proper types, constraints, and indexes |
| `002_rls_policies.sql` | Sets up Row Level Security (RLS) policies for data isolation |
| `003_functions_triggers.sql` | Database functions and triggers for automation |
| `004_seed_data.sql` | Initial categories, coupons, and admin views |

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### Option 2: Running Manually in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order (001 → 002 → 003 → 004)

### Option 3: Using psql

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  -f supabase/migrations/001_initial_schema.sql \
  -f supabase/migrations/002_rls_policies.sql \
  -f supabase/migrations/003_functions_triggers.sql \
  -f supabase/migrations/004_seed_data.sql
```

## Database Schema Overview

### Core Tables

- **profiles** - User profiles (extends auth.users)
- **vendors** - Vendor/seller information
- **categories** - Product categories (hierarchical)
- **products** - Product listings

### E-Commerce Tables

- **cart_items** - Shopping cart
- **orders** - Customer orders
- **order_items** - Order line items
- **addresses** - User addresses
- **wishlist_items** - Saved products
- **reviews** - Product reviews

### Vendor Tables

- **vendor_wallets** - Vendor earnings
- **wallet_transactions** - Transaction history
- **payment_methods** - Payout methods

### Marketing Tables

- **coupons** - Discount codes

## Row Level Security (RLS)

All tables have RLS enabled with the following patterns:

- **Public data** (categories, active products, reviews) - Anyone can read
- **User-owned data** (cart, addresses, orders) - Users can manage their own
- **Vendor data** (products, wallet) - Vendors can manage their own store
- **Admin access** - Admins can read/write all data

## Key Functions

| Function | Description |
|----------|-------------|
| `validate_coupon(code, cart_total)` | Validates coupon and returns discount |
| `get_vendor_stats(vendor_id)` | Returns vendor statistics |
| `search_products(query, ...)` | Full-text product search |

## Triggers

| Trigger | Table | Description |
|---------|-------|-------------|
| `update_*_updated_at` | All | Auto-updates `updated_at` column |
| `on_auth_user_created` | auth.users | Creates profile for new users |
| `on_vendor_created` | vendors | Creates wallet for new vendors |
| `generate_order_number` | orders | Generates unique order numbers |
| `update_product_rating` | reviews | Recalculates product ratings |
| `decrease_product_stock` | order_items | Reduces stock on order |
| `restore_product_stock` | orders | Restores stock on cancellation |
| `process_vendor_sale` | orders | Credits vendor wallet on delivery |

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Rollback

To rollback, you'll need to manually drop tables in reverse order. Consider using Supabase branching for safe testing.

```sql
-- Drop all tables (CAUTION: destroys all data)
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS vendor_wallets CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS vendor_status CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS discount_type CASCADE;
```
