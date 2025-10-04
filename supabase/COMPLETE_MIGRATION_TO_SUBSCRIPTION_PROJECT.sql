-- COMPLETE SCHEMA MIGRATION TO SUBSCRIPTION PROJECT (aeorianxnxpxveoxzhov)
-- Run this in the subscription project SQL Editor

-- CORE PRODUCT CATALOG

-- Drop existing table if you want fresh schema (comment out if you want to keep existing data)
-- DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  subcategory text,
  manufacturer text,
  model_number text,
  price numeric(10,2),
  description text,
  specifications jsonb DEFAULT '{}'::jsonb,
  image_url text,
  data_sheet_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if table already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'active') THEN
    ALTER TABLE products ADD COLUMN active boolean DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specifications') THEN
    ALTER TABLE products ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- DEMO & LEAD MANAGEMENT

CREATE TABLE IF NOT EXISTS demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendly_event_uri text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  event_start_time timestamptz NOT NULL,
  event_end_time timestamptz NOT NULL,
  status text CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  lead_score integer DEFAULT 0,
  custom_responses jsonb DEFAULT '{}'::jsonb,
  demo_conducted boolean DEFAULT false,
  trial_started boolean DEFAULT false,
  converted_to_customer boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_bookings_email ON demo_bookings(email);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_status ON demo_bookings(status);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_event_start ON demo_bookings(event_start_time);

-- ASSESSMENTS & PROJECTS

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  project_name text,
  customer_info jsonb DEFAULT '{}'::jsonb,
  requirements jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '{}'::jsonb,
  estimated_cost numeric(12,2),
  status text CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- DOCUMENTS & FILE STORAGE

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  assessment_id uuid REFERENCES assessments(id),
  document_type text CHECK (document_type IN ('proposal', 'quote', 'bom', 'specification', 'other')),
  title text NOT NULL,
  file_url text,
  file_size integer,
  mime_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_assessment_id ON documents(assessment_id);

CREATE TABLE IF NOT EXISTS uploaded_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  original_filename text NOT NULL,
  storage_path text NOT NULL,
  file_size integer,
  mime_type text,
  upload_status text CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  processing_results jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SPATIAL STUDIO / INTEGRATOR PLUS

CREATE TABLE IF NOT EXISTS spatial_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  project_name text NOT NULL,
  site_address text,
  floor_count integer DEFAULT 1,
  total_sq_ft numeric(10,2),
  project_data jsonb DEFAULT '{}'::jsonb,
  status text CHECK (status IN ('draft', 'active', 'completed', 'archived')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS spatial_floorplans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES spatial_projects(id) ON DELETE CASCADE,
  floor_number integer NOT NULL,
  floorplan_url text,
  extracted_data jsonb DEFAULT '{}'::jsonb,
  camera_placements jsonb DEFAULT '[]'::jsonb,
  equipment_list jsonb DEFAULT '[]'::jsonb,
  analysis_status text CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  analysis_error text,
  analysis_started_at timestamptz,
  analysis_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Analysis Debug Logging
CREATE TABLE IF NOT EXISTS ai_analysis_debug (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floorplan_id uuid REFERENCES spatial_floorplans(id),
  operation text NOT NULL,
  input_params jsonb DEFAULT '{}'::jsonb,
  raw_response jsonb DEFAULT '{}'::jsonb,
  parsed_result jsonb DEFAULT '{}'::jsonb,
  error_message text,
  duration_ms numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- PRICING & ANALYTICS

CREATE TABLE IF NOT EXISTS pricing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  old_price numeric(10,2),
  new_price numeric(10,2),
  change_reason text,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recent_price_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  product_name text,
  old_price numeric(10,2),
  new_price numeric(10,2),
  change_percentage numeric(5,2),
  changed_at timestamptz DEFAULT now()
);

-- ACTIVITY & AUDIT LOGS

CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS admin_actions_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  target_user_id uuid,
  action_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- USER ROLES & PERMISSIONS (Already exists in auth schema, but adding custom)

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'guest')) DEFAULT 'user',
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- PAYMENT & STRIPE EVENTS

CREATE TABLE IF NOT EXISTS payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  customer_id text,
  stripe_session_id text,
  plan_id text,
  user_email text,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY ON ALL TABLES

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_floorplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_debug ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_price_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- BASIC RLS POLICIES (You can customize these later)

-- Products: Public read, admin write
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Assessments: Users can only see their own
CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id);

-- Documents: Users can only see their own
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Spatial Projects: Users can only see their own
CREATE POLICY "Users can view own spatial projects" ON spatial_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own spatial projects" ON spatial_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own spatial projects" ON spatial_projects FOR UPDATE USING (auth.uid() = user_id);

-- Activity Logs: Users can view their own, admins can view all
CREATE POLICY "Users can view own activity" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all activity" ON activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Demo Bookings: Admins only
CREATE POLICY "Admins can manage demo bookings" ON demo_bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- STORAGE BUCKETS

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('floorplans', 'floorplans', false),
  ('spatial-floorplans', 'spatial-floorplans', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- DONE!
-- Next steps:
-- 1. Export data from V3 project (products, demo_bookings, assessments, etc.)
-- 2. Import into this project
-- 3. Update Render environment variables to point to this project
-- 4. Test everything
-- 5. Archive V3 project
