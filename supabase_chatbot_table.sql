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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_thread_id ON chatbot_conversations(thread_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_provider ON chatbot_conversations(provider);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for service role" ON chatbot_conversations
  FOR ALL
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE chatbot_conversations IS 'Stores all chatbot conversations for analytics and support';
COMMENT ON COLUMN chatbot_conversations.thread_id IS 'OpenAI thread ID for conversation tracking';
COMMENT ON COLUMN chatbot_conversations.provider IS 'AI provider used (openai_assistant, fallback, etc.)';
COMMENT ON COLUMN chatbot_conversations.assistant_id IS 'OpenAI Assistant ID used for this conversation';
COMMENT ON COLUMN chatbot_conversations.session_data IS 'Additional metadata about the conversation session';