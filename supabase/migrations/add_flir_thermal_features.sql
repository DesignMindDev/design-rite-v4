-- =====================================================
-- FLIR Thermal Camera Features Migration
-- =====================================================
-- Adds thermal camera capabilities, NDAA compliance,
-- Johnson Criteria detection ranges, and analytics
-- =====================================================

-- Add thermal camera columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS camera_type VARCHAR(50) DEFAULT 'visible';
-- Options: 'visible', 'thermal', 'multispectral', 'radiometric', 'radar'

ALTER TABLE products ADD COLUMN IF NOT EXISTS ndaa_compliant BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ndaa_certification_date DATE;

-- Thermal sensor specifications
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_sensor VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_sensitivity_netd INTEGER; -- in mK (millikelvin)
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_resolution VARCHAR(50); -- e.g., "640×480 VGA", "320×240 QVGA"
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_fov_min DECIMAL(6,2); -- degrees
ALTER TABLE products ADD COLUMN IF NOT EXISTS thermal_fov_max DECIMAL(6,2); -- degrees
ALTER TABLE products ADD COLUMN IF NOT EXISTS pixel_pitch INTEGER; -- in micrometers (um)

-- Johnson Criteria detection ranges (in meters)
ALTER TABLE products ADD COLUMN IF NOT EXISTS detection_range_human INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recognition_range_human INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS identification_range_human INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS detection_range_vehicle INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS recognition_range_vehicle INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS identification_range_vehicle INTEGER;

-- Radiometric capabilities (temperature measurement)
ALTER TABLE products ADD COLUMN IF NOT EXISTS radiometric_capable BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS temp_range_min INTEGER; -- Celsius
ALTER TABLE products ADD COLUMN IF NOT EXISTS temp_range_max INTEGER; -- Celsius
ALTER TABLE products ADD COLUMN IF NOT EXISTS temp_accuracy VARCHAR(50); -- e.g., "±5°C below 100°C"

-- Radar specifications (for FLIR radar products)
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_technology VARCHAR(50); -- FMCW, Doppler, FMCW/Doppler
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_frequency_band VARCHAR(20); -- X-Band, Ka-Band
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_scan_sector VARCHAR(50); -- e.g., "90° fixed", "360°"
ALTER TABLE products ADD COLUMN IF NOT EXISTS radar_scan_rate VARCHAR(50); -- e.g., "2 Hz", "1 rev/sec"

-- Advanced analytics
ALTER TABLE products ADD COLUMN IF NOT EXISTS onboard_analytics TEXT[];
-- Array of: 'dnn_classifier', 'intrusion_detection', 'loitering', 'stopped_vehicle',
-- 'abandoned_object', 'object_removal', 'tampering', 'tripwire', 'human_vehicle_classification'

ALTER TABLE products ADD COLUMN IF NOT EXISTS analytics_package VARCHAR(50);
-- 'basic', 'professional', 'enterprise'

-- Nexus integration (FLIR's unified security platform)
ALTER TABLE products ADD COLUMN IF NOT EXISTS nexus_enabled BOOLEAN DEFAULT false;

-- Environmental specifications
ALTER TABLE products ADD COLUMN IF NOT EXISTS operating_temp_min INTEGER; -- Celsius
ALTER TABLE products ADD COLUMN IF NOT EXISTS operating_temp_max INTEGER; -- Celsius
ALTER TABLE products ADD COLUMN IF NOT EXISTS anti_ice_deice BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingress_rating VARCHAR(20); -- IP66, IP67, etc.
ALTER TABLE products ADD COLUMN IF NOT EXISTS ik_rating VARCHAR(20); -- IK10, etc.

-- Create index for thermal camera queries
CREATE INDEX IF NOT EXISTS idx_products_camera_type ON products(camera_type);
CREATE INDEX IF NOT EXISTS idx_products_ndaa_compliant ON products(ndaa_compliant);
CREATE INDEX IF NOT EXISTS idx_products_radiometric ON products(radiometric_capable);

-- =====================================================
-- Create FLIR Analytics Packages Table
-- =====================================================
CREATE TABLE IF NOT EXISTS flir_analytics_packages (
    id SERIAL PRIMARY KEY,
    package_name VARCHAR(50) NOT NULL,
    package_tier VARCHAR(20) NOT NULL, -- 'basic', 'professional', 'enterprise'
    features TEXT[] NOT NULL,
    description TEXT,
    price_modifier DECIMAL(5,2) DEFAULT 0.00, -- percentage multiplier
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert analytics package definitions
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
 0.25);

-- =====================================================
-- Create FLIR Radar Products Table
-- =====================================================
CREATE TABLE IF NOT EXISTS flir_radar_products (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    model_series VARCHAR(50) NOT NULL, -- R20SS-3D, R8SS, R5, R3, R-290, R-190
    application VARCHAR(100), -- 'Airspace & Ground', 'Ground & Portable', etc.
    target_types TEXT[], -- ['drone', 'human', 'vehicle', 'boat']
    minimum_detection_velocity DECIMAL(4,2), -- meters/second
    detection_range_specs JSONB, -- Detailed range by target type
    accuracy_range VARCHAR(50),
    accuracy_azimuth VARCHAR(50),
    nexus_integration BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- Create Detection Range Calculator Function
-- =====================================================
-- Function to calculate Johnson Criteria detection ranges
-- Based on: Detection = 3.6px×1px, Recognition = 14.4px×4px, Identification = 28.8px×8px
CREATE OR REPLACE FUNCTION calculate_detection_ranges(
    lens_efl INTEGER, -- Effective focal length in mm
    pixel_pitch INTEGER, -- in micrometers (um)
    horiz_res INTEGER, -- horizontal resolution (e.g., 640, 320, 1024)
    target_type VARCHAR DEFAULT 'human' -- 'human' or 'vehicle'
)
RETURNS TABLE (
    detection_range INTEGER,
    recognition_range INTEGER,
    identification_range INTEGER
) AS $$
DECLARE
    target_height DECIMAL; -- meters
    pixels_for_detection DECIMAL := 3.6;
    pixels_for_recognition DECIMAL := 14.4;
    pixels_for_identification DECIMAL := 28.8;
BEGIN
    -- Set target dimensions based on type
    IF target_type = 'human' THEN
        target_height := 1.8; -- 1.8 meters (6 feet)
    ELSIF target_type = 'vehicle' THEN
        target_height := 2.5; -- 2.5 meters (standard vehicle height)
    ELSE
        target_height := 1.8;
    END IF;

    -- Calculate ranges using Johnson Criteria
    -- Formula: Range = (target_height × lens_efl × horiz_res) / (pixels_required × pixel_pitch)

    RETURN QUERY SELECT
        FLOOR((target_height * lens_efl * horiz_res) / (pixels_for_detection * pixel_pitch))::INTEGER,
        FLOOR((target_height * lens_efl * horiz_res) / (pixels_for_recognition * pixel_pitch))::INTEGER,
        FLOOR((target_height * lens_efl * horiz_res) / (pixels_for_identification * pixel_pitch))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON COLUMN products.camera_type IS 'Type of camera: visible, thermal, multispectral, radiometric, radar';
COMMENT ON COLUMN products.ndaa_compliant IS 'NDAA Section 889 compliant for US Government sales';
COMMENT ON COLUMN products.thermal_sensitivity_netd IS 'Noise Equivalent Temperature Difference in millikelvin (mK) - lower is better';
COMMENT ON COLUMN products.detection_range_human IS 'Maximum distance to detect a human (Johnson Criteria: 3.6px×1px)';
COMMENT ON COLUMN products.recognition_range_human IS 'Maximum distance to recognize a human (Johnson Criteria: 14.4px×4px)';
COMMENT ON COLUMN products.identification_range_human IS 'Maximum distance to identify a human (Johnson Criteria: 28.8px×8px)';

-- =====================================================
-- Sample query to test detection range calculation
-- =====================================================
-- SELECT * FROM calculate_detection_ranges(25, 17, 640, 'human');
-- Should return: detection=734m, recognition=183m, identification=92m
