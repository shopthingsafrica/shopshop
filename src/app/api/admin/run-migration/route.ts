import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Check if user is admin (basic security check)
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
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Run the migration SQL
    const migrationSQL = `
      -- Add user management fields to profiles table
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
      ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;

      -- Add index for suspended users
      CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(is_suspended) WHERE is_suspended = TRUE;

      -- Add comments
      COMMENT ON COLUMN profiles.is_suspended IS 'Whether the user account is suspended';
      COMMENT ON COLUMN profiles.suspension_reason IS 'Reason for suspension';
      COMMENT ON COLUMN profiles.suspended_at IS 'When the user was suspended';
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Migration error:', error);
      return NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User management fields migration completed successfully' 
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}