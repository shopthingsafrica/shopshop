'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input, Checkbox } from '@/components/ui';
import { signIn } from '../actions';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
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
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });
      
      if (result.error) {
        setError(result.error);
      } else if (result.requiresOtp) {
        // Redirect to OTP verification for 2FA
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}&type=2fa`);
      } else {
        // Successful login, redirect to home or dashboard
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-primary mb-2">
        Welcome back
      </h1>
      <p className="text-muted-foreground mb-6">
        Sign in to your ShopThings account
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          leftIcon={<Mail className="w-5 h-5" />}
          required
        />
        
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
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
          required
        />
        
        <div className="flex items-center justify-between">
          <Checkbox
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label="Remember me"
          />
          <Link
            href="/auth/forgot-password"
            className="text-sm text-secondary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
      
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>
      
      {/* OAuth Options */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-sm">Google</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <span className="font-medium text-sm">Apple</span>
        </button>
      </div>
      
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-secondary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
