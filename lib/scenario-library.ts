// lib/scenario-library.ts
// Pre-built security scenarios with standard assumptions

export interface SecurityScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  facilityType: string;
  sqftRange: {
    min: number;
    max: number;
    typical: number;
  };
  assumptions: {
    surveillance: {
      cameras: number;
      coverage: string;
      areas: string[];
    };
    accessControl: {
      doors: number;
      cardReaders: number;
      level: string;
    };
    intrusion: {
      zones: number;
      sensors: number;
      monitoring: boolean;
    };
    fire: {
      detectors: number;
      coverage: string;
    };
  };
  compliance: string[];
  securityConcerns: string[];
  budgetRange: {
    min: number;
    max: number;
    typical: number;
  };
  confidenceLevel: number; // 65-80% based on assumptions
}

export const securityScenarios: SecurityScenario[] = [
  {
    id: 'small-office',
    name: 'Small Office',
    description: '1-25 employees, single location professional office',
    icon: '🏢',
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
    compliance: ['General Business Security'],
    securityConcerns: ['After-hours access', 'Visitor management', 'Equipment protection'],
    budgetRange: { min: 8000, max: 18000, typical: 12000 },
    confidenceLevel: 75
  },
  {
    id: 'medium-office',
    name: 'Medium Office',
    description: '25-100 employees, multi-department office building',
    icon: '🏬',
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
    compliance: ['General Business Security', 'Data Protection'],
    securityConcerns: ['Multi-floor access control', 'Visitor tracking', 'Asset protection', 'After-hours monitoring'],
    budgetRange: { min: 25000, max: 45000, typical: 32000 },
    confidenceLevel: 70
  },
  {
    id: 'retail-boutique',
    name: 'Retail Boutique',
    description: 'Small retail store, high-value merchandise',
    icon: '🛍️',
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
    compliance: ['PCI Compliance', 'Retail Security Standards'],
    securityConcerns: ['Theft prevention', 'Customer safety', 'Inventory protection', 'Point-of-sale security'],
    budgetRange: { min: 6000, max: 15000, typical: 9500 },
    confidenceLevel: 80
  },
  {
    id: 'elementary-school',
    name: 'Elementary School',
    description: 'K-5 school building with multiple classrooms',
    icon: '🏫',
    facilityType: 'Educational Facility',
    sqftRange: { min: 15000, max: 40000, typical: 25000 },
    assumptions: {
      surveillance: {
        cameras: 24,
        coverage: 'comprehensive',
        areas: ['All entrances', 'Hallways', 'Playground', 'Cafeteria', 'Main office', 'Parking lot']
      },
      accessControl: {
        doors: 12,
        cardReaders: 8,
        level: 'high-security'
      },
      intrusion: {
        zones: 12,
        sensors: 24,
        monitoring: true
      },
      fire: {
        detectors: 60,
        coverage: 'enhanced'
      }
    },
    compliance: ['FERPA', 'School Safety Standards', 'State Education Requirements'],
    securityConcerns: ['Student safety', 'Visitor screening', 'Lockdown procedures', 'Perimeter security'],
    budgetRange: { min: 45000, max: 85000, typical: 62000 },
    confidenceLevel: 65
  },
  {
    id: 'medical-clinic',
    name: 'Medical Clinic',
    description: 'Healthcare facility with patient privacy requirements',
    icon: '🏥',
    facilityType: 'Healthcare Facility',
    sqftRange: { min: 3000, max: 12000, typical: 6000 },
    assumptions: {
      surveillance: {
        cameras: 12,
        coverage: 'privacy-compliant',
        areas: ['Waiting area', 'Reception', 'Entrances', 'Parking', 'Staff areas (not patient areas)']
      },
      accessControl: {
        doors: 6,
        cardReaders: 4,
        level: 'high-security'
      },
      intrusion: {
        zones: 6,
        sensors: 12,
        monitoring: true
      },
      fire: {
        detectors: 25,
        coverage: 'healthcare-grade'
      }
    },
    compliance: ['HIPAA', 'Healthcare Security Standards', 'Patient Privacy Laws'],
    securityConcerns: ['Patient privacy', 'Medication security', 'Staff safety', 'Records protection'],
    budgetRange: { min: 18000, max: 35000, typical: 25000 },
    confidenceLevel: 70
  },
  {
    id: 'warehouse',
    name: 'Warehouse/Distribution',
    description: 'Industrial storage and distribution facility',
    icon: '🏭',
    facilityType: 'Industrial Warehouse',
    sqftRange: { min: 10000, max: 100000, typical: 30000 },
    assumptions: {
      surveillance: {
        cameras: 20,
        coverage: 'perimeter-focused',
        areas: ['Loading docks', 'Entrances', 'Perimeter', 'High-value storage', 'Office area']
      },
      accessControl: {
        doors: 6,
        cardReaders: 4,
        level: 'industrial'
      },
      intrusion: {
        zones: 8,
        sensors: 16,
        monitoring: true
      },
      fire: {
        detectors: 40,
        coverage: 'industrial-grade'
      }
    },
    compliance: ['Industrial Security Standards', 'OSHA Requirements'],
    securityConcerns: ['Cargo theft', 'Perimeter security', 'Employee safety', 'Inventory protection'],
    budgetRange: { min: 35000, max: 75000, typical: 50000 },
    confidenceLevel: 70
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