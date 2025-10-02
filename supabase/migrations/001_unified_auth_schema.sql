-- =====================================================
-- UNIFIED AUTH SCHEMA MIGRATION
-- Design-Rite v3 + Document AI Platform Integration
-- Migration: Extends existing users table for Document AI features
-- Created: 2025-10-02
-- Run Order: AFTER auth_tables.sql
-- =====================================================

-- ==============================================
-- STEP 1: Extend users table for Document AI
-- ==============================================

-- Add Document AI specific columns to existing users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'base' CHECK (subscription_tier IN ('base', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  ADD COLUMN IF NOT EXISTS token_usage bigint DEFAULT 0,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS business_type text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS tax_id text,
  ADD COLUMN IF NOT EXISTS has_free_access boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_seen_subscription_page boolean DEFAULT false;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN users.subscription_tier IS 'Subscription tier: base (free), pro, enterprise';
COMMENT ON COLUMN users.token_usage IS 'Total AI tokens consumed for billing/analytics';
COMMENT ON COLUMN users.logo_url IS 'Company logo URL for document branding';

-- ==============================================
-- STEP 2: Create Document Management Tables
-- ==============================================

-- User uploaded documents (source documents for AI processing)
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  extracted_text text,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_docs_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_docs_status ON user_documents(processing_status);
CREATE INDEX IF NOT EXISTS idx_user_docs_created ON user_documents(created_at DESC);

-- Enable RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Users can only access their own documents
CREATE POLICY "Users can view their own documents" ON user_documents
  FOR SELECT
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert their own documents" ON user_documents
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own documents" ON user_documents
  FOR UPDATE
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can delete their own documents" ON user_documents
  FOR DELETE
  USING (user_id = auth.uid()::uuid);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents" ON user_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
  );

-- ==============================================
-- STEP 3: Document Chunks (Vector Embeddings)
-- ==============================================

-- Install pgvector extension if not already installed
CREATE EXTENSION IF NOT EXISTS vector;

-- Document chunks with vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  chunk_text text NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  metadata jsonb,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chunks_document ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- Enable RLS
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Users can access chunks from their own documents
CREATE POLICY "Users can view their document chunks" ON document_chunks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_documents
      WHERE user_documents.id = document_chunks.document_id
      AND user_documents.user_id = auth.uid()::uuid
    )
  );

-- System can manage chunks (service key)
CREATE POLICY "System can manage chunks" ON document_chunks
  FOR ALL
  WITH CHECK (true);

-- ==============================================
-- STEP 4: Document Processing Queue
-- ==============================================

CREATE TABLE IF NOT EXISTS document_processing_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_document_id uuid NOT NULL REFERENCES user_documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts integer DEFAULT 0,
  error_message text,
  created_at timestamp DEFAULT now(),
  processed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_queue_status ON document_processing_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_queue_user ON document_processing_queue(user_id);

-- Enable RLS
ALTER TABLE document_processing_queue ENABLE ROW LEVEL SECURITY;

-- Users can view their own queue items
CREATE POLICY "Users can view their queue items" ON document_processing_queue
  FOR SELECT
  USING (user_id = auth.uid()::uuid);

-- System can manage queue
CREATE POLICY "System can manage queue" ON document_processing_queue
  FOR ALL
  WITH CHECK (true);

-- ==============================================
-- STEP 5: AI Chat Conversations
-- ==============================================

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text DEFAULT 'New Conversation',
  company_name text,
  assessment_type text DEFAULT 'general',
  assessment_data jsonb,
  conversation_summary text,
  priority_level text DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  priority_score integer DEFAULT 50,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON chat_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_company ON chat_conversations USING gin(to_tsvector('english', company_name));

-- Enable RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" ON chat_conversations
  FOR ALL
  USING (user_id = auth.uid()::uuid);

-- ==============================================
-- STEP 6: Chat Messages
-- ==============================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user ON chat_messages(user_id);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their conversation messages" ON chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = conversation_id
      AND chat_conversations.user_id = auth.uid()::uuid
    )
  );

-- ==============================================
-- STEP 7: Generated Documents (Invoices/Proposals)
-- ==============================================

CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  document_type text NOT NULL,
  document_category text,
  client_name text,
  amount numeric(12, 2),
  file_path text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_docs_user ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_docs_type ON generated_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_generated_docs_created ON generated_documents(created_at DESC);

-- Enable RLS
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their generated documents" ON generated_documents
  FOR ALL
  USING (user_id = auth.uid()::uuid);

-- ==============================================
-- STEP 8: Global Documents (Shared Knowledge Base)
-- ==============================================

CREATE TABLE IF NOT EXISTS global_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  extracted_text text,
  uploaded_by uuid REFERENCES users(id),
  is_ai_accessible boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_global_docs_filename ON global_documents(filename);
CREATE INDEX IF NOT EXISTS idx_global_docs_uploaded ON global_documents(uploaded_by);

-- Enable RLS
ALTER TABLE global_documents ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read global documents
CREATE POLICY "Authenticated users can view global documents" ON global_documents
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only super admins can manage global documents
CREATE POLICY "Super admins can manage global documents" ON global_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- ==============================================
-- STEP 9: Extend Permissions for Document AI Features
-- ==============================================

-- Add Document AI specific features to permissions
INSERT INTO permissions (role, feature, can_read, can_create, can_update, can_delete, can_export, daily_limit, monthly_limit)
VALUES
  -- Document Upload & Processing
  ('super_admin', 'document_upload', true, true, true, true, true, NULL, NULL),
  ('admin', 'document_upload', true, true, true, true, true, NULL, NULL),
  ('manager', 'document_upload', true, true, true, false, true, NULL, 20),
  ('user', 'document_upload', true, true, false, false, true, 5, 10),
  ('guest', 'document_upload', false, false, false, false, false, NULL, NULL),

  -- AI Chat & Embeddings
  ('super_admin', 'ai_chat', true, true, true, true, true, NULL, NULL),
  ('admin', 'ai_chat', true, true, true, true, true, NULL, NULL),
  ('manager', 'ai_chat', true, true, true, false, true, NULL, NULL),
  ('user', 'ai_chat', true, true, false, false, true, 10, 50),
  ('guest', 'ai_chat', false, false, false, false, false, NULL, NULL),

  -- Generated Documents
  ('super_admin', 'generated_documents', true, true, true, true, true, NULL, NULL),
  ('admin', 'generated_documents', true, true, true, true, true, NULL, NULL),
  ('manager', 'generated_documents', true, true, true, false, true, NULL, NULL),
  ('user', 'generated_documents', true, true, false, false, true, NULL, NULL),
  ('guest', 'generated_documents', false, false, false, false, false, NULL, NULL)

ON CONFLICT (role, feature) DO NOTHING;

-- ==============================================
-- STEP 10: Database Functions for Document AI
-- ==============================================

-- Function to increment token usage
CREATE OR REPLACE FUNCTION increment_token_usage(
  p_user_id uuid,
  p_tokens integer
)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET token_usage = COALESCE(token_usage, 0) + p_tokens
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION vector_similarity_search(
  query_embedding vector(1536),
  user_uuid uuid,
  match_threshold float DEFAULT 0.7,
  match_count integer DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_text text,
  chunk_index integer,
  similarity float,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity,
    dc.metadata
  FROM document_chunks dc
  INNER JOIN user_documents ud ON dc.document_id = ud.id
  WHERE ud.user_id = user_uuid
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's document processing status
CREATE OR REPLACE FUNCTION get_user_document_status(
  p_user_id uuid
)
RETURNS TABLE (
  document_id uuid,
  filename text,
  processing_status text,
  chunks_count bigint,
  created_at timestamp
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ud.id,
    ud.filename,
    ud.processing_status,
    COUNT(dc.id) as chunks_count,
    ud.created_at
  FROM user_documents ud
  LEFT JOIN document_chunks dc ON ud.id = dc.document_id
  WHERE ud.user_id = p_user_id
  GROUP BY ud.id, ud.filename, ud.processing_status, ud.created_at
  ORDER BY ud.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STEP 11: Triggers
-- ==============================================

-- Auto-queue documents for processing when uploaded
CREATE OR REPLACE FUNCTION queue_document_for_processing()
RETURNS trigger AS $$
BEGIN
  IF NEW.extracted_text IS NOT NULL AND LENGTH(NEW.extracted_text) > 100 THEN
    INSERT INTO document_processing_queue (user_document_id, user_id, status)
    VALUES (NEW.id, NEW.user_id, 'pending')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_queue_document
  AFTER INSERT OR UPDATE ON user_documents
  FOR EACH ROW
  WHEN (NEW.extracted_text IS NOT NULL)
  EXECUTE FUNCTION queue_document_for_processing();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_docs_timestamp
  BEFORE UPDATE ON user_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_conversations_timestamp
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_generated_docs_timestamp
  BEFORE UPDATE ON generated_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Unified Auth Schema Migration Completed Successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Schema Changes:';
  RAISE NOTICE '  ✓ Extended users table with Document AI fields';
  RAISE NOTICE '  ✓ Created user_documents table';
  RAISE NOTICE '  ✓ Created document_chunks table with vector embeddings';
  RAISE NOTICE '  ✓ Created document_processing_queue table';
  RAISE NOTICE '  ✓ Created chat_conversations table';
  RAISE NOTICE '  ✓ Created chat_messages table';
  RAISE NOTICE '  ✓ Created generated_documents table';
  RAISE NOTICE '  ✓ Created global_documents table';
  RAISE NOTICE '  ✓ Extended permissions with Document AI features';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions Created:';
  RAISE NOTICE '  ✓ increment_token_usage(user_id, tokens)';
  RAISE NOTICE '  ✓ vector_similarity_search(embedding, user_id, threshold, count)';
  RAISE NOTICE '  ✓ get_user_document_status(user_id)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Create storage buckets (documents, generated-pdfs)';
  RAISE NOTICE '  2. Configure OpenAI API key for embeddings';
  RAISE NOTICE '  3. Set up Stripe webhook endpoints';
  RAISE NOTICE '  4. Deploy Edge Functions with unified auth';
  RAISE NOTICE '';
END $$;
