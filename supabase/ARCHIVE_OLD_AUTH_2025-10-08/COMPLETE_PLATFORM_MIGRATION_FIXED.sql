-- COMPLETE DESIGN-RITE PLATFORM MIGRATION (FIXED)
-- Project: aeorianxnxpxveoxzhov.supabase.co
-- Run this in: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new
--
-- This script creates ALL tables for the complete platform:
-- 1. Core Platform (already exists from FRESH_START)
-- 2. Creative Studio (new)
-- 3. Spatial Studio (enhance existing tables)
-- 4. Insight Studio (new)
--
-- This version handles existing tables gracefully

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PART 1: CREATIVE STUDIO TABLES (NEW)
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

-- CREATIVE STUDIO STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creative-assets',
  'creative-assets',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- CREATIVE STUDIO SAMPLE TEMPLATES
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
-- PART 2: SPATIAL STUDIO TABLES (ENHANCE EXISTING)
-- =============================================================================

-- Add missing columns to existing spatial_projects table
DO $$
BEGIN
  -- Add customer_id if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spatial_projects' AND column_name = 'customer_id') THEN
    ALTER TABLE spatial_projects ADD COLUMN customer_id VARCHAR(255);
  END IF;

  -- Add floorplan_url if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spatial_projects' AND column_name = 'floorplan_url') THEN
    ALTER TABLE spatial_projects ADD COLUMN floorplan_url TEXT;
  END IF;

  -- Add threejs_model if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spatial_projects' AND column_name = 'threejs_model') THEN
    ALTER TABLE spatial_projects ADD COLUMN threejs_model JSONB;
  END IF;

  -- Add dimensions if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'spatial_projects' AND column_name = 'dimensions') THEN
    ALTER TABLE spatial_projects ADD COLUMN dimensions JSONB;
  END IF;
END $$;

-- Create index on customer_id if not exists
CREATE INDEX IF NOT EXISTS idx_spatial_projects_customer ON spatial_projects(customer_id);

-- Storage bucket for floor plans
INSERT INTO storage.buckets (id, name, public)
VALUES ('spatial-floorplans', 'spatial-floorplans', true)
ON CONFLICT (id) DO NOTHING;

-- Table: Site Annotations (NEW)
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

-- Table: AI Device Suggestions (NEW)
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

-- Table: Site Walk Sessions (NEW)
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

-- Enhance existing ai_analysis_debug table if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_analysis_debug' AND column_name = 'project_id') THEN
    -- If table doesn't have project_id, it's using floorplan_id - that's fine, leave it
    NULL;
  END IF;
END $$;

-- Table: Spatial Studio Uploads (NEW)
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

-- Table: Spatial Studio Extractions (NEW)
CREATE TABLE IF NOT EXISTS spatial_studio_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID REFERENCES spatial_studio_uploads(id) ON DELETE CASCADE,
  extraction_type VARCHAR(100),
  extracted_data JSONB,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spatial_studio_extractions_upload ON spatial_studio_extractions(upload_id);

-- =============================================================================
-- PART 3: INSIGHT STUDIO (HARVESTER) TABLES (NEW)
-- =============================================================================

-- YOUTUBE VIDEOS TABLE
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT UNIQUE NOT NULL,
  title TEXT,
  channel_name TEXT,
  channel_id TEXT,
  manufacturer TEXT,
  description TEXT,
  duration INTEGER, -- seconds
  view_count INTEGER,
  like_count INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  transcript TEXT,
  summary TEXT,
  ai_analysis JSONB, -- Store AI-generated insights
  tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_youtube_videos_video_id ON youtube_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_manufacturer ON youtube_videos(manufacturer);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_channel_name ON youtube_videos(channel_name);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON youtube_videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_created_at ON youtube_videos(created_at DESC);

-- REDDIT POSTS TABLE
CREATE TABLE IF NOT EXISTS reddit_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subreddit TEXT NOT NULL,
  author TEXT,
  content TEXT,
  url TEXT,
  score INTEGER,
  num_comments INTEGER,
  posted_at TIMESTAMP WITH TIME ZONE,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sentiment TEXT, -- positive, negative, neutral
  relevance_score INTEGER, -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reddit_posts_post_id ON reddit_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_posted_at ON reddit_posts(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_relevance_score ON reddit_posts(relevance_score DESC);

-- COMPETITOR PRICING TABLE
CREATE TABLE IF NOT EXISTS competitor_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  product_name TEXT,
  price DECIMAL(10,2),
  msrp DECIMAL(10,2),
  dealer_cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  source TEXT NOT NULL, -- CDW, ADI, etc.
  source_url TEXT,
  in_stock BOOLEAN,
  lead_time_days INTEGER,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manufacturer, model, source) -- Prevent duplicate entries per source
);

CREATE INDEX IF NOT EXISTS idx_competitor_pricing_manufacturer ON competitor_pricing(manufacturer);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_model ON competitor_pricing(model);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_source ON competitor_pricing(source);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_scraped_at ON competitor_pricing(scraped_at DESC);

-- MANUFACTURER MONITORING TABLE
CREATE TABLE IF NOT EXISTS manufacturer_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer TEXT UNIQUE NOT NULL,
  youtube_channel_id TEXT,
  youtube_channel_name TEXT,
  last_checked TIMESTAMP WITH TIME ZONE,
  videos_found INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manufacturer_monitoring_enabled ON manufacturer_monitoring(enabled);
CREATE INDEX IF NOT EXISTS idx_manufacturer_monitoring_last_checked ON manufacturer_monitoring(last_checked);

-- WEB SCRAPING JOBS TABLE
CREATE TABLE IF NOT EXISTS web_scraping_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL, -- 'youtube', 'reddit', 'pricing'
  target_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  items_found INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_status ON web_scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_job_type ON web_scraping_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_created_at ON web_scraping_jobs(created_at DESC);

-- SEED MANUFACTURER MONITORING DATA
INSERT INTO manufacturer_monitoring (manufacturer, youtube_channel_name, enabled) VALUES
  ('Axis Communications', 'Axis Communications', true),
  ('Hanwha Vision', 'Hanwha Vision America', true),
  ('Hikvision', 'Hikvision USA', true),
  ('Dahua', 'Dahua Technology USA', true),
  ('Verkada', 'Verkada', true),
  ('Avigilon', 'Avigilon', true),
  ('Bosch Security', 'Bosch Security and Safety Systems', true),
  ('Genetec', 'Genetec', true),
  ('Milestone Systems', 'Milestone Systems', true),
  ('Eagle Eye Networks', 'Eagle Eye Networks', true),
  ('Ubiquiti', 'Ubiquiti', true)
ON CONFLICT (manufacturer) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on Creative Studio tables
ALTER TABLE creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_generations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on NEW Spatial Studio tables
ALTER TABLE site_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_device_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_walk_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_studio_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_studio_extractions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Insight Studio tables
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_scraping_jobs ENABLE ROW LEVEL SECURITY;

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

-- Spatial Studio Policies (Public access for now - spatial_projects already has policies from FRESH_START)
CREATE POLICY "Allow public read access to site annotations"
  ON site_annotations FOR SELECT
  USING (true);

CREATE POLICY "Allow public create access to site annotations"
  ON site_annotations FOR INSERT
  WITH CHECK (true);

-- Insight Studio Policies (Admin-only for harvested data)
CREATE POLICY "Admins can view youtube videos" ON youtube_videos FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'manager'))
);
CREATE POLICY "Admins can manage youtube videos" ON youtube_videos FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view reddit posts" ON reddit_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'manager'))
);
CREATE POLICY "Admins can manage reddit posts" ON reddit_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view competitor pricing" ON competitor_pricing FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'manager'))
);
CREATE POLICY "Admins can manage competitor pricing" ON competitor_pricing FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view manufacturer monitoring" ON manufacturer_monitoring FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can manage manufacturer monitoring" ON manufacturer_monitoring FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view scraping jobs" ON web_scraping_jobs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can manage scraping jobs" ON web_scraping_jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

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

-- Spatial floorplans storage policies (if not already created by FRESH_START)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Allow public read access to floor plans'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public read access to floor plans"
      ON storage.objects FOR SELECT
      USING (bucket_id = ''spatial-floorplans'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND policyname = 'Allow public uploads to floor plans'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public uploads to floor plans"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = ''spatial-floorplans'')';
  END IF;
END $$;

-- =============================================================================
-- AUTO-UPDATE TRIGGERS
-- =============================================================================

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

-- Insight Studio triggers
CREATE TRIGGER update_youtube_videos_updated_at
  BEFORE UPDATE ON youtube_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_pricing_updated_at
  BEFORE UPDATE ON competitor_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturer_monitoring_updated_at
  BEFORE UPDATE ON manufacturer_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VERIFICATION
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Design-Rite Complete Platform Migration Done!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Creative Studio Tables: 4';
  RAISE NOTICE '  - creative_projects';
  RAISE NOTICE '  - creative_assets';
  RAISE NOTICE '  - creative_templates (3 sample templates)';
  RAISE NOTICE '  - creative_generations';
  RAISE NOTICE '  - Storage: creative-assets bucket';
  RAISE NOTICE '';
  RAISE NOTICE 'Spatial Studio Tables: 6 new + 1 enhanced';
  RAISE NOTICE '  - spatial_projects (enhanced with new columns)';
  RAISE NOTICE '  - site_annotations';
  RAISE NOTICE '  - ai_device_suggestions';
  RAISE NOTICE '  - site_walk_sessions';
  RAISE NOTICE '  - spatial_studio_uploads';
  RAISE NOTICE '  - spatial_studio_extractions';
  RAISE NOTICE '  - Storage: spatial-floorplans bucket';
  RAISE NOTICE '';
  RAISE NOTICE 'Insight Studio Tables: 5';
  RAISE NOTICE '  - youtube_videos';
  RAISE NOTICE '  - reddit_posts';
  RAISE NOTICE '  - competitor_pricing';
  RAISE NOTICE '  - manufacturer_monitoring (11 manufacturers)';
  RAISE NOTICE '  - web_scraping_jobs';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies: Enabled on all tables';
  RAISE NOTICE 'Auto-update triggers: Configured';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

-- Query to verify all tables were created
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
  table_name LIKE 'creative_%'
  OR table_name LIKE 'spatial_%'
  OR table_name LIKE 'site_%'
  OR table_name LIKE 'ai_%'
  OR table_name LIKE 'youtube_%'
  OR table_name LIKE 'reddit_%'
  OR table_name LIKE 'competitor_%'
  OR table_name LIKE 'manufacturer_%'
  OR table_name LIKE 'web_%'
)
ORDER BY table_name;
