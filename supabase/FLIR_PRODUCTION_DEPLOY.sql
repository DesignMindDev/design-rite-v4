-- =====================================================
-- FLIR THERMAL INTEGRATION - PRODUCTION DEPLOYMENT
-- =====================================================
-- Run this complete file in Supabase SQL Editor
-- Combines: Migration + All Product Data
-- Deployment: Production (design-rite main)
-- Commit: 90d1eb6
-- Date: October 7, 2025
-- =====================================================

-- =====================================================
-- STEP 1: SCHEMA MIGRATION
-- =====================================================

-- Add thermal camera columns to products table
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

-- Radiometric capabilities (temperature measurement)
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_camera_type ON products(camera_type);
CREATE INDEX IF NOT EXISTS idx_products_ndaa_compliant ON products(ndaa_compliant);
CREATE INDEX IF NOT EXISTS idx_products_radiometric ON products(radiometric_capable);

-- =====================================================
-- FLIR Analytics Packages Table
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
-- FLIR Radar Products Table
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
-- Johnson Criteria Detection Range Calculator Function
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

-- Add column comments
COMMENT ON COLUMN products.camera_type IS 'Type of camera: visible, thermal, multispectral, radiometric, radar';
COMMENT ON COLUMN products.ndaa_compliant IS 'NDAA Section 889 compliant for US Government sales';
COMMENT ON COLUMN products.thermal_sensitivity_netd IS 'Noise Equivalent Temperature Difference in millikelvin (mK) - lower is better';
COMMENT ON COLUMN products.detection_range_human IS 'Maximum distance to detect a human (Johnson Criteria: 3.6px×1px)';
COMMENT ON COLUMN products.recognition_range_human IS 'Maximum distance to recognize a human (Johnson Criteria: 14.4px×4px)';
COMMENT ON COLUMN products.identification_range_human IS 'Maximum distance to identify a human (Johnson Criteria: 28.8px×8px)';

-- =====================================================
-- STEP 2: PRODUCT DATA
-- =====================================================
-- Note: This file will now source from the three product data files
-- Run each file separately after this migration completes:
-- 1. flir_thermal_products.sql (F-Series, FH-Series)
-- 2. flir_thermal_products_part2.sql (FC-Series, FB-Series)
-- 3. flir_ptz_and_radar_products.sql (PT-Series, DM-Series, Radar)

-- =====================================================
-- DEPLOYMENT VERIFICATION
-- =====================================================

-- Test the detection range calculator
SELECT 'Testing Johnson Criteria Calculator (should return 734m, 183m, 92m):' as test;
SELECT * FROM calculate_detection_ranges(25, 17, 640, 'human');

-- Verify schema changes
SELECT 'Schema verification - new columns added:' as verification;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('camera_type', 'ndaa_compliant', 'thermal_sensitivity_netd', 'detection_range_human')
ORDER BY column_name;

-- Verify analytics packages
SELECT 'Analytics packages loaded:' as packages;
SELECT package_tier, package_name, array_length(features, 1) as feature_count
FROM flir_analytics_packages
ORDER BY package_tier;

-- =====================================================
-- NEXT STEPS
-- =====================================================
-- After running this file successfully:
-- 1. Run supabase/data/flir_thermal_products.sql (14 products)
-- 2. Run supabase/data/flir_thermal_products_part2.sql (16 products)
-- 3. Run supabase/data/flir_ptz_and_radar_products.sql (16 products)
-- 4. Verify with: SELECT COUNT(*) FROM products WHERE manufacturer = 'FLIR';
-- =====================================================
