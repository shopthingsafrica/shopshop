import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Header, LiveChatSupport } from "@/components/layout";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { AuthProvider } from "@/components/providers";

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
  title: "ShopThings - African Marketplace",
  description: "Discover the Spirit of Africa. Explore authentic African products, fashion, art, and more from verified sellers across the continent and diaspora.",
  keywords: ["African marketplace", "African products", "African fashion", "African art", "e-commerce"],
  icons: {
    icon: [
      { url: '/images/logo.png', type: 'image/png' },
    ],
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
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <FooterWrapper />
          <LiveChatSupport />
        </AuthProvider>
      </body>
    </html>
  );
}
