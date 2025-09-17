// app/api/generate-proposal/route.js
import { NextResponse } from 'next/server';

const CLAUDE_CONFIG = {
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-5-sonnet-20241022',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  }
};

// NDAA-Compliant Equipment Database
const EQUIPMENT_DATABASE = {
  cameras: {
    'axis-p3248-lve': {
      brand: 'Axis Communications',
      model: 'P3248-LVE',
      type: 'Fixed Dome IP Camera',
      resolution: '4K (8MP)',
      features: ['Day/Night', 'WDR', 'Analytics Ready', 'Vandal Resistant'],
      pricing: { entry: 650, mid: 725, premium: 800 },
      ndaa_compliant: true
    },
    'hanwha-pno-9080r': {
      brand: 'Hanwha Vision',
      model: 'PNO-9080R',
      type: 'PTZ Network Camera',
      resolution: '4K (8MP)',
      features: ['30x Optical Zoom', 'AI Analytics', 'Auto Tracking'],
      pricing: { entry: 1800, mid: 2100, premium: 2400 },
      ndaa_compliant: true
    },
    'avigilon-h4a-bo1-ir': {
      brand: 'Avigilon',
      model: 'H4A-BO1-IR',
      type: 'Bullet Camera',
      resolution: '1080p',
      features: ['IR Illumination', 'Self-Learning Analytics', 'WDR'],
      pricing: { entry: 420, mid: 485, premium: 550 },
      ndaa_compliant: true
    }
  },
  vms: {
    'milestone-xprotect-corporate': {
      brand: 'Milestone',
      model: 'XProtect Corporate',
      type: 'Video Management Software',
      features: ['Unlimited Cameras', 'Analytics Integration', 'Mobile Access'],
      pricing: { entry: 850, mid: 950, premium: 1200 },
      per_camera: true
    },
    'genetec-security-center': {
      brand: 'Genetec',
      model: 'Security Center',
      type: 'Unified Security Platform',
      features: ['Video + Access Control', 'Analytics', 'Cloud Ready'],
      pricing: { entry: 1100, mid: 1300, premium: 1600 },
      per_camera: true
    }
  },
  access_control: {
    's2-netbox': {
      brand: 'S2 Security',
      model: 'NetBox',
      type: 'Access Control Panel',
      features: ['Cloud Management', 'Mobile Credentials', '2-Door Controller'],
      pricing: { entry: 650, mid: 750, premium: 850 },
      per_door: true
    },
    'hid-vertx-v1000': {
      brand: 'HID Global',
      model: 'VertX V1000',
      type: 'Network Controller',
      features: ['PoE+', 'Edge-Based', 'Integrated I/O'],
      pricing: { entry: 580, mid: 650, premium: 720 },
      per_door: true
    }
  },
  infrastructure: {
    'cat6a-cable': {
      brand: 'General',
      model: 'Cat6A Plenum Cable',
      type: 'Network Cabling',
      pricing: { entry: 1.85, mid: 2.25, premium: 2.65 },
      per_foot: true
    },
    'poe-switch-24': {
      brand: 'Cisco',
      model: 'C9300-24P',
      type: '24-Port PoE+ Switch',
      features: ['740W PoE Budget', 'Layer 3', 'Stacking'],
      pricing: { entry: 2800, mid: 3200, premium: 3600 }
    },
    'nvr-enterprise': {
      brand: 'QNAP',
      model: 'TS-1685',
      type: '16-Bay Network Video Recorder',
      features: ['Hot Swappable', 'RAID Support', '10GbE'],
      pricing: { entry: 3500, mid: 4200, premium: 5000 }
    }
  }
};

// Facility-based system sizing algorithm
function calculateSystemRequirements(discoveryData) {
  const facilitySize = parseInt(discoveryData.facility_size) || 50000;
  const facilityType = discoveryData.facility_type?.toLowerCase() || 'office';
  const securityLevel = discoveryData.security_level || 'standard';
  
  // Base calculations per facility type
  const facilityFactors = {
    warehouse: { cameras_per_sqft: 0.0008, doors_factor: 0.15 },
    manufacturing: { cameras_per_sqft: 0.001, doors_factor: 0.2 },
    office: { cameras_per_sqft: 0.0006, doors_factor: 0.12 },
    retail: { cameras_per_sqft: 0.0012, doors_factor: 0.18 },
    healthcare: { cameras_per_sqft: 0.0015, doors_factor: 0.25 },
    education: { cameras_per_sqft: 0.0014, doors_factor: 0.22 }
  };
  
  const factors = facilityFactors[facilityType] || facilityFactors.office;
  
  // Calculate base requirements
  const baseCameras = Math.ceil(facilitySize * factors.cameras_per_sqft);
  const baseDoors = Math.ceil(facilitySize / 10000 * factors.doors_factor * 100);
  
  // Security level multipliers
  const securityMultiplier = {
    basic: 0.8,
    standard: 1.0,
    high: 1.4,
    enterprise: 1.8
  };
  
  const multiplier = securityMultiplier[securityLevel] || 1.0;
  
  return {
    cameras: Math.ceil(baseCameras * multiplier),
    doors: Math.ceil(baseDoors * multiplier),
    storage_days: securityLevel === 'enterprise' ? 90 : securityLevel === 'high' ? 60 : 30,
    redundancy: securityLevel === 'enterprise' || securityLevel === 'high'
  };
}

// Generate comprehensive BOM with three pricing tiers
function generateBOM(requirements, discoveryData) {
  const bom = {
    entry: { items: [], total: 0 },
    mid: { items: [], total: 0 },
    premium: { items: [], total: 0 }
  };
  
  // Camera selection based on facility type
  const cameraTypes = {
    warehouse: ['avigilon-h4a-bo1-ir', 'axis-p3248-lve'],
    office: ['axis-p3248-lve'],
    retail: ['axis-p3248-lve', 'hanwha-pno-9080r'],
    manufacturing: ['avigilon-h4a-bo1-ir', 'axis-p3248-lve']
  };
  
  const facilityType = discoveryData.facility_type?.toLowerCase() || 'office';
  const selectedCameras = cameraTypes[facilityType] || cameraTypes.office;
  
  // Add cameras to BOM
  const primaryCamera = EQUIPMENT_DATABASE.cameras[selectedCameras[0]];
  const cameraQty = requirements.cameras;
  
  ['entry', 'mid', 'premium'].forEach(tier => {
    bom[tier].items.push({
      category: 'Video Surveillance',
      description: `${primaryCamera.brand} ${primaryCamera.model} - ${primaryCamera.type}`,
      model: primaryCamera.model,
      quantity: cameraQty,
      unit_price: primaryCamera.pricing[tier],
      total_price: cameraQty * primaryCamera.pricing[tier],
      features: primaryCamera.features
    });
    bom[tier].total += cameraQty * primaryCamera.pricing[tier];
  });
  
  // Add PTZ camera if needed (retail/manufacturing)
  if (requirements.cameras > 12 && selectedCameras.length > 1) {
    const ptzCamera = EQUIPMENT_DATABASE.cameras[selectedCameras[1]];
    const ptzQty = Math.ceil(requirements.cameras * 0.15);
    
    ['entry', 'mid', 'premium'].forEach(tier => {
      bom[tier].items.push({
        category: 'Video Surveillance',
        description: `${ptzCamera.brand} ${ptzCamera.model} - ${ptzCamera.type}`,
        model: ptzCamera.model,
        quantity: ptzQty,
        unit_price: ptzCamera.pricing[tier],
        total_price: ptzQty * ptzCamera.pricing[tier],
        features: ptzCamera.features
      });
      bom[tier].total += ptzQty * ptzCamera.pricing[tier];
    });
  }
  
  // Add VMS
  const vmsSystem = EQUIPMENT_DATABASE.vms['milestone-xprotect-corporate'];
  ['entry', 'mid', 'premium'].forEach(tier => {
    const vmsPrice = vmsSystem.pricing[tier] * Math.ceil(requirements.cameras / 50);
    bom[tier].items.push({
      category: 'Video Management',
      description: `${vmsSystem.brand} ${vmsSystem.model}`,
      model: vmsSystem.model,
      quantity: Math.ceil(requirements.cameras / 50),
      unit_price: vmsSystem.pricing[tier],
      total_price: vmsPrice,
      features: vmsSystem.features
    });
    bom[tier].total += vmsPrice;
  });
  
  // Add access control if doors specified
  if (requirements.doors > 0) {
    const accessSystem = EQUIPMENT_DATABASE.access_control['s2-netbox'];
    const controllerQty = Math.ceil(requirements.doors / 2);
    
    ['entry', 'mid', 'premium'].forEach(tier => {
      const accessPrice = controllerQty * accessSystem.pricing[tier];
      bom[tier].items.push({
        category: 'Access Control',
        description: `${accessSystem.brand} ${accessSystem.model} - 2-Door Controllers`,
        model: accessSystem.model,
        quantity: controllerQty,
        unit_price: accessSystem.pricing[tier],
        total_price: accessPrice,
        features: accessSystem.features
      });
      bom[tier].total += accessPrice;
    });
  }
  
  // Add infrastructure
  const cableFootage = requirements.cameras * 150; // Average cable run
  const cable = EQUIPMENT_DATABASE.infrastructure['cat6a-cable'];
  
  ['entry', 'mid', 'premium'].forEach(tier => {
    const cablePrice = cableFootage * cable.pricing[tier];
    bom[tier].items.push({
      category: 'Infrastructure',
      description: 'Cat6A Plenum Network Cabling',
      model: cable.model,
      quantity: cableFootage,
      unit: 'feet',
      unit_price: cable.pricing[tier],
      total_price: cablePrice
    });
    bom[tier].total += cablePrice;
  });
  
  // Add network switches
  const switchQty = Math.ceil(requirements.cameras / 20);
  const networkSwitch = EQUIPMENT_DATABASE.infrastructure['poe-switch-24'];
  
  ['entry', 'mid', 'premium'].forEach(tier => {
    const switchPrice = switchQty * networkSwitch.pricing[tier];
    bom[tier].items.push({
      category: 'Infrastructure',
      description: `${networkSwitch.brand} ${networkSwitch.model}`,
      model: networkSwitch.model,
      quantity: switchQty,
      unit_price: networkSwitch.pricing[tier],
      total_price: switchPrice,
      features: networkSwitch.features
    });
    bom[tier].total += switchPrice;
  });
  
  // Add storage/NVR
  const nvr = EQUIPMENT_DATABASE.infrastructure['nvr-enterprise'];
  const nvrQty = Math.ceil(requirements.cameras / 64);
  
  ['entry', 'mid', 'premium'].forEach(tier => {
    const nvrPrice = nvrQty * nvr.pricing[tier];
    bom[tier].items.push({
      category: 'Storage',
      description: `${nvr.brand} ${nvr.model}`,
      model: nvr.model,
      quantity: nvrQty,
      unit_price: nvr.pricing[tier],
      total_price: nvrPrice,
      features: nvr.features
    });
    bom[tier].total += nvrPrice;
  });
  
  // Add installation labor (15-25% of equipment cost)
  ['entry', 'mid', 'premium'].forEach(tier => {
    const laborMultiplier = { entry: 0.15, mid: 0.20, premium: 0.25 };
    const laborCost = Math.round(bom[tier].total * laborMultiplier[tier]);
    
    bom[tier].items.push({
      category: 'Installation',
      description: 'Professional Installation and Commissioning',
      quantity: 1,
      unit_price: laborCost,
      total_price: laborCost
    });
    bom[tier].total += laborCost;
  });
  
  return bom;
}

// Generate professional proposal document
async function generateProposal(discoveryData, bom, requirements) {
  const proposalPrompt = `You are a senior security consultant creating a professional proposal for a client. Generate a comprehensive security system proposal based on the discovery session and BOM data provided.

DISCOVERY DATA:
${JSON.stringify(discoveryData, null, 2)}

SYSTEM REQUIREMENTS:
- Cameras: ${requirements.cameras}
- Access Control Doors: ${requirements.doors}
- Storage Retention: ${requirements.storage_days} days

PRICING SUMMARY:
- Entry Level: $${bom.entry.total.toLocaleString()}
- Mid-Tier: $${bom.mid.total.toLocaleString()}
- Premium: $${bom.premium.total.toLocaleString()}

Create a professional proposal document with these sections:

1. EXECUTIVE SUMMARY (2-3 paragraphs highlighting value proposition)
2. CLIENT REQUIREMENTS ANALYSIS (based on discovery data)
3. RECOMMENDED SOLUTION OVERVIEW
4. SYSTEM ARCHITECTURE AND DESIGN
5. COMPLIANCE AND STANDARDS ADHERENCE
6. IMPLEMENTATION TIMELINE (4-12 weeks typical)
7. INVESTMENT SUMMARY (3-tier pricing explanation)
8. NEXT STEPS

Keep the tone professional but consultative. Emphasize how the solution addresses their specific security concerns and business needs. Include mention of NDAA compliance where relevant.

Make it comprehensive but concise - suitable for executive presentation.`;

  try {
    const response = await fetch(CLAUDE_CONFIG.endpoint, {
      method: 'POST',
      headers: CLAUDE_CONFIG.headers,
      body: JSON.stringify({
        model: CLAUDE_CONFIG.model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: proposalPrompt }],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Failed to generate proposal:', error);
    return generateFallbackProposal(discoveryData, bom, requirements);
  }
}

// Fallback proposal if AI fails
function generateFallbackProposal(discoveryData, bom, requirements) {
  return `# SECURITY SYSTEM PROPOSAL
**${discoveryData.company_name || 'Client'} Security Enhancement**

## EXECUTIVE SUMMARY

Based on our comprehensive discovery session, we recommend implementing a modern IP-based security system featuring ${requirements.cameras} strategically positioned cameras, advanced video analytics, and integrated access control for ${requirements.doors} doors.

Our solution addresses your primary security concerns while ensuring full NDAA Section 889 compliance and integration with your existing infrastructure.

## RECOMMENDED SOLUTION

**Video Surveillance System**
- ${requirements.cameras} high-resolution IP cameras with advanced analytics
- Enterprise-grade video management software
- ${requirements.storage_days}-day video retention with redundant storage

**Access Control System** 
- Electronic access control for ${requirements.doors} controlled entry points
- Cloud-managed system with mobile credential support
- Integration with video verification

**Professional Installation**
- Certified technicians with security clearances
- Complete system commissioning and testing
- Operator training and documentation

## INVESTMENT OPTIONS

**Entry Level Solution: $${bom.entry.total.toLocaleString()}**
- Core functionality with professional-grade equipment
- Standard features and 2-year warranty

**Mid-Tier Solution: $${bom.mid.total.toLocaleString()}**
- Enhanced analytics and advanced features
- Extended warranty and priority support

**Premium Solution: $${bom.premium.total.toLocaleString()}**
- Enterprise-level capabilities and redundancy
- Premium support and maintenance packages

## NEXT STEPS

1. Review and approve this proposal
2. Schedule detailed site survey
3. Finalize design specifications
4. Begin procurement and installation

*This proposal is valid for 30 days. Contact us to discuss any modifications or questions.*`;
}

// Main API endpoint
export async function POST(request) {
  try {
    const { discoveryData, conversationHistory } = await request.json();

    if (!discoveryData) {
      return NextResponse.json({ error: 'Discovery data required' }, { status: 400 });
    }

    // Calculate system requirements based on discovery
    const requirements = calculateSystemRequirements(discoveryData);
    
    // Generate detailed BOM with three pricing tiers
    const bom = generateBOM(requirements, discoveryData);
    
    // Generate professional proposal document
    const proposal = await generateProposal(discoveryData, bom, requirements);

    return NextResponse.json({
      success: true,
      proposal: {
        document: proposal,
        requirements: requirements,
        bom: bom,
        summary: {
          cameras: requirements.cameras,
          doors: requirements.doors,
          pricing: {
            entry: bom.entry.total,
            mid: bom.mid.total,
            premium: bom.premium.total
          }
        }
      }
    });

  } catch (error) {
    console.error('Proposal generation error:', error);
    
    return NextResponse.json({
      error: 'Failed to generate proposal',
      details: error.message
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    service: 'Proposal Generation API',
    status: 'healthy',
    features: ['BOM Generation', '3-Tier Pricing', 'NDAA Compliance', 'Professional Proposals']
  });
}