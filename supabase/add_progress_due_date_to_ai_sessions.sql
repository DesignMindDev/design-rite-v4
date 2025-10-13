-- Add progress tracking and due date columns to ai_sessions table
-- Migration: Add project management features
-- Date: 2025-10-13

-- Add progress column (0-100%)
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0
CHECK (progress >= 0 AND progress <= 100);

-- Add due_date column
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- Add tool column if it doesn't exist (needed for project type identification)
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS tool TEXT;

-- Add user_id column if it doesn't exist (needed for user-specific queries)
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add status column if it doesn't exist (needed for filtering in-progress projects)
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Add data column if it doesn't exist (JSONB for storing project data)
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_sessions_due_date
  ON ai_sessions(due_date)
  WHERE due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ai_sessions_progress
  ON ai_sessions(progress);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_id
  ON ai_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_status
  ON ai_sessions(status);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_tool
  ON ai_sessions(tool);

-- Add comment for documentation
COMMENT ON COLUMN ai_sessions.progress IS 'Project completion percentage (0-100)';
COMMENT ON COLUMN ai_sessions.due_date IS 'Project due date for priority sorting';
COMMENT ON COLUMN ai_sessions.tool IS 'Tool/workflow used: security-estimate, ai-discovery, or ai-assistant';
COMMENT ON COLUMN ai_sessions.user_id IS 'Reference to auth.users for user-specific projects';
COMMENT ON COLUMN ai_sessions.status IS 'Project status: draft, in_progress, completed, archived';
COMMENT ON COLUMN ai_sessions.data IS 'Project data payload in JSON format';

-- Update RLS policies to include new columns (if needed)
-- Note: Existing "Allow all operations" policy should cover these columns
-- If you want stricter policies, uncomment and modify:
-- DROP POLICY IF EXISTS "Allow all operations on ai_sessions" ON ai_sessions;
-- CREATE POLICY "Users can manage their own sessions" ON ai_sessions
--   FOR ALL USING (auth.uid() = user_id);
