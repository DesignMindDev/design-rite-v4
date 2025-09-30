// lib/quote-generator.ts
// Generates quotes with confidence levels and refinement requirements

import { SecurityScenario } from './scenario-library'
import { vmsOptions, analyticsOptions, getVMSByDeployment, getCompatibleAnalytics } from './vms-analytics-database'

export interface QuoteLineItem {
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  confidence: 'high' | 'medium' | 'low';
  refinementNeeded?: string;
}

export interface SecurityQuote {
  id: string;
  projectName: string;
  companyName: string;
  contactInfo: {
    name: string;
    email: string;
  };

  // Quote details
  lineItems: QuoteLineItem[];
  subtotal: number;
  tax: number;
  total: number;

  // Confidence and refinement
  overallConfidence: number; // 65-85%
  confidenceFactors: {
    siteInformation: number;
    requirements: number;
    compliance: number;
    installation: number;
  };

  refinementNeeds: RefinementNeed[];
  nextSteps: string[];

  // Metadata
  createdAt: string;
  validUntil: string;
  estimatedImplementationTime: string;
}

export interface RefinementNeed {
  category: 'site_visit' | 'end_user_meeting' | 'technical_review' | 'compliance_verification';
  title: string;
  description: string;
  impact: 'cost_savings' | 'cost_increase' | 'timeline_change' | 'scope_change';
  potentialSavings?: string;
  requiredFor90Percent: boolean;
}

export class QuoteGenerator {

  generateQuote(discoveryData: any, selectedScenario?: SecurityScenario): SecurityQuote {
    const lineItems = this.generateLineItems(discoveryData, selectedScenario);
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax estimate
    const total = subtotal + tax;

    const confidenceFactors = this.calculateConfidenceFactors(discoveryData, selectedScenario);
    const overallConfidence = Math.round(
      (confidenceFactors.siteInformation +
       confidenceFactors.requirements +
       confidenceFactors.compliance +
       confidenceFactors.installation) / 4
    );

    return {
      id: `QUOTE-${Date.now()}`,
      projectName: discoveryData.projectName || 'Security System Project',
      companyName: discoveryData.companyName || 'Your Company',
      contactInfo: {
        name: discoveryData.contactName || 'Contact Name',
        email: discoveryData.contactEmail || 'contact@company.com'
      },

      lineItems,
      subtotal,
      tax,
      total,

      overallConfidence,
      confidenceFactors,
      refinementNeeds: this.generateRefinementNeeds(discoveryData, selectedScenario),
      nextSteps: this.generateNextSteps(overallConfidence),

      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      estimatedImplementationTime: this.estimateImplementationTime(discoveryData)
    };
  }

  private generateLineItems(discoveryData: any, selectedScenario?: SecurityScenario): QuoteLineItem[] {
    const items: QuoteLineItem[] = [];

    // Use scenario assumptions or discovery data
    const assumptions = selectedScenario?.assumptions || this.extractAssumptions(discoveryData);

    // Surveillance System
    if (assumptions.surveillance) {
      const cameraCount = assumptions.surveillance.cameras || 8;
      const cameraPrice = this.getCameraPrice(assumptions.surveillance.coverage);

      items.push({
        category: 'Surveillance',
        description: `Security Camera System (${cameraCount} cameras, ${assumptions.surveillance.coverage} coverage)`,
        quantity: 1,
        unitPrice: cameraPrice * cameraCount,
        total: cameraPrice * cameraCount,
        confidence: selectedScenario ? 'medium' : 'low',
        refinementNeeded: selectedScenario ? undefined : 'Site survey needed for camera placement and coverage'
      });

      // Network Video Recorder
      const nvrPrice = this.getNVRPrice(cameraCount);
      items.push({
        category: 'Surveillance',
        description: `Network Video Recorder (${Math.ceil(cameraCount / 8) * 8} channel)`,
        quantity: 1,
        unitPrice: nvrPrice,
        total: nvrPrice,
        confidence: 'high'
      });
    }

    // Access Control System
    if (assumptions.accessControl) {
      const doorCount = assumptions.accessControl.doors || 3;
      const readerCount = assumptions.accessControl.cardReaders || 2;

      const accessControlPrice = this.getAccessControlPrice(doorCount, assumptions.accessControl.level);
      items.push({
        category: 'Access Control',
        description: `Access Control System (${doorCount} doors, ${readerCount} card readers)`,
        quantity: 1,
        unitPrice: accessControlPrice,
        total: accessControlPrice,
        confidence: selectedScenario ? 'medium' : 'low',
        refinementNeeded: 'Door hardware assessment and integration requirements'
      });
    }

    // Intrusion Detection
    if (assumptions.intrusion) {
      const intrusionPrice = this.getIntrusionPrice(assumptions.intrusion.zones, assumptions.intrusion.sensors);
      items.push({
        category: 'Intrusion Detection',
        description: `Intrusion Detection System (${assumptions.intrusion.zones} zones, ${assumptions.intrusion.sensors} sensors)`,
        quantity: 1,
        unitPrice: intrusionPrice,
        total: intrusionPrice,
        confidence: 'medium'
      });
    }

    // Installation and Configuration
    const installationPrice = this.getInstallationPrice(items.reduce((sum, item) => sum + item.total, 0));
    items.push({
      category: 'Installation',
      description: 'Professional Installation, Configuration, and Training',
      quantity: 1,
      unitPrice: installationPrice,
      total: installationPrice,
      confidence: 'low',
      refinementNeeded: 'Site conditions, existing infrastructure, and installation complexity assessment'
    });

    return items;
  }

  private calculateConfidenceFactors(discoveryData: any, selectedScenario?: SecurityScenario) {
    return {
      siteInformation: selectedScenario ? 75 : (discoveryData.squareFootage > 0 ? 65 : 45),
      requirements: selectedScenario ? 80 : (discoveryData.securityConcerns?.length > 0 ? 70 : 50),
      compliance: discoveryData.complianceRequirements?.length > 0 ? 85 : 60,
      installation: 55 // Always low until site visit
    };
  }

  private generateRefinementNeeds(discoveryData: any, selectedScenario?: SecurityScenario): RefinementNeed[] {
    const needs: RefinementNeed[] = [
      {
        category: 'site_visit',
        title: 'Site Survey and Infrastructure Assessment',
        description: 'On-site evaluation of existing infrastructure, cable pathways, power availability, and installation complexity',
        impact: 'cost_savings',
        potentialSavings: '$2,000-5,000 if existing infrastructure can be utilized',
        requiredFor90Percent: true
      },
      {
        category: 'end_user_meeting',
        title: 'End User Requirements Workshop',
        description: 'Meet with actual system users to understand daily workflows, specific security concerns, and operational preferences',
        impact: 'scope_change',
        requiredFor90Percent: true
      },
      {
        category: 'technical_review',
        title: 'IT Infrastructure Integration Review',
        description: 'Assess network capacity, IT policies, and integration requirements with existing systems',
        impact: 'cost_increase',
        requiredFor90Percent: true
      }
    ];

    if (discoveryData.complianceRequirements?.length > 0) {
      needs.push({
        category: 'compliance_verification',
        title: 'Compliance Requirements Verification',
        description: `Detailed review of ${discoveryData.complianceRequirements.join(', ')} requirements and audit preparation`,
        impact: 'timeline_change',
        requiredFor90Percent: true
      });
    }

    return needs;
  }

  private generateNextSteps(confidence: number): string[] {
    const steps = [
      'Schedule site survey and technical assessment',
      'Meet with end users and decision makers',
      'Finalize detailed specifications and compliance requirements'
    ];

    if (confidence < 70) {
      steps.unshift('Gather additional project requirements and constraints');
    }

    steps.push('Receive final 90%+ accurate quote and project timeline');
    steps.push('Begin procurement and implementation planning');

    return steps;
  }

  private estimateImplementationTime(discoveryData: any): string {
    const sqft = discoveryData.squareFootage || 5000;

    if (sqft < 5000) return '2-3 weeks';
    if (sqft < 20000) return '3-5 weeks';
    if (sqft < 50000) return '4-8 weeks';
    return '6-12 weeks';
  }

  // Pricing helper methods
  private getCameraPrice(coverage: string): number {
    switch (coverage) {
      case 'basic': return 400;
      case 'standard': return 550;
      case 'comprehensive': return 750;
      case 'privacy-compliant': return 650;
      case 'perimeter-focused': return 600;
      default: return 550;
    }
  }

  private getNVRPrice(cameraCount: number): number {
    if (cameraCount <= 8) return 800;
    if (cameraCount <= 16) return 1400;
    if (cameraCount <= 32) return 2200;
    return 3500;
  }

  private getAccessControlPrice(doorCount: number, level: string): number {
    const basePrice = doorCount * 850; // $850 per door
    const multiplier = level === 'high-security' ? 1.4 : level === 'advanced' ? 1.2 : 1.0;
    return Math.round(basePrice * multiplier);
  }

  private getIntrusionPrice(zones: number, sensors: number): number {
    return (zones * 200) + (sensors * 75) + 800; // Control panel base cost
  }

  private getInstallationPrice(equipmentTotal: number): number {
    return Math.round(equipmentTotal * 0.35); // 35% of equipment cost for installation
  }

  private extractAssumptions(discoveryData: any) {
    // Extract assumptions from discovery data when no scenario is selected
    return {
      surveillance: {
        cameras: Math.max(4, Math.round(discoveryData.squareFootage / 500) || 8),
        coverage: 'standard'
      },
      accessControl: {
        doors: discoveryData.buildingCount ? discoveryData.buildingCount * 2 : 3,
        cardReaders: discoveryData.buildingCount ? discoveryData.buildingCount * 2 : 2,
        level: 'standard'
      },
      intrusion: {
        zones: Math.max(3, Math.round(discoveryData.squareFootage / 1000) || 4),
        sensors: Math.max(6, Math.round(discoveryData.squareFootage / 500) || 8)
      }
    };
  }
}