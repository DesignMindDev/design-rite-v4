-- ADD_HARVESTER_TABLES.sql
-- Run this in Supabase SQL Editor for project: aeorianxnxpxveoxzhov
-- This adds tables needed by the LowVolt Intelligence Platform harvester

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- YOUTUBE VIDEOS TABLE
-- Stores YouTube video metadata, transcripts, and AI summaries
-- ============================================================================
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Indexes for youtube_videos
CREATE INDEX IF NOT EXISTS idx_youtube_videos_video_id ON youtube_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_manufacturer ON youtube_videos(manufacturer);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_channel_name ON youtube_videos(channel_name);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON youtube_videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_created_at ON youtube_videos(created_at DESC);

-- ============================================================================
-- REDDIT POSTS TABLE
-- Stores Reddit posts from security/low-voltage related subreddits
-- ============================================================================
CREATE TABLE IF NOT EXISTS reddit_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Indexes for reddit_posts
CREATE INDEX IF NOT EXISTS idx_reddit_posts_post_id ON reddit_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_posted_at ON reddit_posts(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_reddit_posts_relevance_score ON reddit_posts(relevance_score DESC);

-- ============================================================================
-- COMPETITOR PRICING TABLE
-- Stores scraped pricing data from competitors and distributors
-- ============================================================================
CREATE TABLE IF NOT EXISTS competitor_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Indexes for competitor_pricing
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_manufacturer ON competitor_pricing(manufacturer);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_model ON competitor_pricing(model);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_source ON competitor_pricing(source);
CREATE INDEX IF NOT EXISTS idx_competitor_pricing_scraped_at ON competitor_pricing(scraped_at DESC);

-- ============================================================================
-- MANUFACTURER MONITORING TABLE
-- Tracks when to check manufacturers for new content
-- ============================================================================
CREATE TABLE IF NOT EXISTS manufacturer_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manufacturer TEXT UNIQUE NOT NULL,
  youtube_channel_id TEXT,
  youtube_channel_name TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  video_count INTEGER DEFAULT 0,
  monitoring_enabled BOOLEAN DEFAULT true,
  check_frequency_hours INTEGER DEFAULT 24, -- How often to check for new videos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for manufacturer_monitoring
CREATE INDEX IF NOT EXISTS idx_manufacturer_monitoring_manufacturer ON manufacturer_monitoring(manufacturer);
CREATE INDEX IF NOT EXISTS idx_manufacturer_monitoring_enabled ON manufacturer_monitoring(monitoring_enabled);
CREATE INDEX IF NOT EXISTS idx_manufacturer_monitoring_last_checked ON manufacturer_monitoring(last_checked_at);

-- ============================================================================
-- WEB SCRAPING JOBS TABLE
-- Tracks scraping job status and history
-- ============================================================================
CREATE TABLE IF NOT EXISTS web_scraping_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL, -- 'youtube', 'reddit', 'pricing', 'manufacturer'
  target TEXT NOT NULL, -- URL, channel, subreddit, etc.
  status TEXT NOT NULL, -- 'pending', 'running', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  items_found INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB, -- Store job-specific data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for web_scraping_jobs
CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_job_type ON web_scraping_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_status ON web_scraping_jobs(status);
CREATE INDEX IF NOT EXISTS idx_web_scraping_jobs_created_at ON web_scraping_jobs(created_at DESC);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- All tables should be accessible only with service role key
-- ============================================================================
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_scraping_jobs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to all tables
CREATE POLICY "Service role has full access to youtube_videos"
  ON youtube_videos
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to reddit_posts"
  ON reddit_posts
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to competitor_pricing"
  ON competitor_pricing
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to manufacturer_monitoring"
  ON manufacturer_monitoring
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to web_scraping_jobs"
  ON web_scraping_jobs
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- INITIAL DATA - Seed manufacturer monitoring for common brands
-- ============================================================================
INSERT INTO manufacturer_monitoring (manufacturer, monitoring_enabled, check_frequency_hours)
VALUES
  ('Hanwha Vision', true, 24),
  ('Axis Communications', true, 24),
  ('Genetec', true, 24),
  ('Milestone Systems', true, 24),
  ('Verkada', true, 24),
  ('Avigilon', true, 24),
  ('Vicon', true, 24),
  ('Hikvision', true, 24),
  ('Dahua', true, 24),
  ('Honeywell Security', true, 24),
  ('Bosch Security', true, 24)
ON CONFLICT (manufacturer) DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Harvester tables created successfully!';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - youtube_videos';
  RAISE NOTICE '  - reddit_posts';
  RAISE NOTICE '  - competitor_pricing';
  RAISE NOTICE '  - manufacturer_monitoring';
  RAISE NOTICE '  - web_scraping_jobs';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Row Level Security enabled on all tables';
  RAISE NOTICE '📊 11 manufacturers seeded in monitoring table';
END $$;
