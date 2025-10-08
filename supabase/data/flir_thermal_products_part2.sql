-- =====================================================
-- FLIR THERMAL CAMERA PRODUCTS - Part 2
-- FC-Series and FB-Series Fixed Thermal Cameras
-- =====================================================

-- =====================================================
-- FC-ID SERIES - Fixed IP Thermal Camera
-- Price Range: $2,800 - $7,500
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

-- FC-690 (7.5mm lens)
('FLIR FC-690 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-690-ID', 3200.00, 'each',
'Fixed IP Thermal Camera - 7.5mm lens, VGA resolution, 204m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
90.0, 90.0, 17,
204, 51, 25,
625, 156, 78,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-669 (9mm lens)
('FLIR FC-669 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-669-ID', 3500.00, 'each',
'Fixed IP Thermal Camera - 9mm lens, VGA resolution, 266m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
69.0, 69.0, 17,
266, 66, 33,
815, 203, 102,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-644 (13mm lens)
('FLIR FC-644 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-644-ID', 4200.00, 'each',
'Fixed IP Thermal Camera - 13mm lens, VGA resolution, 417m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
44.0, 44.0, 17,
417, 104, 52,
1278, 319, 160,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-632 (19mm lens)
('FLIR FC-632 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-632-ID', 4800.00, 'each',
'Fixed IP Thermal Camera - 19mm lens, VGA resolution, 573m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
32.0, 32.0, 17,
573, 143, 72,
1757, 439, 220,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-625 (25mm lens)
('FLIR FC-625 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-625-ID', 5400.00, 'each',
'Fixed IP Thermal Camera - 25mm lens, VGA resolution, 734m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
25.0, 25.0, 17,
734, 183, 92,
2249, 561, 282,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-617 (35mm lens)
('FLIR FC-617 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-617-ID', 6200.00, 'each',
'Fixed IP Thermal Camera - 35mm lens, VGA resolution, 1079m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
17.0, 17.0, 17,
1079, 270, 135,
3307, 827, 413,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-610 (60mm lens)
('FLIR FC-610 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-610-ID', 7100.00, 'each',
'Fixed IP Thermal Camera - 60mm lens, VGA resolution, 1833m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
10.0, 10.0, 17,
1833, 458, 229,
5623, 1406, 703,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FC-608 (75mm lens)
('FLIR FC-608 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FC-608-ID', 7500.00, 'each',
'Fixed IP Thermal Camera - 75mm lens, VGA resolution, 2236m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 35, '640×512 VGA',
8.0, 8.0, 17,
2236, 559, 279,
6857, 1714, 857,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 70, true,
'IP67', 'IK10',
'{"ip_video": "Dual stream H.264, MPEG-4 & MJPEG", "power": "PoE, PoE+, 14–32 VAC, 11–44 VDC", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb);

-- =====================================================
-- FB-ID SERIES - Compact Fixed IP Thermal Camera
-- Price Range: $2,200 - $5,500
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

-- FB-393 (3.7mm lens) - Wide angle
('FLIR FB-393 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-393-ID', 2800.00, 'each',
'Compact Fixed Thermal Camera - 3.7mm wide angle, QVGA resolution, 99m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '320×240 QVGA',
93.0, 93.0, 17,
99, 25, 12,
302, 76, 38,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'basic', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FB-349 (6.8mm lens)
('FLIR FB-349 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-349-ID', 3200.00, 'each',
'Compact Fixed Thermal Camera - 6.8mm lens, QVGA resolution, 187m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '320×240 QVGA',
49.0, 49.0, 17,
187, 47, 23,
574, 143, 72,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'basic', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FB-324 (12.8mm lens)
('FLIR FB-324 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-324-ID', 3800.00, 'each',
'Compact Fixed Thermal Camera - 12.8mm lens, QVGA resolution, 382m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '320×240 QVGA',
24.0, 24.0, 17,
382, 95, 48,
1171, 293, 146,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'basic', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FB-695 VGA (4.9mm lens)
('FLIR FB-695 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-695-ID', 4200.00, 'each',
'Compact Fixed Thermal Camera - 4.9mm lens, VGA resolution, 193m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
95.0, 95.0, 12,
193, 48, 24,
592, 148, 74,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FB-650 VGA (8.7mm lens)
('FLIR FB-650 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-650-ID', 4600.00, 'each',
'Compact Fixed Thermal Camera - 8.7mm lens, VGA resolution, 367m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
50.0, 50.0, 12,
367, 92, 46,
1125, 281, 141,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FB-632 VGA (14mm lens)
('FLIR FB-632 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-632-ID', 5100.00, 'each',
'Compact Fixed Thermal Camera - 14mm lens, VGA resolution, 573m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
32.0, 32.0, 12,
573, 143, 72,
1757, 439, 220,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb),

-- FB-618 VGA (24mm lens)
('FLIR FB-618 ID', 'Cameras', 'Thermal Cameras', 'FLIR', 'FB-618-ID', 5500.00, 'each',
'Compact Fixed Thermal Camera - 24mm lens, VGA resolution, 1019m human detection',
'thermal', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
18.0, 18.0, 12,
1019, 255, 127,
3124, 781, 390,
ARRAY['intrusion_detection', 'tripwire', 'human_vehicle_classification'],
'professional', false,
-40, 50, false,
'IP66', 'IK10',
'{"ip_video": "Dual stream H.264 & MJPEG", "power": "12 VDC, 24 VAC, PoE", "onvif": "Profile S", "warranty": "3 years camera, 10 years thermal sensor"}'::jsonb);
