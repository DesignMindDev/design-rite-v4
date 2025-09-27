-- Design-Rite v3 Complete Database Setup
-- Run this in your Supabase SQL editor to create all required tables

-- ===========================================
-- 1. CHATBOT CONVERSATIONS TABLE
-- ===========================================
-- Create chatbot_conversations table for logging chat interactions
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'openai_assistant',
  assistant_id TEXT,
  user_ip TEXT,
  user_agent TEXT,
  session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_thread_id ON chatbot_conversations(thread_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_provider ON chatbot_conversations(provider);

-- ===========================================
-- 2. AI SESSIONS AND CONVERSATIONS TABLES
-- ===========================================
-- Table for AI chat sessions (used by AI Assistant page)
CREATE TABLE IF NOT EXISTS ai_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_hash TEXT NOT NULL,
  session_name TEXT NOT NULL,
  ai_provider TEXT DEFAULT 'simulated',
  assessment_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_hash ON ai_sessions(user_hash);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_session_id ON ai_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_last_activity ON ai_sessions(last_activity);

-- Table for individual conversation messages (used by AI Assistant page)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_hash TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  ai_provider TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  assessment_data JSONB,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_hash ON ai_conversations(user_hash);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_timestamp ON ai_conversations(timestamp);

-- Add foreign key constraint (optional, but good practice)
-- ALTER TABLE ai_conversations ADD CONSTRAINT fk_ai_conversations_session
--   FOREIGN KEY (session_id) REFERENCES ai_sessions(session_id) ON DELETE CASCADE;

-- ===========================================
-- 3. ASSESSMENTS TABLE
-- ===========================================
-- Table for storing completed assessments (used by AI Assessment API and Admin page)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  facility_type TEXT,
  square_footage INTEGER,
  current_security TEXT,
  security_concerns TEXT,
  budget TEXT,
  timeline TEXT,
  contact_info JSONB,
  assessment_content TEXT NOT NULL,
  technical_specifications TEXT,
  status TEXT DEFAULT 'completed',
  ai_model_used TEXT DEFAULT 'claude-3-sonnet',
  processing_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for assessments
CREATE INDEX IF NOT EXISTS idx_assessments_company_name ON assessments(company_name);
CREATE INDEX IF NOT EXISTS idx_assessments_facility_type ON assessments(facility_type);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- ===========================================
-- 4. ROW LEVEL SECURITY (RLS) SETUP
-- ===========================================
-- Enable Row Level Security for all tables
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for service role (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations for service role on chatbot_conversations" ON chatbot_conversations
  FOR ALL
  USING (true);

CREATE POLICY "Allow all operations for service role on ai_sessions" ON ai_sessions
  FOR ALL
  USING (true);

CREATE POLICY "Allow all operations for service role on ai_conversations" ON ai_conversations
  FOR ALL
  USING (true);

CREATE POLICY "Allow all operations for service role on assessments" ON assessments
  FOR ALL
  USING (true);

-- ===========================================
-- 5. USEFUL VIEWS
-- ===========================================
-- Optional: Create a view for session summaries
CREATE OR REPLACE VIEW ai_session_summaries AS
SELECT
  s.session_id,
  s.user_hash,
  s.session_name,
  s.ai_provider,
  s.created_at,
  s.last_activity,
  s.message_count,
  COUNT(c.id) as actual_message_count,
  MAX(c.timestamp) as last_message_time
FROM ai_sessions s
LEFT JOIN ai_conversations c ON s.session_id = c.session_id
GROUP BY s.session_id, s.user_hash, s.session_name, s.ai_provider, s.created_at, s.last_activity, s.message_count
ORDER BY s.last_activity DESC;

-- ===========================================
-- 6. TABLE COMMENTS FOR DOCUMENTATION
-- ===========================================
-- Add comments for documentation
COMMENT ON TABLE chatbot_conversations IS 'Stores all chatbot conversations for analytics and support';
COMMENT ON COLUMN chatbot_conversations.thread_id IS 'OpenAI thread ID for conversation tracking';
COMMENT ON COLUMN chatbot_conversations.provider IS 'AI provider used (openai_assistant, fallback, etc.)';
COMMENT ON COLUMN chatbot_conversations.assistant_id IS 'OpenAI Assistant ID used for this conversation';
COMMENT ON COLUMN chatbot_conversations.session_data IS 'Additional metadata about the conversation session';

COMMENT ON TABLE ai_sessions IS 'AI Assistant page sessions for conversation management';
COMMENT ON COLUMN ai_sessions.session_id IS 'Unique session identifier for AI Assistant conversations';
COMMENT ON COLUMN ai_sessions.user_hash IS 'Anonymous user identifier based on browser fingerprint';
COMMENT ON COLUMN ai_sessions.ai_provider IS 'AI provider used in this session (simulated, openai, claude, etc.)';

COMMENT ON TABLE ai_conversations IS 'Individual messages within AI Assistant sessions';
COMMENT ON COLUMN ai_conversations.session_id IS 'References ai_sessions.session_id';
COMMENT ON COLUMN ai_conversations.ai_provider IS 'AI provider used for this specific conversation';

COMMENT ON TABLE assessments IS 'Completed security assessments from AI Assessment API';
COMMENT ON COLUMN assessments.assessment_content IS 'Generated assessment content/report';
COMMENT ON COLUMN assessments.technical_specifications IS 'JSON string of original form data';
COMMENT ON COLUMN assessments.ai_model_used IS 'AI model used to generate this assessment';
COMMENT ON COLUMN assessments.processing_time_ms IS 'Time taken to generate assessment in milliseconds';

-- ===========================================
-- 7. VERIFICATION QUERIES
-- ===========================================
-- Use these queries to verify the setup was successful:

-- SELECT 'chatbot_conversations' as table_name, count(*) as record_count FROM chatbot_conversations
-- UNION ALL
-- SELECT 'ai_sessions' as table_name, count(*) as record_count FROM ai_sessions
-- UNION ALL
-- SELECT 'ai_conversations' as table_name, count(*) as record_count FROM ai_conversations
-- UNION ALL
-- SELECT 'assessments' as table_name, count(*) as record_count FROM assessments;

-- ===========================================
-- SETUP COMPLETE
-- ===========================================
-- All tables, indexes, and policies have been created.
--
-- Summary of created tables:
-- 1. chatbot_conversations - OpenAI Assistant chatbot interactions
-- 2. ai_sessions - AI Assistant page session management
-- 3. ai_conversations - AI Assistant page individual messages
-- 4. assessments - Generated security assessments
--
-- Next steps:
-- 1. Verify all tables exist in your Supabase dashboard
-- 2. Test the chatbot functionality
-- 3. Test AI Assistant page conversation logging
-- 4. Test assessment generation and storage
-- 5. Check admin dashboards for data visibility