-- =====================================================
-- COMPLETE FLIR DEPLOYMENT FOR PRODUCTION
-- =====================================================
-- This single file creates products table + FLIR features
-- Run this ONCE in production Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE PRODUCTS TABLE (Simplified)
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,

  -- Product Information
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  manufacturer TEXT,
  model TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'each',
  cost DECIMAL(10,2),

  -- Product Identifiers
  sku TEXT UNIQUE,
  manufacturer_part_number TEXT,

  -- Media
  image_url TEXT,
  datasheet_url TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  specifications JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer);
CREATE INDEX IF NOT EXISTS idx_products_model ON products(model);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- =====================================================
-- STEP 2: ADD FLIR THERMAL COLUMNS
-- =====================================================

-- Thermal camera columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS camera_type VARCHAR(50) DEFAULT 'visible';
ALTER TABLE products ADD COLUMN IF NOT EXISTS ndaa_compliant BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ndaa_certification_date DATE;

-- Thermal sensor specifications
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_sensor VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_sensitivity_netd INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_resolution VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_fov_min DECIMAL(6,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_fov_max DECIMAL(6,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS pixel_pitch INTEGER;

-- Johnson Criteria detection ranges (in meters)
ALTER TABLE products ADD COLUMN IF NOT EXISTS detection_range_human INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recognition_range_human INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS identification_range_human INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS detection_range_vehicle INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recognition_range_vehicle INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS identification_range_vehicle INTEGER;

-- Radiometric capabilities
ALTER TABLE products ADD COLUMN IF NOT EXISTS radiometric_capable BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS temp_range_min INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS temp_range_max INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS temp_accuracy VARCHAR(50);

-- Radar specifications
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_technology VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_frequency_band VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_scan_sector VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_scan_rate VARCHAR(50);

-- Advanced analytics
ALTER TABLE products ADD COLUMN IF NOT EXISTS onboard_analytics TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS analytics_package VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS nexus_enabled BOOLEAN DEFAULT false;

-- Environmental specifications
ALTER TABLE products ADD COLUMN IF NOT EXISTS operating_temp_min INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS operating_temp_max INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS anti_ice_deice BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingress_rating VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS ik_rating VARCHAR(20);

-- Thermal indexes
CREATE INDEX IF NOT EXISTS idx_products_camera_type ON products(camera_type);
CREATE INDEX IF NOT EXISTS idx_products_ndaa_compliant ON products(ndaa_compliant);
CREATE INDEX IF NOT EXISTS idx_products_radiometric ON products(radiometric_capable);

-- =====================================================
-- STEP 3: CREATE FLIR ANALYTICS PACKAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS flir_analytics_packages (
    id SERIAL PRIMARY KEY,
    package_name VARCHAR(50) NOT NULL,
    package_tier VARCHAR(20) NOT NULL,
    features TEXT[] NOT NULL,
    description TEXT,
    price_modifier DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO flir_analytics_packages (package_name, package_tier, features, description, price_modifier) VALUES
('Basic Analytics', 'basic',
 ARRAY['intrusion_detection', 'tripwire', 'camera_tampering'],
 'Essential perimeter protection with intrusion and tripwire detection',
 0.00),
('Professional Analytics', 'professional',
 ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification', 'loitering', 'stopped_vehicle', 'camera_tampering'],
 'Advanced detection with human/vehicle classification and behavioral analytics',
 0.15),
('Enterprise Analytics', 'enterprise',
 ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'loitering', 'stopped_vehicle', 'abandoned_object', 'object_removal', 'wrong_direction', 'camera_tampering', 'people_counting', 'face_detection'],
 'Complete AI-powered analytics suite with deep neural network classification',
 0.25)
ON CONFLICT DO NOTHING;

-- =====================================================
-- STEP 4: CREATE FLIR RADAR PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS flir_radar_products (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    model_series VARCHAR(50) NOT NULL,
    application VARCHAR(100),
    target_types TEXT[],
    minimum_detection_velocity DECIMAL(4,2),
    detection_range_specs JSONB,
    accuracy_range VARCHAR(50),
    accuracy_azimuth VARCHAR(50),
    nexus_integration BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- STEP 5: JOHNSON CRITERIA CALCULATOR FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_detection_ranges(
    lens_efl INTEGER,
    pixel_pitch INTEGER,
    horiz_res INTEGER,
    target_type VARCHAR DEFAULT 'human'
)
RETURNS TABLE (
    detection_range INTEGER,
    recognition_range INTEGER,
    identification_range INTEGER
) AS $$
DECLARE
    target_height DECIMAL;
    pixels_for_detection DECIMAL := 3.6;
    pixels_for_recognition DECIMAL := 14.4;
    pixels_for_identification DECIMAL := 28.8;
BEGIN
    IF target_type = 'human' THEN
        target_height := 1.8;
    ELSIF target_type = 'vehicle' THEN
        target_height := 2.5;
    ELSE
        target_height := 1.8;
    END IF;

    RETURN QUERY SELECT
        FLOOR((target_height * lens_efl * horiz_res) / (pixels_for_detection * pixel_pitch))::INTEGER,
        FLOOR((target_height * lens_efl * horiz_res) / (pixels_for_recognition * pixel_pitch))::INTEGER,
        FLOOR((target_height * lens_efl * horiz_res) / (pixels_for_identification * pixel_pitch))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICATION TESTS
-- =====================================================

-- Test 1: Products table exists
SELECT 'Products table created successfully' as status;
SELECT COUNT(*) as product_count FROM products;

-- Test 2: Johnson Criteria calculator (should return 734, 183, 92)
SELECT 'Johnson Criteria Calculator Test (should be 734, 183, 92):' as test;
SELECT * FROM calculate_detection_ranges(25, 17, 640, 'human');

-- Test 3: Verify new columns exist
SELECT 'Thermal columns added:' as verification;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('camera_type', 'ndaa_compliant', 'thermal_sensitivity_netd', 'detection_range_human')
ORDER BY column_name;

-- Test 4: Analytics packages loaded
SELECT 'Analytics packages:' as packages;
SELECT package_tier, package_name, array_length(features, 1) as feature_count
FROM flir_analytics_packages
ORDER BY package_tier;

-- =====================================================
-- DEPLOYMENT COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run supabase/data/flir_thermal_products.sql
-- 2. Run supabase/data/flir_thermal_products_part2.sql
-- 3. Run supabase/data/flir_ptz_and_radar_products.sql
-- =====================================================
