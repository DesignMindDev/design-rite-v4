-- Design-Rite Lead Generation Tables
-- Run this in your Supabase SQL editor

-- 1. Waitlist/Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  role VARCHAR(100),
  facilities_count VARCHAR(50),
  source_page VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT false,
  opted_in BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent TIMESTAMP WITH TIME ZONE
);

-- 2. Chat Interactions Table
CREATE TABLE IF NOT EXISTS chat_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  visitor_email VARCHAR(255),
  visitor_name VARCHAR(255),
  company VARCHAR(255),
  messages JSONB,
  inquiry_type VARCHAR(100),
  lead_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_to_user BOOLEAN DEFAULT false,
  follow_up_sent BOOLEAN DEFAULT false,
  notes TEXT
);

-- 3. Lead Scores Table
CREATE TABLE IF NOT EXISTS lead_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  total_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  intent_score INTEGER DEFAULT 0,
  profile_score INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_status VARCHAR(50) DEFAULT 'new',
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  inquiry_type VARCHAR(100),
  message TEXT,
  source_page VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded BOOLEAN DEFAULT false,
  response_date TIMESTAMP WITH TIME ZONE
);

-- 5. Email Campaign Tracking
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  subject_line VARCHAR(500),
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  campaign_type VARCHAR(50)
);

-- 6. Email Activity Tracking
CREATE TABLE IF NOT EXISTS email_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  campaign_id UUID REFERENCES email_campaigns(id),
  action VARCHAR(50), -- 'sent', 'opened', 'clicked', 'unsubscribed'
  link_clicked VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_waitlist_email ON waitlist_subscribers(email);
CREATE INDEX idx_waitlist_created ON waitlist_subscribers(created_at);
CREATE INDEX idx_chat_email ON chat_interactions(visitor_email);
CREATE INDEX idx_chat_session ON chat_interactions(session_id);
CREATE INDEX idx_lead_email ON lead_scores(email);
CREATE INDEX idx_lead_score ON lead_scores(total_score DESC);
CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_email_activity_email ON email_activity(email);

-- Create a view for high-value leads
CREATE OR REPLACE VIEW high_value_leads AS
SELECT 
  ls.email,
  ls.total_score,
  ls.lead_status,
  ws.company_name,
  ws.role,
  ci.visitor_name,
  ls.last_activity
FROM lead_scores ls
LEFT JOIN waitlist_subscribers ws ON ls.email = ws.email
LEFT JOIN chat_interactions ci ON ls.email = ci.visitor_email
WHERE ls.total_score >= 50
ORDER BY ls.total_score DESC;

-- Create a function to automatically update lead scores
CREATE OR REPLACE FUNCTION update_lead_score_on_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or create lead score entry
  INSERT INTO lead_scores (email, engagement_score, last_activity)
  VALUES (NEW.email, 10, NOW())
  ON CONFLICT (email) 
  DO UPDATE SET 
    engagement_score = lead_scores.engagement_score + 10,
    total_score = lead_scores.total_score + 10,
    last_activity = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for waitlist signups
CREATE TRIGGER update_score_on_waitlist
AFTER INSERT ON waitlist_subscribers
FOR EACH ROW
EXECUTE FUNCTION update_lead_score_on_activity();

-- Sample query to get your best leads
-- SELECT * FROM high_value_leads LIMIT 20;