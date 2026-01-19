'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { resetPassword } from '../actions';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Check for URL error parameters on mount
  useEffect(() => {
    const urlError = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    if (urlError === 'access_denied' && errorCode === 'otp_expired') {
      setError('This password reset link has expired. Please request a new one.');
    } else if (errorDescription) {
      setError(decodeURIComponent(errorDescription));
    } else if (urlError) {
      setError('There was an error with your password reset link. Please try again.');
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must include uppercase, lowercase, and a number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await resetPassword(formData.password);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Check if there's an expired link error
  const hasExpiredLinkError = searchParams.get('error_code') === 'otp_expired';

  if (success) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary mb-2">
          Password Reset Successfully
        </h1>
        <p className="text-muted-foreground mb-6">
          Your password has been changed. You can now sign in with your new password.
        </p>
        <div className="animate-pulse mb-4">
          <div className="h-1 bg-secondary rounded-full w-32 mx-auto"></div>
        </div>
        <p className="text-sm text-muted-foreground">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          hasExpiredLinkError ? 'bg-error/10' : 'bg-secondary/10'
        }`}>
          {hasExpiredLinkError ? (
            <AlertCircle className="w-8 h-8 text-error" />
          ) : (
            <Lock className="w-8 h-8 text-secondary" />
          )}
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary mb-2">
          {hasExpiredLinkError ? 'Link Expired' : 'Reset Your Password'}
        </h1>
        <p className="text-muted-foreground">
          {hasExpiredLinkError 
            ? 'This password reset link has expired. Please request a new one.'
            : 'Enter your new password below'
          }
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      {hasExpiredLinkError ? (
        <div className="space-y-4">
          <Link href="/auth/forgot-password">
            <Button variant="primary" fullWidth size="lg">
              Request New Reset Link
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" fullWidth size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              helperText="Min 8 characters with uppercase, lowercase & number"
              required
            />
            
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={fieldErrors.confirmPassword}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />
            
            {/* Password strength indicator */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Password requirements:</p>
              <ul className="text-sm space-y-1">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-success' : 'text-muted-foreground'}`}>
                  <span className="w-4 h-4 mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-success' : 'text-muted-foreground'}`}>
                  <span className="w-4 h-4 mr-2">{/[A-Z]/.test(formData.password) ? '✓' : '○'}</span>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-success' : 'text-muted-foreground'}`}>
                  <span className="w-4 h-4 mr-2">{/[a-z]/.test(formData.password) ? '✓' : '○'}</span>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-success' : 'text-muted-foreground'}`}>
                  <span className="w-4 h-4 mr-2">{/\d/.test(formData.password) ? '✓' : '○'}</span>
                  One number
                </li>
              </ul>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </form>
          
          <p className="mt-6 text-center">
            <Link href="/auth/login" className="inline-flex items-center text-secondary hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
