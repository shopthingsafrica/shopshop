/**
 * Email hooks for integrating with Supabase Auth and application events
 */

import { createClient } from '@/lib/supabase/server';
import { 
  sendWelcomeEmail, 
  sendOrderConfirmationEmail, 
  sendVendorApprovalEmail, 
  sendProductModerationEmail,
  sendPasswordResetEmail,
  sendTwoFactorEmail 
} from '@/lib/email';

/**
 * Send welcome email when user signs up
 */
export async function handleUserSignup(userId: string) {
  try {
    const supabase = await createClient();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', userId)
      .single();

    if (profile) {
      await sendWelcomeEmail({
        name: profile.full_name || 'New User',
        email: profile.email,
      });
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

/**
 * Send order confirmation email
 */
export async function handleOrderCreated(orderId: string) {
  try {
    const supabase = await createClient();
    
    // Get order with customer and items
    const { data: order } = await supabase
      .from('orders')
      .select(`
        *,
        customer:profiles!user_id(full_name, email),
        shipping_address:addresses!shipping_address_id(*),
        items:order_items(
          quantity,
          unit_price,
          product:products(name)
        )
      `)
      .eq('id', orderId)
      .single();

    if (order && order.customer) {
      await sendOrderConfirmationEmail({
        orderNumber: order.order_number,
        customerName: order.customer.email, // Use email as recipient
        total: order.total,
        currency: order.currency,
        items: order.items?.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.unit_price,
        })) || [],
        shippingAddress: {
          fullName: order.shipping_address.full_name,
          addressLine1: order.shipping_address.address_line_1,
          addressLine2: order.shipping_address.address_line_2,
          city: order.shipping_address.city,
          state: order.shipping_address.state,
          postalCode: order.shipping_address.postal_code,
          country: order.shipping_address.country,
        },
      });
    }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

/**
 * Send vendor approval/rejection email
 */
export async function handleVendorStatusChange(vendorId: string, approved: boolean, reason?: string) {
  try {
    const supabase = await createClient();
    
    const { data: vendor } = await supabase
      .from('vendors')
      .select(`
        store_name,
        user:profiles!user_id(full_name, email)
      `)
      .eq('id', vendorId)
      .single();

    if (vendor && vendor.user && Array.isArray(vendor.user) && vendor.user.length > 0) {
      const userProfile = vendor.user[0];
      await sendVendorApprovalEmail({
        vendorName: userProfile.full_name || 'Vendor',
        storeName: vendor.store_name,
        email: userProfile.email,
        approved,
        reason,
      });
    }
  } catch (error) {
    console.error('Failed to send vendor approval email:', error);
  }
}

/**
 * Send product moderation email
 */
export async function handleProductStatusChange(productId: string, approved: boolean, reason?: string) {
  try {
    const supabase = await createClient();
    
    const { data: product } = await supabase
      .from('products')
      .select(`
        name,
        vendor:vendors!vendor_id(
          store_name,
          user:profiles!user_id(full_name, email)
        )
      `)
      .eq('id', productId)
      .single();

    if (product && product.vendor?.user) {
      await sendProductModerationEmail({
        vendorName: product.vendor.user.full_name || 'Vendor',
        productName: product.name,
        email: product.vendor.user.email,
        approved,
        reason,
      });
    }
  } catch (error) {
    console.error('Failed to send product moderation email:', error);
  }
}

/**
 * Send password reset email (called from auth callback)
 */
export async function handlePasswordReset(email: string, resetLink: string) {
  try {
    const supabase = await createClient();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('email', email)
      .single();

    await sendPasswordResetEmail({
      name: profile?.full_name || 'User',
      email,
      resetLink,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}

/**
 * Send 2FA code email
 */
export async function handleTwoFactorCode(email: string, code: string) {
  try {
    const supabase = await createClient();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('email', email)
      .single();

    await sendTwoFactorEmail({
      name: profile?.full_name || 'User',
      email,
      code,
    });
  } catch (error) {
    console.error('Failed to send 2FA email:', error);
  }
}