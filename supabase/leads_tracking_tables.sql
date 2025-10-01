-- =============================================
-- Design-Rite Leads & Web Activity Tracking
-- Complete journey from first visit to conversion
-- =============================================

-- =============================================
-- LEADS TABLE
-- Core lead information and scoring
-- =============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Identity
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(255),

    -- Lead Source & Attribution
    lead_source VARCHAR(100), -- organic, linkedin, google_ads, referral, direct, etc.
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    referrer_url TEXT,
    landing_page TEXT,

    -- Lead Scoring
    lead_score INTEGER DEFAULT 0,
    lead_grade VARCHAR(10) DEFAULT 'C', -- A (90-100), B (70-89), C (50-69), D (0-49)
    lead_status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, demo_scheduled, demo_completed, trial, customer, lost

    -- Engagement Metrics
    page_views INTEGER DEFAULT 0,
    session_count INTEGER DEFAULT 0,
    time_on_site INTEGER DEFAULT 0, -- seconds
    last_activity_at TIMESTAMP WITH TIME ZONE,
    first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Tool Usage
    used_quick_estimate BOOLEAN DEFAULT FALSE,
    used_ai_assessment BOOLEAN DEFAULT FALSE,
    used_system_surveyor BOOLEAN DEFAULT FALSE,
    quotes_generated INTEGER DEFAULT 0,

    -- Demo Booking
    demo_booked BOOLEAN DEFAULT FALSE,
    demo_booking_id UUID REFERENCES demo_bookings(id),
    demo_completed BOOLEAN DEFAULT FALSE,

    -- Conversion Tracking
    trial_started BOOLEAN DEFAULT FALSE,
    trial_started_at TIMESTAMP WITH TIME ZONE,
    converted_to_customer BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMP WITH TIME ZONE,
    mrr DECIMAL(10,2), -- Monthly Recurring Revenue if customer

    -- Enrichment Data
    company_size VARCHAR(100),
    industry VARCHAR(255),
    location VARCHAR(255),

    -- Notes & Tags
    notes TEXT,
    tags TEXT[], -- Array of tags like ['high-value', 'security-integrator', 'follow-up-needed']

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- WEB ACTIVITY EVENTS TABLE
-- Track every interaction for journey mapping
-- =============================================
CREATE TABLE IF NOT EXISTS web_activity_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

    -- Lead Association
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- Browser session ID

    -- Event Details
    event_type VARCHAR(100) NOT NULL, -- page_view, tool_usage, form_submit, demo_booked, etc.
    event_category VARCHAR(100), -- navigation, engagement, conversion
    event_action VARCHAR(255), -- clicked_estimate, completed_assessment, downloaded_quote
    event_label VARCHAR(255), -- Additional context

    -- Page Context
    page_url TEXT,
    page_title VARCHAR(255),
    referrer_url TEXT,

    -- Tool-Specific Data
    tool_name VARCHAR(100), -- quick_estimate, ai_assessment, system_surveyor
    tool_data JSONB, -- Store tool-specific data like estimate results

    -- Technical Details
    user_agent TEXT,
    ip_address VARCHAR(45),
    device_type VARCHAR(50), -- desktop, mobile, tablet
    browser VARCHAR(100),
    os VARCHAR(100),

    -- Engagement Metrics
    time_on_page INTEGER, -- seconds
    scroll_depth INTEGER, -- percentage 0-100

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LEAD NOTES TABLE
-- Track all interactions and notes
-- =============================================
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,

    note_type VARCHAR(50) DEFAULT 'manual', -- manual, system, email, call, demo
    note TEXT NOT NULL,

    created_by VARCHAR(255), -- User who created the note
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for Performance
-- =============================================

-- Leads table indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_grade ON leads(lead_grade);
CREATE INDEX IF NOT EXISTS idx_leads_last_activity ON leads(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_demo_booked ON leads(demo_booked) WHERE demo_booked = true;
CREATE INDEX IF NOT EXISTS idx_leads_trial_started ON leads(trial_started) WHERE trial_started = true;

-- Web activity events indexes
CREATE INDEX IF NOT EXISTS idx_web_activity_lead_id ON web_activity_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_web_activity_session_id ON web_activity_events(session_id);
CREATE INDEX IF NOT EXISTS idx_web_activity_event_type ON web_activity_events(event_type);
CREATE INDEX IF NOT EXISTS idx_web_activity_created_at ON web_activity_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_activity_tool_name ON web_activity_events(tool_name) WHERE tool_name IS NOT NULL;

-- Lead notes indexes
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_at ON lead_notes(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

-- Leads policies
CREATE POLICY "Enable read access for authenticated users" ON leads
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for service role" ON leads
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON leads
    FOR UPDATE
    USING (true);

-- Web activity events policies
CREATE POLICY "Enable read access for authenticated users" ON web_activity_events
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for service role" ON web_activity_events
    FOR INSERT
    WITH CHECK (true);

-- Lead notes policies
CREATE POLICY "Enable read access for authenticated users" ON lead_notes
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for service role" ON lead_notes
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON lead_notes
    FOR UPDATE
    USING (true);

-- =============================================
-- FUNCTIONS for Automatic Lead Scoring
-- =============================================

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_record leads)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Base engagement scoring
    score := score + (lead_record.page_views * 2); -- 2 points per page view
    score := score + (lead_record.session_count * 5); -- 5 points per session
    score := score + (lead_record.quotes_generated * 20); -- 20 points per quote

    -- Tool usage scoring
    IF lead_record.used_quick_estimate THEN score := score + 10; END IF;
    IF lead_record.used_ai_assessment THEN score := score + 25; END IF;
    IF lead_record.used_system_surveyor THEN score := score + 30; END IF;

    -- Demo and conversion scoring
    IF lead_record.demo_booked THEN score := score + 30; END IF;
    IF lead_record.demo_completed THEN score := score + 40; END IF;
    IF lead_record.trial_started THEN score := score + 50; END IF;

    -- Cap score at 100
    IF score > 100 THEN score := 100; END IF;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate lead grade
CREATE OR REPLACE FUNCTION calculate_lead_grade(score INTEGER)
RETURNS VARCHAR AS $$
BEGIN
    IF score >= 90 THEN RETURN 'A';
    ELSIF score >= 70 THEN RETURN 'B';
    ELSIF score >= 50 THEN RETURN 'C';
    ELSE RETURN 'D';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update lead score and grade
CREATE OR REPLACE FUNCTION update_lead_scoring()
RETURNS TRIGGER AS $$
BEGIN
    NEW.lead_score := calculate_lead_score(NEW);
    NEW.lead_grade := calculate_lead_grade(NEW.lead_score);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lead_scoring
    BEFORE INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_scoring();

-- =============================================
-- HELPFUL COMMENTS
-- =============================================

COMMENT ON TABLE leads IS 'Core lead information with scoring and conversion tracking';
COMMENT ON TABLE web_activity_events IS 'Detailed web activity events for journey mapping';
COMMENT ON TABLE lead_notes IS 'Manual and system notes for each lead';

COMMENT ON COLUMN leads.lead_score IS 'Auto-calculated score 0-100 based on engagement and behavior';
COMMENT ON COLUMN leads.lead_grade IS 'A (90-100), B (70-89), C (50-69), D (0-49)';
COMMENT ON COLUMN leads.lead_status IS 'new, contacted, qualified, demo_scheduled, demo_completed, trial, customer, lost';
COMMENT ON COLUMN leads.tags IS 'Array of custom tags for lead categorization';

COMMENT ON COLUMN web_activity_events.event_type IS 'page_view, tool_usage, form_submit, demo_booked, etc.';
COMMENT ON COLUMN web_activity_events.tool_data IS 'JSON data specific to tool usage events';
