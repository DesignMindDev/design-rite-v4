/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * Patent Pending - Security scenario algorithms and assessment systems.
 *
 * Scenario Library - Pre-built security scenarios with standard assumptions
 * Last Modified: October 01, 2025
 */

import { VMSOption, AnalyticsOption } from './vms-analytics-database';

export interface VMSOption {
  id: string;
  name: string;
  vendor: string;
  deploymentModel: 'cloud' | 'on-premise' | 'hybrid';
  priceModel: 'per-camera-monthly' | 'per-camera-perpetual' | 'per-site' | 'custom';
  priceRange: { min: number; max: number };
  features: string[];
  bestFor: string[];
}

export interface AnalyticsOption {
  id: string;
  name: string;
  vendor: string;
  specialty: string;
  priceModel: 'per-camera-annual' | 'per-camera-monthly' | 'perpetual' | 'custom';
  priceRange: { min: number; max: number };
  features: string[];
  integrations: string[];
}

export interface DeploymentTier {
  name: 'entry' | 'professional' | 'enterprise' | 'cloud-first';
  description: string;
  vmsOptions: string[]; // VMS IDs from vms-analytics-database
  analyticsOptions: string[]; // Analytics IDs from vms-analytics-database
  priceRange: { min: number; max: number };
  features: string[];
  bestFor: string[];
}

export interface SecurityScenario {
  id: string;
  name: string;
  description: string;
  icon: string;

  // Enhanced industry classification
  industryVertical: 'retail' | 'hospitality' | 'office' | 'education' | 'healthcare' | 'industrial';
  specificUseCase: string;
  segments: string[]; // Industry segments (QSR, Gas Station, etc.)

  facilityType: string;
  sqftRange: {
    min: number;
    max: number;
    typical: number;
  };

  // Enhanced assumptions with specific details
  assumptions: {
    surveillance: {
      cameras: number;
      coverage: string;
      areas: string[];
      specialRequirements?: string[];
    };
    accessControl: {
      doors: number;
      cardReaders: number;
      level: string;
      integrations?: string[];
    };
    intrusion: {
      zones: number;
      sensors: number;
      monitoring: boolean;
      specialFeatures?: string[];
    };
    fire: {
      detectors: number;
      coverage: string;
    };
  };

  // Enhanced pricing with deployment tiers
  deploymentTiers: {
    entry: DeploymentTier;
    professional: DeploymentTier;
    enterprise: DeploymentTier;
    cloudFirst: DeploymentTier;
  };

  // Budget ranges for different deployment approaches
  budgetRange: { min: number; max: number; typical: number };

  compliance: string[];
  securityConcerns: string[];

  // Industry-specific features
  industrySpecifics: {
    keyFeatures: string[];
    criticalIntegrations?: string[];
    regulatoryRequirements?: string[];
  };

  confidenceLevel: number; // 65-80% based on assumptions
}

export const securityScenarios: SecurityScenario[] = [
  {
    id: 'small-office',
    name: 'Small Office',
    description: '1-25 employees, single location professional office',
    icon: '🏢',
    industryVertical: 'office',
    specificUseCase: 'Small Professional Office',
    segments: ['Professional Services', 'Consulting', 'Real Estate'],
    facilityType: 'Commercial Office',
    sqftRange: { min: 1000, max: 5000, typical: 2500 },
    assumptions: {
      surveillance: {
        cameras: 6,
        coverage: 'standard',
        areas: ['Main entrance', 'Reception area', 'Parking lot', 'Back entrance', 'Server room']
      },
      accessControl: {
        doors: 3,
        cardReaders: 2,
        level: 'standard'
      },
      intrusion: {
        zones: 4,
        sensors: 8,
        monitoring: true
      },
      fire: {
        detectors: 12,
        coverage: 'code-minimum'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Basic security with essential coverage',
        vmsOptions: ['basic-nvr', 'hanwha-wave'],
        analyticsOptions: [],
        priceRange: { min: 8000, max: 12000 },
        features: ['Local recording', 'Basic motion detection', 'Mobile viewing'],
        bestFor: ['Budget-conscious businesses', 'Basic security needs']
      },
      professional: {
        name: 'professional',
        description: 'Enhanced security with cloud integration',
        vmsOptions: ['openeye-ows', 'eagle-eye-cloud', 'milestone-professional'],
        analyticsOptions: ['actuate-ai-filtering'],
        priceRange: { min: 12000, max: 18000 },
        features: ['Cloud backup', 'Advanced analytics', 'Mobile alerts', 'Remote management'],
        bestFor: ['Growing businesses', 'Professional image', 'Remote monitoring needs']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Complete security platform with integrations',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['ipsotek-visuite', 'avigilon-analytics'],
        priceRange: { min: 18000, max: 25000 },
        features: ['Unified platform', 'Advanced integrations', 'Compliance reporting', '24/7 monitoring'],
        bestFor: ['Multi-location businesses', 'Compliance requirements', 'High security needs']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud-native security platform',
        vmsOptions: ['verkada-command', 'genetec-saas'],
        analyticsOptions: ['oosto-face-recognition', 'scylla-gun-detection'],
        priceRange: { min: 15000, max: 22000 },
        features: ['No servers needed', 'AI-powered', 'Instant deployment', 'Modern interface'],
        bestFor: ['Tech-forward companies', 'Fast deployment', 'Minimal IT maintenance']
      }
    },
    compliance: ['General Business Security'],
    securityConcerns: ['After-hours access', 'Visitor management', 'Equipment protection'],
    industrySpecifics: {
      keyFeatures: ['Professional appearance', 'Visitor management', 'After-hours monitoring'],
      criticalIntegrations: ['Access control', 'Visitor management systems'],
      regulatoryRequirements: ['General business insurance requirements']
    },
    budgetRange: { min: 8000, max: 25000, typical: 15000 },
    confidenceLevel: 75
  },
  {
    id: 'medium-office',
    name: 'Medium Office',
    description: '25-100 employees, multi-department office building',
    icon: '🏬',
    industryVertical: 'office',
    specificUseCase: 'Multi-Department Office Building',
    segments: ['Corporate Office', 'Professional Services', 'Regional Headquarters'],
    facilityType: 'Commercial Office',
    sqftRange: { min: 5000, max: 20000, typical: 10000 },
    assumptions: {
      surveillance: {
        cameras: 16,
        coverage: 'comprehensive',
        areas: ['All entrances', 'Reception', 'Parking areas', 'Hallways', 'Conference rooms', 'IT room']
      },
      accessControl: {
        doors: 8,
        cardReaders: 6,
        level: 'advanced'
      },
      intrusion: {
        zones: 8,
        sensors: 16,
        monitoring: true
      },
      fire: {
        detectors: 35,
        coverage: 'enhanced'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Professional security with local management',
        vmsOptions: ['basic-nvr', 'milestone-professional'],
        analyticsOptions: [],
        priceRange: { min: 25000, max: 35000 },
        features: ['Professional recording', 'Mobile access', 'Visitor management'],
        bestFor: ['Cost-conscious businesses', 'Single building operations']
      },
      professional: {
        name: 'professional',
        description: 'Advanced security with cloud integration',
        vmsOptions: ['openeye-ows', 'eagle-eye-cloud', 'milestone-professional'],
        analyticsOptions: ['actuate-ai-filtering', 'avigilon-analytics'],
        priceRange: { min: 35000, max: 50000 },
        features: ['Cloud backup', 'Advanced analytics', 'Multi-site ready', 'Integration platform'],
        bestFor: ['Growing companies', 'Multi-location businesses', 'Professional requirements']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Corporate platform with unified security',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['ipsotek-visuite', 'oosto-face-recognition', 'avigilon-analytics'],
        priceRange: { min: 50000, max: 70000 },
        features: ['Unified platform', 'Advanced compliance', 'Corporate integrations', 'Enterprise analytics'],
        bestFor: ['Large corporations', 'Compliance requirements', 'Complex integrations']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud platform with AI capabilities',
        vmsOptions: ['verkada-command', 'genetec-saas'],
        analyticsOptions: ['oosto-face-recognition', 'ipsotek-visuite'],
        priceRange: { min: 45000, max: 65000 },
        features: ['Zero maintenance', 'AI-powered insights', 'Instant scaling', 'Modern UX'],
        bestFor: ['Tech-forward companies', 'Rapid deployment', 'Remote workforce']
      }
    },
    compliance: ['General Business Security', 'Data Protection'],
    securityConcerns: ['Multi-floor access control', 'Visitor tracking', 'Asset protection', 'After-hours monitoring'],
    industrySpecifics: {
      keyFeatures: ['Multi-floor management', 'Visitor tracking', 'Conference room monitoring', 'Asset protection'],
      criticalIntegrations: ['Access control', 'Visitor management', 'IT systems', 'HR systems'],
      regulatoryRequirements: ['Data protection compliance', 'Employee privacy laws']
    },
    budgetRange: { min: 25000, max: 70000, typical: 45000 },
    confidenceLevel: 70
  },
  {
    id: 'retail-boutique',
    name: 'Retail Boutique',
    description: 'Small retail store, high-value merchandise',
    icon: '🛍️',
    industryVertical: 'retail',
    specificUseCase: 'High-End Retail Boutique',
    segments: ['Fashion Retail', 'Jewelry Store', 'Luxury Goods'],
    facilityType: 'Retail Store',
    sqftRange: { min: 500, max: 3000, typical: 1200 },
    assumptions: {
      surveillance: {
        cameras: 8,
        coverage: 'comprehensive',
        areas: ['Sales floor', 'Checkout', 'Storage', 'Entrance', 'Fitting rooms']
      },
      accessControl: {
        doors: 2,
        cardReaders: 1,
        level: 'standard'
      },
      intrusion: {
        zones: 3,
        sensors: 6,
        monitoring: true
      },
      fire: {
        detectors: 8,
        coverage: 'code-minimum'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Essential theft prevention and monitoring',
        vmsOptions: ['basic-nvr', 'hanwha-wave'],
        analyticsOptions: [],
        priceRange: { min: 6000, max: 10000 },
        features: ['Basic recording', 'Mobile alerts', 'POS integration'],
        bestFor: ['Independent retailers', 'Start-up boutiques']
      },
      professional: {
        name: 'professional',
        description: 'Advanced loss prevention with analytics',
        vmsOptions: ['openeye-ows', 'eagle-eye-cloud'],
        analyticsOptions: ['actuate-ai-filtering', 'avigilon-analytics'],
        priceRange: { min: 10000, max: 15000 },
        features: ['Loss prevention analytics', 'Customer counting', 'Cloud backup', 'Advanced alerts'],
        bestFor: ['Established boutiques', 'High-value inventory', 'Multi-location retail']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Premium security with facial recognition',
        vmsOptions: ['genetec-security-center', 'milestone-professional'],
        analyticsOptions: ['oosto-face-recognition', 'ipsotek-visuite'],
        priceRange: { min: 15000, max: 22000 },
        features: ['Facial recognition', 'VIP customer identification', 'Advanced behavior analytics'],
        bestFor: ['Luxury retailers', 'High-risk locations', 'Chain stores']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern retail platform with AI insights',
        vmsOptions: ['verkada-command', 'eagle-eye-cloud'],
        analyticsOptions: ['oosto-face-recognition', 'avigilon-analytics'],
        priceRange: { min: 12000, max: 18000 },
        features: ['AI customer insights', 'Heat mapping', 'Real-time analytics', 'Mobile management'],
        bestFor: ['Tech-savvy retailers', 'Data-driven operations', 'Modern store concepts']
      }
    },
    compliance: ['PCI Compliance', 'Retail Security Standards'],
    securityConcerns: ['Theft prevention', 'Customer safety', 'Inventory protection', 'Point-of-sale security'],
    industrySpecifics: {
      keyFeatures: ['Loss prevention', 'Customer behavior analytics', 'POS integration', 'Inventory protection'],
      criticalIntegrations: ['POS systems', 'Inventory management', 'Access control'],
      regulatoryRequirements: ['PCI compliance', 'Customer privacy protection']
    },
    budgetRange: { min: 6000, max: 22000, typical: 12000 },
    confidenceLevel: 80
  },
  {
    id: 'elementary-school',
    name: 'Elementary School',
    description: 'K-5 school building with multiple classrooms',
    icon: '🏫',
    industryVertical: 'education',
    specificUseCase: 'Elementary School Campus',
    segments: ['Public School', 'Private School', 'Charter School'],
    facilityType: 'Educational Facility',
    sqftRange: { min: 15000, max: 40000, typical: 25000 },
    assumptions: {
      surveillance: {
        cameras: 24,
        coverage: 'comprehensive',
        areas: ['All entrances', 'Hallways', 'Playground', 'Cafeteria', 'Main office', 'Parking lot'],
        specialRequirements: ['Privacy compliance', 'Lockdown integration', 'Perimeter monitoring']
      },
      accessControl: {
        doors: 12,
        cardReaders: 8,
        level: 'high-security',
        integrations: ['Visitor management', 'Lockdown systems']
      },
      intrusion: {
        zones: 12,
        sensors: 24,
        monitoring: true,
        specialFeatures: ['Lockdown procedures', 'Emergency alerts', 'Law enforcement integration']
      },
      fire: {
        detectors: 60,
        coverage: 'enhanced'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Basic school security with essential safety features',
        vmsOptions: ['basic-nvr', 'milestone-professional'],
        analyticsOptions: [],
        priceRange: { min: 45000, max: 60000 },
        features: ['Basic monitoring', 'Visitor management', 'Emergency procedures'],
        bestFor: ['Small schools', 'Budget-constrained districts']
      },
      professional: {
        name: 'professional',
        description: 'Enhanced school security with advanced monitoring',
        vmsOptions: ['openeye-ows', 'milestone-professional', 'eagle-eye-cloud'],
        analyticsOptions: ['actuate-ai-filtering', 'avigilon-analytics'],
        priceRange: { min: 60000, max: 80000 },
        features: ['Advanced analytics', 'Threat detection', 'Cloud backup', 'Mobile alerts'],
        bestFor: ['Standard public schools', 'Private schools', 'Medium districts']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Comprehensive school safety platform',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['scylla-gun-detection', 'ipsotek-visuite', 'avigilon-analytics'],
        priceRange: { min: 80000, max: 110000 },
        features: ['Weapons detection', 'Unified safety platform', 'District integration', 'Advanced compliance'],
        bestFor: ['Large schools', 'High-risk areas', 'District-wide deployments']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud-based school safety system',
        vmsOptions: ['verkada-command', 'genetec-saas'],
        analyticsOptions: ['scylla-gun-detection', 'oosto-face-recognition'],
        priceRange: { min: 70000, max: 100000 },
        features: ['AI-powered safety', 'Real-time alerts', 'No servers needed', 'District dashboard'],
        bestFor: ['Tech-forward districts', 'Remote management', 'Modern schools']
      }
    },
    compliance: ['FERPA', 'School Safety Standards', 'State Education Requirements'],
    securityConcerns: ['Student safety', 'Visitor screening', 'Lockdown procedures', 'Perimeter security'],
    industrySpecifics: {
      keyFeatures: ['Visitor management', 'Lockdown procedures', 'Threat detection', 'Student privacy'],
      criticalIntegrations: ['PA systems', 'Emergency notification', 'Law enforcement', 'District systems'],
      regulatoryRequirements: ['FERPA compliance', 'State safety standards', 'Emergency procedures']
    },
    budgetRange: { min: 45000, max: 110000, typical: 75000 },
    confidenceLevel: 65
  },
  {
    id: 'medical-clinic',
    name: 'Medical Clinic',
    description: 'Healthcare facility with patient privacy requirements',
    icon: '🏥',
    industryVertical: 'healthcare',
    specificUseCase: 'Outpatient Medical Clinic',
    segments: ['Primary Care', 'Specialty Clinic', 'Urgent Care'],
    facilityType: 'Healthcare Facility',
    sqftRange: { min: 3000, max: 12000, typical: 6000 },
    assumptions: {
      surveillance: {
        cameras: 12,
        coverage: 'privacy-compliant',
        areas: ['Waiting area', 'Reception', 'Entrances', 'Parking', 'Staff areas (not patient areas)'],
        specialRequirements: ['HIPAA compliance', 'Patient privacy zones', 'No recording in treatment areas']
      },
      accessControl: {
        doors: 6,
        cardReaders: 4,
        level: 'high-security',
        integrations: ['EMR systems', 'Pharmacy access']
      },
      intrusion: {
        zones: 6,
        sensors: 12,
        monitoring: true,
        specialFeatures: ['Medication security', 'After-hours protection']
      },
      fire: {
        detectors: 25,
        coverage: 'healthcare-grade'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'HIPAA-compliant basic security',
        vmsOptions: ['basic-nvr', 'milestone-professional'],
        analyticsOptions: [],
        priceRange: { min: 18000, max: 25000 },
        features: ['Privacy-compliant monitoring', 'Access control', 'Basic compliance'],
        bestFor: ['Small clinics', 'Single-provider practices']
      },
      professional: {
        name: 'professional',
        description: 'Enhanced healthcare security with compliance',
        vmsOptions: ['openeye-ows', 'genetec-security-center'],
        analyticsOptions: ['actuate-ai-filtering'],
        priceRange: { min: 25000, max: 35000 },
        features: ['Advanced compliance', 'Medication security', 'Staff safety', 'Incident management'],
        bestFor: ['Multi-provider clinics', 'Specialty practices', 'Urgent care']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Comprehensive healthcare security platform',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['ipsotek-visuite', 'avigilon-analytics'],
        priceRange: { min: 35000, max: 50000 },
        features: ['Unified healthcare platform', 'Advanced compliance', 'Integration with EMR', 'Audit trails'],
        bestFor: ['Large clinics', 'Hospital affiliates', 'Multi-location practices']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud healthcare security',
        vmsOptions: ['genetec-saas', 'eagle-eye-cloud'],
        analyticsOptions: ['avigilon-analytics'],
        priceRange: { min: 30000, max: 45000 },
        features: ['Cloud compliance', 'Remote management', 'Modern interface', 'Data sovereignty'],
        bestFor: ['Tech-forward practices', 'Remote locations', 'Telemedicine integration']
      }
    },
    compliance: ['HIPAA', 'Healthcare Security Standards', 'Patient Privacy Laws'],
    securityConcerns: ['Patient privacy', 'Medication security', 'Staff safety', 'Records protection'],
    industrySpecifics: {
      keyFeatures: ['Patient privacy protection', 'Medication security', 'Staff safety', 'Compliance auditing'],
      criticalIntegrations: ['EMR systems', 'Pharmacy management', 'Access control', 'Nurse call systems'],
      regulatoryRequirements: ['HIPAA compliance', 'State healthcare regulations', 'DEA requirements']
    },
    budgetRange: { min: 18000, max: 50000, typical: 32000 },
    confidenceLevel: 70
  },
  {
    id: 'warehouse',
    name: 'Warehouse/Distribution',
    description: 'Industrial storage and distribution facility',
    icon: '🏭',
    industryVertical: 'industrial',
    specificUseCase: 'Distribution and Logistics Facility',
    segments: ['Distribution Center', 'Manufacturing', 'Cold Storage'],
    facilityType: 'Industrial Warehouse',
    sqftRange: { min: 10000, max: 100000, typical: 30000 },
    assumptions: {
      surveillance: {
        cameras: 20,
        coverage: 'perimeter-focused',
        areas: ['Loading docks', 'Entrances', 'Perimeter', 'High-value storage', 'Office area'],
        specialRequirements: ['Wide-area coverage', 'License plate recognition', 'Vehicle tracking']
      },
      accessControl: {
        doors: 6,
        cardReaders: 4,
        level: 'industrial',
        integrations: ['WMS systems', 'Loading dock controls']
      },
      intrusion: {
        zones: 8,
        sensors: 16,
        monitoring: true,
        specialFeatures: ['Perimeter protection', 'Vehicle detection', 'Cargo monitoring']
      },
      fire: {
        detectors: 40,
        coverage: 'industrial-grade'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Basic industrial security with perimeter focus',
        vmsOptions: ['basic-nvr', 'milestone-professional'],
        analyticsOptions: [],
        priceRange: { min: 35000, max: 50000 },
        features: ['Perimeter monitoring', 'Loading dock coverage', 'Basic access control'],
        bestFor: ['Small warehouses', 'Single-shift operations']
      },
      professional: {
        name: 'professional',
        description: 'Enhanced industrial security with analytics',
        vmsOptions: ['openeye-ows', 'milestone-professional'],
        analyticsOptions: ['actuate-ai-filtering', 'avigilon-analytics'],
        priceRange: { min: 50000, max: 70000 },
        features: ['License plate recognition', 'Cargo tracking', 'Advanced perimeter', 'Mobile alerts'],
        bestFor: ['Medium warehouses', '24/7 operations', 'High-value cargo']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Comprehensive industrial security platform',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['ipsotek-visuite', 'avigilon-analytics'],
        priceRange: { min: 70000, max: 100000 },
        features: ['Unified platform', 'WMS integration', 'Advanced analytics', 'Corporate reporting'],
        bestFor: ['Large facilities', 'Multi-site operations', 'Complex integrations']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud industrial security',
        vmsOptions: ['verkada-command', 'eagle-eye-cloud'],
        analyticsOptions: ['ipsotek-visuite', 'avigilon-analytics'],
        priceRange: { min: 60000, max: 90000 },
        features: ['AI-powered insights', 'Remote management', 'Predictive analytics', 'Modern dashboard'],
        bestFor: ['Tech-forward operations', 'Remote sites', 'Data-driven logistics']
      }
    },
    compliance: ['Industrial Security Standards', 'OSHA Requirements'],
    securityConcerns: ['Cargo theft', 'Perimeter security', 'Employee safety', 'Inventory protection'],
    industrySpecifics: {
      keyFeatures: ['Perimeter security', 'Vehicle tracking', 'Cargo monitoring', 'Loading dock security'],
      criticalIntegrations: ['WMS systems', 'Loading dock controls', 'Fleet management', 'Inventory systems'],
      regulatoryRequirements: ['OSHA compliance', 'Transportation security', 'Cargo tracking regulations']
    },
    budgetRange: { min: 35000, max: 100000, typical: 65000 },
    confidenceLevel: 70
  },
  {
    id: 'gas-station',
    name: 'Gas Station',
    description: 'Fuel retail location with high-theft risk and compliance requirements',
    icon: '⛽',
    industryVertical: 'retail',
    specificUseCase: 'Fuel Retail Station',
    segments: ['Convenience Store', 'Fuel Retail', 'Quick Service'],
    facilityType: 'Gas Station/Convenience Store',
    sqftRange: { min: 2000, max: 6000, typical: 3500 },
    assumptions: {
      surveillance: {
        cameras: 16,
        coverage: 'comprehensive',
        areas: ['All fuel pumps', 'Store interior', 'Cash registers', 'Entrances', 'Parking lot', 'Storage areas'],
        specialRequirements: ['Explosion-proof cameras at pumps', 'High-resolution for license plates', 'Night vision capability']
      },
      accessControl: {
        doors: 4,
        cardReaders: 2,
        level: 'high-security',
        integrations: ['Cash management systems', 'POS integration']
      },
      intrusion: {
        zones: 8,
        sensors: 12,
        monitoring: true,
        specialFeatures: ['Glass break detection', 'Perimeter protection', 'Silent alarms']
      },
      fire: {
        detectors: 20,
        coverage: 'enhanced'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Basic compliance with essential theft prevention',
        vmsOptions: ['basic-nvr', 'hanwha-wave'],
        analyticsOptions: [],
        priceRange: { min: 18000, max: 25000 },
        features: ['Basic recording', 'Remote viewing', 'Mobile alerts'],
        bestFor: ['Single location owners', 'Budget-conscious operators']
      },
      professional: {
        name: 'professional',
        description: 'Enhanced security with analytics and cloud backup',
        vmsOptions: ['openeye-ows', 'eagle-eye-cloud'],
        analyticsOptions: ['actuate-ai-filtering', 'avigilon-analytics'],
        priceRange: { min: 25000, max: 35000 },
        features: ['Cloud backup', 'License plate recognition', 'People counting', 'Loss prevention analytics'],
        bestFor: ['Multi-location chains', 'High-volume stations', 'Insurance compliance']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Complete platform with advanced integrations',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['ipsotek-visuite', 'oosto-face-recognition', 'avigilon-analytics'],
        priceRange: { min: 35000, max: 50000 },
        features: ['Unified platform', 'Advanced facial recognition', 'Behavior analytics', 'Corporate integration'],
        bestFor: ['Large chains', 'High-risk locations', 'Corporate compliance']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud platform with AI-powered theft prevention',
        vmsOptions: ['verkada-command', 'eagle-eye-cloud'],
        analyticsOptions: ['oosto-face-recognition', 'ipsotek-visuite'],
        priceRange: { min: 30000, max: 45000 },
        features: ['AI theft detection', 'Real-time alerts', 'Mobile management', 'No local servers'],
        bestFor: ['Tech-forward operators', 'Remote management', 'Multi-state chains']
      }
    },
    compliance: ['PCI Compliance', 'Petroleum Equipment Institute', 'State Fuel Regulations'],
    securityConcerns: ['Drive-off theft', 'Armed robbery', 'Shoplifting', 'Employee theft', 'Vandalism'],
    industrySpecifics: {
      keyFeatures: ['License plate capture', 'Pump monitoring', 'Cash drop verification', 'Drive-off prevention'],
      criticalIntegrations: ['POS systems', 'Fuel management', 'Cash management', 'Alarm monitoring'],
      regulatoryRequirements: ['Explosion-proof equipment', 'Emergency shutoff integration']
    },
    budgetRange: { min: 18000, max: 50000, typical: 32000 },
    confidenceLevel: 70
  },
  {
    id: 'qsr-restaurant',
    name: 'Quick Service Restaurant',
    description: 'Fast-food restaurant with drive-thru and dining area',
    icon: '🍔',
    industryVertical: 'hospitality',
    specificUseCase: 'Quick Service Restaurant',
    segments: ['Fast Food', 'Drive-Thru', 'Counter Service'],
    facilityType: 'Restaurant',
    sqftRange: { min: 2500, max: 4500, typical: 3200 },
    assumptions: {
      surveillance: {
        cameras: 12,
        coverage: 'comprehensive',
        areas: ['Kitchen', 'Front counter', 'Drive-thru', 'Dining area', 'Entrances', 'Parking lot', 'Cash registers'],
        specialRequirements: ['Kitchen-safe cameras', 'Drive-thru audio/video', 'POS integration']
      },
      accessControl: {
        doors: 4,
        cardReaders: 2,
        level: 'standard',
        integrations: ['POS systems', 'Time clock systems']
      },
      intrusion: {
        zones: 6,
        sensors: 10,
        monitoring: true,
        specialFeatures: ['After-hours protection', 'Cash drop monitoring']
      },
      fire: {
        detectors: 18,
        coverage: 'commercial-kitchen-grade'
      }
    },
    deploymentTiers: {
      entry: {
        name: 'entry',
        description: 'Essential security for single location',
        vmsOptions: ['basic-nvr', 'hanwha-wave'],
        analyticsOptions: [],
        priceRange: { min: 15000, max: 22000 },
        features: ['Basic recording', 'POS integration', 'Remote viewing'],
        bestFor: ['Independent restaurants', 'Franchise single units']
      },
      professional: {
        name: 'professional',
        description: 'Enhanced security with loss prevention focus',
        vmsOptions: ['openeye-ows', 'eagle-eye-cloud'],
        analyticsOptions: ['actuate-ai-filtering', 'avigilon-analytics'],
        priceRange: { min: 22000, max: 32000 },
        features: ['Loss prevention analytics', 'Cloud backup', 'Mobile alerts', 'Employee monitoring'],
        bestFor: ['Multi-unit franchisees', 'High-volume locations']
      },
      enterprise: {
        name: 'enterprise',
        description: 'Corporate-grade platform with advanced analytics',
        vmsOptions: ['genetec-security-center', 'milestone-corporate'],
        analyticsOptions: ['ipsotek-visuite', 'oosto-face-recognition'],
        priceRange: { min: 32000, max: 45000 },
        features: ['Corporate dashboard', 'Advanced behavior analytics', 'Facial recognition', 'Multi-site management'],
        bestFor: ['Corporate chains', 'Regional franchisees', 'High-security requirements']
      },
      cloudFirst: {
        name: 'cloud-first',
        description: 'Modern cloud platform with AI-powered insights',
        vmsOptions: ['verkada-command', 'eagle-eye-cloud'],
        analyticsOptions: ['oosto-face-recognition', 'ipsotek-visuite'],
        priceRange: { min: 28000, max: 40000 },
        features: ['AI customer insights', 'Real-time alerts', 'Mobile management', 'Predictive analytics'],
        bestFor: ['Tech-forward chains', 'Data-driven operations', 'Remote management']
      }
    },
    compliance: ['Health Department', 'PCI Compliance', 'Food Safety Regulations'],
    securityConcerns: ['Employee theft', 'Customer disputes', 'Drive-thru incidents', 'After-hours break-ins'],
    industrySpecifics: {
      keyFeatures: ['POS integration', 'Drive-thru monitoring', 'Employee performance', 'Customer service quality'],
      criticalIntegrations: ['POS systems', 'Drive-thru timers', 'Kitchen display systems'],
      regulatoryRequirements: ['Food service compliance', 'ADA accessibility monitoring']
    },
    budgetRange: { min: 15000, max: 45000, typical: 28000 },
    confidenceLevel: 75
  }
];

export function getScenarioById(id: string): SecurityScenario | undefined {
  return securityScenarios.find(scenario => scenario.id === id);
}

export function getScenariosByType(facilityType: string): SecurityScenario[] {
  return securityScenarios.filter(scenario =>
    scenario.facilityType.toLowerCase().includes(facilityType.toLowerCase())
  );
}

export function getScenarioByBudget(budget: number): SecurityScenario[] {
  return securityScenarios.filter(scenario =>
    budget >= scenario.budgetRange.min && budget <= scenario.budgetRange.max
  );
}

export function getScenariosByIndustry(industry: string): SecurityScenario[] {
  return securityScenarios.filter(scenario =>
    scenario.industryVertical === industry ||
    scenario.segments.some(segment =>
      segment.toLowerCase().includes(industry.toLowerCase())
    )
  );
}

export function getVMSOptionsForScenario(scenario: SecurityScenario, tier: 'entry' | 'professional' | 'enterprise' | 'cloud-first') {
  return scenario.deploymentTiers[tier === 'cloud-first' ? 'cloudFirst' : tier].vmsOptions;
}

export function getAnalyticsOptionsForScenario(scenario: SecurityScenario, tier: 'entry' | 'professional' | 'enterprise' | 'cloud-first') {
  return scenario.deploymentTiers[tier === 'cloud-first' ? 'cloudFirst' : tier].analyticsOptions;
}