import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, ShoppingBag, Truck, Shield, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui';

// Featured categories - only 4 to match mockup
const FEATURED_CATEGORIES = [
  { name: 'Global Connection', slug: 'global-connection', image: '/images/categories/globalConnection.png', count: 1250 },
  { name: 'Payment & Logistics', slug: 'payment-logistics', image: '/images/categories/payment&logistics.png', count: 890 },
];

// Verified sellers - 3 to match mockup
const VERIFIED_SELLERS = [
  { name: 'AfroThreads Co.', slug: 'afrothreads-co', location: 'Lagos, Nigeria', products: 234, rating: 4.9, avatar: '/images/sellers/afrothreads.jpg', description: 'Handcrafted apparel inspired by traditional African textiles' },
  { name: 'Artisan Carvings', slug: 'artisan-carvings', location: 'Accra, Ghana', products: 189, rating: 4.8, avatar: '/images/sellers/artisan-carvings.jpg', description: 'Intricate wooden sculptures from West African artisans' },
  { name: 'Spice Route Delights', slug: 'spice-route-delights', location: 'Nairobi, Kenya', products: 156, rating: 4.9, avatar: '/images/sellers/spice-route.jpg', description: 'Authentic spices and gourmet foods from across the continent' },
];

// Curated collections - 4 to match mockup
const CURATED_COLLECTIONS = [
  { name: 'Fashion', slug: 'fashion', image: '/images/collections/fasion.png' },
  { name: 'Home & Art', slug: 'home-art', image: '/images/collections/home&art.png' },
  { name: 'Skincare', slug: 'skincare', image: '/images/collections/skincare.png' },
];


export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <Image 
          src="/images/hero/herosection1.png" 
          alt="Marketplace hero visual"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight animate-fade-in">
              Discover the Spirit of Africa
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed text-white/90 max-w-lg">
              Explore a curated selection of authentic crafts, fashion, and art from across the continent.
            </p>
            <Link href="/products">
              <Button variant="secondary" size="lg" className="shadow-xl shadow-secondary/30 hover:scale-105 transition-transform">
                Explore Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-10 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center md:justify-start space-x-4 group">
              <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors duration-300">
                <BadgeCheck className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Verified Sellers</p>
                <p className="text-sm text-muted-foreground">100% Authentic</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-4 group">
              <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors duration-300">
                <Truck className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Global Shipping</p>
                <p className="text-sm text-muted-foreground">Worldwide Delivery</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-4 group">
              <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors duration-300">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Secure Payments</p>
                <p className="text-sm text-muted-foreground">Safe & Protected</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-4 group">
              <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors duration-300">
                <HeartHandshake className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Support Artisans</p>
                <p className="text-sm text-muted-foreground">Direct Impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Featured Categories
            </h2>
            <p className="text-muted-foreground mt-2">Explore our most popular product categories</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-heading font-bold group-hover:translate-x-2 transition-transform duration-300">{category.name}</h3>
                  <p className="text-white/70 mt-1 group-hover:text-white transition-colors duration-300">Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Sellers */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Verified Sellers
            </h2>
            <p className="text-muted-foreground mt-2">Shop from trusted artisans and businesses</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VERIFIED_SELLERS.map((seller) => (
              <div
                key={seller.slug}
                className="bg-white rounded-2xl p-6 border border-border/50 hover:shadow-xl hover:border-secondary/20 
                  transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted ring-2 ring-border group-hover:ring-secondary/30 transition-all duration-300">
                    <Image 
                      src={seller.avatar}
                      alt={seller.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-foreground">{seller.name}</h3>
                      <BadgeCheck className="w-5 h-5 ml-1.5 text-secondary" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{seller.description}</p>
                  </div>
                </div>
                <Link href={`/vendors/${seller.slug}`}>
                  <Button variant="outline" fullWidth className="mt-4 group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all duration-300">
                    View Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Global Collections */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Curated Global Collections
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Handpicked collections showcasing the best of African creativity</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURATED_COLLECTIONS.map((collection) => (
              <Link 
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image 
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-heading font-bold group-hover:translate-x-2 transition-transform duration-300">{collection.name}</h3>
                  <p className="text-white/70 mt-1 text-sm group-hover:text-white transition-colors duration-300">Explore collection →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Finds Section */}
      <section className="relative py-24 px-4 bg-muted overflow-hidden">
        <Image 
          src="/images/hero/herosection2.png"
          alt="Lifestyle spotlight"
          fill
          className="object-cover opacity-30"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/90 to-secondary/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Fresh Finds, Just For You
          </h2>
          <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto">
            Discover the latest arrivals from our verified sellers
          </p>
          <Link href="/products?sort=newest">
            <Button variant="primary" size="lg" className="shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              Shop New Arrivals
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
