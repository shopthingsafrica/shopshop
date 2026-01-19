import { NextRequest, NextResponse } from 'next/server';
import { handleProductStatusChange } from '@/lib/email-hooks';

export async function POST(request: NextRequest) {
  try {
    const { productId, approved, reason } = await request.json();

    if (!productId || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Product ID and approval status are required' }, { status: 400 });
    }

    await handleProductStatusChange(productId, approved, reason);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product status email error:', error);
    return NextResponse.json({ error: 'Failed to send product status email' }, { status: 500 });
  }
}