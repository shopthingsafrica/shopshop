'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { forgotPassword } from '../actions';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    try {
      const result = await forgotPassword(email);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary mb-2">
          Check Your Email
        </h1>
        <p className="text-muted-foreground mb-6">
          We&apos;ve sent a password reset link to <strong>{email}</strong>. 
          Please check your inbox and follow the instructions to reset your password.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <button 
            onClick={() => setSuccess(false)} 
            className="text-secondary hover:underline"
          >
            try again
          </button>
        </p>
        <Link href="/auth/login">
          <Button variant="outline" fullWidth>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-primary mb-2">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground">
          No worries! Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>
      
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
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          error={emailError || undefined}
          leftIcon={<Mail className="w-5 h-5" />}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>
      
      <p className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center text-secondary hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>
      </p>
    </div>
  );
}
