-- =====================================================
-- ADD DOCUMENT AI SUPPLEMENTARY TABLES
-- Design-Rite v3 + Document AI Platform Integration
-- Migration: Adds admin_settings and user_themes tables
-- Created: 2025-10-02
-- Run Order: AFTER 001_unified_auth_schema.sql
-- =====================================================

-- ==============================================
-- TABLE 1: admin_settings
-- Global AI configuration and API key management
-- ==============================================

CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- AI Configuration
  global_prompt text DEFAULT 'You are a helpful AI assistant named Harvey. You help users with their business needs including generating proposals, invoices, and providing business advice.',
  general_assistant_id text, -- OpenAI Assistant ID (if using Assistants API)
  platform_assistant_id text, -- Secondary assistant ID
  platform_prompt text, -- Platform-specific system prompt
  ai_model text DEFAULT 'gpt-4o-mini' CHECK (ai_model IN ('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-5')),

  -- API Keys (encrypted storage)
  api_key_encrypted text, -- OpenAI API key (use environment variables in production)
  chat_completions_url text DEFAULT 'https://api.openai.com/v1/chat/completions',

  -- AI Behavior Settings
  temperature numeric(3, 2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens integer DEFAULT 1500 CHECK (max_tokens > 0 AND max_tokens <= 8000),
  max_completion_tokens integer DEFAULT 1500,

  -- Stripe Configuration (if not using env vars)
  stripe_price_id_base text,
  stripe_price_id_pro text,
  stripe_price_id_enterprise text,
  price_base_cents integer DEFAULT 0,
  price_pro_cents integer DEFAULT 4995, -- $49.95
  price_enterprise_cents integer DEFAULT 9995, -- $99.95

  -- Document Limits per Tier
  max_base_documents integer DEFAULT 5,
  max_pro_documents integer DEFAULT 20,
  max_enterprise_documents integer DEFAULT 100,

  -- Feature Flags
  payment_required boolean DEFAULT true,
  enable_ai_chat boolean DEFAULT true,
  enable_document_upload boolean DEFAULT true,
  enable_pdf_generation boolean DEFAULT true,

  -- Metadata
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated ON admin_settings(updated_at DESC);

COMMENT ON TABLE admin_settings IS 'Global configuration for AI, pricing, and feature flags';
COMMENT ON COLUMN admin_settings.api_key_encrypted IS 'Encrypted OpenAI API key - prefer environment variables in production';
COMMENT ON COLUMN admin_settings.global_prompt IS 'Default system prompt for AI chat completions';
COMMENT ON COLUMN admin_settings.general_assistant_id IS 'OpenAI Assistant ID for Assistants API v2';

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Only super admins can read settings
CREATE POLICY "Super admins can view admin settings" ON admin_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Only super admins can insert settings
CREATE POLICY "Super admins can create admin settings" ON admin_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Only super admins can update settings
CREATE POLICY "Super admins can update admin settings" ON admin_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_admin_settings_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_settings_timestamp
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_timestamp();

-- Seed default admin settings
INSERT INTO admin_settings (
  global_prompt,
  ai_model,
  temperature,
  max_tokens,
  max_base_documents,
  max_pro_documents,
  max_enterprise_documents,
  payment_required,
  enable_ai_chat,
  enable_document_upload,
  enable_pdf_generation
) VALUES (
  'You are Harvey, an AI assistant for Design-Rite. You help security and low-voltage sales engineers create professional proposals, generate accurate quotes, and streamline their workflow. You have access to product pricing, technical specifications, and customer documents. Always be professional, accurate, and helpful.',
  'gpt-4o-mini',
  0.7,
  1500,
  5,
  20,
  100,
  true,
  true,
  true,
  true
) ON CONFLICT DO NOTHING;

-- ==============================================
-- TABLE 2: user_themes
-- White-label branding and UI customization
-- ==============================================

CREATE TABLE IF NOT EXISTS user_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Branding
  logo_url text, -- URL to company logo (storage bucket or external)
  company_tagline text, -- Optional tagline for documents

  -- Color Scheme
  primary_color text DEFAULT '#8b5cf6' CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  secondary_color text DEFAULT '#a855f7' CHECK (secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
  accent_color text DEFAULT '#ec4899' CHECK (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  text_color text DEFAULT '#1f2937' CHECK (text_color ~ '^#[0-9A-Fa-f]{6}$'),
  background_color_light text DEFAULT '#ffffff' CHECK (background_color_light ~ '^#[0-9A-Fa-f]{6}$'),
  background_color_dark text DEFAULT '#0f172a' CHECK (background_color_dark ~ '^#[0-9A-Fa-f]{6}$'),

  -- Typography
  font_family text DEFAULT 'Inter, system-ui, sans-serif',
  heading_font text DEFAULT 'Inter, system-ui, sans-serif',

  -- Metadata
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Unique constraint - one theme per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_themes_user_id ON user_themes(user_id);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_user_themes_created ON user_themes(created_at DESC);

COMMENT ON TABLE user_themes IS 'User-specific branding and UI customization for white-label experience';
COMMENT ON COLUMN user_themes.logo_url IS 'Company logo URL for proposals, invoices, and PDFs';
COMMENT ON COLUMN user_themes.primary_color IS 'Primary brand color (hex format)';

-- Enable RLS
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;

-- Users can view their own theme
CREATE POLICY "Users can view their own theme" ON user_themes
  FOR SELECT
  USING (user_id = auth.uid()::uuid);

-- Users can insert their own theme
CREATE POLICY "Users can insert their own theme" ON user_themes
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::uuid);

-- Users can update their own theme
CREATE POLICY "Users can update their own theme" ON user_themes
  FOR UPDATE
  USING (user_id = auth.uid()::uuid);

-- Users can delete their own theme
CREATE POLICY "Users can delete their own theme" ON user_themes
  FOR DELETE
  USING (user_id = auth.uid()::uuid);

-- Admins can view all themes
CREATE POLICY "Admins can view all themes" ON user_themes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role IN ('admin', 'super_admin')
      AND u.status = 'active'
    )
  );

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_user_themes_timestamp
  BEFORE UPDATE ON user_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); -- Reuse existing function from 001 migration

-- ==============================================
-- HELPER FUNCTIONS
-- ==============================================

-- Function to get or create default theme for user
CREATE OR REPLACE FUNCTION get_user_theme(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  logo_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  text_color text
) AS $$
BEGIN
  -- Check if theme exists
  IF EXISTS (SELECT 1 FROM user_themes WHERE user_themes.user_id = p_user_id) THEN
    RETURN QUERY
    SELECT
      user_themes.id,
      user_themes.user_id,
      user_themes.logo_url,
      user_themes.primary_color,
      user_themes.secondary_color,
      user_themes.accent_color,
      user_themes.text_color
    FROM user_themes
    WHERE user_themes.user_id = p_user_id;
  ELSE
    -- Create default theme
    INSERT INTO user_themes (user_id)
    VALUES (p_user_id)
    RETURNING
      user_themes.id,
      user_themes.user_id,
      user_themes.logo_url,
      user_themes.primary_color,
      user_themes.secondary_color,
      user_themes.accent_color,
      user_themes.text_color
    INTO
      id,
      user_id,
      logo_url,
      primary_color,
      secondary_color,
      accent_color,
      text_color;

    RETURN QUERY
    SELECT
      user_themes.id,
      user_themes.user_id,
      user_themes.logo_url,
      user_themes.primary_color,
      user_themes.secondary_color,
      user_themes.accent_color,
      user_themes.text_color
    FROM user_themes
    WHERE user_themes.user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_theme IS 'Get user theme or create default if not exists';

-- ==============================================
-- ADMIN VIEWS
-- ==============================================

-- View: AI Configuration Summary
CREATE OR REPLACE VIEW v_ai_config_summary AS
SELECT
  ai_model,
  temperature,
  max_tokens,
  enable_ai_chat,
  enable_document_upload,
  enable_pdf_generation,
  COUNT(DISTINCT u.id) FILTER (WHERE u.token_usage > 0) as active_ai_users,
  SUM(u.token_usage) as total_tokens_used,
  updated_at as config_updated_at
FROM admin_settings
CROSS JOIN users u
WHERE u.status = 'active'
GROUP BY
  admin_settings.id,
  ai_model,
  temperature,
  max_tokens,
  enable_ai_chat,
  enable_document_upload,
  enable_pdf_generation,
  updated_at;

COMMENT ON VIEW v_ai_config_summary IS 'Summary of AI configuration and usage statistics';

-- View: Theme Adoption
CREATE OR REPLACE VIEW v_theme_adoption AS
SELECT
  COUNT(DISTINCT ut.user_id) as users_with_custom_theme,
  COUNT(DISTINCT u.id) as total_active_users,
  ROUND(
    COUNT(DISTINCT ut.user_id)::numeric / NULLIF(COUNT(DISTINCT u.id), 0) * 100,
    2
  ) as adoption_percentage,
  COUNT(DISTINCT ut.user_id) FILTER (WHERE ut.logo_url IS NOT NULL) as users_with_logo
FROM users u
LEFT JOIN user_themes ut ON u.id = ut.user_id
WHERE u.status = 'active';

COMMENT ON VIEW v_theme_adoption IS 'Statistics on theme customization adoption';

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Document AI Supplementary Tables Created Successfully';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables Created:';
  RAISE NOTICE '  ✓ admin_settings (AI configuration and pricing)';
  RAISE NOTICE '  ✓ user_themes (white-label branding)';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions Created:';
  RAISE NOTICE '  ✓ get_user_theme(user_id) - Get or create default theme';
  RAISE NOTICE '';
  RAISE NOTICE 'Views Created:';
  RAISE NOTICE '  ✓ v_ai_config_summary - AI usage statistics';
  RAISE NOTICE '  ✓ v_theme_adoption - Theme customization metrics';
  RAISE NOTICE '';
  RAISE NOTICE 'Default Data Seeded:';
  RAISE NOTICE '  ✓ admin_settings with gpt-4o-mini configuration';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Update OPENAI_API_KEY in environment variables';
  RAISE NOTICE '  2. Configure Stripe price IDs in admin_settings (optional)';
  RAISE NOTICE '  3. Create storage buckets for documents and generated-pdfs';
  RAISE NOTICE '  4. Begin edge function migration to API routes';
  RAISE NOTICE '';
END $$;
