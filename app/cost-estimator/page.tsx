'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CostEstimator() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    facilityType: '',
    squareFootage: '',
    camerasIndoor: 0,
    camerasOutdoor: 0,
    accessControlDoors: 0,
    motionSensors: 0,
    difficultyLevel: 'easy'
  });
  
  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEstimate = () => {
    setIsCalculating(true);
    
    // Simple calculation logic
    const equipmentCost = 
      (formData.camerasIndoor * 350) +
      (formData.camerasOutdoor * 550) +
      (formData.accessControlDoors * 300) +
      (formData.motionSensors * 75);
    
    const totalDevices = formData.camerasIndoor + formData.camerasOutdoor + 
                        formData.accessControlDoors + formData.motionSensors;
    
    const laborCost = totalDevices * 150 * 1.5; // 1.5 hours per device at $150/hour
    const materialsCost = totalDevices * 45;
    const totalCost = equipmentCost + laborCost + materialsCost;
    
    const lowEstimate = Math.round(totalCost * 0.85);
    const highEstimate = Math.round(totalCost * 1.15);

    setTimeout(() => {
      setEstimate({
        equipmentCost: Math.round(equipmentCost),
        laborCost: Math.round(laborCost),
        materialsCost: Math.round(materialsCost),
        totalCost: Math.round(totalCost),
        lowEstimate,
        highEstimate,
      });
      setIsCalculating(false);
      setCurrentStep(4); // Move to results
    }, 2000);
  };

  const exportToAIAssessment = () => {
    const exportData = {
      projectId: `proj_${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerInfo: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        company: formData.company,
      },
      projectDetails: {
        facilityType: formData.facilityType,
        squareFootage: parseInt(formData.squareFootage),
        deviceCounts: {
          camerasIndoor: formData.camerasIndoor,
          camerasOutdoor: formData.camerasOutdoor,
          accessControlDoors: formData.accessControlDoors,
          motionSensors: formData.motionSensors,
        },
        complexity: formData.difficultyLevel,
      },
      estimateResults: estimate,
    };

    sessionStorage.setItem('estimateData', JSON.stringify(exportData));
    router.push(`/ai-assessment?import=true&projectId=${exportData.projectId}`);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Design-Rite
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-purple-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-white/60 mt-2">
            <span>Contact Info</span>
            <span>Project Details</span>
            <span>Equipment</span>
            <span>Results</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Security System Cost Estimator</h1>
                <p className="text-white/70">Get an instant estimate for your security system project</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => updateFormData('customerName', e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => updateFormData('customerEmail', e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => updateFormData('customerPhone', e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateFormData('company', e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    placeholder="Acme Corporation"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.customerName || !formData.customerEmail}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Project Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Facility Type *</label>
                  <select
                    value={formData.facilityType}
                    onChange={(e) => updateFormData('facilityType', e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option value="">Select facility type</option>
                    <option value="office">Office Building</option>
                    <option value="retail">Retail Store</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Square Footage *</label>
                  <input
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => updateFormData('squareFootage', e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    placeholder="10000"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.facilityType || !formData.squareFootage}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Equipment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Equipment Requirements</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4 text-purple-400">Video Surveillance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Indoor Cameras</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.camerasIndoor}
                        onChange={(e) => updateFormData('camerasIndoor', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Outdoor Cameras</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.camerasOutdoor}
                        onChange={(e) => updateFormData('camerasOutdoor', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4 text-blue-400">Access & Detection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Access Control Doors</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.accessControlDoors}
                        onChange={(e) => updateFormData('accessControlDoors', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Motion Sensors</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.motionSensors}
                        onChange={(e) => updateFormData('motionSensors', parseInt(e.target.value) || 0)}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={calculateEstimate}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Calculate Estimate
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {isCalculating ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h2 className="text-2xl font-bold mb-4">Calculating Your Estimate...</h2>
                  <p className="text-white/70">Analyzing your project requirements</p>
                </div>
              ) : estimate && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Your Project Estimate</h2>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      ${estimate.lowEstimate.toLocaleString()} - ${estimate.highEstimate.toLocaleString()}
                    </div>
                    <p className="text-white/70">Professional security system installation</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Cost Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/70">Equipment</span>
                          <span className="font-semibold">${estimate.equipmentCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Labor</span>
                          <span className="font-semibold">${estimate.laborCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Materials</span>
                          <span className="font-semibold">${estimate.materialsCost.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/20 pt-3 flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${estimate.totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Project Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Facility Type</span>
                          <span className="font-semibold capitalize">{formData.facilityType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Square Footage</span>
                          <span className="font-semibold">{parseInt(formData.squareFootage).toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Devices</span>
                          <span className="font-semibold">
                            {formData.camerasIndoor + formData.camerasOutdoor + formData.accessControlDoors + formData.motionSensors}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 rounded-lg border border-purple-500/30 mb-8">
                    <h3 className="text-xl font-semibold mb-4">🎯 Ready for a Detailed Assessment?</h3>
                    <p className="text-white/80 mb-4">
                      Get a comprehensive security analysis with compliance requirements, detailed equipment specifications, 
                      and a complete implementation plan tailored to your facility.
                    </p>
                    <button
                      onClick={exportToAIAssessment}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-lg"
                    >
                      Continue to AI Security Assessment →
                    </button>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => window.print()}
                      className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                    >
                      Print Estimate
                    </button>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                    >
                      New Estimate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
