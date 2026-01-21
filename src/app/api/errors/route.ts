import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/security';

// Rate limiting for error reporting
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // limit to 500 unique IPs per minute
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'anonymous';
    const { success } = await limiter.check(10, identifier); // 10 errors per minute per IP
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many error reports. Please try again later.' },
        { status: 429 }
      );
    }

    const errorReport = await request.json();
    
    // Validate error report structure
    if (!errorReport.message || !errorReport.fingerprint) {
      return NextResponse.json(
        { error: 'Invalid error report format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Check if error already exists
    const { data: existingError } = await supabase
      .from('error_logs')
      .select('id, count')
      .eq('fingerprint', errorReport.fingerprint)
      .single();

    if (existingError) {
      // Update existing error
      await supabase
        .from('error_logs')
        .update({
          count: existingError.count + 1,
          last_seen: new Date().toISOString(),
          context: errorReport.context,
        })
        .eq('id', existingError.id);
    } else {
      // Create new error log
      await supabase
        .from('error_logs')
        .insert({
          message: errorReport.message,
          stack: errorReport.stack,
          level: errorReport.level,
          context: errorReport.context,
          fingerprint: errorReport.fingerprint,
          count: 1,
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString(),
        });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get error logs with pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const level = url.searchParams.get('level');
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('error_logs')
      .select('*', { count: 'exact' })
      .order('last_seen', { ascending: false })
      .range(from, to);

    if (level) {
      query = query.eq('level', level);
    }

    const { data: errors, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      errors: errors || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });

  } catch (error) {
    console.error('Failed to fetch errors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}