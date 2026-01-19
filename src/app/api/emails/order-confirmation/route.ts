import { NextRequest, NextResponse } from 'next/server';
import { handleOrderCreated } from '@/lib/email-hooks';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await handleOrderCreated(orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return NextResponse.json({ error: 'Failed to send order confirmation email' }, { status: 500 });
  }
}