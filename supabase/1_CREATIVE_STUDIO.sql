-- PART 1: CREATIVE STUDIO TABLES
-- Run this first

-- Create update trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table 1: Creative Projects
CREATE TABLE IF NOT EXISTS creative_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT DEFAULT 'creative-studio',
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  target_audience TEXT,
  tone TEXT,
  industry TEXT,
  thread_id TEXT,
  assistant_id TEXT,
  content JSONB,
  assets JSONB,
  metadata JSONB,
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
  asset_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_bucket TEXT DEFAULT 'creative-assets',
  storage_path TEXT NOT NULL,
  public_url TEXT,
  ai_description TEXT,
  ai_tags JSONB,
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
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL,
  industry TEXT,
  sections JSONB NOT NULL,
  default_tone TEXT,
  default_audience TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
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
  generation_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT,
  request_params JSONB,
  response_content TEXT,
  response_metadata JSONB,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  tokens_used INTEGER,
  estimated_cost DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_creative_generations_project_id ON creative_generations(project_id);
CREATE INDEX IF NOT EXISTS idx_creative_generations_user_id ON creative_generations(user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creative-assets',
  'creative-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Sample templates
INSERT INTO creative_templates (name, description, template_type, industry, sections, default_tone, default_audience, is_public, is_system)
VALUES
  (
    'Security Blog Post',
    'Standard template for security industry blog posts',
    'blog-post',
    'security',
    '[{"name": "Introduction", "prompt": "Write an engaging introduction about {topic}"},{"name": "Problem Statement", "prompt": "Describe the security challenges related to {topic}"},{"name": "Solution", "prompt": "Explain how {product/service} addresses these challenges"},{"name": "Benefits", "prompt": "List key benefits and ROI"},{"name": "Call to Action", "prompt": "Write a compelling CTA"}]'::jsonb,
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
    '[{"name": "Customer Overview", "prompt": "Introduce the customer and their industry"},{"name": "Challenge", "prompt": "Describe the security challenges they faced"},{"name": "Solution", "prompt": "Explain the solution implemented"},{"name": "Results", "prompt": "Quantify the results and improvements"},{"name": "Testimonial", "prompt": "Include a customer quote"}]'::jsonb,
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
    '[{"name": "Overview", "prompt": "Brief product overview and value proposition"},{"name": "Key Features", "prompt": "List main features and capabilities"},{"name": "Technical Specs", "prompt": "Include technical specifications"},{"name": "Applications", "prompt": "Describe ideal use cases"},{"name": "Why Choose This", "prompt": "Differentiation from competitors"}]'::jsonb,
    'technical',
    'technical-buyers',
    true,
    true
  )
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own creative projects" ON creative_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create creative projects" ON creative_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own creative projects" ON creative_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own creative projects" ON creative_projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own assets" ON creative_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create assets" ON creative_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assets" ON creative_assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assets" ON creative_assets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public and their own templates" ON creative_templates FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create templates" ON creative_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates" ON creative_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates" ON creative_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own generations" ON creative_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create generations" ON creative_generations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_creative_projects_updated_at BEFORE UPDATE ON creative_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creative_assets_updated_at BEFORE UPDATE ON creative_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creative_templates_updated_at BEFORE UPDATE ON creative_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
