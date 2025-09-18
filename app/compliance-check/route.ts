// app/api/compliance-check/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Compliance standards database
const complianceStandards = {
  healthcare: {
    required: ['HIPAA', 'HITECH'],
    recommended: ['SOC 2', 'NIST CSF', 'ISO 27001'],
    industry: 'Healthcare',
    description: 'Healthcare facilities must protect patient health information and ensure secure access to medical records',
    riskFactors: ['PHI handling', 'Medical device integration', 'Patient access controls'],
    implementationTime: '6-12 months'
  },
  financial: {
    required: ['SOX', 'GLBA', 'PCI DSS'],
    recommended: ['FFIEC', 'SOC 2', 'ISO 27001'],
    industry: 'Financial Services',
    description: 'Financial institutions require strict data protection, audit controls, and fraud prevention',
    riskFactors: ['Payment processing', 'Customer data', 'Regulatory audits'],
    implementationTime: '9-18 months'
  },
  education: {
    required: ['FERPA'],
    recommended: ['CIPA', 'SOC 2', 'NIST CSF'],
    industry: 'Education',
    description: 'Educational institutions must protect student privacy and educational records',
    riskFactors: ['Student records', 'Minor protection', 'Public access areas'],
    implementationTime: '3-6 months'
  },
  government: {
    required: ['FISMA', 'FIPS 140-2'],
    recommended: ['NIST 800-53', 'Common Criteria', 'FedRAMP'],
    industry: 'Government',
    description: 'Government facilities require federal security standards and classified information protection',
    riskFactors: ['Classified data', 'Public safety', 'National security'],
    implementationTime: '12-24 months'
  },
  retail: {
    required: ['PCI DSS'],
    recommended: ['SOC 2', 'ISO 27001', 'NIST CSF'],
    industry: 'Retail',
    description: 'Retail environments must secure payment processing and protect customer information',
    riskFactors: ['Payment terminals', 'Customer data', 'Public access'],
    implementationTime: '4-8 months'
  },
  manufacturing: {
    required: ['NIST CSF'],
    recommended: ['ISO 27001', 'IEC 62443', 'ISA/IEC 62443'],
    industry: 'Manufacturing',
    description: 'Manufacturing facilities need operational technology security and industrial control systems protection',
    riskFactors: ['OT/IT convergence', 'Industrial controls', 'Supply chain'],
    implementationTime: '6-12 months'
  },
  datacenter: {
    required: ['SOC 2', 'ISO 27001'],
    recommended: ['SSAE 18', 'PCI DSS', 'NIST CSF'],
    industry: 'Data Center',
    description: 'Data centers require comprehensive physical and logical security with high availability',
    riskFactors: ['Multi-tenant security', 'Physical access', 'Environmental controls'],
    implementationTime: '8-15 months'
  },
  office: {
    required: ['SOC 2'],
    recommended: ['ISO 27001', 'NIST CSF'],
    industry: 'Corporate',
    description: 'Corporate offices need standard business security practices and employee access controls',
    riskFactors: ['Employee access', 'Visitor management', 'Data protection'],
    implementationTime: '3-6 months'
  }
};

// Data type compliance mappings
const dataTypeCompliance = {
  pii: {
    standards: ['GDPR', 'CCPA', 'SOC 2'],
    description: 'Personal data requires privacy protection and consent management'
  },
  phi: {
    standards: ['HIPAA', 'HITECH'],
    description: 'Protected health information needs encryption and access logging'
  },
  pci: {
    standards: ['PCI DSS'],
    description: 'Payment card data requires secure processing and storage'
  },
  classified: {
    standards: ['FISMA', 'NIST 800-53', 'FIPS 140-2'],
    description: 'Classified information needs government-grade security controls'
  },
  student: {
    standards: ['FERPA', 'CIPA'],
    description: 'Student records require educational privacy protections'
  },
  financial: {
    standards: ['SOX', 'GLBA', 'FFIEC'],
    description: 'Financial records need audit trails and fraud prevention'
  },
  biometric: {
    standards: ['BIPA', 'GDPR', 'ISO 27001'],
    description: 'Biometric data requires consent and secure storage'
  },
  proprietary: {
    standards: ['ISO 27001', 'SOC 2'],
    description: 'Trade secrets need confidentiality and access controls'
  }
};

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    service: 'Compliance Check API',
    status: 'healthy',
    standards_count: Object.keys(complianceStandards).length,
    data_types_count: Object.keys(dataTypeCompliance).length,
    timestamp: new Date().toISOString()
  });
}

// Main compliance analysis endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityType, facilitySize, dataTypes, industry } = body;

    console.log('Compliance check requested for:', facilityType, 'with data types:', dataTypes);

    // Validate required fields
    if (!facilityType) {
      return NextResponse.json({ 
        error: 'Facility type is required' 
      }, { status: 400 });
    }

    // Get base compliance requirements
    const baseCompliance = complianceStandards[facilityType] || complianceStandards.office;
    
    // Additional requirements based on data types
    const additionalRequirements = new Set();
    const dataTypeDetails = [];

    if (dataTypes && Array.isArray(dataTypes)) {
      dataTypes.forEach(dataType => {
        const dtCompliance = dataTypeCompliance[dataType];
        if (dtCompliance) {
          dtCompliance.standards.forEach(std => additionalRequirements.add(std));
          dataTypeDetails.push({
            type: dataType,
            description: dtCompliance.description,
            standards: dtCompliance.standards
          });
        }
      });
    }

    // Merge and deduplicate requirements
    const allRequired = [...new Set([...baseCompliance.required, ...Array.from(additionalRequirements)])];
    
    // Calculate risk level based on complexity
    let riskLevel = 'Low';
    if (allRequired.length > 5 || dataTypes?.includes('classified') || dataTypes?.includes('phi')) {
      riskLevel = 'High';
    } else if (allRequired.length > 2 || dataTypes?.includes('pci') || dataTypes?.includes('biometric')) {
      riskLevel = 'Medium';
    }

    // Calculate estimated implementation time
    const getImplementationMonths = (timeRange) => {
      const [min, max] = timeRange.split('-').map(t => parseInt(t));
      return { min, max, average: Math.round((min + max) / 2) };
    };

    const implementationTime = getImplementationMonths(baseCompliance.implementationTime);

    // Generate recommendations based on facility size
    const sizeFactors = {
      small: { complexityMultiplier: 0.8, costMultiplier: 0.6 },
      medium: { complexityMultiplier: 1.0, costMultiplier: 1.0 },
      large: { complexityMultiplier: 1.3, costMultiplier: 1.5 },
      enterprise: { complexityMultiplier: 1.8, costMultiplier: 2.2 }
    };

    const sizeFactor = sizeFactors[facilitySize] || sizeFactors.medium;

    // Build comprehensive response
    const complianceAnalysis = {
      facilityInfo: {
        type: facilityType,
        size: facilitySize,
        industry: baseCompliance.industry,
        description: baseCompliance.description
      },
      requirements: {
        required: allRequired,
        recommended: baseCompliance.recommended,
        total_standards: allRequired.length + baseCompliance.recommended.length
      },
      riskAssessment: {
        level: riskLevel,
        factors: baseCompliance.riskFactors,
        dataTypes: dataTypeDetails
      },
      implementation: {
        estimatedTime: {
          ...implementationTime,
          adjusted: Math.round(implementationTime.average * sizeFactor.complexityMultiplier)
        },
        phases: [
          'Initial Security Assessment',
          'Gap Analysis & Planning',
          'System Implementation',
          'Testing & Validation',
          'Training & Documentation',
          'Ongoing Compliance Monitoring'
        ]
      },
      nextSteps: [
        'Conduct detailed security assessment',
        'Review current security controls',
        'Develop compliance implementation roadmap',
        'Identify budget and resource requirements',
        'Schedule regular compliance audits'
      ],
      estimatedCost: {
        range: `$${Math.round(25000 * sizeFactor.costMultiplier).toLocaleString()} - $${Math.round(150000 * sizeFactor.costMultiplier).toLocaleString()}`,
        factors: ['Facility size', 'Compliance complexity', 'Existing infrastructure', 'Implementation timeline']
      }
    };

    console.log('Compliance analysis completed:', riskLevel, 'risk with', allRequired.length, 'required standards');

    return NextResponse.json({
      success: true,
      analysis: complianceAnalysis,
      generated_at: new Date().toISOString(),
      session_id: `compliance_${Date.now()}`
    });

  } catch (error) {
    console.error('Compliance check error:', error);
    return NextResponse.json({ 
      error: 'Compliance analysis failed',
      details: error.message 
    }, { status: 500 });
  }
}

// Generate detailed compliance report
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, clientInfo } = body;

    if (!analysis) {
      return NextResponse.json({ 
        error: 'Analysis data required for report generation' 
      }, { status: 400 });
    }

    // Generate comprehensive report
    const report = {
      header: {
        title: 'Security Compliance Assessment Report',
        generated: new Date().toLocaleDateString(),
        facility: analysis.facilityInfo.type,
        preparedFor: clientInfo?.companyName || 'Client Facility'
      },
      executiveSummary: {
        overview: `This compliance assessment identifies ${analysis.requirements.required.length} required security standards and ${analysis.requirements.recommended.length} recommended standards for your ${analysis.facilityInfo.type} facility.`,
        riskLevel: analysis.riskAssessment.level,
        implementationTime: `${analysis.implementation.estimatedTime.adjusted} months`,
        estimatedInvestment: analysis.estimatedCost.range
      },
      detailedFindings: {
        facilityProfile: analysis.facilityInfo,
        complianceRequirements: analysis.requirements,
        riskFactors: analysis.riskAssessment.factors,
        dataProtectionNeeds: analysis.riskAssessment.dataTypes
      },
      implementationPlan: {
        phases: analysis.implementation.phases,
        timeline: analysis.implementation.estimatedTime,
        nextSteps: analysis.nextSteps
      },
      recommendations: {
        immediate: [
          'Schedule comprehensive security assessment',
          'Review current security policies and procedures',
          'Identify compliance gaps and vulnerabilities'
        ],
        shortTerm: [
          'Develop compliance implementation roadmap',
          'Secure budget approval for necessary upgrades',
          'Select qualified security integration partner'
        ],
        longTerm: [
          'Implement comprehensive security system',
          'Establish ongoing compliance monitoring',
          'Schedule regular security audits and updates'
        ]
      }
    };

    console.log('Compliance report generated for:', analysis.facilityInfo.type);

    return NextResponse.json({
      success: true,
      report: report,
      downloadable: true,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ 
      error: 'Report generation failed',
      details: error.message 
    }, { status: 500 });
  }
}