-- Create leads table in Supabase
-- Run this SQL in your Supabase SQL editor if the table doesn't exist

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create an index on source for analytics
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Create an index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (adjust as needed for your security requirements)
CREATE POLICY "Allow public inserts" ON leads FOR INSERT WITH CHECK (true);

-- Create a policy to allow reads for authenticated users (adjust as needed)
CREATE POLICY "Allow authenticated reads" ON leads FOR SELECT TO authenticated WITH CHECK (true);