-- Error Logging Table for Monitoring System
-- Stores application errors with severity levels and context

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  context JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying by severity
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);

-- Index for querying by timestamp
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp DESC);

-- Index for querying critical errors quickly
CREATE INDEX IF NOT EXISTS idx_error_logs_critical ON error_logs(severity) WHERE severity = 'critical';

-- RLS Policies
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view error logs
CREATE POLICY "Super admins can view all error logs"
  ON error_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- System can insert error logs
CREATE POLICY "System can insert error logs"
  ON error_logs FOR INSERT
  WITH CHECK (true);

-- Create view for recent errors
CREATE OR REPLACE VIEW v_recent_errors AS
SELECT
  id,
  error_message,
  severity,
  context,
  timestamp
FROM error_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC
LIMIT 100;

-- Grant access to service role
GRANT ALL ON error_logs TO service_role;
GRANT SELECT ON v_recent_errors TO service_role;

COMMENT ON TABLE error_logs IS 'Application error logging for monitoring and debugging';
COMMENT ON COLUMN error_logs.severity IS 'Error severity: info, warning, error, critical';
COMMENT ON COLUMN error_logs.context IS 'Additional context (user_id, endpoint, etc.)';
