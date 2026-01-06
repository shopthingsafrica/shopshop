'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import DashboardFooter from './DashboardFooter';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Show simplified footer on dashboard and vendor pages
  const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/vendor');
  
  if (isDashboardPage) {
    return <DashboardFooter />;
  }
  
  return <Footer />;
}
