/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
}

function sendToAnalytics(metric: any) {
  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

// Performance observer for monitoring
export function initPerformanceObserver() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // Monitor long tasks
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
          });
        }
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
  }

  // Monitor layout shifts
  try {
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).value > 0.1) {
          console.warn('Layout shift detected:', {
            value: (entry as any).value,
            sources: (entry as any).sources,
          });
        }
      }
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Layout shift API not supported
  }
}

// Image loading optimization
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Preload critical images
  const criticalImages = [
    '/images/hero/herosection1.png',
    '/images/logo.png',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Resource hints
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: process.env.NEXT_PUBLIC_SUPABASE_URL },
  ];

  hints.forEach(({ rel, href }) => {
    if (href && !document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
  });
}

// Lazy loading utility
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Bundle size monitoring
export function logBundleSize() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  // Monitor bundle size in development
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('_next/static')) {
        console.log('Bundle loaded:', {
          name: entry.name,
          size: (entry as any).transferSize,
          duration: entry.duration,
        });
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) return;

  const memory = (performance as any).memory;
  
  setInterval(() => {
    const memoryInfo = {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    };

    // Warn if memory usage is high
    if (memoryInfo.used > 100) {
      console.warn('High memory usage detected:', memoryInfo);
    }
  }, 30000); // Check every 30 seconds
}

// Performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        FCP: 0, // Will be set by web-vitals
        LCP: 0, // Will be set by web-vitals
        TTI: navigation.loadEventEnd - navigation.fetchStart,
        TBT: 0, // Calculated from long tasks
        CLS: 0, // Will be set by web-vitals
      };

      // Performance budget thresholds (in ms)
      const budget = {
        FCP: 1800,
        LCP: 2500,
        TTI: 3800,
        TBT: 300,
        CLS: 0.1,
      };

      // Check if we're within budget
      Object.entries(metrics).forEach(([metric, value]) => {
        const threshold = budget[metric as keyof typeof budget];
        if (value > threshold) {
          console.warn(`Performance budget exceeded for ${metric}:`, {
            actual: value,
            budget: threshold,
            difference: value - threshold,
          });
        }
      });
    }, 1000);
  });
}

// Initialize all performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  trackWebVitals();
  initPerformanceObserver();
  optimizeImageLoading();
  addResourceHints();
  logBundleSize();
  monitorMemoryUsage();
  checkPerformanceBudget();
}