import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { label: 'All Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Best Sellers', href: '/products?sort=popular' },
    { label: 'Special Offers', href: '/offers' },
    { label: 'Gift Cards', href: '/gift-cards' },
  ],
  account: [
    { label: 'My Account', href: '/profile' },
    { label: 'Order History', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Track Order', href: '/orders/track' },
    { label: 'Returns', href: '/returns' },
  ],
  vendor: [
    { label: 'Sell on ShopThings', href: '/vendor/register' },
    { label: 'Vendor Dashboard', href: '/vendor' },
    { label: 'Seller Guidelines', href: '/vendor/guidelines' },
    { label: 'Success Stories', href: '/vendor/stories' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/shopthings', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/shopthings', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/shopthings', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/shopthings', label: 'YouTube' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.jpeg"
                alt="ShopThings"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
                Shop<span className="text-secondary">Things</span>
              </span>
            </Link>
            <p className="text-white/80 text-sm mb-6">
              Discover the Spirit of Africa. Authentic crafts, fashion, and art from verified sellers across the continent.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links sections */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">My Account</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">Sell With Us</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.vendor.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:support@shopthings.africa"
                className="flex items-center text-sm text-white/80 hover:text-secondary transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                support@shopthings.africa
              </a>
              <a
                href="tel:+2341234567890"
                className="flex items-center text-sm text-white/80 hover:text-secondary transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                +234 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold mb-1">Stay Updated</h3>
              <p className="text-white/80 text-sm">
                Subscribe to get special offers, free giveaways, and new arrivals.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent w-full md:w-64"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>© {currentYear} ShopThings Africa. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-secondary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
