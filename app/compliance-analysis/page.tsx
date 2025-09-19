'use client';

import React, { useState } from 'react';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Building, Users, Lock, Eye, Clock, Download } from 'lucide-react';

export default function ComplianceCheck() {
  const [selectedFacility, setSelectedFacility] = useState('');
  const [facilitySize, setFacilitySize] = useState('');
  const [dataTypes, setDataTypes] = useState([]);
  const [complianceResults, setComplianceResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const facilityTypes = [
    { value: 'healthcare', label: 'Healthcare Facility', icon: '🏥' },
    { value: 'financial', label: 'Financial Institution', icon: '🏦' },
    { value: 'education', label: 'Educational Institution', icon: '🎓' },
    { value: 'government', label: 'Government Building', icon: '🏛️' },
    { value: 'retail', label: 'Retail/Commercial', icon: '🏪' },
    { value: 'manufacturing', label: 'Manufacturing Plant', icon: '🏭' },
    { value: 'datacenter', label: 'Data Center', icon: '💻' },
    { value: 'office', label: 'Corporate Office', icon: '🏢' }
  ];

  const dataTypeOptions = [
    { value: 'pii', label: 'Personal Identifiable Information (PII)' },
    { value: 'phi', label: 'Protected Health Information (PHI)' },
    { value: 'pci', label: 'Payment Card Information' },
    { value: 'classified', label: 'Classified/Controlled Information' },
    { value: 'student', label: 'Student Records (FERPA)' },
    { value: 'financial', label: 'Financial Records' },
    { value: 'biometric', label: 'Biometric Data' },
    { value: 'proprietary', label: 'Trade Secrets/IP' }
  ];

  const complianceStandards = {
    healthcare: {
      required: ['HIPAA', 'HITECH'],
      recommended: ['SOC 2', 'NIST CSF'],
      industry: 'Healthcare',
      description: 'Healthcare facilities must protect patient health information'
    },
    financial: {
      required: ['SOX', 'GLBA', 'PCI DSS'],
      recommended: ['FFIEC', 'SOC 2'],
      industry: 'Financial Services',
      description: 'Financial institutions require strict data protection and audit controls'
    },
    education: {
      required: ['FERPA'],
      recommended: ['CIPA', 'SOC 2'],
      industry: 'Education',
      description: 'Educational institutions must protect student privacy and records'
    },
    government: {
      required: ['FISMA', 'FIPS 140-2'],
      recommended: ['NIST 800-53', 'Common Criteria'],
      industry: 'Government',
      description: 'Government facilities require federal security standards compliance'
    },
    retail: {
      required: ['PCI DSS'],
      recommended: ['SOC 2', 'ISO 27001'],
      industry: 'Retail',
      description: 'Retail environments must secure payment processing and customer data'
    },
    manufacturing: {
      required: ['NIST CSF'],
      recommended: ['ISO 27001', 'IEC 62443'],
      industry: 'Manufacturing',
      description: 'Manufacturing facilities need operational technology security'
    },
    datacenter: {
      required: ['SOC 2', 'ISO 27001'],
      recommended: ['SSAE 18', 'PCI DSS'],
      industry: 'Data Center',
      description: 'Data centers require comprehensive physical and logical security'
    },
    office: {
      required: ['SOC 2'],
      recommended: ['ISO 27001', 'NIST CSF'],
      industry: 'Corporate',
      description: 'Corporate offices need standard business security practices'
    }
  };

  const handleDataTypeChange = (dataType) => {
    setDataTypes(prev => 
      prev.includes(dataType) 
        ? prev.filter(dt => dt !== dataType)
        : [...prev, dataType]
    );
  };

// Replace the analyzeCompliance function in your compliance-check/page.tsx with this:

const analyzeCompliance = async () => {
  setIsAnalyzing(true);
  
  try {
    // Call the real API endpoint
    const response = await fetch('/api/compliance-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        facilityType: selectedFacility,
        facilitySize: facilitySize,
        dataTypes: dataTypes,
        industry: selectedFacility
      })
    });

    const result = await response.json();
    
    if (result.success) {
      setComplianceResults({
        facilityType: result.analysis.facilityInfo.type,
        industry: result.analysis.facilityInfo.industry,
        description: result.analysis.facilityInfo.description,
        required: result.analysis.requirements.required,
        recommended: result.analysis.requirements.recommended,
        riskLevel: result.analysis.riskAssessment.level,
        dataTypes: dataTypes,
        implementationTime: result.analysis.implementation.estimatedTime,
        estimatedCost: result.analysis.estimatedCost,
        nextSteps: result.analysis.nextSteps
      });
    } else {
      throw new Error(result.error || 'Analysis failed');
    }
  } catch (error) {
    console.error('Compliance analysis error:', error);
    
    // Fallback to basic analysis if API fails
    const baseCompliance = complianceStandards[selectedFacility] || complianceStandards.office;
    const additionalRequirements = [];
    
    if (dataTypes.includes('pci')) additionalRequirements.push('PCI DSS');
    if (dataTypes.includes('phi')) additionalRequirements.push('HIPAA', 'HITECH');
    if (dataTypes.includes('student')) additionalRequirements.push('FERPA');
    if (dataTypes.includes('classified')) additionalRequirements.push('FISMA', 'NIST 800-53');

    const allRequired = [...new Set([...baseCompliance.required, ...additionalRequirements])];
    
    setComplianceResults({
      facilityType: facilityTypes.find(f => f.value === selectedFacility)?.label || 'General Facility',
      industry: baseCompliance.industry,
      description: baseCompliance.description + ' (Basic analysis - API unavailable)',
      required: allRequired,
      recommended: baseCompliance.recommended,
      riskLevel: allRequired.length > 3 ? 'High' : allRequired.length > 1 ? 'Medium' : 'Low',
      dataTypes: dataTypes
    });
  } finally {
    setIsAnalyzing(false);
  }
};

  const generateReport = () => {
    if (!complianceResults) return;
    
    const reportContent = `SECURITY COMPLIANCE ASSESSMENT REPORT
Generated: ${new Date().toLocaleDateString()}

FACILITY INFORMATION:
- Type: ${complianceResults.facilityType}
- Industry: ${complianceResults.industry}
- Size: ${facilitySize}

COMPLIANCE REQUIREMENTS:
Required Standards:
${complianceResults.required.map(std => `• ${std}`).join('\n')}

Recommended Standards:
${complianceResults.recommended.map(std => `• ${std}`).join('\n')}

DATA TYPES IDENTIFIED:
${complianceResults.dataTypes.map(dt => `• ${dataTypeOptions.find(opt => opt.value === dt)?.label}`).join('\n')}

RISK ASSESSMENT: ${complianceResults.riskLevel}

NEXT STEPS:
1. Conduct detailed security assessment
2. Review current security controls
3. Develop compliance implementation plan
4. Schedule regular compliance audits

For detailed implementation guidance, contact Design-Rite security consultants.`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-assessment-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Shield className="w-16 h-16 text-purple-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">Compliance Check</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Identify applicable security standards and regulatory requirements for your facility
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Building className="w-6 h-6 mr-3 text-purple-400" />
                Facility Assessment
              </h2>

              {/* Facility Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Facility Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {facilityTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedFacility(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedFacility === type.value
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-gray-600 bg-slate-700/50 text-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Facility Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Facility Size
                </label>
                <select
                  value={facilitySize}
                  onChange={(e) => setFacilitySize(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select size...</option>
                  <option value="small">Small (under 10,000 sq ft)</option>
                  <option value="medium">Medium (10,000 - 50,000 sq ft)</option>
                  <option value="large">Large (50,000 - 200,000 sq ft)</option>
                  <option value="enterprise">Enterprise (over 200,000 sq ft)</option>
                </select>
              </div>

              {/* Data Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Data Types Handled
                </label>
                <div className="space-y-2">
                  {dataTypeOptions.map((dataType) => (
                    <label key={dataType.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dataTypes.includes(dataType.value)}
                        onChange={() => handleDataTypeChange(dataType.value)}
                        className="mr-3 w-4 h-4 text-purple-600 bg-slate-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">{dataType.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeCompliance}
                disabled={!selectedFacility || isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing Compliance Requirements...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5 mr-3" />
                    Analyze Compliance Requirements
                  </>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-purple-400" />
                Compliance Analysis
              </h2>

              {!complianceResults ? (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Complete the facility assessment to see compliance requirements
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Facility Info */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">{complianceResults.facilityType}</h3>
                    <p className="text-gray-300 text-sm">{complianceResults.description}</p>
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center">
                    <span className="text-gray-300 mr-3">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complianceResults.riskLevel === 'High' 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : complianceResults.riskLevel === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {complianceResults.riskLevel}
                    </span>
                  </div>

                  {/* Required Standards */}
                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                      Required Standards
                    </h3>
                    <div className="space-y-2">
                      {complianceResults.required.map((standard) => (
                        <div key={standard} className="flex items-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <Lock className="w-4 h-4 text-red-400 mr-3" />
                          <span className="text-white font-medium">{standard}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Standards */}
                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      Recommended Standards
                    </h3>
                    <div className="space-y-2">
                      {complianceResults.recommended.map((standard) => (
                        <div key={standard} className="flex items-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                          <span className="text-white">{standard}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generate Report Button */}
                  <button
                    onClick={generateReport}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Download Compliance Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          {complianceResults && (
            <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-purple-400" />
                Recommended Next Steps
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-400">1</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Security Assessment</h3>
                  <p className="text-gray-300 text-sm">Conduct comprehensive security evaluation</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">2</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Gap Analysis</h3>
                  <p className="text-gray-300 text-sm">Identify compliance gaps and requirements</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-400">3</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Implementation</h3>
                  <p className="text-gray-300 text-sm">Deploy security controls and systems</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-400">4</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Ongoing Monitoring</h3>
                  <p className="text-gray-300 text-sm">Maintain compliance through regular audits</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a 
                  href="/ai-assessment"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Start Discovery Session with AI Assistant
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


