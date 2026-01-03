'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { verifyOtp, resendOtp } from '../actions';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const type = searchParams.get('type') || 'signup'; // 'signup' or '2fa'
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    
    // Handle paste
    if (value.length > 1) {
      const pastedValue = value.slice(0, 6).split('');
      pastedValue.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedValue.length, 5)]?.focus();
      return;
    }
    
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await verifyOtp(email, otpCode);
      
      if (result.error) {
        setError(result.error);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setSuccess(true);
        // Redirect after success animation
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    setError(null);
    
    try {
      const result = await resendOtp(email);
      
      if (result.error) {
        setError(result.error);
      } else {
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary mb-2">
          Email Verified!
        </h1>
        <p className="text-muted-foreground mb-6">
          Your account has been successfully verified. Redirecting...
        </p>
        <div className="animate-pulse">
          <div className="h-1 bg-secondary rounded-full w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-error" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary mb-2">
          Invalid Request
        </h1>
        <p className="text-muted-foreground mb-6">
          No email address provided. Please start the signup process again.
        </p>
        <Link href="/auth/signup">
          <Button variant="primary">Go to Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-secondary" />
      </div>
      
      <h1 className="text-2xl font-heading font-bold text-primary mb-2">
        {type === '2fa' ? 'Two-Factor Authentication' : 'Verify Your Email'}
      </h1>
      <p className="text-muted-foreground mb-2">
        We&apos;ve sent a 6-digit verification code to
      </p>
      <p className="font-medium text-foreground mb-6">{email}</p>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`Digit ${index + 1} of 6`}
              title={`Enter digit ${index + 1}`}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              disabled={isLoading}
            />
          ))}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Verify Code
        </Button>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-2">
          Didn&apos;t receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="inline-flex items-center text-secondary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            `Resend in ${resendCooldown}s`
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Resend Code
            </>
          )}
        </button>
      </div>
      
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/auth/login" className="text-secondary hover:underline">
          ← Back to Login
        </Link>
      </p>
    </div>
  );
}
