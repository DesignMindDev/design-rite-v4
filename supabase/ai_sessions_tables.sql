-- AI Sessions and Conversations Tables
-- Run this in your Supabase SQL editor

-- Table for AI chat sessions
CREATE TABLE IF NOT EXISTS ai_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_hash TEXT NOT NULL,
  session_name TEXT NOT NULL,
  ai_provider TEXT DEFAULT 'simulated',
  assessment_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,

  -- Indexes for performance
  INDEX idx_ai_sessions_user_hash (user_hash),
  INDEX idx_ai_sessions_session_id (session_id),
  INDEX idx_ai_sessions_last_activity (last_activity)
);

-- Table for individual conversation messages
CREATE TABLE IF NOT EXISTS ai_conversations (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES ai_sessions(session_id) ON DELETE CASCADE,
  user_hash TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  ai_provider TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  assessment_data JSONB,
  metadata JSONB DEFAULT '{}',

  -- Indexes for performance
  INDEX idx_ai_conversations_session_id (session_id),
  INDEX idx_ai_conversations_user_hash (user_hash),
  INDEX idx_ai_conversations_timestamp (timestamp)
);

-- Enable Row Level Security
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now, you can restrict based on your needs)
CREATE POLICY "Allow all operations on ai_sessions" ON ai_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on ai_conversations" ON ai_conversations
  FOR ALL USING (true);

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