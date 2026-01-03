'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An error occurred during authentication';

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-error" />
      </div>
      <h1 className="text-2xl font-heading font-bold text-primary mb-2">
        Authentication Error
      </h1>
      <p className="text-muted-foreground mb-6">
        {message}
      </p>
      <div className="flex flex-col gap-3">
        <Link href="/auth">
          <Button variant="primary" fullWidth>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" fullWidth>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
