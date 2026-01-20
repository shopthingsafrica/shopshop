/**
 * Security utilities for rate limiting, input sanitization, and protection
 */

import { NextRequest } from 'next/server';

// Lazy import DOMPurify to avoid issues in edge runtime
let DOMPurify: any = null;

async function getDOMPurify() {
  if (!DOMPurify && typeof window !== 'undefined') {
    try {
      const { default: purify } = await import('isomorphic-dompurify');
      DOMPurify = purify;
    } catch (error) {
      console.warn('DOMPurify not available:', error);
    }
  }
  return DOMPurify;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max unique tokens per interval
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limiting implementation
 */
export function rateLimit(options: RateLimitOptions) {
  return {
    check: async (limit: number, token: string): Promise<RateLimitResult> => {
      const now = Date.now();
      const key = `${token}:${Math.floor(now / options.interval)}`;
      
      // Clean up old entries
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k);
        }
      }
      
      const current = rateLimitStore.get(key) || { count: 0, resetTime: now + options.interval };
      
      if (current.count >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: current.resetTime,
        };
      }
      
      current.count++;
      rateLimitStore.set(key, current);
      
      return {
        success: true,
        limit,
        remaining: limit - current.count,
        reset: current.resetTime,
      };
    },
  };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

/**
 * Input sanitization
 */
export class InputSanitizer {
  /**
   * Sanitize HTML content
   */
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: [],
    });
  }

  /**
   * Sanitize plain text (remove HTML tags)
   */
  static sanitizeText(input: string): string {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeText(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    return this.sanitizeText(phone).replace(/[^\d+\-\s()]/g, '');
  }

  /**
   * Sanitize URL
   */
  static sanitizeURL(url: string): string {
    try {
      const sanitized = this.sanitizeText(url);
      const urlObj = new URL(sanitized);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }
      
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitize filename
   */
  static sanitizeFilename(filename: string): string {
    return this.sanitizeText(filename)
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .substring(0, 255);
  }

  /**
   * Sanitize search query
   */
  static sanitizeSearchQuery(query: string): string {
    return this.sanitizeText(query)
      .replace(/[<>]/g, '') // Remove potential XSS
      .trim()
      .substring(0, 100); // Limit length
  }
}

/**
 * CSRF Protection
 */
export class CSRFProtection {
  private static secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';

  /**
   * Generate CSRF token
   */
  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const payload = `${sessionId}:${timestamp}`;
    const signature = this.sign(payload);
    return btoa(`${payload}:${signature}`);
  }

  /**
   * Verify CSRF token
   */
  static verifyToken(token: string, sessionId: string): boolean {
    try {
      const decoded = atob(token);
      const [session, timestamp, signature] = decoded.split(':');
      
      if (session !== sessionId) {
        return false;
      }
      
      // Check if token is not older than 1 hour
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      if (now - tokenTime > 3600000) {
        return false;
      }
      
      const expectedSignature = this.sign(`${session}:${timestamp}`);
      return signature === expectedSignature;
    } catch {
      return false;
    }
  }

  private static sign(payload: string): string {
    // Simple HMAC-like signing (in production, use crypto.createHmac)
    return btoa(`${payload}:${this.secret}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }
}

/**
 * SQL Injection Protection
 */
export class SQLProtection {
  private static dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\b\s+['"]\w+['"]?\s*=\s*['"]\w+['"]?)/gi,
  ];

  /**
   * Check if input contains SQL injection patterns
   */
  static containsSQLInjection(input: string): boolean {
    return this.dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Sanitize input to prevent SQL injection
   */
  static sanitize(input: string): string {
    let sanitized = input;
    
    // Remove dangerous patterns
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized.trim();
  }
}

/**
 * XSS Protection
 */
export class XSSProtection {
  private static dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ];

  /**
   * Check if input contains XSS patterns
   */
  static containsXSS(input: string): boolean {
    return this.dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Remove XSS patterns from input
   */
  static sanitize(input: string): string {
    let sanitized = input;
    
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized;
  }
}

/**
 * Password security utilities
 */
export class PasswordSecurity {
  /**
   * Check password strength
   */
  static checkStrength(password: string): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain uppercase letters');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain numbers');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain special characters');
    } else {
      score += 1;
    }

    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];

    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      feedback.push('Password contains common words');
      score = Math.max(0, score - 2);
    }

    return {
      score,
      feedback,
      isStrong: score >= 4 && feedback.length === 0,
    };
  }
}

/**
 * File upload security
 */
export class FileUploadSecurity {
  private static allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
  ];

  private static maxFileSize = 5 * 1024 * 1024; // 5MB

  /**
   * Validate uploaded file
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`,
      };
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed. Only images are permitted.',
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: 'Invalid file extension.',
      };
    }

    return { isValid: true };
  }

  /**
   * Sanitize filename
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .substring(0, 100);
  }
}

/**
 * Security headers middleware
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
    
    // HSTS (only in production with HTTPS)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    }),
  };
}

/**
 * Brute force protection
 */
export class BruteForceProtection {
  private static attempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>();
  private static maxAttempts = 5;
  private static blockDuration = 15 * 60 * 1000; // 15 minutes
  private static attemptWindow = 5 * 60 * 1000; // 5 minutes

  /**
   * Record failed login attempt
   */
  static recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const current = this.attempts.get(identifier) || { count: 0, lastAttempt: 0, blocked: false };

    // Reset count if outside attempt window
    if (now - current.lastAttempt > this.attemptWindow) {
      current.count = 0;
      current.blocked = false;
    }

    current.count++;
    current.lastAttempt = now;

    if (current.count >= this.maxAttempts) {
      current.blocked = true;
    }

    this.attempts.set(identifier, current);
  }

  /**
   * Check if identifier is blocked
   */
  static isBlocked(identifier: string): boolean {
    const current = this.attempts.get(identifier);
    if (!current || !current.blocked) {
      return false;
    }

    const now = Date.now();
    if (now - current.lastAttempt > this.blockDuration) {
      // Unblock after duration
      current.blocked = false;
      current.count = 0;
      this.attempts.set(identifier, current);
      return false;
    }

    return true;
  }

  /**
   * Clear attempts for identifier (on successful login)
   */
  static clearAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Get remaining block time
   */
  static getRemainingBlockTime(identifier: string): number {
    const current = this.attempts.get(identifier);
    if (!current || !current.blocked) {
      return 0;
    }

    const now = Date.now();
    const remaining = this.blockDuration - (now - current.lastAttempt);
    return Math.max(0, remaining);
  }
}

// Export convenience functions
export const sanitizeHTML = InputSanitizer.sanitizeHTML;
export const sanitizeText = InputSanitizer.sanitizeText;
export const sanitizeEmail = InputSanitizer.sanitizeEmail;
export const sanitizeURL = InputSanitizer.sanitizeURL;
export const checkPasswordStrength = PasswordSecurity.checkStrength;
export const validateFile = FileUploadSecurity.validateFile;