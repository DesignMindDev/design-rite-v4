-- PART 2: SPATIAL STUDIO ENHANCEMENTS
-- Run this second (after Creative Studio)

-- Enhance existing spatial_projects table with missing columns
ALTER TABLE spatial_projects ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);
ALTER TABLE spatial_projects ADD COLUMN IF NOT EXISTS floorplan_url TEXT;
ALTER TABLE spatial_projects ADD COLUMN IF NOT EXISTS threejs_model JSONB;
ALTER TABLE spatial_projects ADD COLUMN IF NOT EXISTS dimensions JSONB;

CREATE INDEX IF NOT EXISTS idx_spatial_projects_customer ON spatial_projects(customer_id);

-- Storage bucket for floor plans
INSERT INTO storage.buckets (id, name, public)
VALUES ('spatial-floorplans', 'spatial-floorplans', true)
ON CONFLICT (id) DO NOTHING;

-- Table: Site Annotations
CREATE TABLE IF NOT EXISTS site_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  annotation_type VARCHAR(50),
  gps_coordinates JSONB,
  floor_coordinates JSONB,
  voice_transcript TEXT,
  photo_url TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  device_type VARCHAR(100),
  confidence_score NUMERIC(3,2),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_site_annotations_project ON site_annotations(project_id);

-- Table: AI Device Suggestions
CREATE TABLE IF NOT EXISTS ai_device_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  device_category VARCHAR(100),
  suggested_coordinates JSONB,
  reasoning TEXT,
  coverage_area JSONB,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_device_suggestions_project ON ai_device_suggestions(project_id);

-- Table: Site Walk Sessions
CREATE TABLE IF NOT EXISTS site_walk_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  operator_name VARCHAR(255),
  device_type VARCHAR(100),
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  annotation_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress'
);

CREATE INDEX IF NOT EXISTS idx_site_walk_sessions_project ON site_walk_sessions(project_id);

-- Table: Spatial Studio Uploads
CREATE TABLE IF NOT EXISTS spatial_studio_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  storage_path TEXT,
  upload_status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spatial_studio_uploads_project ON spatial_studio_uploads(project_id);

-- Table: Spatial Studio Extractions
CREATE TABLE IF NOT EXISTS spatial_studio_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID REFERENCES spatial_studio_uploads(id) ON DELETE CASCADE,
  extraction_type VARCHAR(100),
  extracted_data JSONB,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spatial_studio_extractions_upload ON spatial_studio_extractions(upload_id);

-- Enable RLS
ALTER TABLE site_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_device_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_walk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_studio_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_studio_extractions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for now)
CREATE POLICY "Allow public read access to site annotations" ON site_annotations FOR SELECT USING (true);
CREATE POLICY "Allow public create access to site annotations" ON site_annotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to ai suggestions" ON ai_device_suggestions FOR SELECT USING (true);
CREATE POLICY "Allow public create access to ai suggestions" ON ai_device_suggestions FOR INSERT WITH CHECK (true);
