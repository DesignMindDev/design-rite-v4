-- Creative Studio Tables for Design-Rite v3
-- This file contains all table definitions for storing Creative Studio data

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Projects table - main container for all creative studio work
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'creative-studio', -- creative-studio, security-design, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, completed, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255), -- For future user authentication
    metadata JSONB DEFAULT '{}'::JSONB
);

-- 2. Assets table - file uploads and media assets
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    is_selected BOOLEAN DEFAULT FALSE
);

-- 3. Chat messages table - AI chat conversations
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    provider VARCHAR(50), -- anthropic, openai, google
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- 4. Content drafts table - generated content pieces
CREATE TABLE IF NOT EXISTS content_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('blog', 'social', 'script', 'case-study')),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, review, approved, published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB
);

-- 5. Research queries table - research assistant data
CREATE TABLE IF NOT EXISTS research_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('industry-trends', 'competitive-analysis', 'technical-research', 'content-ideas', 'market-analysis')),
    ai_provider VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'searching', -- searching, complete, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synthesis TEXT,
    key_insights TEXT[],
    actionable_items TEXT[],
    content_opportunities TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB
);

-- 6. Research results table - search results from research queries
CREATE TABLE IF NOT EXISTS research_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_id UUID REFERENCES research_queries(id) ON DELETE CASCADE,
    title VARCHAR(1000) NOT NULL,
    snippet TEXT,
    url VARCHAR(2000),
    source VARCHAR(500),
    published_date TIMESTAMP WITH TIME ZONE,
    relevance_score DECIMAL(3,2), -- 0.00 to 1.00
    search_provider VARCHAR(50),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- 7. Floor plan designs table - CAD/drawing data
CREATE TABLE IF NOT EXISTS floor_plan_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    drawings JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of drawing objects
    active_layers TEXT[] DEFAULT ARRAY['security-cameras', 'detection-sensors', 'access-control', 'perimeter-security', 'network-infrastructure', 'power-backup'],
    canvas_dimensions JSONB DEFAULT '{"width": 800, "height": 600}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- 8. Site plans table - security site planning data
CREATE TABLE IF NOT EXISTS site_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    site_name VARCHAR(255),
    location VARCHAR(500),
    devices JSONB DEFAULT '[]'::JSONB, -- Array of device objects with specs
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_file_type ON assets(file_type);
CREATE INDEX IF NOT EXISTS idx_assets_upload_date ON assets(upload_date);

CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

CREATE INDEX IF NOT EXISTS idx_content_drafts_project_id ON content_drafts(project_id);
CREATE INDEX IF NOT EXISTS idx_content_drafts_type ON content_drafts(type);
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status);

CREATE INDEX IF NOT EXISTS idx_research_queries_project_id ON research_queries(project_id);
CREATE INDEX IF NOT EXISTS idx_research_queries_category ON research_queries(category);
CREATE INDEX IF NOT EXISTS idx_research_queries_status ON research_queries(status);

CREATE INDEX IF NOT EXISTS idx_research_results_query_id ON research_results(query_id);
CREATE INDEX IF NOT EXISTS idx_research_results_relevance_score ON research_results(relevance_score);

CREATE INDEX IF NOT EXISTS idx_floor_plan_designs_project_id ON floor_plan_designs(project_id);
CREATE INDEX IF NOT EXISTS idx_floor_plan_designs_is_active ON floor_plan_designs(is_active);

CREATE INDEX IF NOT EXISTS idx_site_plans_project_id ON site_plans(project_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_plan_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_plans ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (can be restricted later)
-- In production, these should be more restrictive based on user authentication

-- Projects policies
CREATE POLICY "Allow all on projects" ON projects FOR ALL USING (true);

-- Assets policies
CREATE POLICY "Allow all on assets" ON assets FOR ALL USING (true);

-- Chat messages policies
CREATE POLICY "Allow all on chat_messages" ON chat_messages FOR ALL USING (true);

-- Content drafts policies
CREATE POLICY "Allow all on content_drafts" ON content_drafts FOR ALL USING (true);

-- Research queries policies
CREATE POLICY "Allow all on research_queries" ON research_queries FOR ALL USING (true);

-- Research results policies
CREATE POLICY "Allow all on research_results" ON research_results FOR ALL USING (true);

-- Floor plan designs policies
CREATE POLICY "Allow all on floor_plan_designs" ON floor_plan_designs FOR ALL USING (true);

-- Site plans policies
CREATE POLICY "Allow all on site_plans" ON site_plans FOR ALL USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_drafts_updated_at BEFORE UPDATE ON content_drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floor_plan_designs_updated_at BEFORE UPDATE ON floor_plan_designs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_plans_updated_at BEFORE UPDATE ON site_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert a default project for testing
INSERT INTO projects (name, description, type)
VALUES ('Default Creative Studio Project', 'Main workspace for creative studio activities', 'creative-studio')
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE projects IS 'Main container for all creative studio work sessions';
COMMENT ON TABLE assets IS 'File uploads and media assets for projects';
COMMENT ON TABLE chat_messages IS 'AI chat conversations within projects';
COMMENT ON TABLE content_drafts IS 'Generated content pieces (blog posts, social media, etc.)';
COMMENT ON TABLE research_queries IS 'Research assistant queries and results';
COMMENT ON TABLE research_results IS 'Individual search results from research queries';
COMMENT ON TABLE floor_plan_designs IS 'CAD/drawing data for security system designs';
COMMENT ON TABLE site_plans IS 'Security site planning and device specifications';