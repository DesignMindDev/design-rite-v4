-- =====================================================
-- FLIR THERMAL CAMERA PRODUCTS
-- =====================================================
-- Complete product catalog from FLIR Security Product Matrix
-- and Thermal Security Camera Range Data (October 2021)
-- All products are NDAA Section 889 compliant
-- =====================================================

-- Note: Run add_flir_thermal_features.sql migration BEFORE running this file

-- =====================================================
-- F-SERIES ID - Fixed Thermal Security Camera with Onboard Analytics
-- Price Range: $5,500 - $10,000
-- =====================================================

INSERT INTO products (
    name, category, subcategory, manufacturer, model, price, unit,
    description, camera_type, ndaa_compliant, ndaa_certification_date,
    thermal_sensor, thermal_sensitivity_netd, thermal_resolution,
    thermal_fov_min, thermal_fov_max, pixel_pitch,
    detection_range_human, recognition_range_human, identification_range_human,
    detection_range_vehicle, recognition_range_vehicle, identification_range_vehicle,
    onboard_analytics, analytics_package, nexus_enabled,
    operating_temp_min, operating_temp_max, anti_ice_deice,
    ingress_rating, ik_rating, specifications
) VALUES

-- F-644 ID (13mm lens)
('FLIR F-644 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-644-ID', 6200.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 13mm lens, VGA resolution, 417m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
44.0, 44.0, 17,
417, 104, 52,
1278, 319, 160,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- F-625 ID (25mm lens)
('FLIR F-625 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-625-ID', 6800.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 25mm lens, VGA resolution, 733m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
25.0, 25.0, 17,
733, 183, 92,
2249, 562, 281,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- F-617 ID (35mm lens)
('FLIR F-617 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-617-ID', 7400.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 35mm lens, VGA resolution, 1079m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
17.0, 17.0, 17,
1079, 270, 135,
3307, 827, 413,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- F-612 ID (50mm lens)
('FLIR F-612 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-612-ID', 8200.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 50mm lens, VGA resolution, 1528m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
12.0, 12.0, 17,
1528, 382, 191,
4686, 1171, 586,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- F-610 ID (65mm lens)
('FLIR F-610 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-610-ID', 8800.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 65mm lens, VGA resolution, 1910m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
10.0, 10.0, 17,
1910, 477, 239,
5857, 1464, 732,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- F-608 ID (75mm lens)
('FLIR F-608 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-608-ID', 9200.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 75mm lens, VGA resolution, 2132m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
8.0, 8.0, 17,
2132, 533, 266,
6538, 1634, 817,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- F-606 ID (100mm lens)
('FLIR F-606 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'F-606-ID', 10500.00, 'each',
'Fixed Thermal Security Camera with AI Analytics - 100mm lens, VGA resolution, 2957m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×480 VGA',
6.0, 6.0, 17,
2957, 739, 370,
9069, 2267, 1134,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-50, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "24 VAC, 24 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb);

-- =====================================================
-- FH-ID SERIES - Multispectral Fixed Camera (Thermal + 4K Visible)
-- Price Range: $12,000 - $18,000
-- =====================================================

INSERT INTO products (
    name, category, subcategory, manufacturer, model, price, unit,
    description, camera_type, ndaa_compliant, ndaa_certification_date,
    thermal_sensor, thermal_sensitivity_netd, thermal_resolution,
    thermal_fov_min, thermal_fov_max, pixel_pitch,
    detection_range_human, recognition_range_human, identification_range_human,
    detection_range_vehicle, recognition_range_vehicle, identification_range_vehicle,
    onboard_analytics, analytics_package, nexus_enabled,
    operating_temp_min, operating_temp_max, anti_ice_deice,
    ingress_rating, ik_rating, specifications
) VALUES

-- FH-669 ID (9mm thermal lens)
('FLIR FH-669 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-669-ID', 14500.00, 'each',
'Multispectral Fixed Camera - 9mm thermal + 4K visible, 266m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
69.0, 69.0, 17,
266, 66, 33,
815, 203, 102,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FH-644 ID (13mm thermal lens)
('FLIR FH-644 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-644-ID', 15200.00, 'each',
'Multispectral Fixed Camera - 13mm thermal + 4K visible, 417m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
44.0, 44.0, 17,
417, 104, 52,
1278, 319, 160,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FH-625 ID (25mm thermal lens)
('FLIR FH-625 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-625-ID', 16200.00, 'each',
'Multispectral Fixed Camera - 25mm thermal + 4K visible, 734m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
25.0, 25.0, 17,
734, 183, 92,
2249, 561, 282,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FH-617 ID (35mm thermal lens)
('FLIR FH-617 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-617-ID', 17400.00, 'each',
'Multispectral Fixed Camera - 35mm thermal + 4K visible, 1079m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
17.0, 17.0, 17,
1079, 270, 135,
3307, 827, 413,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FH-612 ID (50mm thermal lens)
('FLIR FH-612 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-612-ID', 18200.00, 'each',
'Multispectral Fixed Camera - 50mm thermal + 4K visible, 1528m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
12.0, 12.0, 17,
1528, 382, 191,
4686, 1171, 586,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FH-610 ID (60mm thermal lens)
('FLIR FH-610 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-610-ID', 19200.00, 'each',
'Multispectral Fixed Camera - 60mm thermal + 4K visible, 1833m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
10.0, 10.0, 17,
1833, 458, 229,
5623, 1406, 703,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FH-608 ID (75mm thermal lens)
('FLIR FH-608 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FH-608-ID', 20500.00, 'each',
'Multispectral Fixed Camera - 75mm thermal + 4K visible, 2236m human detection',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 25, '640×512 VGA',
8.0, 8.0, 17,
2236, 559, 279,
6857, 1714, 857,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering'],
'enterprise', true,
-40, 70, true,
'IP67', 'IK10',
'{"visible_camera": "4K 2160p (3840×2160)", "ip_video": "Dual stream H.264/H.265 per sensor", "power": "12 VDC, 24 VDC, 24 VAC, 802.3bt PoE+", "onvif": "Profile S/G/T", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb);

-- Continue with next batch (FC-Series, FB-Series, PT-Series) in next section...
-- File size limit - will create additional insert files
