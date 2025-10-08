/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * FLIR Thermal Camera Scenarios
 * Specialized scenarios for thermal, radiometric, and radar deployments
 * Last Modified: October 07, 2025
 */

import { SecurityScenario, DeploymentTier } from './scenario-library';

// =====================================================
// THERMAL CAMERA SCENARIOS
// Critical Infrastructure, Industrial, Government/NDAA
// =====================================================

export const thermalScenarios: SecurityScenario[] = [
  // =====================================================
  // CRITICAL INFRASTRUCTURE - Solar Farm Perimeter
  // =====================================================
  {
    id: 'solar-farm-perimeter',
    name: 'Solar Farm Perimeter Security',
    description: '500-acre solar installation with thermal perimeter detection, remote monitoring, and NDAA compliance',
    icon: '☀️',
    industryVertical: 'industrial',
    specificUseCase: 'Renewable Energy Critical Infrastructure',
    segments: ['Solar Energy', 'Utility-Scale Power Generation', 'Critical Infrastructure'],
    facilityType: 'Solar Farm / Photovoltaic Plant',
    sqftRange: {
      min: 10000000, // 229 acres
      max: 30000000, // 689 acres
      typical: 21780000, // 500 acres
    },

    assumptions: {
      surveillance: {
        cameras: 24,
        coverage: '2-mile perimeter protection with thermal detection',
        areas: [
          'Main gate entrance/exit',
          'Perimeter fence line (N, S, E, W sectors)',
          'Inverter stations (8 locations)',
          'Substation transformer yard',
          'Equipment storage yards (2)',
          'Access roads',
        ],
        specialRequirements: [
          'FLIR thermal cameras for 24/7 perimeter detection (no lighting required)',
          'Long-range detection (500m-1500m human detection)',
          'Radar integration for wide-area surveillance',
          'NDAA Section 889 compliant for utility/critical infrastructure',
          'Low false alarm rate (thermal + AI analytics)',
          'Remote monitoring (no on-site security staff)',
        ],
      },
      accessControl: {
        doors: 2,
        cardReaders: 4,
        level: 'Basic access control for gates and equipment buildings',
        integrations: ['FLIR Cameleon decision support platform'],
      },
      intrusion: {
        zones: 8,
        sensors: 32,
        monitoring: true,
        specialFeatures: [
          'Fence-mounted fiber optic sensors',
          'Thermal camera intrusion analytics',
          'Radar-triggered PTZ tracking',
          'Automated alerts to remote SOC',
        ],
      },
      fire: {
        detectors: 12,
        coverage: 'Equipment buildings and inverter stations',
      },
    },

    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Basic thermal perimeter with fence sensors',
        vmsOptions: ['flir-meridian'],
        analyticsOptions: [],
        priceRange: { min: 45000, max: 65000 },
        features: [
          '12x FLIR FC-625 thermal cameras (734m detection)',
          '8x FLIR FC-617 thermal cameras (1079m detection)',
          '4x fence intrusion sensors',
          'FLIR Meridian VMS (24 cameras)',
          'Basic intrusion detection analytics',
          'Remote viewing capability',
        ],
        bestFor: [
          'Budget-constrained projects',
          'Standard perimeter protection',
          'Remote solar farms',
        ],
      },
      professional: {
        name: 'professional',
        description: 'Thermal + visible PTZ with AI analytics',
        vmsOptions: ['flir-horizon'],
        analyticsOptions: [],
        priceRange: { min: 75000, max: 95000 },
        features: [
          '16x FLIR FH-625 multispectral cameras (thermal + 4K visible)',
          '4x FLIR PT-625 thermal PTZ with autotracking',
          '4x fence intrusion sensors',
          'FLIR Horizon VMS (150 cameras)',
          'DNN human/vehicle classification',
          'Automated PTZ tracking on thermal alerts',
        ],
        bestFor: [
          'Enhanced detection and verification',
          'Lower false alarm rates',
          'Professional monitoring centers',
        ],
      },
      enterprise: {
        name: 'enterprise',
        description: 'Thermal + radar fusion with decision support',
        vmsOptions: ['flir-cameleon'],
        analyticsOptions: [],
        priceRange: { min: 120000, max: 180000 },
        features: [
          '20x FLIR F-Series ID thermal cameras (enterprise analytics)',
          '4x FLIR PT-Series AI SR thermal PTZ',
          '4x FLIR R5 perimeter radar (3000m detection)',
          '8x fence intrusion sensors',
          'FLIR Cameleon decision support platform',
          'GIS mapping with automated threat tracking',
          'Multi-sensor fusion (thermal + radar + fence)',
          'Automated workflow engine for alerts',
        ],
        bestFor: [
          'Utility-scale critical infrastructure',
          'NERC CIP compliance requirements',
          'Command & control center integration',
        ],
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Not recommended for remote solar farms (connectivity limitations)',
        vmsOptions: ['flir-horizon'],
        analyticsOptions: [],
        priceRange: { min: 75000, max: 95000 },
        features: [
          'Same as Professional tier',
          'Cloud recording backup via cellular',
        ],
        bestFor: [
          'Solar farms with reliable high-speed internet',
        ],
      },
    },

    budgetRange: { min: 45000, max: 180000, typical: 95000 },

    compliance: ['NDAA Section 889', 'NERC CIP (if utility-connected)', 'Local AHJ requirements'],

    timeline: {
      design: 2,
      installation: 3,
      commissioning: 1,
      total: 6,
    },

    roi: {
      description: 'Prevents theft, vandalism, and copper wire theft; reduces insurance premiums',
      paybackPeriodMonths: 18,
      benefits: [
        'Prevent copper wire theft ($50K-$200K per incident)',
        'Reduce insurance premiums (10-20% with certified monitoring)',
        'Avoid revenue loss from vandalism downtime',
        'Comply with utility interconnection security requirements',
      ],
    },
  },

  // =====================================================
  // CRITICAL INFRASTRUCTURE - Electrical Substation
  // =====================================================
  {
    id: 'electrical-substation',
    name: 'Electrical Substation Perimeter Security',
    description: 'NERC CIP compliant substation security with thermal perimeter detection and NDAA-compliant equipment',
    icon: '⚡',
    industryVertical: 'industrial',
    specificUseCase: 'Electrical Utility Critical Infrastructure',
    segments: ['Electric Utility', 'Transmission & Distribution', 'Critical Infrastructure'],
    facilityType: 'Electrical Substation (69kV-500kV)',
    sqftRange: {
      min: 20000, // Small distribution substation
      max: 200000, // Large transmission substation
      typical: 75000, // Typical 138kV/69kV substation
    },

    assumptions: {
      surveillance: {
        cameras: 16,
        coverage: 'Complete perimeter coverage with thermal and visible verification',
        areas: [
          'Main gate entrance',
          'Perimeter fence (4 zones)',
          'Transformer yards (primary and secondary)',
          'Control building exterior',
          'Switchgear areas',
          'Access roads and staging areas',
        ],
        specialRequirements: [
          'NDAA Section 889 compliant (REQUIRED for utility CIP)',
          'FLIR thermal cameras for all-weather 24/7 detection',
          'Long-range detection (500m-1000m)',
          '90-day minimum video retention (CIP requirement)',
          'Cyber-secure network architecture',
          'Redundant recording servers',
        ],
      },
      accessControl: {
        doors: 4,
        cardReaders: 6,
        level: 'NERC CIP compliant access control',
        integrations: ['FLIR Latitude VMS', 'Alarm monitoring station'],
      },
      intrusion: {
        zones: 6,
        sensors: 24,
        monitoring: true,
        specialFeatures: [
          'Perimeter intrusion detection system (fence-mounted)',
          'Thermal camera analytics (intrusion, loitering)',
          'Automated alerts to utility SOC',
          'Integration with SCADA alarm systems',
        ],
      },
      fire: {
        detectors: 8,
        coverage: 'Control building and equipment shelters',
      },
    },

    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Basic NERC CIP compliance (not recommended)',
        vmsOptions: ['flir-horizon'],
        analyticsOptions: [],
        priceRange: { min: 35000, max: 50000 },
        features: [
          '12x FLIR FC-ID thermal cameras',
          '4x FLIR visible cameras (gate/building)',
          'FLIR Horizon VMS with 90-day retention',
          'Basic intrusion detection analytics',
          'NDAA compliant equipment',
        ],
        bestFor: [
          'Small distribution substations',
          'Minimum CIP compliance',
        ],
      },
      professional: {
        name: 'professional',
        description: 'Standard NERC CIP deployment',
        vmsOptions: ['flir-latitude'],
        analyticsOptions: [],
        priceRange: { min: 65000, max: 85000 },
        features: [
          '12x FLIR F-Series ID thermal cameras (enterprise analytics)',
          '4x FLIR FH-ID multispectral cameras',
          '2x FLIR DM-Series thermal PTZ',
          'FLIR Latitude VMS with redundant servers',
          'DNN human/vehicle classification',
          'SCADA system integration',
        ],
        bestFor: [
          'Transmission substations (138kV+)',
          'NERC CIP Medium/High impact facilities',
          'Standard utility deployments',
        ],
      },
      enterprise: {
        name: 'enterprise',
        description: 'High-security CIP with radar integration',
        vmsOptions: ['flir-cameleon'],
        analyticsOptions: [],
        priceRange: { min: 110000, max: 150000 },
        features: [
          '16x FLIR F-Series ID thermal cameras',
          '4x FLIR PT-Series AI SR thermal PTZ',
          '2x FLIR R5 perimeter radar',
          'FLIR Cameleon command & control platform',
          'Multi-sensor fusion and GIS mapping',
          'Hot standby backup servers',
          'Advanced threat correlation',
          'Integration with utility SOC',
        ],
        bestFor: [
          'High-voltage transmission substations (230kV+)',
          'NERC CIP High impact facilities',
          'Mission-critical infrastructure',
        ],
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Not suitable for NERC CIP (on-premise required)',
        vmsOptions: ['flir-latitude'],
        analyticsOptions: [],
        priceRange: { min: 65000, max: 85000 },
        features: [
          'Same as Professional tier',
          'No cloud components (CIP security requirements)',
        ],
        bestFor: [],
      },
    },

    budgetRange: { min: 35000, max: 150000, typical: 85000 },

    compliance: [
      'NERC CIP-006 (Physical Security)',
      'NERC CIP-007 (System Security Management)',
      'NDAA Section 889 (REQUIRED)',
      'TSA Pipeline Security Guidelines (if applicable)',
    ],

    timeline: {
      design: 3,
      installation: 4,
      commissioning: 2,
      total: 9,
    },

    roi: {
      description: 'Mandatory compliance investment - prevents regulatory fines and ensures grid reliability',
      paybackPeriodMonths: 0, // Compliance requirement, not ROI-driven
      benefits: [
        'Avoid NERC violations ($1M+ per day per violation)',
        'Prevent physical security breaches',
        'Ensure grid reliability and public safety',
        'Reduce insurance liability',
      ],
    },
  },

  // =====================================================
  // INDUSTRIAL - Warehouse Fire Detection
  // =====================================================
  {
    id: 'warehouse-fire-detection',
    name: 'Warehouse with Thermal Fire Detection',
    description: '150,000 sq ft warehouse with FLIR radiometric cameras for early fire detection and perimeter security',
    icon: '🔥',
    industryVertical: 'industrial',
    specificUseCase: 'Fire Prevention & Early Detection',
    segments: ['Warehousing', 'Distribution Centers', 'Manufacturing'],
    facilityType: 'Industrial Warehouse / Distribution Center',
    sqftRange: {
      min: 75000,
      max: 300000,
      typical: 150000,
    },

    assumptions: {
      surveillance: {
        cameras: 32,
        coverage: 'Interior fire detection + perimeter security + loading dock monitoring',
        areas: [
          'Warehouse interior ceiling (fire detection - 16 zones)',
          'Loading dock doors (8 bays)',
          'Perimeter fence line',
          'Employee entrances (2)',
          'Office area',
          'Equipment staging areas',
        ],
        specialRequirements: [
          'FLIR FH-R radiometric cameras for temperature monitoring',
          'Temperature threshold alerts (programmable hot-spots)',
          'FLIR FC-ID thermal for perimeter (no lighting needed)',
          'Integration with fire alarm panel',
          'Early fire detection (before smoke detectors)',
          'Hot equipment monitoring',
        ],
      },
      accessControl: {
        doors: 6,
        cardReaders: 8,
        level: 'Employee and visitor access control',
        integrations: ['VMS platform', 'Fire alarm system'],
      },
      intrusion: {
        zones: 4,
        sensors: 16,
        monitoring: true,
        specialFeatures: [
          'After-hours intrusion detection',
          'Loading dock door sensors',
          'Thermal camera perimeter analytics',
        ],
      },
      fire: {
        detectors: 50,
        coverage: 'Full warehouse with radiometric thermal supplement',
      },
    },

    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Perimeter security only (no fire detection)',
        vmsOptions: ['flir-meridian'],
        analyticsOptions: [],
        priceRange: { min: 28000, max: 38000 },
        features: [
          '12x FLIR FC-ID thermal perimeter cameras',
          '8x FLIR visible cameras (loading docks)',
          'FLIR Meridian VMS (24 cameras)',
          'Basic intrusion analytics',
        ],
        bestFor: [
          'Basic perimeter security',
          'Budget-constrained projects',
        ],
      },
      professional: {
        name: 'professional',
        description: 'Perimeter security + basic fire monitoring',
        vmsOptions: ['flir-horizon'],
        analyticsOptions: [],
        priceRange: { min: 55000, max: 75000 },
        features: [
          '16x FLIR FC-ID thermal perimeter cameras',
          '8x FLIR FH-R radiometric cameras (interior fire detection)',
          '8x visible cameras (loading docks)',
          'FLIR Horizon VMS (32+ cameras)',
          'Temperature threshold monitoring (50°C-380°C)',
          'Automated alerts on hot-spot detection',
        ],
        bestFor: [
          'Warehouses with high-value inventory',
          'Insurance risk reduction',
          'Early fire detection',
        ],
      },
      enterprise: {
        name: 'enterprise',
        description: 'Comprehensive fire detection + advanced security',
        vmsOptions: ['flir-latitude'],
        analyticsOptions: [],
        priceRange: { min: 95000, max: 130000 },
        features: [
          '20x FLIR F-Series ID thermal cameras (perimeter)',
          '12x FLIR FH-R radiometric cameras (ceiling-mounted fire detection)',
          '2x FLIR PT-Series thermal PTZ (loading docks)',
          'FLIR Latitude VMS with redundancy',
          'Advanced radiometric analytics (isotherms, hot-spot mapping)',
          'Integration with fire alarm panel and sprinkler system',
          'Automated temperature-based alerts',
          'Equipment health monitoring',
        ],
        bestFor: [
          'High-value inventory ($10M+)',
          'Hazardous materials storage',
          'Insurance compliance and premium reduction',
        ],
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Hybrid on-premise + cloud backup',
        vmsOptions: ['flir-latitude'],
        analyticsOptions: [],
        priceRange: { min: 95000, max: 130000 },
        features: [
          'Same as Enterprise tier',
          'Cloud backup recording',
          'Remote temperature dashboard',
        ],
        bestFor: [
          'Multi-site distribution networks',
          'Remote monitoring by corporate safety teams',
        ],
      },
    },

    budgetRange: { min: 28000, max: 130000, typical: 75000 },

    compliance: [
      'NFPA 72 (National Fire Alarm Code - supplement)',
      'OSHA warehouse safety requirements',
      'Local fire marshal approval',
      'Insurance underwriter requirements',
    ],

    timeline: {
      design: 2,
      installation: 3,
      commissioning: 1,
      total: 6,
    },

    roi: {
      description: 'Early fire detection prevents catastrophic loss; reduces insurance premiums',
      paybackPeriodMonths: 12,
      benefits: [
        'Prevent catastrophic fire loss ($5M-$50M)',
        'Reduce insurance premiums (15-25% with certified fire detection)',
        'Detect equipment failures before fires start',
        'Comply with insurance underwriter requirements',
        'Protect employee safety',
      ],
    },
  },

  // Continue with additional scenarios...
  // (Federal Building, Data Center, Chemical Plant, Military Base scenarios would follow same pattern)
];

export default thermalScenarios;
