#!/usr/bin/env node
/**
 * Delete Test Users - Programmatic Deletion via Supabase Admin API
 * Bypasses the Supabase UI completely
 *
 * Usage:
 *   node scripts/delete_test_users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const TEST_EMAILS = [
  'test1@design-rite.com',
  'test2@design-rite.com',
  'test3@design-rite.com'
];

async function deleteUser(email) {
  console.log(`\n🔍 Finding user: ${email}`);

  // Step 1: Get user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error(`❌ Error listing users:`, listError);
    return { success: false, error: listError };
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.log(`⚠️  User not found: ${email}`);
    return { success: true, skipped: true };
  }

  console.log(`   Found: ${user.id}`);
  console.log(`   Created: ${user.created_at}`);

  // Step 2: Delete user via admin API
  console.log(`🗑️  Deleting user...`);

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error(`❌ Error deleting user:`, deleteError);
    return { success: false, error: deleteError };
  }

  console.log(`✅ Successfully deleted: ${email}`);
  return { success: true, userId: user.id };
}

async function main() {
  console.log('='.repeat(60));
  console.log('🗑️  DELETE TEST USERS - Programmatic Deletion');
  console.log('='.repeat(60));
  console.log(`\nSupabase URL: ${SUPABASE_URL}`);
  console.log(`Service Key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);

  const results = [];

  for (const email of TEST_EMAILS) {
    const result = await deleteUser(email);
    results.push({ email, ...result });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successfully deleted: ${successful}`);
  console.log(`⚠️  Not found (skipped): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   ${r.email}: ${r.error?.message || 'Unknown error'}`);
    });
  }

  console.log('\n' + '='.repeat(60));

  // Verify deletion
  console.log('\n🔍 VERIFICATION - Checking if users still exist...\n');

  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Error verifying:', error);
    process.exit(1);
  }

  const remainingTestUsers = users.filter(u =>
    TEST_EMAILS.includes(u.email)
  );

  if (remainingTestUsers.length === 0) {
    console.log('✅ All test users successfully deleted!\n');
  } else {
    console.log(`⚠️  ${remainingTestUsers.length} test users still exist:`);
    remainingTestUsers.forEach(u => {
      console.log(`   - ${u.email} (${u.id})`);
    });
    console.log('');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
