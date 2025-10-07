-- =====================================================
-- FLIR THERMAL PTZ AND RADAR PRODUCTS
-- PT-Series, DM-Series, DX-Series PTZ + Radar Systems
-- =====================================================

-- =====================================================
-- PT-SERIES AI SR - Thermal PTZ with AI Analytics
-- Price Range: $28,000 - $45,000
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

-- PT-644 (13mm lens)
('FLIR PT-644 AI SR', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'PT-644-AI-SR', 32000.00, 'each',
'Thermal PTZ with AI Analytics - 13mm lens, VGA resolution, 417m human detection, 30x optical zoom visible',
'multispectral', false, NULL,
'Uncooled thermal sensor with 4x optical zoom', 25, '640×512 VGA',
36.0, 6.0, 17,
417, 104, 52,
1278, 319, 160,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering', 'nuisance_alarm_filtering', 'masking', 'autotracking', 'geotracking'],
'enterprise', true,
-40, 70, true,
'IP66', 'IK10',
'{"visible_camera": "4K 1/1.8-type Exmor R CMOS, 30X optical zoom, 12X digital zoom", "pan_speed": "0.1° to 60°/sec, 360° continuous", "tilt_speed": "0.1° to 30°/sec, -90° to 90°", "ip_video": "H.265, H.264 & M-JPEG", "power": "24 VDC (21-30 VDC)", "onvif": "Profile S/G/T", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

-- PT-625 (25mm lens)
('FLIR PT-625 AI SR', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'PT-625-AI-SR', 34500.00, 'each',
'Thermal PTZ with AI Analytics - 25mm lens, VGA resolution, 733m human detection, 30x optical zoom visible',
'multispectral', false, NULL,
'Uncooled thermal sensor with 4x optical zoom', 25, '640×512 VGA',
25.0, 6.0, 17,
733, 183, 92,
2249, 562, 281,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering', 'nuisance_alarm_filtering', 'masking', 'autotracking', 'geotracking'],
'enterprise', true,
-40, 70, true,
'IP66', 'IK10',
'{"visible_camera": "4K 1/1.8-type Exmor R CMOS, 30X optical zoom, 12X digital zoom", "pan_speed": "0.1° to 60°/sec, 360° continuous", "tilt_speed": "0.1° to 30°/sec, -90° to 90°", "ip_video": "H.265, H.264 & M-JPEG", "power": "24 VDC (21-30 VDC)", "onvif": "Profile S/G/T", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

-- PT-617 (35mm lens)
('FLIR PT-617 AI SR', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'PT-617-AI-SR', 37000.00, 'each',
'Thermal PTZ with AI Analytics - 35mm lens, VGA resolution, 1079m human detection, 30x optical zoom visible',
'multispectral', false, NULL,
'Uncooled thermal sensor with 4x optical zoom', 25, '640×512 VGA',
17.0, 6.0, 17,
1079, 270, 135,
3307, 827, 413,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering', 'nuisance_alarm_filtering', 'masking', 'autotracking', 'geotracking'],
'enterprise', true,
-40, 70, true,
'IP66', 'IK10',
'{"visible_camera": "4K 1/1.8-type Exmor R CMOS, 30X optical zoom, 12X digital zoom", "pan_speed": "0.1° to 60°/sec, 360° continuous", "tilt_speed": "0.1° to 30°/sec, -90° to 90°", "ip_video": "H.265, H.264 & M-JPEG", "power": "24 VDC (21-30 VDC)", "onvif": "Profile S/G/T", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

-- PT-612 (50mm lens)
('FLIR PT-612 AI SR', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'PT-612-AI-SR', 39500.00, 'each',
'Thermal PTZ with AI Analytics - 50mm lens, VGA resolution, 1528m human detection, 30x optical zoom visible',
'multispectral', false, NULL,
'Uncooled thermal sensor with 4x optical zoom', 25, '640×512 VGA',
12.0, 6.0, 17,
1528, 382, 191,
4686, 1171, 586,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering', 'nuisance_alarm_filtering', 'masking', 'autotracking', 'geotracking'],
'enterprise', true,
-40, 70, true,
'IP66', 'IK10',
'{"visible_camera": "4K 1/1.8-type Exmor R CMOS, 30X optical zoom, 12X digital zoom", "pan_speed": "0.1° to 60°/sec, 360° continuous", "tilt_speed": "0.1° to 30°/sec, -90° to 90°", "ip_video": "H.265, H.264 & M-JPEG", "power": "24 VDC (21-30 VDC)", "onvif": "Profile S/G/T", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

-- PT-608 (75mm lens)
('FLIR PT-608 AI SR', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'PT-608-AI-SR', 42000.00, 'each',
'Thermal PTZ with AI Analytics - 75mm lens, VGA resolution, 2132m human detection, 30x optical zoom visible',
'multispectral', false, NULL,
'Uncooled thermal sensor with 4x optical zoom', 25, '640×512 VGA',
8.0, 6.0, 17,
2132, 533, 266,
6538, 1634, 817,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering', 'nuisance_alarm_filtering', 'masking', 'autotracking', 'geotracking'],
'enterprise', true,
-40, 70, true,
'IP66', 'IK10',
'{"visible_camera": "4K 1/1.8-type Exmor R CMOS, 30X optical zoom, 12X digital zoom", "pan_speed": "0.1° to 60°/sec, 360° continuous", "tilt_speed": "0.1° to 30°/sec, -90° to 90°", "ip_video": "H.265, H.264 & M-JPEG", "power": "24 VDC (21-30 VDC)", "onvif": "Profile S/G/T", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

-- PT-606Z (105mm lens - long range)
('FLIR PT-606Z AI SR', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'PT-606Z-AI-SR', 45000.00, 'each',
'Thermal PTZ with AI Analytics - 105mm lens, VGA resolution, 3056m human detection, 30x optical zoom visible',
'multispectral', false, NULL,
'Uncooled thermal sensor with 4x optical zoom', 25, '640×512 VGA',
6.0, 6.0, 17,
3056, 764, 382,
9371, 2343, 1171,
ARRAY['dnn_classifier', 'intrusion_detection', 'tripwire', 'human_vehicle_classification', 'tampering', 'loitering', 'nuisance_alarm_filtering', 'masking', 'autotracking', 'geotracking'],
'enterprise', true,
-40, 70, true,
'IP66', 'IK10',
'{"visible_camera": "4K 1/1.8-type Exmor R CMOS, 30X optical zoom, 12X digital zoom", "pan_speed": "0.1° to 60°/sec, 360° continuous", "tilt_speed": "0.1° to 30°/sec, -90° to 90°", "ip_video": "H.265, H.264 & M-JPEG", "power": "24 VDC (21-30 VDC)", "onvif": "Profile S/G/T", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb);

-- =====================================================
-- DM-SERIES - Multispectral PTZ Thermal Camera
-- Price Range: $18,000 - $28,000
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

('FLIR DM-695', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'DM-695', 19500.00, 'each',
'Multispectral PTZ Thermal Camera - 4.9mm thermal, 193m human detection, 4K visible',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
95.0, 95.0, 12,
193, 48, 24,
592, 148, 74,
ARRAY[], 'basic', false,
-40, 55, false,
'IP66', 'IK10',
'{"visible_camera": "1/2.3 type Exmor R CMOS, 2.8-12mm, 110° to 36° FOV", "pan_speed": "360° continuous", "tilt_angle": "10° to 190°", "ip_video": "H.264 & M-JPEG", "power": "24 VAC, Universal PoE Injector", "onvif": "Profile S", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

('FLIR DM-650', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'DM-650', 22000.00, 'each',
'Multispectral PTZ Thermal Camera - 8.7mm thermal, 367m human detection, 4K visible',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
50.0, 50.0, 12,
367, 92, 46,
1125, 281, 141,
ARRAY[], 'basic', false,
-40, 55, false,
'IP66', 'IK10',
'{"visible_camera": "1/2.3 type Exmor R CMOS, 2.8-12mm, 110° to 36° FOV", "pan_speed": "360° continuous", "tilt_angle": "10° to 190°", "ip_video": "H.264 & M-JPEG", "power": "24 VAC, Universal PoE Injector", "onvif": "Profile S", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

('FLIR DM-624', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'DM-624', 25000.00, 'each',
'Multispectral PTZ Thermal Camera - 18mm thermal, 764m human detection, 4K visible',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
24.0, 24.0, 12,
764, 191, 95,
2343, 586, 293,
ARRAY[], 'basic', false,
-40, 55, false,
'IP66', 'IK10',
'{"visible_camera": "1/2.3 type Exmor R CMOS, 2.8-12mm, 110° to 36° FOV", "pan_speed": "360° continuous", "tilt_angle": "10° to 190°", "ip_video": "H.264 & M-JPEG", "power": "24 VAC, Universal PoE Injector", "onvif": "Profile S", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb),

('FLIR DM-612', 'Cameras', 'Thermal PTZ Cameras', 'FLIR', 'DM-612', 28000.00, 'each',
'Multispectral PTZ Thermal Camera - 36mm thermal, 1528m human detection, 4K visible',
'multispectral', true, '2024-01-01',
'Uncooled sun-safe VOx microbolometer', 50, '640×480 VGA',
12.0, 12.0, 12,
1528, 382, 191,
4686, 1171, 586,
ARRAY[], 'basic', false,
-40, 55, false,
'IP66', 'IK10',
'{"visible_camera": "1/2.3 type Exmor R CMOS, 2.8-12mm, 110° to 36° FOV", "pan_speed": "360° continuous", "tilt_angle": "10° to 190°", "ip_video": "H.264 & M-JPEG", "power": "24 VAC, Universal PoE Injector", "onvif": "Profile S", "warranty": "2 years camera, 10 years thermal sensor"}'::jsonb);

-- =====================================================
-- RADAR PRODUCTS - Ground Surveillance Radar
-- Price Range: $18,000 - $95,000
-- =====================================================

INSERT INTO products (
    name, category, subcategory, manufacturer, model, price, unit,
    description, camera_type, ndaa_compliant, ndaa_certification_date,
    radar_technology, radar_frequency_band, radar_scan_sector, radar_scan_rate,
    detection_range_human, detection_range_vehicle,
    nexus_enabled, operating_temp_min, operating_temp_max,
    ingress_rating, specifications
) VALUES

-- R-290 (FCC Compliant - US Market)
('FLIR R-290', 'Sensors', 'Perimeter Radar', 'FLIR', 'R-290', 22000.00, 'each',
'FCC-Compliant Commercial Ground Radar - 200m walking detection, 400m vehicle detection',
'radar', true, '2024-01-01',
'FMCW', '24.075-24.175 GHz', 'Pan ±43°, Tilt 30°/-60°', 'Up to 10 Hz',
200, 400,
true, -40, 70,
'IP66',
'{"target_types": ["human", "vehicle"], "minimum_detection_velocity": "0.2 m/s", "accuracy": "<1m range, <1° azimuth", "onvif": "Not specified", "warranty": "3 years"}'::jsonb),

-- R-190 (CE Compliant - European Market)
('FLIR R-190', 'Sensors', 'Perimeter Radar', 'FLIR', 'R-190', 22000.00, 'each',
'CE-Compliant Commercial Ground Radar - 125m walking detection, 300m vehicle detection',
'radar', true, '2024-01-01',
'FMCW', '24.000-24.250 GHz', 'Pan ±43°, Tilt 30°/-60°', 'Up to 10 Hz',
125, 300,
true, -40, 70,
'IP66',
'{"target_types": ["human", "vehicle"], "minimum_detection_velocity": "0.2 m/s", "accuracy": "<1m range, <1° azimuth", "onvif": "Not specified", "warranty": "3 years"}'::jsonb),

-- R3 (Mid-Range Perimeter)
('FLIR R3', 'Sensors', 'Perimeter Radar', 'FLIR', 'R3', 38000.00, 'each',
'Perimeter Surveillance Radar - 1900m walking detection, 360° coverage',
'radar', true, '2024-01-01',
'FMCW', 'Ka-Band', '360°', '1 rev/sec (60 rpm)',
1900, 5700,
false, -30, 65,
'IP66',
'{"target_types": ["human", "vehicle"], "minimum_detection_velocity": "0.1 m/s", "accuracy": "0.3m range, 1° azimuth", "onvif": "Not specified", "warranty": "3 years"}'::jsonb),

-- R5 (High Resolution)
('FLIR R5', 'Sensors', 'Perimeter Radar', 'FLIR', 'R5', 52000.00, 'each',
'High Resolution Perimeter Surveillance Radar - 3000m walking detection, 360° coverage',
'radar', true, '2024-01-01',
'FMCW', 'Ka-Band', '360°', '1 rev/sec (60 rpm)',
3000, 9000,
false, -30, 65,
'IP66',
'{"target_types": ["human", "vehicle"], "minimum_detection_velocity": "0.1 m/s", "accuracy": "0.7m range, 1° azimuth", "onvif": "Not specified", "warranty": "3 years"}'::jsonb),

-- R8SS (Long Range + Drone Detection)
('FLIR R8SS', 'Sensors', 'Perimeter Radar', 'FLIR', 'R8SS', 68000.00, 'each',
'Man-Portable Perimeter Surveillance Radar - 8000m walking detection, drone detection',
'radar', true, '2024-01-01',
'FMCW/Doppler', 'X-Band', '90°, 360° with pan/tilt', '2 Hz or 4 Hz (90° sector)',
8000, 24000,
false, -30, 60,
'IP66',
'{"target_types": ["drone", "human", "vehicle"], "minimum_detection_velocity": "0.1 m/s", "accuracy": "3m range, 0.2° azimuth", "drone_detection": "10m-4000m small UAS", "onvif": "Not specified", "warranty": "3 years"}'::jsonb),

-- R20SS-3D (Drone + Ground Surveillance)
('FLIR R20SS-3D', 'Sensors', 'Perimeter Radar', 'FLIR', 'R20SS-3D', 95000.00, 'each',
'Drone Surveillance Radar - 5000m walking detection, 6700m small UAS detection, 40° vertical coverage',
'radar', true, '2024-01-01',
'FMCW/Doppler', 'X-Band', '90° fixed, 360° with P/T, 40° vertical', '2 Hz or 4 Hz (90° sector)',
5000, 15000,
false, -30, 60,
'IP66',
'{"target_types": ["micro_uas", "mini_uas", "small_uas", "human", "vehicle"], "minimum_detection_velocity": "0.1 m/s", "accuracy": "Elevation 2°, 3m range, 0.5° azimuth", "drone_detection": "Micro UAS 20m-2000m, Mini UAS 20m-3500m, Small UAS 20m-6700m", "onvif": "Not specified", "warranty": "3 years"}'::jsonb);
