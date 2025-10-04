-- ADD HARVESTER TABLES TO SUBSCRIPTION PROJECT
-- Run this in aeorianxnxpxveoxzhov AFTER the fresh start script

-- YouTube Videos (Marketing content)
CREATE TABLE IF NOT EXISTS youtube_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  channel_name text,
  published_at timestamptz,
  view_count integer,
  like_count integer,
  comment_count integer,
  thumbnail_url text,
  url text,
  tags text[],
  category text,
  relevant_products text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_youtube_videos_video_id ON youtube_videos(video_id);
CREATE INDEX idx_youtube_videos_published_at ON youtube_videos(published_at DESC);

-- Reddit Posts (Marketing/community content)
CREATE TABLE IF NOT EXISTS reddit_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id text UNIQUE NOT NULL,
  subreddit text NOT NULL,
  title text NOT NULL,
  content text,
  author text,
  posted_at timestamptz,
  upvotes integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  url text,
  flair text,
  relevant_products text[],
  sentiment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reddit_posts_post_id ON reddit_posts(post_id);
CREATE INDEX idx_reddit_posts_subreddit ON reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_posted_at ON reddit_posts(posted_at DESC);

-- Competitor Pricing
CREATE TABLE IF NOT EXISTS competitor_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  competitor_name text NOT NULL,
  competitor_price numeric(10,2) NOT NULL,
  our_price numeric(10,2),
  price_difference numeric(10,2),
  price_difference_percentage numeric(5,2),
  source_url text,
  last_checked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_competitor_pricing_product_id ON competitor_pricing(product_id);
CREATE INDEX idx_competitor_pricing_competitor_name ON competitor_pricing(competitor_name);
CREATE INDEX idx_competitor_pricing_last_checked ON competitor_pricing(last_checked DESC);

-- Enable RLS
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read for now, can restrict later)
CREATE POLICY "Public can view youtube videos" ON youtube_videos FOR SELECT USING (true);
CREATE POLICY "Admins can manage youtube videos" ON youtube_videos FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Public can view reddit posts" ON reddit_posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage reddit posts" ON reddit_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view competitor pricing" ON competitor_pricing FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'manager'))
);
CREATE POLICY "Admins can manage competitor pricing" ON competitor_pricing FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Done! Now you can import the harvester data
