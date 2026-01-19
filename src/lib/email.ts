/**
 * Email service using Resend
 * Handles all transactional emails for the marketplace
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: `${process.env.RESEND_FROM_NAME || 'ShopThings Africa'} <${process.env.RESEND_FROM_EMAIL || 'noreply@shopthingsafrica.work.gd'}>`,
  replyTo: process.env.RESEND_REPLY_TO_EMAIL || 'support@shopthingsafrica.work.gd',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthingsafrica.work.gd',
};

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface WelcomeEmailData {
  name: string;
  email: string;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  total: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface VendorApprovalData {
  vendorName: string;
  storeName: string;
  email: string;
  approved: boolean;
  reason?: string;
}

interface ProductModerationData {
  vendorName: string;
  productName: string;
  email: string;
  approved: boolean;
  reason?: string;
}

interface PasswordResetData {
  name: string;
  email: string;
  resetLink: string;
}

interface TwoFactorData {
  name: string;
  email: string;
  code: string;
}

/**
 * Send email using Resend API
 */
async function sendEmail(template: EmailTemplate): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      reply_to: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Welcome email for new users
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
  const template: EmailTemplate = {
    to: data.email,
    subject: 'Welcome to ShopThings Africa! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ShopThings Africa</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #C1272D 0%, #FFA500 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .feature { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 6px; }
            .feature-icon { font-size: 24px; margin-bottom: 8px; }
            @media (max-width: 600px) { .features { grid-template-columns: 1fr; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Welcome to ShopThings Africa!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Discover authentic African products from verified vendors</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.name}! 👋</h2>
              
              <p>Welcome to ShopThings Africa, your gateway to authentic African products! We're thrilled to have you join our community of buyers and sellers celebrating African culture and craftsmanship.</p>
              
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">🛍️</div>
                  <h3>Shop Authentic Products</h3>
                  <p>Discover unique items from verified African vendors</p>
                </div>
                <div class="feature">
                  <div class="feature-icon">✅</div>
                  <h3>Verified Sellers</h3>
                  <p>Shop with confidence from our approved vendors</p>
                </div>
                <div class="feature">
                  <div class="feature-icon">🚚</div>
                  <h3>Secure Delivery</h3>
                  <p>Safe and reliable shipping to your doorstep</p>
                </div>
                <div class="feature">
                  <div class="feature-icon">💬</div>
                  <h3>Community Support</h3>
                  <p>Connect with vendors and fellow shoppers</p>
                </div>
              </div>
              
              <p><strong>Ready to start shopping?</strong></p>
              
              <a href="${EMAIL_CONFIG.baseUrl}/products" class="button">Browse Products</a>
              
              <p>If you're interested in selling your products, you can also <a href="${EMAIL_CONFIG.baseUrl}/vendor/apply" style="color: #C1272D;">apply to become a vendor</a>.</p>
              
              <p>Need help getting started? Check out our <a href="${EMAIL_CONFIG.baseUrl}/help" style="color: #C1272D;">Help Center</a> or reply to this email.</p>
              
              <p>Happy shopping!<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
              <p>
                <a href="${EMAIL_CONFIG.baseUrl}" style="color: #666;">Visit Website</a> | 
                <a href="${EMAIL_CONFIG.baseUrl}/help" style="color: #666;">Help Center</a> | 
                <a href="${EMAIL_CONFIG.baseUrl}/unsubscribe" style="color: #666;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to ShopThings Africa!

Hello ${data.name}!

Welcome to ShopThings Africa, your gateway to authentic African products! We're thrilled to have you join our community.

What you can do:
• Shop authentic products from verified African vendors
• Connect with sellers and fellow shoppers
• Enjoy secure delivery to your doorstep
• Get community support when you need it

Ready to start shopping? Visit: ${EMAIL_CONFIG.baseUrl}/products

Interested in selling? Apply to become a vendor: ${EMAIL_CONFIG.baseUrl}/vendor/apply

Need help? Visit our Help Center: ${EMAIL_CONFIG.baseUrl}/help

Happy shopping!
The ShopThings Africa Team
    `,
  };

  return sendEmail(template);
}

/**
 * Order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<{ success: boolean; error?: string }> {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  const template: EmailTemplate = {
    to: data.customerName,
    subject: `Order Confirmation - #${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #C1272D; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .order-summary { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .order-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .total-row { font-weight: bold; font-size: 18px; background: #f0f0f0; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Order Confirmed! ✅</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.customerName}!</h2>
              
              <p>Great news! Your order has been confirmed and is being processed. Here are the details:</p>
              
              <div class="order-summary">
                <h3>Order #${data.orderNumber}</h3>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total:</strong> ₦${data.total.toLocaleString()}</p>
              </div>
              
              <h3>Items Ordered:</h3>
              <table class="order-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr class="total-row">
                    <td colspan="2" style="padding: 15px; text-align: right;">Total:</td>
                    <td style="padding: 15px; text-align: right;">₦${data.total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Shipping Address:</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                <p style="margin: 0;">
                  ${data.shippingAddress.fullName}<br>
                  ${data.shippingAddress.addressLine1}<br>
                  ${data.shippingAddress.addressLine2 ? data.shippingAddress.addressLine2 + '<br>' : ''}
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
                  ${data.shippingAddress.country}
                </p>
              </div>
              
              <p><strong>What's next?</strong></p>
              <ul>
                <li>We'll process your order within 1-2 business days</li>
                <li>You'll receive a shipping confirmation with tracking details</li>
                <li>Your order will be delivered within 3-7 business days</li>
              </ul>
              
              <a href="${EMAIL_CONFIG.baseUrl}/orders/${data.orderNumber}" class="button">Track Your Order</a>
              
              <p>Questions about your order? Contact our support team or check your <a href="${EMAIL_CONFIG.baseUrl}/orders" style="color: #C1272D;">order history</a>.</p>
              
              <p>Thank you for shopping with ShopThings Africa!<br>
              The ShopThings Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return sendEmail(template);
}

/**
 * Vendor approval/rejection email
 */
export async function sendVendorApprovalEmail(data: VendorApprovalData): Promise<{ success: boolean; error?: string }> {
  const template: EmailTemplate = {
    to: data.email,
    subject: data.approved ? 'Vendor Application Approved! 🎉' : 'Vendor Application Update',
    html: data.approved ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vendor Application Approved</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .success-icon { font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">🎉</div>
              <h1 style="margin: 0;">Congratulations!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your vendor application has been approved</p>
            </div>
            
            <div class="content">
              <h2>Welcome to ShopThings Africa, ${data.vendorName}!</h2>
              
              <p>Great news! Your application for <strong>${data.storeName}</strong> has been approved. You can now start selling on our platform!</p>
              
              <p><strong>What you can do now:</strong></p>
              <ul>
                <li>Access your vendor dashboard</li>
                <li>Add your first products</li>
                <li>Set up your store profile</li>
                <li>Configure payment methods</li>
                <li>Start receiving orders</li>
              </ul>
              
              <a href="${EMAIL_CONFIG.baseUrl}/vendor/dashboard" class="button">Access Vendor Dashboard</a>
              
              <p><strong>Getting Started Tips:</strong></p>
              <ul>
                <li>Upload high-quality product images</li>
                <li>Write detailed product descriptions</li>
                <li>Set competitive prices</li>
                <li>Respond quickly to customer inquiries</li>
                <li>Maintain good inventory levels</li>
              </ul>
              
              <p>Need help? Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.africa'}/vendor/help" style="color: #C1272D;">Vendor Guide</a> or contact our support team.</p>
              
              <p>We're excited to have you as part of our community!<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vendor Application Update</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #EF4444; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Application Update</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Regarding your vendor application</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.vendorName},</h2>
              
              <p>Thank you for your interest in becoming a vendor on ShopThings Africa. After reviewing your application for <strong>${data.storeName}</strong>, we need to provide you with an update.</p>
              
              <p><strong>Application Status:</strong> Not approved at this time</p>
              
              ${data.reason ? `
                <p><strong>Reason:</strong></p>
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                  ${data.reason}
                </div>
              ` : ''}
              
              <p><strong>What's next?</strong></p>
              <p>Don't worry! You can address the feedback above and reapply. We encourage you to:</p>
              <ul>
                <li>Review our vendor requirements</li>
                <li>Address the specific feedback provided</li>
                <li>Submit a new application when ready</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.africa'}/vendor/apply" class="button">Apply Again</a>
              
              <p>If you have questions about this decision or need clarification, please don't hesitate to contact our support team.</p>
              
              <p>Thank you for your understanding.<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return sendEmail(template);
}

/**
 * Product moderation email
 */
export async function sendProductModerationEmail(data: ProductModerationData): Promise<{ success: boolean; error?: string }> {
  const template: EmailTemplate = {
    to: data.email,
    subject: data.approved ? `Product Approved: ${data.productName}` : `Product Review: ${data.productName}`,
    html: data.approved ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Product Approved</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Product Approved! ✅</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your product is now live</p>
            </div>
            
            <div class="content">
              <h2>Great news, ${data.vendorName}!</h2>
              
              <p>Your product <strong>"${data.productName}"</strong> has been approved and is now live on ShopThings Africa!</p>
              
              <p>Customers can now discover and purchase your product. Here's what you can do:</p>
              <ul>
                <li>Share your product on social media</li>
                <li>Monitor your sales in the vendor dashboard</li>
                <li>Respond to customer questions promptly</li>
                <li>Keep your inventory updated</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.africa'}/vendor/products" class="button">View Your Products</a>
              
              <p>Keep up the great work!<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Product Review Required</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F59E0B; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Product Review Required</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Action needed for your product</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.vendorName},</h2>
              
              <p>Your product <strong>"${data.productName}"</strong> requires some updates before it can be approved.</p>
              
              ${data.reason ? `
                <p><strong>Required Changes:</strong></p>
                <div style="background: #fef3cd; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                  ${data.reason}
                </div>
              ` : ''}
              
              <p>Please make the necessary updates and resubmit your product for review.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.africa'}/vendor/products" class="button">Edit Product</a>
              
              <p>If you have questions about these requirements, please contact our support team.</p>
              
              <p>Thank you for your cooperation.<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return sendEmail(template);
}

/**
 * Password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetData): Promise<{ success: boolean; error?: string }> {
  const template: EmailTemplate = {
    to: data.email,
    subject: 'Reset Your Password - ShopThings Africa',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #C1272D; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .button { display: inline-block; background: #C1272D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .security-notice { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Reset Your Password</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">ShopThings Africa</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.name},</h2>
              
              <p>We received a request to reset the password for your ShopThings Africa account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <a href="${data.resetLink}" class="button">Reset Password</a>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 14px;">${data.resetLink}</p>
              
              <div class="security-notice">
                <p style="margin: 0;"><strong>Security Notice:</strong></p>
                <ul style="margin: 10px 0 0 0;">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
              
              <p>Best regards,<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return sendEmail(template);
}

/**
 * Two-factor authentication code email
 */
export async function sendTwoFactorEmail(data: TwoFactorData): Promise<{ success: boolean; error?: string }> {
  const template: EmailTemplate = {
    to: data.email,
    subject: 'Your Verification Code - ShopThings Africa',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #C1272D; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e5e5; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
            .code { background: #f8f9fa; border: 2px solid #C1272D; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
            .code-text { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #C1272D; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Verification Code</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">ShopThings Africa</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.name},</h2>
              
              <p>Here's your verification code for ShopThings Africa:</p>
              
              <div class="code">
                <p class="code-text">${data.code}</p>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in 10 minutes</li>
                <li>Don't share this code with anyone</li>
                <li>If you didn't request this code, please contact support immediately</li>
              </ul>
              
              <p>Enter this code in the verification form to continue.</p>
              
              <p>Best regards,<br>
              The ShopThings Africa Team</p>
            </div>
            
            <div class="footer">
              <p>© 2026 ShopThings Africa. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return sendEmail(template);
}