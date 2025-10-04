-- =============================================================================
-- Design-Rite Platform - Complete Supabase Database Schema
-- =============================================================================
-- Project: aeorianxnxpxveoxzhov.supabase.co
-- Run this in: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new
--
-- This file creates ALL tables for:
-- 1. Creative Studio
-- 2. Spatial Studio
-- 3. Shared infrastructure
--
-- Run this ONCE if tables don't exist yet
-- =============================================================================

-- =============================================================================
-- PART 1: CREATIVE STUDIO TABLES
-- =============================================================================

-- Table 1: Creative Projects
CREATE TABLE IF NOT EXISTS creative_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT DEFAULT 'creative-studio',

  -- Project metadata
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL, -- 'blog-post', 'case-study', 'product-description', 'email-campaign'
  status TEXT DEFAULT 'draft', -- 'draft', 'in-progress', 'review', 'published', 'archived'

  -- Content settings
  target_audience TEXT,
  tone TEXT, -- 'professional', 'casual', 'technical', 'persuasive'
  industry TEXT, -- 'security', 'low-voltage', 'access-control'

  -- AI assistant tracking
  thread_id TEXT, -- OpenAI thread ID
  assistant_id TEXT, -- OpenAI assistant ID

  -- Project data
  content JSONB,
  assets JSONB,
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_creative_projects_user_id ON creative_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_creative_projects_status ON creative_projects(status);
CREATE INDEX IF NOT EXISTS idx_creative_projects_type ON creative_projects(project_type);

-- Table 2: Creative Assets
CREATE TABLE IF NOT EXISTS creative_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES creative_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT DEFAULT 'creative-studio',

  -- Asset metadata
  asset_type TEXT NOT NULL, -- 'image', 'video', 'document', 'audio'
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  -- Storage
  storage_bucket TEXT DEFAULT 'creative-assets',
  storage_path TEXT NOT NULL,
  public_url TEXT,

  -- AI metadata
  ai_description TEXT,
  ai_tags JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creative_assets_project_id ON creative_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_user_id ON creative_assets(user_id);

-- Table 3: Creative Templates
CREATE TABLE IF NOT EXISTS creative_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT DEFAULT 'creative-studio',

  -- Template metadata
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL,
  industry TEXT,

  -- Template structure
  sections JSONB NOT NULL,
  default_tone TEXT,
  default_audience TEXT,

  -- Settings
  is_public BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creative_templates_user_id ON creative_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_creative_templates_type ON creative_templates(template_type);

-- Table 4: Creative Generations
CREATE TABLE IF NOT EXISTS creative_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES creative_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT DEFAULT 'creative-studio',

  -- Generation details
  generation_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT,

  -- Request/response
  request_params JSONB,
  response_content TEXT,
  response_metadata JSONB,

  -- Status
  status TEXT DEFAULT 'pending',
  error_message TEXT,

  -- Cost tracking
  tokens_used INTEGER,
  estimated_cost DECIMAL(10, 6),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_creative_generations_project_id ON creative_generations(project_id);
CREATE INDEX IF NOT EXISTS idx_creative_generations_user_id ON creative_generations(user_id);

-- =============================================================================
-- CREATIVE STUDIO STORAGE BUCKET
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creative-assets',
  'creative-assets',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- CREATIVE STUDIO SAMPLE TEMPLATES
-- =============================================================================

INSERT INTO creative_templates (name, description, template_type, industry, sections, default_tone, default_audience, is_public, is_system)
VALUES
  (
    'Security Blog Post',
    'Standard template for security industry blog posts',
    'blog-post',
    'security',
    '[
      {"name": "Introduction", "prompt": "Write an engaging introduction about {topic}"},
      {"name": "Problem Statement", "prompt": "Describe the security challenges related to {topic}"},
      {"name": "Solution", "prompt": "Explain how {product/service} addresses these challenges"},
      {"name": "Benefits", "prompt": "List key benefits and ROI"},
      {"name": "Call to Action", "prompt": "Write a compelling CTA"}
    ]'::jsonb,
    'professional',
    'security-decision-makers',
    true,
    true
  ),
  (
    'Case Study',
    'Customer success story template',
    'case-study',
    'security',
    '[
      {"name": "Customer Overview", "prompt": "Introduce the customer and their industry"},
      {"name": "Challenge", "prompt": "Describe the security challenges they faced"},
      {"name": "Solution", "prompt": "Explain the solution implemented"},
      {"name": "Results", "prompt": "Quantify the results and improvements"},
      {"name": "Testimonial", "prompt": "Include a customer quote"}
    ]'::jsonb,
    'professional',
    'prospects',
    true,
    true
  ),
  (
    'Product Description',
    'Template for security product descriptions',
    'product-description',
    'security',
    '[
      {"name": "Overview", "prompt": "Brief product overview and value proposition"},
      {"name": "Key Features", "prompt": "List main features and capabilities"},
      {"name": "Technical Specs", "prompt": "Include technical specifications"},
      {"name": "Applications", "prompt": "Describe ideal use cases"},
      {"name": "Why Choose This", "prompt": "Differentiation from competitors"}
    ]'::jsonb,
    'technical',
    'technical-buyers',
    true,
    true
  )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- PART 2: SPATIAL STUDIO TABLES
-- =============================================================================

-- Storage bucket for floor plans (create first!)
INSERT INTO storage.buckets (id, name, public)
VALUES ('spatial-floorplans', 'spatial-floorplans', true)
ON CONFLICT (id) DO NOTHING;

-- Table 1: Spatial Projects
CREATE TABLE IF NOT EXISTS spatial_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id VARCHAR(255),
  project_name VARCHAR(255) NOT NULL,
  floorplan_url TEXT,
  threejs_model JSONB,
  dimensions JSONB,
  floor_count INTEGER DEFAULT 1,
  analysis_status VARCHAR(50) DEFAULT 'pending',
  analysis_error TEXT,
  analysis_started_at TIMESTAMP,
  analysis_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spatial_projects_customer ON spatial_projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_spatial_projects_status ON spatial_projects(analysis_status);

-- Table 2: Site Annotations
CREATE TABLE IF NOT EXISTS site_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table 3: AI Device Suggestions
CREATE TABLE IF NOT EXISTS ai_device_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  device_category VARCHAR(100),
  suggested_coordinates JSONB,
  reasoning TEXT,
  coverage_area JSONB,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_device_suggestions_project ON ai_device_suggestions(project_id);

-- Table 4: Site Walk Sessions
CREATE TABLE IF NOT EXISTS site_walk_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  operator_name VARCHAR(255),
  device_type VARCHAR(100),
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  annotation_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in_progress'
);

CREATE INDEX IF NOT EXISTS idx_site_walk_sessions_project ON site_walk_sessions(project_id);

-- Table 5: AI Analysis Debug
CREATE TABLE IF NOT EXISTS ai_analysis_debug (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES spatial_projects(id) ON DELETE CASCADE,
  operation VARCHAR(100),
  input_data JSONB,
  raw_response TEXT,
  parsed_result JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_debug_project ON ai_analysis_debug(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_debug_operation ON ai_analysis_debug(operation);

-- Table 6: Spatial Studio Uploads
CREATE TABLE IF NOT EXISTS spatial_studio_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table 7: Spatial Studio Extractions
CREATE TABLE IF NOT EXISTS spatial_studio_extractions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upload_id UUID REFERENCES spatial_studio_uploads(id) ON DELETE CASCADE,
  extraction_type VARCHAR(100),
  extracted_data JSONB,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spatial_studio_extractions_upload ON spatial_studio_extractions(upload_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on Creative Studio tables
ALTER TABLE creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_generations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Spatial Studio tables
ALTER TABLE spatial_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_device_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_walk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_debug ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_studio_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_studio_extractions ENABLE ROW LEVEL SECURITY;

-- Creative Studio Policies
CREATE POLICY "Users can view their own creative projects"
  ON creative_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create creative projects"
  ON creative_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own creative projects"
  ON creative_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own creative projects"
  ON creative_projects FOR DELETE
  USING (auth.uid() = user_id);

-- Creative Assets Policies
CREATE POLICY "Users can view their own assets"
  ON creative_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create assets"
  ON creative_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON creative_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON creative_assets FOR DELETE
  USING (auth.uid() = user_id);

-- Creative Templates Policies
CREATE POLICY "Users can view public and their own templates"
  ON creative_templates FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create templates"
  ON creative_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON creative_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON creative_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Creative Generations Policies
CREATE POLICY "Users can view their own generations"
  ON creative_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create generations"
  ON creative_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Spatial Studio Policies (Public access for now - adjust based on your needs)
CREATE POLICY "Allow public read access to spatial projects"
  ON spatial_projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public create access to spatial projects"
  ON spatial_projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to spatial projects"
  ON spatial_projects FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to spatial projects"
  ON spatial_projects FOR DELETE
  USING (true);

-- Storage Policies
CREATE POLICY "Users can upload to creative-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'creative-assets');

CREATE POLICY "Anyone can view creative-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'creative-assets');

CREATE POLICY "Users can update their own creative-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'creative-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own creative-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'creative-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Spatial floorplans storage policies
CREATE POLICY "Allow public read access to floor plans"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spatial-floorplans');

CREATE POLICY "Allow public uploads to floor plans"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'spatial-floorplans');

CREATE POLICY "Allow public updates to floor plans"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'spatial-floorplans');

CREATE POLICY "Allow public deletes from floor plans"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'spatial-floorplans');

-- =============================================================================
-- AUTO-UPDATE TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creative Studio triggers
CREATE TRIGGER update_creative_projects_updated_at
  BEFORE UPDATE ON creative_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creative_assets_updated_at
  BEFORE UPDATE ON creative_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creative_templates_updated_at
  BEFORE UPDATE ON creative_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Spatial Studio triggers
CREATE TRIGGER update_spatial_projects_updated_at
  BEFORE UPDATE ON spatial_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VERIFICATION
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Design-Rite Platform Database Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Creative Studio Tables:';
  RAISE NOTICE '  - creative_projects';
  RAISE NOTICE '  - creative_assets';
  RAISE NOTICE '  - creative_templates (3 sample templates)';
  RAISE NOTICE '  - creative_generations';
  RAISE NOTICE '  - Storage: creative-assets bucket';
  RAISE NOTICE '';
  RAISE NOTICE 'Spatial Studio Tables:';
  RAISE NOTICE '  - spatial_projects';
  RAISE NOTICE '  - site_annotations';
  RAISE NOTICE '  - ai_device_suggestions';
  RAISE NOTICE '  - site_walk_sessions';
  RAISE NOTICE '  - ai_analysis_debug';
  RAISE NOTICE '  - spatial_studio_uploads';
  RAISE NOTICE '  - spatial_studio_extractions';
  RAISE NOTICE '  - Storage: spatial-floorplans bucket';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies: Enabled on all tables';
  RAISE NOTICE 'Auto-update triggers: Configured';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

-- Query to verify tables were created
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND (table_name LIKE 'creative_%' OR table_name LIKE 'spatial_%' OR table_name LIKE 'site_%' OR table_name LIKE 'ai_%')
ORDER BY table_name;
