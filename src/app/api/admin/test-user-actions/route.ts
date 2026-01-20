import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test if the suspension fields exist
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, is_suspended, suspension_reason, suspended_at')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'Database schema may need migration for user management fields',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'User management fields are available',
      sampleData: data?.[0] || null,
      fieldsAvailable: [
        'is_suspended',
        'suspension_reason', 
        'suspended_at'
      ],
      timestamp: new Date().toISOString(),
    });
    
  } catch (err) {
    console.error('User actions test error:', err);
    
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}