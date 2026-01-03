import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-heading font-bold">
              Shop<span className="text-secondary">Things</span>
            </span>
          </Link>
          
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-4xl font-heading font-bold mb-6 leading-tight">
              Discover the Spirit of Africa
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Join thousands of buyers and sellers on Africa&apos;s premier marketplace for authentic crafts, fashion, and art.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold">10,000+ Products</p>
                  <p className="text-sm text-white/70">Authentic African crafts and more</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌍</span>
                </div>
                <div>
                  <p className="font-semibold">Global Shipping</p>
                  <p className="text-sm text-white/70">Delivery to 50+ countries</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Verified Sellers</p>
                  <p className="text-sm text-white/70">Shop with confidence</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} ShopThings Africa. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-heading font-bold text-primary">
              Shop<span className="text-secondary">Things</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
