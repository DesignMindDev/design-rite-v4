-- PART 3: INSIGHT STUDIO (HARVESTER) TABLES
-- Run this third (after Creative + Spatial)

-- YouTube Videos
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT UNIQUE NOT NULL,
  title TEXT,
  channel_name TEXT,
  channel_id TEXT,
  manufacturer TEXT,
  description TEXT,
  duration INTEGER,
  view_count INTEGER,
  like_count INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  transcript TEXT,
  summary TEXT,
  ai_analysis JSONB,
  tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_youtube_videos_video_id ON youtube_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_manufacturer ON youtube_videos(manufacturer);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_channel_name ON youtube_videos(channel_name);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON youtube_videos(published_at DESC);

-- Reddit Posts
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
  sentiment TEXT,
  relevance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reddit_posts_post_id ON reddit_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_posted_at ON reddit_posts(posted_at DESC);

-- Competitor Pricing
CREATE TABLE IF NOT EXISTS competitor_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  product_name TEXT,
  price DECIMAL(10,2),
  msrp DECIMAL(10,2),
  dealer_cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  source TEXT NOT NULL,
  source_url TEXT,
  in_stock BOOLEAN,
  lead_time_days INTEGER,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(manufacturer, model, source)
);

CREATE INDEX IF NOT EXISTS idx_competitor_pricing_manufacturer ON competitor_pricing(manufacturer);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_model ON competitor_pricing(model);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_source ON competitor_pricing(source);

-- Manufacturer Monitoring
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

-- Web Scraping Jobs
CREATE TABLE IF NOT EXISTS web_scraping_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  target_url TEXT,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  items_found INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_status ON web_scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_job_type ON web_scraping_jobs(job_type);

-- Seed manufacturer data
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

-- Enable RLS
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_scraping_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin-only access)
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

-- Triggers
CREATE TRIGGER update_youtube_videos_updated_at BEFORE UPDATE ON youtube_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitor_pricing_updated_at BEFORE UPDATE ON competitor_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_manufacturer_monitoring_updated_at BEFORE UPDATE ON manufacturer_monitoring FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
