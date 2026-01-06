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
    <footer className="main-footer bg-gradient-to-b from-primary to-primary/95 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5 group">
              <Image
                src="/images/logo.jpeg"
                alt="ShopThings"
                width={140}
                height={40}
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-white/75 text-sm mb-8 leading-relaxed">
              Discover the Spirit of Africa. Authentic crafts, fashion, and art from verified sellers across the continent.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 rounded-xl hover:bg-secondary hover:scale-110 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links sections */}
          <div>
            <h3 className="font-heading font-semibold mb-5 text-lg">Shop</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors duration-200 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-5 text-lg">My Account</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors duration-200 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-5 text-lg">Sell With Us</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.vendor.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors duration-200 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold mb-5 text-lg">Help & Support</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors duration-200 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact info */}
            <div className="mt-8 space-y-3">
              <a
                href="mailto:support@shopthings.africa"
                className="flex items-center text-sm text-white/70 hover:text-secondary transition-colors duration-200 group"
              >
                <Mail className="w-4 h-4 mr-2.5 group-hover:scale-110 transition-transform" />
                support@shopthings.africa
              </a>
              <a
                href="tel:+2341234567890"
                className="flex items-center text-sm text-white/70 hover:text-secondary transition-colors duration-200 group"
              >
                <Phone className="w-4 h-4 mr-2.5 group-hover:scale-110 transition-transform" />
                +234 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-semibold mb-2 text-lg">Stay Updated</h3>
              <p className="text-white/70 text-sm">
                Subscribe to get special offers, free giveaways, and new arrivals.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:bg-white/15 transition-all duration-200 w-full md:w-72"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20 active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>© {currentYear} ShopThings Africa. All rights reserved.</p>
            <div className="flex items-center space-x-8">
              <Link href="/privacy" className="hover:text-secondary transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-secondary transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-secondary transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
