'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SecurityEstimateForm = () => {
  const [formData, setFormData] = useState({
    surveillance: { enabled: false, cameras: '', coverage: 'basic' },
    accessControl: { enabled: false, doors: '', cardReaders: '', level: 'standard' },
    intrusion: { enabled: false, zones: '', sensors: '', monitoring: false },
    fire: { enabled: false, detectors: '', coverage: 'code-minimum' }
  });

  const [estimate, setEstimate] = useState(null);
  const [facilitySize, setFacilitySize] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [realPricingData, setRealPricingData] = useState([]);

  // Pricing matrices (based on real-world security system costs)
  const pricing = {
    surveillance: {
      basic: { camera: 800, installation: 200, software: 150 },
      standard: { camera: 1200, installation: 300, software: 200 },
      premium: { camera: 1800, installation: 400, software: 300 }
    },
    accessControl: {
      standard: { door: 1500, reader: 400, software: 300 },
      enterprise: { door: 2200, reader: 600, software: 500 }
    },
    intrusion: {
      zone: 350, sensor: 150, panel: 800, monitoring: 35
    },
    fire: {
      detector: 180, panel: 1200, notification: 250
    }
  };

  const handleSystemToggle = (system) => {
    setFormData(prev => ({
      ...prev,
      [system]: { ...prev[system], enabled: !prev[system].enabled }
    }));
  };

  const handleInputChange = (system, field, value) => {
    setFormData(prev => ({
      ...prev,
      [system]: { ...prev[system], [field]: value }
    }));
  };

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const calculateEstimate = async () => {
    setIsCalculating(true);

    try {
      // Get AI-powered recommendations with real pricing
      await getAiRecommendations();

      // Calculate with both static and AI-enhanced pricing
      let totalCost = 0;
      const breakdown = {};

      // Surveillance calculation
      if (formData.surveillance.enabled) {
        const cameraCount = parseInt(formData.surveillance.cameras) || 0;
        const level = formData.surveillance.coverage;
        const cameraCost = cameraCount * pricing.surveillance[level].camera;
        const installCost = cameraCount * pricing.surveillance[level].installation;
        const softwareCost = pricing.surveillance[level].software * Math.ceil(cameraCount / 16);

        breakdown.surveillance = {
          equipment: cameraCost,
          installation: installCost,
          software: softwareCost,
          total: cameraCost + installCost + softwareCost
        };
        totalCost += breakdown.surveillance.total;
      }

      // Access Control calculation
      if (formData.accessControl.enabled) {
        const doorCount = parseInt(formData.accessControl.doors) || 0;
        const readerCount = parseInt(formData.accessControl.cardReaders) || doorCount;
        const level = formData.accessControl.level;

        const doorCost = doorCount * pricing.accessControl[level].door;
        const readerCost = readerCount * pricing.accessControl[level].reader;
        const softwareCost = pricing.accessControl[level].software;

        breakdown.accessControl = {
          doors: doorCost,
          readers: readerCost,
          software: softwareCost,
          total: doorCost + readerCost + softwareCost
        };
        totalCost += breakdown.accessControl.total;
      }

      // Intrusion calculation
      if (formData.intrusion.enabled) {
        const zoneCount = parseInt(formData.intrusion.zones) || 0;
        const sensorCount = parseInt(formData.intrusion.sensors) || 0;

        const zoneCost = zoneCount * pricing.intrusion.zone;
        const sensorCost = sensorCount * pricing.intrusion.sensor;
        const panelCost = pricing.intrusion.panel;
        const monthlyCost = formData.intrusion.monitoring ? pricing.intrusion.monitoring : 0;

        breakdown.intrusion = {
          zones: zoneCost,
          sensors: sensorCost,
          panel: panelCost,
          monthlyMonitoring: monthlyCost,
          total: zoneCost + sensorCost + panelCost
        };
        totalCost += breakdown.intrusion.total;
      }

      // Fire system calculation
      if (formData.fire.enabled) {
        const detectorCount = parseInt(formData.fire.detectors) || 0;
        const coverage = formData.fire.coverage;

        let multiplier = 1;
        if (coverage === 'enhanced') multiplier = 1.4;
        if (coverage === 'premium') multiplier = 1.8;

        const detectorCost = detectorCount * pricing.fire.detector * multiplier;
        const panelCost = pricing.fire.panel;
        const notificationCost = Math.ceil(detectorCount / 10) * pricing.fire.notification;

        breakdown.fire = {
          detectors: detectorCost,
          panel: panelCost,
          notification: notificationCost,
          total: detectorCost + panelCost + notificationCost
        };
        totalCost += breakdown.fire.total;
      }

      setEstimate({ breakdown, totalCost });
    } catch (error) {
      console.error('Calculation error:', error);
      // Fallback to basic calculation if AI fails
      basicCalculation();
    } finally {
      setIsCalculating(false);
    }
  };

  const getAiRecommendations = async () => {
    try {
      // Build facility profile for AI
      const facilityProfile = {
        facilityType: 'Commercial Building',
        squareFootage: parseInt(facilitySize) || 25000,
        securityLevel: 'standard',
        systems: {
          surveillance: formData.surveillance.enabled,
          accessControl: formData.accessControl.enabled,
          intrusion: formData.intrusion.enabled,
          fire: formData.fire.enabled
        }
      };

      // Get AI recommendations with real pricing
      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_recommendations',
          requirements: facilityProfile
        })
      });

      if (response.ok) {
        const aiData = await response.json();
        setAiRecommendations(aiData.recommendations);
        setRealPricingData(aiData.realPricingData || []);
      }
    } catch (error) {
      console.error('AI recommendations error:', error);
    }
  };

  const basicCalculation = () => {
    let totalCost = 0;
    const breakdown = {};

    // Basic calculation fallback logic
    setEstimate({ breakdown, totalCost });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handoffToAiAssistant = () => {
    // Prepare handoff data
    const handoffData = {
      source: 'security-estimate',
      facilitySize,
      contactInfo,
      selectedSystems: Object.keys(formData).filter(key => formData[key].enabled),
      estimate: estimate?.totalCost,
      timestamp: new Date().toISOString()
    };

    // Store in sessionStorage for the AI Assistant
    sessionStorage.setItem('estimateHandoff', JSON.stringify(handoffData));

    // Navigate to AI Assistant with context
    window.location.href = '/ai-assessment?source=estimate&context=detailed-analysis';
  };

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold dr-text-violet">
              Design-Rite
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="hover:dr-text-violet transition-colors">Home</Link>
              <Link href="/solutions" className="hover:dr-text-violet transition-colors">Solutions</Link>
              <Link href="/contact" className="hover:dr-text-violet transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="dr-heading-xl mb-6">Security System Estimator</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get an instant professional estimate for your comprehensive security project.
            Configure systems, see real-time pricing, and connect with our experts.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 mb-8 border">
          <h2 className="text-2xl font-bold mb-6 dr-text-violet">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={contactInfo.name}
                onChange={(e) => handleContactChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={contactInfo.company}
                onChange={(e) => handleContactChange('company', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                placeholder="ABC Manufacturing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Facility Information */}
        <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 mb-8 border">
          <h2 className="text-2xl font-bold mb-6 dr-text-violet">Facility Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Facility Size (sq ft)</label>
              <input
                type="number"
                value={facilitySize}
                onChange={(e) => setFacilitySize(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                placeholder="25,000"
              />
            </div>
          </div>
        </div>

        {/* Security Systems */}
        <div className="space-y-8">

          {/* Video Surveillance */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={formData.surveillance.enabled}
                onChange={() => handleSystemToggle('surveillance')}
                className="mr-4 h-5 w-5 text-purple-600 rounded"
              />
              <h3 className="text-2xl font-bold dr-text-violet">📹 Video Surveillance System</h3>
            </div>

            {formData.surveillance.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pl-9">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Cameras</label>
                  <input
                    type="number"
                    value={formData.surveillance.cameras}
                    onChange={(e) => handleInputChange('surveillance', 'cameras', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Camera Quality Level</label>
                  <select
                    value={formData.surveillance.coverage}
                    onChange={(e) => handleInputChange('surveillance', 'coverage', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet"
                    style={{ backgroundColor: '#374151', color: '#f4f4f5' }}
                  >
                    <option value="basic">Basic (1080p HD)</option>
                    <option value="standard">Standard (4K Ultra HD)</option>
                    <option value="premium">Premium (4K + AI Analytics)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Access Control */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={formData.accessControl.enabled}
                onChange={() => handleSystemToggle('accessControl')}
                className="mr-4 h-5 w-5 text-purple-600 rounded"
              />
              <h3 className="text-2xl font-bold dr-text-violet">🔐 Access Control System</h3>
            </div>

            {formData.accessControl.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pl-9">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Controlled Doors</label>
                  <input
                    type="number"
                    value={formData.accessControl.doors}
                    onChange={(e) => handleInputChange('accessControl', 'doors', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Card Readers</label>
                  <input
                    type="number"
                    value={formData.accessControl.cardReaders}
                    onChange={(e) => handleInputChange('accessControl', 'cardReaders', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">System Level</label>
                  <select
                    value={formData.accessControl.level}
                    onChange={(e) => handleInputChange('accessControl', 'level', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet"
                    style={{ backgroundColor: '#374151', color: '#f4f4f5' }}
                  >
                    <option value="standard">Standard (Basic Card Access)</option>
                    <option value="enterprise">Enterprise (Biometric + Multi-Factor)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Intrusion Detection */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={formData.intrusion.enabled}
                onChange={() => handleSystemToggle('intrusion')}
                className="mr-4 h-5 w-5 text-purple-600 rounded"
              />
              <h3 className="text-2xl font-bold dr-text-violet">🚨 Intrusion Detection System</h3>
            </div>

            {formData.intrusion.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pl-9">
                <div>
                  <label className="block text-sm font-medium mb-2">Detection Zones</label>
                  <input
                    type="number"
                    value={formData.intrusion.zones}
                    onChange={(e) => handleInputChange('intrusion', 'zones', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sensors/Devices</label>
                  <input
                    type="number"
                    value={formData.intrusion.sensors}
                    onChange={(e) => handleInputChange('intrusion', 'sensors', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                    placeholder="24"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    checked={formData.intrusion.monitoring}
                    onChange={(e) => handleInputChange('intrusion', 'monitoring', e.target.checked)}
                    className="mr-3 h-5 w-5 text-purple-600 rounded"
                  />
                  <label className="text-sm font-medium">24/7 Professional Monitoring</label>
                </div>
              </div>
            )}
          </div>

          {/* Fire Detection */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={formData.fire.enabled}
                onChange={() => handleSystemToggle('fire')}
                className="mr-4 h-5 w-5 text-purple-600 rounded"
              />
              <h3 className="text-2xl font-bold dr-text-violet">🔥 Fire Detection & Life Safety</h3>
            </div>

            {formData.fire.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pl-9">
                <div>
                  <label className="block text-sm font-medium mb-2">Smoke/Heat Detectors</label>
                  <input
                    type="number"
                    value={formData.fire.detectors}
                    onChange={(e) => handleInputChange('fire', 'detectors', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Coverage Level</label>
                  <select
                    value={formData.fire.coverage}
                    onChange={(e) => handleInputChange('fire', 'coverage', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet"
                    style={{ backgroundColor: '#374151', color: '#f4f4f5' }}
                  >
                    <option value="code-minimum">Code Minimum (Basic Compliance)</option>
                    <option value="enhanced">Enhanced (Above Code)</option>
                    <option value="premium">Premium (Maximum Protection)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-12">
          <button
            onClick={calculateEstimate}
            disabled={isCalculating}
            className="dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-4 px-12 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Analyzing with AI...
              </div>
            ) : (
              "Generate Professional Estimate"
            )}
          </button>
          <p className="text-sm text-gray-400 mt-3">
            Powered by AI with real-time pricing from 3,000+ security products
          </p>
        </div>

        {/* Estimate Results */}
        {estimate && (
          <div className="mt-12 bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 border">
            <h2 className="text-3xl font-bold mb-8 text-center dr-text-violet">Security System Investment Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(estimate.breakdown).map(([system, details]) => (
                <div key={system} className="bg-white/5 rounded-2xl p-6 border border-gray-600/30">
                  <h3 className="text-xl font-semibold mb-4 capitalize dr-text-violet">
                    {system === 'accessControl' ? 'Access Control System' :
                     system === 'surveillance' ? 'Video Surveillance System' :
                     system === 'intrusion' ? 'Intrusion Detection System' :
                     system === 'fire' ? 'Fire Detection System' : system}
                  </h3>
                  <div className="space-y-3 text-sm">
                    {Object.entries(details).map(([item, cost]) => (
                      item !== 'total' && (
                        <div key={item} className="flex justify-between">
                          <span className="capitalize text-gray-300">
                            {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="font-semibold">
                            {item === 'monthlyMonitoring' ?
                              `${formatCurrency(cost)}/month` :
                              formatCurrency(cost)
                            }
                          </span>
                        </div>
                      )
                    ))}
                    <div className="flex justify-between font-bold text-lg border-t border-purple-400/30 pt-3 mt-4 dr-text-violet">
                      <span>System Subtotal</span>
                      <span>{formatCurrency(details.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <div className="text-5xl font-bold dr-text-violet mb-4">
                {formatCurrency(estimate.totalCost)}
              </div>
              <div className="text-xl text-gray-300 mb-6">
                Total Project Investment
              </div>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                * Professional estimate includes equipment, installation, and initial configuration.
                Final pricing may vary based on site conditions, specific requirements, and local regulations.
              </p>
            </div>

            <div className="mt-10 bg-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="font-bold text-xl mb-4 dr-text-violet">Ready to Move Forward?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Next Steps Include:</h4>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>• Comprehensive site security assessment</li>
                    <li>• Detailed system specifications review</li>
                    <li>• Code compliance verification</li>
                    <li>• Installation timeline and project planning</li>
                    <li>• Training and ongoing support options</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Get Your Formal Proposal:</h4>
                  <div className="space-y-3">
                    <Link
                      href="/contact"
                      className="block text-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-semibold py-3 px-6 rounded-xl transition-all"
                    >
                      Schedule Consultation
                    </Link>
                    <Link
                      href="/professional-proposals"
                      className="block text-center bg-gray-700 hover:bg-gray-600 dr-text-pearl font-semibold py-3 px-6 rounded-xl transition-all"
                    >
                      Learn About Our Process
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Need More Detail?</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => handoffToAiAssistant()}
                      className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dr-text-pearl font-semibold py-3 px-6 rounded-xl transition-all"
                    >
                      🤖 Continue with AI Discovery
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Get detailed requirements analysis, compliance mapping, and professional proposals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design-Rite Branding Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            Powered by <span className="dr-text-violet font-semibold">Design-Rite Discovery Assistant</span> •
            Professional security system design and integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityEstimateForm;