-- =====================================================
-- CREATE ACTIVITY LOGS TABLE FOR SECURITY AUDIT TRAIL
-- =====================================================

-- Drop table if it exists (in case it was partially created with wrong schema)
DROP TABLE IF EXISTS activity_logs CASCADE;

CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action varchar(100) NOT NULL,
  resource_type varchar(100),
  resource_id varchar(255),
  ip_address varchar(50),
  user_agent text,
  details jsonb,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_logs_success ON activity_logs(success);

-- RLS Policies for activity_logs table
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read all logs
-- (In production, you might want to restrict this more)
CREATE POLICY "Authenticated users can view logs" ON activity_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only service role can insert logs (prevent tampering)
-- This ensures logs can't be forged by users
CREATE POLICY "Service role can insert logs" ON activity_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service role can delete logs (prevent tampering)
CREATE POLICY "Service role can delete logs" ON activity_logs
  FOR DELETE
  TO service_role
  USING (true);

-- Verify table created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'activity_logs') as column_count
FROM information_schema.tables
WHERE table_name = 'activity_logs';

-- =====================================================
-- EXPECTED RESULT:
-- =====================================================
-- table_name    | column_count
-- --------------|-------------
-- activity_logs | 11
-- =====================================================
