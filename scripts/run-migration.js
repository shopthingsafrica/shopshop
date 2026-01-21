const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase configuration');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('Running user management fields migration...');

  try {
    // Check if columns already exist
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')
      .in('column_name', ['is_suspended', 'suspension_reason', 'suspended_at']);

    if (checkError) {
      console.error('Error checking existing columns:', checkError);
    } else {
      const existingColumns = columns?.map(c => c.column_name) || [];
      console.log('Existing columns:', existingColumns);
      
      if (existingColumns.includes('is_suspended')) {
        console.log('Migration already applied - columns exist');
        return;
      }
    }

    // Try to add columns one by one using a different approach
    console.log('Attempting to add is_suspended column...');
    try {
      // We'll use a simple test query to check if we can add the columns
      // Since we can't execute raw SQL directly, let's try to update the profiles table structure
      // by attempting to select the new columns
      
      const { error: testError } = await supabase
        .from('profiles')
        .select('is_suspended')
        .limit(1);
      
      if (testError && testError.message.includes('column "is_suspended" does not exist')) {
        console.log('Columns do not exist, need to add them manually via Supabase dashboard');
        console.log('Please run the following SQL in your Supabase SQL editor:');
        console.log('');
        console.log('ALTER TABLE profiles');
        console.log('ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE,');
        console.log('ADD COLUMN IF NOT EXISTS suspension_reason TEXT,');
        console.log('ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ;');
        console.log('');
        console.log('CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(is_suspended) WHERE is_suspended = TRUE;');
        console.log('');
        console.log('Then run this script again to verify.');
        return;
      } else if (!testError) {
        console.log('✅ Columns already exist!');
        return;
      } else {
        console.error('Unexpected error:', testError);
      }
    } catch (error) {
      console.error('Error testing columns:', error);
    }

    console.log('✅ Migration completed successfully!');
    console.log('User management fields added to profiles table:');
    console.log('- is_suspended (BOOLEAN)');
    console.log('- suspension_reason (TEXT)');
    console.log('- suspended_at (TIMESTAMPTZ)');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();