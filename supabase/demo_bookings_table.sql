-- =============================================
-- Design-Rite Demo Bookings Table
-- Calendly Integration for Demo Scheduling
-- =============================================

-- Demo bookings table for Calendly integration
CREATE TABLE IF NOT EXISTS demo_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    calendly_event_id VARCHAR(255) UNIQUE,
    calendly_event_uri VARCHAR(500),
    event_name VARCHAR(255),
    event_status VARCHAR(100) DEFAULT 'scheduled', -- scheduled, cancelled, rescheduled, completed
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    location JSONB, -- Zoom/Teams link info

    -- Invitee information
    invitee_name VARCHAR(255),
    invitee_email VARCHAR(255) NOT NULL,
    invitee_company VARCHAR(255),
    invitee_phone VARCHAR(50),

    -- Custom questions responses
    biggest_challenge TEXT,
    current_proposal_process TEXT,
    monthly_proposal_volume INTEGER,
    company_size VARCHAR(100),
    urgency_level VARCHAR(50),

    -- Tracking fields
    lead_source VARCHAR(100) DEFAULT 'linkedin_post',
    lead_score INTEGER DEFAULT 0,
    follow_up_status VARCHAR(100) DEFAULT 'pending',
    demo_conducted BOOLEAN DEFAULT FALSE,
    demo_feedback TEXT,
    conversion_status VARCHAR(100) DEFAULT 'prospect', -- prospect, trial, customer, lost

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_demo_bookings_email ON demo_bookings(invitee_email);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_calendly_id ON demo_bookings(calendly_event_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_status ON demo_bookings(event_status);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_start_time ON demo_bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_lead_score ON demo_bookings(lead_score);

-- Enable Row Level Security (RLS)
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin access)
CREATE POLICY "Enable read access for authenticated users" ON demo_bookings
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for service role" ON demo_bookings
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON demo_bookings
    FOR UPDATE
    USING (true);

-- Add helpful comments
COMMENT ON TABLE demo_bookings IS 'Stores Calendly demo bookings with lead scoring and tracking';
COMMENT ON COLUMN demo_bookings.lead_score IS 'Calculated score 0-100 based on prospect responses';
COMMENT ON COLUMN demo_bookings.event_status IS 'scheduled, cancelled, rescheduled, completed';
COMMENT ON COLUMN demo_bookings.conversion_status IS 'prospect, trial, customer, lost';
