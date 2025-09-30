// lib/vms-analytics-database.ts
// VMS and Analytics platforms database from enterprise guides

import { VMSOption, AnalyticsOption } from './scenario-library';

export const vmsOptions: VMSOption[] = [
  // Entry Level VMS
  {
    id: 'basic-nvr',
    name: 'Basic NVR System',
    vendor: 'Generic',
    deploymentModel: 'on-premise',
    priceModel: 'per-camera-perpetual',
    priceRange: { min: 200, max: 400 },
    features: [
      'Local recording',
      'Motion detection',
      'Remote viewing',
      'Mobile app access'
    ],
    bestFor: [
      'Small businesses',
      'Single locations',
      'Budget-conscious projects'
    ]
  },
  {
    id: 'hanwha-wave',
    name: 'Hanwha Wave (IPtechview)',
    vendor: 'Hanwha Vision',
    deploymentModel: 'on-premise',
    priceModel: 'per-camera-perpetual',
    priceRange: { min: 0, max: 100 }, // Free with Hanwha cameras
    features: [
      'FREE with Hanwha cameras',
      'Windows-based VMS',
      'Basic analytics',
      'Multi-site management'
    ],
    bestFor: [
      'Budget projects',
      'All-Hanwha deployments',
      'Small-to-mid businesses'
    ]
  },

  // Professional Level VMS
  {
    id: 'openeye-ows',
    name: 'OpenEye Web Services',
    vendor: 'OpenEye (Motorola)',
    deploymentModel: 'cloud',
    priceModel: 'per-camera-monthly',
    priceRange: { min: 20, max: 40 },
    features: [
      'Cloud-based VMS',
      'Simple interface',
      'US-based support',
      'Mobile access',
      'Video analytics'
    ],
    bestFor: [
      'Mid-market businesses',
      'Regional chains',
      'Simple deployments'
    ]
  },
  {
    id: 'eagle-eye-cloud',
    name: 'Eagle Eye Networks',
    vendor: 'Eagle Eye Networks',
    deploymentModel: 'cloud',
    priceModel: 'per-camera-monthly',
    priceRange: { min: 15, max: 50 },
    features: [
      '100% cloud-native',
      'Camera agnostic (10,000+ models)',
      'AI analytics included',
      'Bandwidth optimization',
      'Mobile-first design'
    ],
    bestFor: [
      'Multi-location retail',
      'Franchise operations',
      'Remote sites',
      'No IT staff'
    ]
  },
  {
    id: 'milestone-professional',
    name: 'Milestone XProtect Professional+',
    vendor: 'Milestone Systems',
    deploymentModel: 'on-premise',
    priceModel: 'per-camera-perpetual',
    priceRange: { min: 400, max: 600 },
    features: [
      'Open platform (14,700+ devices)',
      'Up to 256 cameras',
      'Cloud integration ready',
      'Advanced search',
      'Evidence export'
    ],
    bestFor: [
      'System integrators',
      'Diverse camera infrastructure',
      'Scalable deployments'
    ]
  },

  // Enterprise Level VMS
  {
    id: 'genetec-security-center',
    name: 'Genetec Security Center',
    vendor: 'Genetec',
    deploymentModel: 'on-premise',
    priceModel: 'per-camera-perpetual',
    priceRange: { min: 1500, max: 2500 },
    features: [
      'Unified platform (video + access + LPR)',
      'Enterprise cybersecurity',
      'Open architecture (1000+ brands)',
      'Federation capability',
      'AI-powered search'
    ],
    bestFor: [
      'Large enterprise',
      'Government agencies',
      'Critical infrastructure',
      'Healthcare (HIPAA)'
    ]
  },
  {
    id: 'genetec-saas',
    name: 'Genetec Security Center SaaS',
    vendor: 'Genetec',
    deploymentModel: 'cloud',
    priceModel: 'per-camera-monthly',
    priceRange: { min: 30, max: 60 },
    features: [
      'Enterprise cloud platform',
      'Unified security (video + access)',
      'Data sovereignty options',
      'Advanced compliance',
      'Hybrid deployment ready'
    ],
    bestFor: [
      'Enterprise wanting cloud',
      'Multi-national organizations',
      'Regulatory compliance'
    ]
  },
  {
    id: 'milestone-corporate',
    name: 'Milestone XProtect Corporate',
    vendor: 'Milestone Systems',
    deploymentModel: 'hybrid',
    priceModel: 'per-camera-perpetual',
    priceRange: { min: 800, max: 1200 },
    features: [
      'Unlimited cameras',
      'Multi-site management',
      'Milestone Interconnect',
      'Advanced analytics ready',
      'Cloud deployment options'
    ],
    bestFor: [
      'Large enterprises',
      'Multi-site operations',
      'Integration-heavy projects'
    ]
  },

  // Cloud-First VMS
  {
    id: 'verkada-command',
    name: 'Verkada Command Platform',
    vendor: 'Verkada',
    deploymentModel: 'hybrid',
    priceModel: 'custom',
    priceRange: { min: 2000, max: 6000 }, // 10-year TCO per camera
    features: [
      'No NVR required (cameras have storage)',
      'Plug & play deployment',
      'AI-powered search',
      'Unified platform (video + access + sensors)',
      '10-year warranty'
    ],
    bestFor: [
      'IT-lean organizations',
      'Fast-growing companies',
      'Modern enterprises',
      'Rapid deployments'
    ]
  }
];

export const analyticsOptions: AnalyticsOption[] = [
  // Weapons Detection
  {
    id: 'scylla-gun-detection',
    name: 'Scylla Weapons Detection',
    vendor: 'Scylla Technologies',
    specialty: 'Physical Threat Detection',
    priceModel: 'per-camera-annual',
    priceRange: { min: 300, max: 800 },
    features: [
      'Real-time gun detection (<1 second)',
      '98.5% accuracy, 99.95% false alarm reduction',
      'Works from 50m+ (4K cameras)',
      'Battle-proven (US military use)',
      'Mobile alerts with screenshots'
    ],
    integrations: [
      'Milestone XProtect',
      'Genetec Security Center',
      'MOBOTIX',
      'Axis cameras',
      'exacqVision'
    ]
  },

  // Advanced Behavioral Analytics
  {
    id: 'ipsotek-visuite',
    name: 'Ipsotek VISuite AI',
    vendor: 'Ipsotek (Eviden)',
    specialty: 'Scenario-based Behavior Analysis',
    priceModel: 'perpetual',
    priceRange: { min: 500, max: 2000 },
    features: [
      '32+ rules per camera',
      'Scenario-based rule engine (SBRE)',
      'GPU-accelerated AI',
      'Auto-calibration',
      'PTZ auto-tracking',
      'Multi-sensor fusion'
    ],
    integrations: [
      'Milestone XProtect',
      'Genetec Security Center',
      'Most VMS via ONVIF'
    ]
  },

  // Face Recognition
  {
    id: 'oosto-face-recognition',
    name: 'Oosto Vision AI',
    vendor: 'Oosto',
    specialty: 'Face Recognition & Identity Management',
    priceModel: 'per-camera-annual',
    priceRange: { min: 500, max: 1500 },
    features: [
      'Watchlist alerting',
      'VIP recognition',
      'Demographics analytics',
      'Privacy-first (GDPR compliant)',
      'Appearance search',
      'Crowd analytics'
    ],
    integrations: [
      'Major VMS platforms',
      'Access control systems',
      'GPU server required'
    ]
  },

  // False Alarm Reduction
  {
    id: 'actuate-ai-filtering',
    name: 'Actuate AI',
    vendor: 'Actuate',
    specialty: 'False Alarm Reduction',
    priceModel: 'per-camera-monthly',
    priceRange: { min: 10, max: 30 },
    features: [
      '95%+ false positive reduction',
      'Multiple AI models',
      'Camera health monitoring',
      'Cloud-based processing',
      'Monitoring center integration'
    ],
    integrations: [
      'Major monitoring platforms',
      'Central stations',
      'Enterprise SOCs'
    ]
  },

  // Integrated Platform Analytics
  {
    id: 'avigilon-analytics',
    name: 'Avigilon Analytics Suite',
    vendor: 'Avigilon (Motorola)',
    specialty: 'Integrated Platform Analytics',
    priceModel: 'per-camera-perpetual',
    priceRange: { min: 200, max: 500 },
    features: [
      'Appearance search',
      'Unusual motion detection (UMD)',
      'Focus of attention (FoA)',
      'License plate recognition',
      'Built into cameras and VMS',
      'Crowd analytics'
    ],
    integrations: [
      'Avigilon VMS (native)',
      'Motorola ecosystem',
      'Third-party via partnerships'
    ]
  }
];

// Helper functions
export function getVMSByDeployment(deployment: 'cloud' | 'on-premise' | 'hybrid'): VMSOption[] {
  return vmsOptions.filter(vms =>
    vms.deploymentModel === deployment || vms.deploymentModel === 'hybrid'
  );
}

export function getVMSByPriceRange(maxBudgetPerCamera: number): VMSOption[] {
  return vmsOptions.filter(vms => vms.priceRange.min <= maxBudgetPerCamera);
}

export function getAnalyticsBySpecialty(specialty: string): AnalyticsOption[] {
  return analyticsOptions.filter(analytics =>
    analytics.specialty.toLowerCase().includes(specialty.toLowerCase())
  );
}

export function getCompatibleAnalytics(vmsId: string): AnalyticsOption[] {
  const vms = vmsOptions.find(v => v.id === vmsId);
  if (!vms) return [];

  // Return analytics that integrate with this VMS
  return analyticsOptions.filter(analytics =>
    analytics.integrations.some(integration =>
      integration.toLowerCase().includes(vms.vendor.toLowerCase()) ||
      integration.toLowerCase().includes(vms.name.toLowerCase())
    )
  );
}