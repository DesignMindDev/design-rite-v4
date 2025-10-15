-- Create table for Design Rite Challenge leads
CREATE TABLE IF NOT EXISTS public.challenge_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact Information
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Company Information
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_size TEXT NOT NULL,

  -- Lead Qualification
  pain_point TEXT NOT NULL,
  offer_choice TEXT NOT NULL CHECK (offer_choice IN ('7day-trial', '20percent-discount')),

  -- Marketing Consent
  consent_marketing BOOLEAN DEFAULT false,

  -- Campaign Tracking
  source TEXT DEFAULT 'design_rite_challenge',
  campaign_name TEXT DEFAULT 'Take the Design Rite Challenge',

  -- Status Tracking
  email_verified BOOLEAN DEFAULT false,
  account_created BOOLEAN DEFAULT false,
  magic_link_sent_at TIMESTAMPTZ,
  email_verified_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_challenge_leads_email ON public.challenge_leads(email);

-- Create index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_challenge_leads_created_at ON public.challenge_leads(created_at);

-- Create index on offer_choice for conversion tracking
CREATE INDEX IF NOT EXISTS idx_challenge_leads_offer_choice ON public.challenge_leads(offer_choice);

-- Enable Row Level Security
ALTER TABLE public.challenge_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow anonymous users to insert (for lead capture form)
CREATE POLICY "Anyone can submit lead form"
  ON public.challenge_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read own lead data"
  ON public.challenge_leads
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = email OR email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

-- Allow service role to do anything (for admin/API operations)
CREATE POLICY "Service role has full access"
  ON public.challenge_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_challenge_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_challenge_leads_updated_at
  BEFORE UPDATE ON public.challenge_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_leads_updated_at();

-- Grant permissions
GRANT SELECT, INSERT ON public.challenge_leads TO anon;
GRANT SELECT, UPDATE ON public.challenge_leads TO authenticated;
GRANT ALL ON public.challenge_leads TO service_role;

-- Comments for documentation
COMMENT ON TABLE public.challenge_leads IS 'Stores lead information from the Design Rite Challenge signup flow';
COMMENT ON COLUMN public.challenge_leads.email IS 'Business email address (validated to reject free providers)';
COMMENT ON COLUMN public.challenge_leads.pain_point IS 'User-described biggest time-wasting process';
COMMENT ON COLUMN public.challenge_leads.offer_choice IS '7day-trial or 20percent-discount';
COMMENT ON COLUMN public.challenge_leads.magic_link_sent_at IS 'When the email verification magic link was sent';
COMMENT ON COLUMN public.challenge_leads.email_verified_at IS 'When the user clicked the magic link and verified their email';
