-- Spatial Studio - 3D Floor Plan Intelligence Tables
-- Run this in Supabase SQL Editor

-- Table 1: Store 3D floor plan projects
CREATE TABLE IF NOT EXISTS spatial_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id varchar(255),
  project_name varchar(255) NOT NULL,
  floorplan_url text,              -- Original 2D file URL
  threejs_model jsonb,             -- 3D model data (JSON)
  dimensions jsonb,                -- {width, height, scale_factor}
  floor_count integer DEFAULT 1,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Table 2: Store site walk annotations
CREATE TABLE IF NOT EXISTS site_annotations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES spatial_projects(id) ON DELETE CASCADE,
  annotation_type varchar(50),     -- 'camera', 'access_point', 'door', 'threat'
  gps_coordinates jsonb,           -- {lat, lng, altitude}
  floor_coordinates jsonb,         -- {x, y, z} in 3D model space
  voice_transcript text,
  photo_url text,
  timestamp timestamp DEFAULT now(),
  device_type varchar(100),
  confidence_score numeric(3,2),
  metadata jsonb                   -- Additional context
);

-- Table 3: AI device placement suggestions
CREATE TABLE IF NOT EXISTS ai_device_suggestions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES spatial_projects(id) ON DELETE CASCADE,
  device_category varchar(100),    -- 'Fixed Camera', 'PTZ', 'Access Control'
  suggested_coordinates jsonb,     -- {x, y, z}
  reasoning text,
  coverage_area jsonb,             -- Polygon array for coverage zone
  confidence_score numeric(3,2),
  created_at timestamp DEFAULT now()
);

-- Table 4: Site walk sessions (for tracking field visits)
CREATE TABLE IF NOT EXISTS site_walk_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES spatial_projects(id) ON DELETE CASCADE,
  operator_name varchar(255),
  device_type varchar(100),        -- 'iPhone 15 Pro', 'Meta Glasses', etc.
  start_time timestamp DEFAULT now(),
  end_time timestamp,
  annotation_count integer DEFAULT 0,
  status varchar(50) DEFAULT 'in_progress'
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_spatial_projects_customer ON spatial_projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_site_annotations_project ON site_annotations(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_project ON ai_device_suggestions(project_id);
CREATE INDEX IF NOT EXISTS idx_site_walks_project ON site_walk_sessions(project_id);

-- Enable Row Level Security (optional - configure based on auth needs)
ALTER TABLE spatial_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_device_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_walk_sessions ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for floor plan files
INSERT INTO storage.buckets (id, name, public)
VALUES ('spatial-floorplans', 'spatial-floorplans', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow public read access to floor plans"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spatial-floorplans');

CREATE POLICY "Allow authenticated uploads to floor plans"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'spatial-floorplans');
