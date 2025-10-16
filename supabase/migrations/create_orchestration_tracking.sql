-- Super Agent Orchestration Tracking Table
-- This table logs all orchestration tasks handled by the Super Agent

-- Create orchestration_tracking table
CREATE TABLE IF NOT EXISTS orchestration_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_description TEXT NOT NULL,
  tools_used TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  result JSONB DEFAULT '{}',
  execution_time_ms INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orchestration_tracking_status ON orchestration_tracking(status);
CREATE INDEX IF NOT EXISTS idx_orchestration_tracking_user_id ON orchestration_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_tracking_created_at ON orchestration_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orchestration_tracking_tools_used ON orchestration_tracking USING GIN(tools_used);

-- Enable Row Level Security
ALTER TABLE orchestration_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Super Admins can see all orchestration records
CREATE POLICY "Super admins can view all orchestration records"
ON orchestration_tracking
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- Admins can see all orchestration records
CREATE POLICY "Admins can view all orchestration records"
ON orchestration_tracking
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Users can only see their own orchestration records
CREATE POLICY "Users can view their own orchestration records"
ON orchestration_tracking
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Super Admins can insert orchestration records
CREATE POLICY "Super admins can insert orchestration records"
ON orchestration_tracking
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- Admins can insert orchestration records
CREATE POLICY "Admins can insert orchestration records"
ON orchestration_tracking
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Super Admins can update orchestration records
CREATE POLICY "Super admins can update orchestration records"
ON orchestration_tracking
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orchestration_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orchestration_tracking_updated_at_trigger
BEFORE UPDATE ON orchestration_tracking
FOR EACH ROW
EXECUTE FUNCTION update_orchestration_tracking_updated_at();

-- Comments for documentation
COMMENT ON TABLE orchestration_tracking IS 'Logs all Super Agent orchestration tasks and their outcomes';
COMMENT ON COLUMN orchestration_tracking.task_description IS 'Human-readable description of what the orchestration task is';
COMMENT ON COLUMN orchestration_tracking.tools_used IS 'Array of tool names used during orchestration';
COMMENT ON COLUMN orchestration_tracking.status IS 'Status: pending, processing, completed, failed';
COMMENT ON COLUMN orchestration_tracking.result IS 'JSON result from the orchestration task';
COMMENT ON COLUMN orchestration_tracking.execution_time_ms IS 'Total execution time in milliseconds';
COMMENT ON COLUMN orchestration_tracking.user_id IS 'User who initiated the orchestration (nullable for system tasks)';
