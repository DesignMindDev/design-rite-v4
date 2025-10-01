/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * Patent Pending - Integration algorithms and equipment mapping systems.
 *
 * System Surveyor to Design-Rite Equipment Mapper
 * Maps System Surveyor equipment types and models to Design-Rite product catalog
 * Provides intelligent product matching and recommendations
 *
 * Last Modified: October 01, 2025
 */

export interface SystemSurveyorEquipment {
  id: string;
  name: string;
  systemType: string;
  manufacturer: string;
  model: string;
  quantity: number;
  location: string;
  installHours: number;
}

export interface DesignRiteMapping {
  surveyorItem: SystemSurveyorEquipment;
  recommendedProduct: {
    category: string;
    subcategory: string;
    searchTerms: string[];
    filters?: {
      indoor?: boolean;
      outdoor?: boolean;
      resolution?: string;
      features?: string[];
    };
  };
  confidence: 'high' | 'medium' | 'low';
  notes: string;
}

/**
 * Camera mapping rules based on location and type
 */
export function mapCamera(equipment: SystemSurveyorEquipment): DesignRiteMapping {
  const location = equipment.location.toLowerCase();
  const name = equipment.name.toLowerCase();

  // Determine indoor vs outdoor based on location keywords
  const isOutdoor = location.includes('lot') ||
                   location.includes('exterior') ||
                   location.includes('outside') ||
                   location.includes('corner') ||
                   name.includes('outdoor');

  // Determine if PTZ based on name
  const isPTZ = name.includes('ptz') || name.includes('pan') || name.includes('tilt');

  // Determine resolution preference
  let resolution = '4MP'; // Default
  if (name.includes('4k') || name.includes('8mp')) resolution = '4K';
  if (name.includes('1080p') || name.includes('2mp')) resolution = '1080p';

  const searchTerms = [];
  const features = [];

  if (isPTZ) {
    searchTerms.push('PTZ', 'Pan Tilt Zoom');
  } else {
    searchTerms.push('Fixed', 'Turret', 'Bullet');
    if (isOutdoor) searchTerms.push('Bullet');
    else searchTerms.push('Turret', 'Dome');
  }

  // Add common security features
  features.push('IR Night Vision', 'WDR', 'H.265');

  if (isOutdoor) {
    features.push('Weatherproof', 'IP67', 'IK10 Vandal Proof');
  }

  return {
    surveyorItem: equipment,
    recommendedProduct: {
      category: 'Camera',
      subcategory: isPTZ ? 'PTZ Camera' : (isOutdoor ? 'Bullet Camera' : 'Turret Camera'),
      searchTerms,
      filters: {
        indoor: !isOutdoor,
        outdoor: isOutdoor,
        resolution,
        features
      }
    },
    confidence: equipment.manufacturer ? 'high' : 'medium',
    notes: `Location: ${equipment.location} - ${isOutdoor ? 'Outdoor' : 'Indoor'} camera recommended`
  };
}

/**
 * Network equipment mapping
 */
export function mapNetworkEquipment(equipment: SystemSurveyorEquipment): DesignRiteMapping {
  const name = equipment.name.toLowerCase();

  if (name.includes('switch')) {
    // Estimate port count based on other equipment
    const portCount = name.includes('24') ? 24 : name.includes('48') ? 48 : 24;
    const isPOE = !name.includes('non-poe');

    return {
      surveyorItem: equipment,
      recommendedProduct: {
        category: 'Network',
        subcategory: 'PoE Switch',
        searchTerms: [`${portCount}-port`, isPOE ? 'PoE+' : 'PoE', 'Managed Switch'],
        filters: {
          features: ['Layer 2', 'VLAN Support', 'IGMP Snooping']
        }
      },
      confidence: 'high',
      notes: `Recommend ${portCount}-port PoE+ managed switch`
    };
  }

  if (name.includes('wireless access point') || name.includes('wap')) {
    return {
      surveyorItem: equipment,
      recommendedProduct: {
        category: 'Network',
        subcategory: 'Wireless Access Point',
        searchTerms: ['WiFi 6', 'Access Point', 'PoE'],
        filters: {
          features: ['Dual Band', 'MIMO', 'PoE Powered']
        }
      },
      confidence: 'high',
      notes: 'WiFi 6 access point for modern coverage'
    };
  }

  return {
    surveyorItem: equipment,
    recommendedProduct: {
      category: 'Network',
      subcategory: 'Network Equipment',
      searchTerms: [equipment.name],
    },
    confidence: 'low',
    notes: 'Generic network equipment - needs manual review'
  };
}

/**
 * NVR/Server mapping based on camera count
 */
export function mapServer(equipment: SystemSurveyorEquipment, cameraCount: number): DesignRiteMapping {
  // Estimate storage needs: ~30 days @ 4MP H.265
  // Rough calc: 4MP = 2.5GB/day per camera
  const storageNeeded = Math.ceil((cameraCount * 2.5 * 30) / 1000); // TB

  let channels = 8;
  if (cameraCount > 32) channels = 64;
  else if (cameraCount > 16) channels = 32;
  else if (cameraCount > 8) channels = 16;

  return {
    surveyorItem: equipment,
    recommendedProduct: {
      category: 'Recording',
      subcategory: 'NVR',
      searchTerms: [`${channels}-Channel NVR`, 'H.265', `${storageNeeded}TB`],
      filters: {
        features: ['RAID Support', 'HDMI Output', 'Remote Access']
      }
    },
    confidence: 'high',
    notes: `${channels}-channel NVR for ${cameraCount} cameras with ${storageNeeded}TB storage (30 days)`
  };
}

/**
 * Infrastructure mapping (cabling, mounting)
 */
export function mapInfrastructure(equipment: SystemSurveyorEquipment): DesignRiteMapping {
  const name = equipment.name.toLowerCase();

  if (name.includes('cable path')) {
    return {
      surveyorItem: equipment,
      recommendedProduct: {
        category: 'Installation',
        subcategory: 'Labor & Materials',
        searchTerms: ['Cat6', 'Cable', 'Labor'],
      },
      confidence: 'high',
      notes: `Cable run: ${equipment.installHours}hrs labor included`
    };
  }

  if (name.includes('patch panel')) {
    return {
      surveyorItem: equipment,
      recommendedProduct: {
        category: 'Network',
        subcategory: 'Patch Panel',
        searchTerms: ['24-Port Patch Panel', 'Cat6'],
      },
      confidence: 'high',
      notes: 'Network patch panel for structured cabling'
    };
  }

  return {
    surveyorItem: equipment,
    recommendedProduct: {
      category: 'Installation',
      subcategory: 'Materials',
      searchTerms: [equipment.name],
    },
    confidence: 'medium',
    notes: 'Infrastructure component'
  };
}

/**
 * Access Control mapping
 */
export function mapAccessControl(equipment: SystemSurveyorEquipment): DesignRiteMapping {
  const name = equipment.name.toLowerCase();

  if (name.includes('reader')) {
    const isProximity = name.includes('prox') || name.includes('proximity');
    const isBiometric = name.includes('finger') || name.includes('bio');

    return {
      surveyorItem: equipment,
      recommendedProduct: {
        category: 'Access Control',
        subcategory: isBiometric ? 'Biometric Reader' : 'Card Reader',
        searchTerms: isBiometric ? ['Fingerprint Reader'] : ['Proximity Card Reader', 'RFID'],
        filters: {
          features: ['PoE', 'Wiegand', 'Weather Resistant']
        }
      },
      confidence: 'high',
      notes: `${isBiometric ? 'Biometric' : 'Proximity'} reader at ${equipment.location}`
    };
  }

  if (name.includes('lock') || name.includes('strike')) {
    return {
      surveyorItem: equipment,
      recommendedProduct: {
        category: 'Access Control',
        subcategory: 'Electric Lock',
        searchTerms: ['Electric Strike', 'Magnetic Lock', 'Fail Safe'],
      },
      confidence: 'medium',
      notes: 'Electric locking hardware'
    };
  }

  return {
    surveyorItem: equipment,
    recommendedProduct: {
      category: 'Access Control',
      subcategory: 'Access Control',
      searchTerms: [equipment.name],
    },
    confidence: 'low',
    notes: 'Access control component - needs review'
  };
}

/**
 * Main mapping function - routes equipment to appropriate mapper
 */
export function mapEquipmentToDesignRite(
  equipment: SystemSurveyorEquipment,
  context?: { totalCameras?: number }
): DesignRiteMapping {
  const name = equipment.name.toLowerCase();
  const type = equipment.systemType.toLowerCase();

  // Route to specific mapper based on equipment type
  if (name.includes('camera') || type.includes('surveillance')) {
    return mapCamera(equipment);
  }

  if (name.includes('switch') || name.includes('wireless access point') || name.includes('router')) {
    return mapNetworkEquipment(equipment);
  }

  if (name.includes('server') || name.includes('nvr') || name.includes('recorder')) {
    return mapServer(equipment, context?.totalCameras || 0);
  }

  if (name.includes('cable') || name.includes('patch panel')) {
    return mapInfrastructure(equipment);
  }

  if (name.includes('reader') || name.includes('lock') || name.includes('door') || type.includes('access')) {
    return mapAccessControl(equipment);
  }

  // Generic mapping for unrecognized equipment
  return {
    surveyorItem: equipment,
    recommendedProduct: {
      category: 'Other',
      subcategory: equipment.systemType,
      searchTerms: [equipment.name, equipment.manufacturer, equipment.model].filter(Boolean),
    },
    confidence: 'low',
    notes: `Unrecognized equipment type: ${equipment.systemType}`
  };
}

/**
 * Batch map all equipment from System Surveyor export
 */
export function mapAllEquipment(surveyorData: {
  cameras: SystemSurveyorEquipment[];
  network: SystemSurveyorEquipment[];
  infrastructure: SystemSurveyorEquipment[];
  accessControl: SystemSurveyorEquipment[];
  other: SystemSurveyorEquipment[];
}): DesignRiteMapping[] {
  const mappings: DesignRiteMapping[] = [];
  const totalCameras = surveyorData.cameras.length;

  // Map cameras
  surveyorData.cameras.forEach(item => {
    mappings.push(mapEquipmentToDesignRite(item));
  });

  // Map network equipment
  surveyorData.network.forEach(item => {
    mappings.push(mapEquipmentToDesignRite(item, { totalCameras }));
  });

  // Map infrastructure (but skip individual cable paths, summarize instead)
  const cablePaths = surveyorData.infrastructure.filter(i => i.name.toLowerCase().includes('cable path'));
  const otherInfra = surveyorData.infrastructure.filter(i => !i.name.toLowerCase().includes('cable path'));

  if (cablePaths.length > 0) {
    // Create single line item for all cable runs
    const totalCableHours = cablePaths.reduce((sum, cp) => sum + cp.installHours, 0);
    mappings.push({
      surveyorItem: {
        id: 'CABLE-SUMMARY',
        name: `Cable Runs (${cablePaths.length} runs)`,
        systemType: 'Infrastructure',
        manufacturer: '',
        model: '',
        quantity: cablePaths.length,
        location: 'Various',
        installHours: totalCableHours
      },
      recommendedProduct: {
        category: 'Installation',
        subcategory: 'Structured Cabling',
        searchTerms: ['Cat6 Cable', 'Installation Labor', 'Cable Management']
      },
      confidence: 'high',
      notes: `${cablePaths.length} cable runs totaling ${totalCableHours} hours of installation labor`
    });
  }

  otherInfra.forEach(item => {
    mappings.push(mapEquipmentToDesignRite(item));
  });

  // Map access control
  surveyorData.accessControl.forEach(item => {
    mappings.push(mapEquipmentToDesignRite(item, { totalCameras }));
  });

  // Map other equipment
  surveyorData.other.forEach(item => {
    mappings.push(mapEquipmentToDesignRite(item));
  });

  return mappings;
}

/**
 * Generate AI Assessment context from mapped equipment
 */
export function generateAIContext(mappings: DesignRiteMapping[], siteInfo: any): string {
  const cameraCount = mappings.filter(m => m.recommendedProduct.category === 'Camera').length;
  const outdoorCameras = mappings.filter(m =>
    m.recommendedProduct.category === 'Camera' && m.recommendedProduct.filters?.outdoor
  ).length;
  const indoorCameras = cameraCount - outdoorCameras;

  const hasAccessControl = mappings.some(m => m.recommendedProduct.category === 'Access Control');
  const hasNetwork = mappings.some(m => m.recommendedProduct.category === 'Network');

  let context = `SYSTEM SURVEYOR FIELD SURVEY IMPORT\n\n`;
  context += `Site: ${siteInfo.siteName || 'Unknown'}\n`;
  context += `Address: ${siteInfo.address || 'Unknown'}\n`;
  context += `Survey: ${siteInfo.surveyName || 'Unknown'}\n\n`;

  context += `FIELD-VERIFIED EQUIPMENT:\n`;
  context += `- ${cameraCount} cameras surveyed (${outdoorCameras} outdoor, ${indoorCameras} indoor)\n`;

  if (hasAccessControl) {
    const accessDevices = mappings.filter(m => m.recommendedProduct.category === 'Access Control').length;
    context += `- ${accessDevices} access control devices\n`;
  }

  if (hasNetwork) {
    context += `- Network infrastructure surveyed and documented\n`;
  }

  const totalLaborHours = mappings.reduce((sum, m) => sum + (m.surveyorItem.installHours || 0), 0);
  context += `- ${totalLaborHours} hours installation labor estimated\n\n`;

  context += `CAMERA LOCATIONS:\n`;
  mappings
    .filter(m => m.recommendedProduct.category === 'Camera')
    .forEach(m => {
      context += `- [${m.surveyorItem.id}] ${m.surveyorItem.location || 'Location TBD'}\n`;
    });

  context += `\n\nUSE THIS FIELD-VERIFIED DATA as the foundation for your security assessment. `;
  context += `All camera locations have been professionally surveyed on-site. `;
  context += `Focus your analysis on: 1) Validating equipment specifications, 2) Recommending specific products, `;
  context += `3) Identifying any coverage gaps, 4) Optimizing the design for cost and performance.`;

  return context;
}
