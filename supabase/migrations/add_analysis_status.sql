-- Migration: Add analysis status tracking to spatial_projects
-- Run this if you already created spatial_projects table without these fields

-- Add new columns
ALTER TABLE spatial_projects
ADD COLUMN IF NOT EXISTS analysis_status varchar(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS analysis_error text,
ADD COLUMN IF NOT EXISTS analysis_started_at timestamp,
ADD COLUMN IF NOT EXISTS analysis_completed_at timestamp;

-- Create debug logging table
CREATE TABLE IF NOT EXISTS ai_analysis_debug (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES spatial_projects(id) ON DELETE CASCADE,
  operation varchar(100),
  input_data jsonb,
  raw_response text,
  parsed_result jsonb,
  error_message text,
  execution_time_ms integer,
  created_at timestamp DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_spatial_projects_status ON spatial_projects(analysis_status);
CREATE INDEX IF NOT EXISTS idx_ai_debug_project ON ai_analysis_debug(project_id);

-- Enable RLS
ALTER TABLE ai_analysis_debug ENABLE ROW LEVEL SECURITY;

-- Update existing projects to 'completed' if they have threejs_model
UPDATE spatial_projects
SET analysis_status = 'completed',
    analysis_completed_at = created_at
WHERE threejs_model IS NOT NULL
  AND analysis_status = 'pending';
