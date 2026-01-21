import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Header, LiveChatSupport } from "@/components/layout";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { AuthProvider } from "@/components/providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorTrackingSetup } from "@/components/ErrorTrackingSetup";
import { WebsiteStructuredData } from "@/components/StructuredData";
import { PerformanceSetup } from "@/components/PerformanceSetup";
import { ServiceWorkerSetup } from "@/components/ServiceWorkerSetup";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShopThings - African Marketplace",
    template: "%s | ShopThings"
  },
  description: "Discover the Spirit of Africa. Explore authentic African products, fashion, art, and more from verified sellers across the continent and diaspora.",
  keywords: [
    "African marketplace", 
    "African products", 
    "African fashion", 
    "African art", 
    "e-commerce",
    "authentic African goods",
    "African textiles",
    "handmade crafts",
    "African jewelry",
    "traditional wear",
    "African diaspora",
    "online marketplace"
  ],
  authors: [{ name: "ShopThings Team" }],
  creator: "ShopThings",
  publisher: "ShopThings",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ShopThings - African Marketplace',
    description: 'Discover the Spirit of Africa. Explore authentic African products, fashion, art, and more from verified sellers.',
    siteName: 'ShopThings',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopThings - African Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopThings - African Marketplace',
    description: 'Discover the Spirit of Africa. Explore authentic African products, fashion, art, and more.',
    images: ['/images/twitter-image.jpg'],
    creator: '@shopthings',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${roboto.variable} antialiased`}
      >
        <ErrorBoundary>
          <ErrorTrackingSetup />
          <PerformanceSetup />
          <ServiceWorkerSetup />
          <WebsiteStructuredData />
          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <FooterWrapper />
            <LiveChatSupport />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
