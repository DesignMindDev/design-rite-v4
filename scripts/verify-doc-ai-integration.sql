-- ============================================
-- Document AI Integration Verification Script
-- Run in Supabase SQL Editor to verify deployment
-- ============================================

-- 1. Verify all Document AI tables exist
SELECT
  'Tables Check' as check_type,
  COUNT(*) as found_count,
  CASE
    WHEN COUNT(*) = 9 THEN '✅ All tables present'
    ELSE '❌ Missing tables'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'admin_settings',
  'user_themes',
  'user_documents',
  'document_chunks',
  'chat_conversations',
  'chat_messages',
  'generated_documents',
  'global_documents',
  'document_processing_queue'
);

-- 2. Verify users table has Document AI columns
SELECT
  'Users Table Columns' as check_type,
  COUNT(*) as found_count,
  CASE
    WHEN COUNT(*) >= 14 THEN '✅ All columns added'
    ELSE '❌ Missing columns'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name IN (
  'stripe_customer_id',
  'stripe_subscription_id',
  'subscription_tier',
  'subscription_status',
  'token_usage',
  'logo_url',
  'business_type',
  'company_size',
  'industry',
  'phone',
  'website',
  'company_tagline',
  'onboarding_completed',
  'preferences'
);

-- 3. Verify storage buckets created
SELECT
  'Storage Buckets' as check_type,
  COUNT(*) as found_count,
  CASE
    WHEN COUNT(*) = 4 THEN '✅ All buckets created'
    ELSE '❌ Missing buckets'
  END as status
FROM storage.buckets
WHERE id IN ('documents', 'generated-pdfs', 'user-logos', 'global-documents');

-- 4. Verify database functions created
SELECT
  'Database Functions' as check_type,
  COUNT(*) as found_count,
  CASE
    WHEN COUNT(*) >= 3 THEN '✅ Functions created'
    ELSE '❌ Missing functions'
  END as status
FROM pg_proc
JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
WHERE pg_namespace.nspname = 'public'
AND pg_proc.proname IN (
  'increment_token_usage',
  'vector_similarity_search',
  'get_user_document_status'
);

-- 5. Verify pgvector extension installed
SELECT
  'PgVector Extension' as check_type,
  1 as found_count,
  CASE
    WHEN extname = 'vector' THEN '✅ Extension installed'
    ELSE '❌ Extension missing'
  END as status
FROM pg_extension
WHERE extname = 'vector';

-- 6. Verify permissions seeded for Document AI features
SELECT
  'Document AI Permissions' as check_type,
  COUNT(*) as found_count,
  CASE
    WHEN COUNT(*) >= 15 THEN '✅ Permissions seeded'
    ELSE '❌ Missing permissions'
  END as status
FROM permissions
WHERE feature IN ('document_upload', 'ai_chat', 'generated_documents');

-- 7. List storage bucket details
SELECT
  id,
  name,
  public as is_public,
  file_size_limit / 1048576 as max_size_mb,
  array_length(allowed_mime_types, 1) as allowed_types_count
FROM storage.buckets
WHERE id IN ('documents', 'generated-pdfs', 'user-logos', 'global-documents')
ORDER BY id;

-- 8. Check RLS policies on Document AI tables
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN (
  'user_documents',
  'document_chunks',
  'chat_conversations',
  'chat_messages',
  'generated_documents',
  'admin_settings',
  'user_themes'
)
GROUP BY schemaname, tablename
ORDER BY tablename;

-- 9. Verify admin_settings table has default row
SELECT
  'Admin Settings' as check_type,
  COUNT(*) as found_count,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Admin settings initialized'
    ELSE '⚠️ No admin settings (will auto-create on first use)'
  END as status
FROM admin_settings;

-- 10. Check if any test users exist with subscription data
SELECT
  COUNT(*) as users_with_stripe,
  COUNT(*) FILTER (WHERE subscription_tier = 'pro') as pro_users,
  COUNT(*) FILTER (WHERE subscription_tier = 'enterprise') as enterprise_users,
  COUNT(*) FILTER (WHERE subscription_status = 'active') as active_subscriptions
FROM users
WHERE stripe_customer_id IS NOT NULL;

-- ============================================
-- SUMMARY: Run this query to get overall status
-- ============================================
SELECT
  '🎯 Document AI Integration Status' as summary,
  CASE
    WHEN
      (SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('admin_settings', 'user_documents', 'chat_conversations')) = 3
      AND (SELECT COUNT(*) FROM storage.buckets WHERE id = 'documents') = 1
      AND (SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector') = 1
    THEN '✅ READY FOR USE'
    ELSE '❌ INCOMPLETE - Check individual tests above'
  END as deployment_status;
