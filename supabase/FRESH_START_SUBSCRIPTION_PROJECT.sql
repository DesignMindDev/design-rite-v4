-- FRESH START FOR SUBSCRIPTION PROJECT (aeorianxnxpxveoxzhov)
-- This drops all existing tables and rebuilds from scratch
-- WARNING: This will delete all data! Only run on the NEW subscription project

-- Drop all existing tables (in correct order to respect foreign keys)
DROP TABLE IF EXISTS ai_analysis_debug CASCADE;
DROP TABLE IF EXISTS spatial_floorplans CASCADE;
DROP TABLE IF EXISTS spatial_projects CASCADE;
DROP TABLE IF EXISTS uploaded_documents CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS demo_bookings CASCADE;
DROP TABLE IF EXISTS pricing_history CASCADE;
DROP TABLE IF EXISTS recent_price_changes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS admin_actions_logs CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS payment_events CASCADE;

-- Also drop testing dashboard tables if they exist
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS test_runs CASCADE;
DROP TABLE IF EXISTS test_schedules CASCADE;
DROP TABLE IF EXISTS dashboard_help CASCADE;
DROP TABLE IF EXISTS admin_chat_history CASCADE;

-- CORE PRODUCT CATALOG
CREATE TABLE products (
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

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_manufacturer ON products(manufacturer);
CREATE INDEX idx_products_active ON products(active);

-- DEMO & LEAD MANAGEMENT
CREATE TABLE demo_bookings (
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

CREATE INDEX idx_demo_bookings_email ON demo_bookings(email);
CREATE INDEX idx_demo_bookings_status ON demo_bookings(status);
CREATE INDEX idx_demo_bookings_event_start ON demo_bookings(event_start_time);

-- ASSESSMENTS & PROJECTS
CREATE TABLE assessments (
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

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);

-- DOCUMENTS & FILE STORAGE
CREATE TABLE documents (
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

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_assessment_id ON documents(assessment_id);

CREATE TABLE uploaded_documents (
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
CREATE TABLE spatial_projects (
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

CREATE TABLE spatial_floorplans (
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

CREATE TABLE ai_analysis_debug (
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
CREATE TABLE pricing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  old_price numeric(10,2),
  new_price numeric(10,2),
  change_reason text,
  changed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE recent_price_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  product_name text,
  old_price numeric(10,2),
  new_price numeric(10,2),
  change_percentage numeric(5,2),
  changed_at timestamptz DEFAULT now()
);

-- ACTIVITY & AUDIT LOGS
CREATE TABLE activity_logs (
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

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

CREATE TABLE admin_actions_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  target_user_id uuid,
  action_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- USER ROLES & PERMISSIONS
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'manager', 'user', 'guest')) DEFAULT 'user',
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- PAYMENT & STRIPE EVENTS
CREATE TABLE payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  customer_id text,
  stripe_session_id text,
  plan_id text,
  user_email text,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- TESTING DASHBOARD TABLES
CREATE TABLE test_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  test_suite text NOT NULL CHECK (test_suite IN ('stress', 'security', 'ux', 'admin', 'full')),
  cron_expression text NOT NULL,
  enabled boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_run_at timestamptz,
  next_run_at timestamptz,
  notification_settings jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE test_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES test_schedules(id),
  test_suite text NOT NULL,
  status text CHECK (status IN ('running', 'completed', 'failed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  total_tests integer DEFAULT 0,
  passed_tests integer DEFAULT 0,
  failed_tests integer DEFAULT 0,
  duration_ms numeric,
  triggered_by text CHECK (triggered_by IN ('manual', 'schedule', 'ci_cd')),
  triggered_by_user uuid REFERENCES auth.users(id),
  results_summary jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_run_id uuid REFERENCES test_runs(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_category text NOT NULL,
  status text CHECK (status IN ('passed', 'failed', 'skipped')),
  duration_ms numeric,
  error_message text,
  stack_trace text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE dashboard_help (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  formula text,
  example_value text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE admin_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  response text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for testing dashboard
CREATE INDEX idx_test_runs_status ON test_runs(status);
CREATE INDEX idx_test_runs_started_at ON test_runs(started_at DESC);
CREATE INDEX idx_test_results_run_id ON test_results(test_run_id);
CREATE INDEX idx_test_schedules_enabled ON test_schedules(enabled);

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
ALTER TABLE test_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_chat_history ENABLE ROW LEVEL SECURITY;

-- BASIC RLS POLICIES
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON assessments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own spatial projects" ON spatial_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own spatial projects" ON spatial_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own spatial projects" ON spatial_projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all activity" ON activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can manage demo bookings" ON demo_bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can manage test schedules" ON test_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can view test runs" ON test_runs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('floorplans', 'floorplans', false),
  ('spatial-floorplans', 'spatial-floorplans', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ALL DONE!
-- Next: Export data from V3 and import here
