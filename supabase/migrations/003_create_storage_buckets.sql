-- =====================================================
-- STORAGE BUCKETS FOR DOCUMENT AI PLATFORM
-- Design-Rite v3 + Document AI Platform Integration
-- Migration: Creates storage buckets with RLS policies
-- Created: 2025-10-02
-- Run Order: AFTER 002_add_doc_ai_tables.sql
-- =====================================================

-- ==============================================
-- BUCKET 1: documents (Private)
-- User-uploaded source documents (PDF, DOCX, TXT)
-- ==============================================

-- Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policy: Users can upload to their own folder
CREATE POLICY "Users can upload documents to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can read their own files
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can update their own files
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can delete their own files
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Admins can read all documents
CREATE POLICY "Admins can read all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::uuid
    AND users.role IN ('admin', 'super_admin')
    AND users.status = 'active'
  )
);

-- ==============================================
-- BUCKET 2: generated-pdfs (Private)
-- AI-generated invoices, proposals, reports
-- ==============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-pdfs',
  'generated-pdfs',
  false, -- Private bucket
  5242880, -- 5MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policy: Users can upload generated PDFs to their folder
CREATE POLICY "Users can upload generated PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'generated-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can read their own generated PDFs
CREATE POLICY "Users can read own generated PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'generated-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can update their own generated PDFs
CREATE POLICY "Users can update own generated PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'generated-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can delete their own generated PDFs
CREATE POLICY "Users can delete own generated PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'generated-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Admins can read all generated PDFs
CREATE POLICY "Admins can read all generated PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'generated-pdfs' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::uuid
    AND users.role IN ('admin', 'super_admin')
    AND users.status = 'active'
  )
);

-- ==============================================
-- BUCKET 3: user-logos (Public)
-- Company logos for branding (public access for PDFs)
-- ==============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-logos',
  'user-logos',
  true, -- Public bucket (logos need to be embeddable in PDFs)
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policy: Users can upload logos to their own folder
CREATE POLICY "Users can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Anyone can read logos (public bucket)
-- No SELECT policy needed for public buckets

-- RLS Policy: Users can update their own logos
CREATE POLICY "Users can update own logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Users can delete their own logos
CREATE POLICY "Users can delete own logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ==============================================
-- BUCKET 4: global-documents (Public)
-- Admin-uploaded shared documents (guides, templates)
-- ==============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'global-documents',
  'global-documents',
  true, -- Public bucket for shared resources
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policy: Only super admins can upload global documents
CREATE POLICY "Super admins can upload global documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'global-documents' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::uuid
    AND users.role = 'super_admin'
    AND users.status = 'active'
  )
);

-- RLS Policy: Anyone can read global documents (public bucket)
-- No SELECT policy needed for public buckets

-- RLS Policy: Only super admins can update global documents
CREATE POLICY "Super admins can update global documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'global-documents' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::uuid
    AND users.role = 'super_admin'
    AND users.status = 'active'
  )
);

-- RLS Policy: Only super admins can delete global documents
CREATE POLICY "Super admins can delete global documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'global-documents' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::uuid
    AND users.role = 'super_admin'
    AND users.status = 'active'
  )
);

-- ==============================================
-- HELPER FUNCTIONS FOR STORAGE
-- ==============================================

-- Function to get user's storage usage
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id uuid)
RETURNS TABLE (
  total_documents integer,
  total_size_bytes bigint,
  documents_size_bytes bigint,
  generated_pdfs_size_bytes bigint,
  logos_size_bytes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::integer as total_documents,
    SUM(COALESCE((metadata->>'size')::bigint, 0)) as total_size_bytes,
    SUM(
      CASE WHEN bucket_id = 'documents'
      THEN COALESCE((metadata->>'size')::bigint, 0)
      ELSE 0 END
    ) as documents_size_bytes,
    SUM(
      CASE WHEN bucket_id = 'generated-pdfs'
      THEN COALESCE((metadata->>'size')::bigint, 0)
      ELSE 0 END
    ) as generated_pdfs_size_bytes,
    SUM(
      CASE WHEN bucket_id = 'user-logos'
      THEN COALESCE((metadata->>'size')::bigint, 0)
      ELSE 0 END
    ) as logos_size_bytes
  FROM storage.objects
  WHERE bucket_id IN ('documents', 'generated-pdfs', 'user-logos')
    AND (storage.foldername(name))[1] = p_user_id::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_storage_usage IS 'Calculate total storage usage across all buckets for a user';

-- Function to check if user has exceeded document limit
CREATE OR REPLACE FUNCTION check_document_limit(p_user_id uuid)
RETURNS TABLE (
  current_count integer,
  max_allowed integer,
  limit_exceeded boolean
) AS $$
DECLARE
  v_count integer;
  v_max integer;
BEGIN
  -- Get current document count
  SELECT COUNT(*)::integer INTO v_count
  FROM user_documents
  WHERE user_id = p_user_id;

  -- Get user's max documents based on subscription tier
  SELECT
    CASE
      WHEN u.role IN ('super_admin', 'admin') THEN 99999 -- Unlimited
      WHEN u.subscription_tier = 'enterprise' THEN
        (SELECT max_enterprise_documents FROM admin_settings LIMIT 1)
      WHEN u.subscription_tier = 'pro' THEN
        (SELECT max_pro_documents FROM admin_settings LIMIT 1)
      ELSE
        (SELECT max_base_documents FROM admin_settings LIMIT 1)
    END INTO v_max
  FROM users u
  WHERE u.id = p_user_id;

  RETURN QUERY
  SELECT
    v_count as current_count,
    COALESCE(v_max, 5) as max_allowed,
    v_count >= COALESCE(v_max, 5) as limit_exceeded;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_document_limit IS 'Check if user has exceeded their document upload limit';

-- ==============================================
-- ADMIN VIEWS
-- ==============================================

-- View: Storage usage by bucket
CREATE OR REPLACE VIEW v_storage_usage_by_bucket AS
SELECT
  bucket_id,
  COUNT(*) as file_count,
  SUM(COALESCE((metadata->>'size')::bigint, 0)) as total_size_bytes,
  ROUND(SUM(COALESCE((metadata->>'size')::bigint, 0))::numeric / 1048576, 2) as total_size_mb,
  AVG(COALESCE((metadata->>'size')::bigint, 0))::bigint as avg_file_size_bytes
FROM storage.objects
WHERE bucket_id IN ('documents', 'generated-pdfs', 'user-logos', 'global-documents')
GROUP BY bucket_id
ORDER BY total_size_bytes DESC;

COMMENT ON VIEW v_storage_usage_by_bucket IS 'Storage statistics grouped by bucket';

-- View: Top storage users
CREATE OR REPLACE VIEW v_top_storage_users AS
SELECT
  (storage.foldername(name))[1]::uuid as user_id,
  u.email,
  u.full_name,
  u.subscription_tier,
  COUNT(*) as file_count,
  SUM(COALESCE((metadata->>'size')::bigint, 0)) as total_size_bytes,
  ROUND(SUM(COALESCE((metadata->>'size')::bigint, 0))::numeric / 1048576, 2) as total_size_mb
FROM storage.objects
LEFT JOIN users u ON u.id = (storage.foldername(name))[1]::uuid
WHERE bucket_id IN ('documents', 'generated-pdfs', 'user-logos')
GROUP BY (storage.foldername(name))[1], u.email, u.full_name, u.subscription_tier
ORDER BY total_size_bytes DESC
LIMIT 50;

COMMENT ON VIEW v_top_storage_users IS 'Top 50 users by storage consumption';

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Storage Buckets Created Successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Buckets Created:';
  RAISE NOTICE '  ✓ documents (private, 10MB limit) - User uploads';
  RAISE NOTICE '  ✓ generated-pdfs (private, 5MB limit) - AI-generated PDFs';
  RAISE NOTICE '  ✓ user-logos (public, 2MB limit) - Company branding';
  RAISE NOTICE '  ✓ global-documents (public, 10MB limit) - Shared resources';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies:';
  RAISE NOTICE '  ✓ Users can only access their own files in private buckets';
  RAISE NOTICE '  ✓ Admins can read all files for moderation';
  RAISE NOTICE '  ✓ Super admins can manage global documents';
  RAISE NOTICE '';
  RAISE NOTICE 'Helper Functions:';
  RAISE NOTICE '  ✓ get_user_storage_usage(user_id) - Calculate storage used';
  RAISE NOTICE '  ✓ check_document_limit(user_id) - Verify upload limits';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin Views:';
  RAISE NOTICE '  ✓ v_storage_usage_by_bucket - Storage stats per bucket';
  RAISE NOTICE '  ✓ v_top_storage_users - Highest storage consumers';
  RAISE NOTICE '';
  RAISE NOTICE 'File Paths:';
  RAISE NOTICE '  • documents: {user_id}/{filename}';
  RAISE NOTICE '  • generated-pdfs: {user_id}/invoice_{timestamp}.pdf';
  RAISE NOTICE '  • user-logos: {user_id}/logo.{ext}';
  RAISE NOTICE '  • global-documents: {category}/{filename}';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Test file upload via Supabase client';
  RAISE NOTICE '  2. Begin API route migration (ai-chat first)';
  RAISE NOTICE '';
END $$;
