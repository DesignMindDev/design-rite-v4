'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Shield, Building2, Users, Calendar, DollarSign, CheckCircle, AlertTriangle, Download, Briefcase, ArrowLeft, ExternalLink, Database, GitBranch, MapPin } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { productIntelligenceAPI, type ProductData } from '../../lib/product-intelligence';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const IntegratorDiscoveryAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🚀 **Welcome to the Design-Rite AI Assessment Demo!**\n\nThis interactive demonstration showcases our advanced discovery methodology that helps security integrators capture every critical detail for winning proposals.\n\n**What you'll experience:**\n✅ Intelligent client discovery conversation\n✅ Real-time qualification scoring\n✅ Automated document generation\n✅ Compliance framework mapping\n\n**Ready to see the power?** Choose a scenario below or tell me about a specific project you're working on!",
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [sessionData, setSessionData] = useState({
    sessionId: Date.now().toString(),
    companyName: '',
    facilityType: '',
    currentPhase: 'initial_discovery',
    qualificationScore: 0,
    documentsGenerated: [],
    startTime: new Date(),
    userInteractions: 0
  });

  const [realPricingData, setRealPricingData] = useState({
    cameras: [],
    controllers: [],
    nvrs: [],
    lastUpdated: null,
    isLoading: false
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch real pricing data from harvester API
  const fetchRealPricingData = async () => {
    setRealPricingData(prev => ({ ...prev, isLoading: true }));

    try {
      // Fetch cameras
      const cameraResults = await productIntelligenceAPI.searchProducts('camera', 10);
      const controllerResults = await productIntelligenceAPI.searchProducts('controller', 5);
      const nvrResults = await productIntelligenceAPI.searchProducts('nvr', 5);

      setRealPricingData({
        cameras: cameraResults.products || [],
        controllers: controllerResults.products || [],
        nvrs: nvrResults.products || [],
        lastUpdated: new Date(),
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch real pricing data:', error);
      setRealPricingData(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Calculate package pricing based on real data
  const calculatePackagePricing = () => {
    const { cameras, controllers, nvrs } = realPricingData;

    if (cameras.length === 0) {
      // Return default pricing if no data available
      return {
        essential: 285000,
        professional: 425000,
        enterprise: 580000
      };
    }

    // Calculate based on real pricing data
    const avgCameraPrice = cameras.reduce((sum, camera) =>
      sum + (camera.pricing?.street_price || camera.pricing?.msrp || 500), 0
    ) / cameras.length;

    const avgControllerPrice = controllers.length > 0 ?
      controllers.reduce((sum, controller) =>
        sum + (controller.pricing?.street_price || controller.pricing?.msrp || 2000), 0
      ) / controllers.length : 2000;

    const avgNvrPrice = nvrs.length > 0 ?
      nvrs.reduce((sum, nvr) =>
        sum + (nvr.pricing?.street_price || nvr.pricing?.msrp || 3000), 0
      ) / nvrs.length : 3000;

    // Calculate package totals with real pricing
    const essential = Math.round(
      (avgCameraPrice * 16) + // 16 cameras
      (avgControllerPrice * 2) + // 2 controllers
      (avgNvrPrice * 1) + // 1 NVR
      (15000) // Installation & misc
    );

    const professional = Math.round(
      (avgCameraPrice * 32) + // 32 cameras
      (avgControllerPrice * 4) + // 4 controllers
      (avgNvrPrice * 2) + // 2 NVRs
      (25000) // Installation & analytics
    );

    const enterprise = Math.round(
      (avgCameraPrice * 48) + // 48 cameras
      (avgControllerPrice * 6) + // 6 controllers
      (avgNvrPrice * 3) + // 3 NVRs
      (50000) // Installation & enterprise features
    );

    return { essential, professional, enterprise };
  };

  // Fetch pricing data on component mount
  useEffect(() => {
    fetchRealPricingData();
  }, []);

  // Demo scenarios for quick start
  const demoScenarios = [
    {
      id: 'university',
      title: 'State University Campus',
      icon: '🎓',
      description: 'Multi-building campus with dormitories, FERPA compliance requirements',
      initialMessage: 'I need a security assessment for State University. We have 15 buildings including dormitories, administrative offices, and research facilities. FERPA compliance is critical.'
    },
    {
      id: 'hospital',
      title: 'Regional Medical Center',
      icon: '🏥',
      description: 'Healthcare facility requiring HIPAA compliance and emergency protocols',
      initialMessage: 'We need a comprehensive security system for Regional Medical Center. This is a 200-bed facility with HIPAA requirements, emergency departments, and multiple access points.'
    },
    {
      id: 'corporate',
      title: 'Corporate Headquarters',
      icon: '🏢',
      description: 'Fortune 500 company with high-security requirements and executive protection',
      initialMessage: 'Our Fortune 500 company is building new headquarters. We need enterprise-grade security with executive protection, visitor management, and integration with existing IT infrastructure.'
    },
    {
      id: 'government',
      title: 'Federal Facility',
      icon: '🏛️',
      description: 'Government building requiring FISMA compliance and classified area protection',
      initialMessage: 'We are upgrading security for a federal facility. FISMA compliance is mandatory, and we have both public and classified areas requiring different security levels.'
    }
  ];

  // Log user interactions to Supabase
  const logInteraction = async (interactionData) => {
    try {
      await supabase.from('assessment_interactions').insert([
        {
          session_id: sessionData.sessionId,
          user_email: userEmail,
          interaction_type: interactionData.type,
          message_content: interactionData.content,
          scenario_selected: selectedScenario,
          qualification_score: sessionData.qualificationScore,
          timestamp: new Date().toISOString(),
          nda_accepted: ndaAccepted
        }
      ]);
    } catch (error) {
      console.error('Failed to log interaction:', error);
    }
  };

  // Log NDA acceptances to dedicated table
  const logNDAAcceptance = async (email, companyInfo = null) => {
    try {
      await supabase.from('nda_acceptances').insert([
        {
          session_id: sessionData.sessionId,
          user_email: email,
          acceptance_timestamp: new Date().toISOString(),
          scenario_context: selectedScenario,
          facility_type: sessionData.facilityType,
          qualification_score: sessionData.qualificationScore,
          user_interactions_count: sessionData.userInteractions,
          session_duration_minutes: Math.round((new Date() - sessionData.startTime) / 60000),
          ip_address: null, // Can be populated server-side if needed
          user_agent: navigator.userAgent,
          company_info: companyInfo,
          nda_version: '1.0',
          acceptance_method: 'web_form'
        }
      ]);
    } catch (error) {
      console.error('Failed to log NDA acceptance:', error);
    }
  };

  // Handle scenario selection
  const selectScenario = async (scenario) => {
    setSelectedScenario(scenario.id);

    // Log scenario selection
    await logInteraction({
      type: 'scenario_selected',
      content: `Selected scenario: ${scenario.title}`
    });

    const scenarioMessage = {
      role: 'user',
      content: scenario.initialMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, scenarioMessage]);

    // AI responds to scenario
    const aiResponse = {
      role: 'assistant',
      content: `Perfect! I can see you're working with ${scenario.title}. Let me gather some additional details to ensure we capture every requirement for your security system design.\n\n**Initial Assessment:**\n${scenario.description}\n\n**Next, I need to understand:**\n• Approximate square footage or number of people\n• Current security systems (if any)\n• Specific compliance requirements\n• Budget considerations\n• Timeline for implementation\n\nLet's start with the size and scope - can you tell me more about the facility dimensions and occupancy?`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);

    // Update session data
    setSessionData(prev => ({
      ...prev,
      facilityType: scenario.title,
      qualificationScore: 15, // Starting score for scenario selection
      userInteractions: prev.userInteractions + 1
    }));
  };

  // Call Claude API for intelligent discovery assistance
  const callClaudeAPI = async (userMessage) => {
    try {
      const response = await fetch('/api/discovery-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionData: sessionData,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update session data with discovery progress
        if (data.discoveryProgress) {
          setSessionData(prev => ({
            ...prev,
            currentPhase: data.discoveryProgress.currentPhase,
            qualificationScore: data.discoveryProgress.qualificationScore
          }));
        }

        return data.message.content;
      } else {
        // Use fallback response if provided
        return data.fallback?.content || "I apologize, but I'm having trouble processing that right now. Could you please rephrase your response?";
      }
    } catch (error) {
      console.error('Claude API call failed:', error);
      return "I'm experiencing some technical difficulties. Let me help you manually - could you provide more details about your client's specific requirements?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Log user message
    await logInteraction({
      type: 'user_message',
      content: input
    });

    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Update interaction count
    setSessionData(prev => ({
      ...prev,
      userInteractions: prev.userInteractions + 1,
      qualificationScore: Math.min(prev.qualificationScore + 5, 100) // Increase score with interaction
    }));

    // Call Claude API for intelligent response
    try {
      const aiResponse = await callClaudeAPI(currentInput);

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Log AI response
      await logInteraction({
        type: 'ai_response',
        content: aiResponse
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Fallback response
      const fallbackMessage = {
        role: 'assistant',
        content: "I'm experiencing some connectivity issues. Let's continue with the discovery process. Could you provide more details about what we were discussing?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateDocuments = () => {
    setSessionData(prev => ({
      ...prev,
      documentsGenerated: ['Executive_Summary', 'SOW', 'BOM', 'Implementation_Plan', 'Service_Plan']
    }));

    const pricingStatus = realPricingData.lastUpdated ?
      `\n\n🔥 **LIVE PRICING ACTIVE** - Proposal includes real-time pricing from ${realPricingData.cameras.length + realPricingData.controllers.length + realPricingData.nvrs.length} harvested products (CDW, manufacturer data)` :
      '';

    const docMessage = {
      role: 'assistant',
      content: `📋 **PROFESSIONAL DOCUMENTS GENERATED!**\n\n✅ Executive Summary\n✅ Statement of Work (SOW)\n✅ Bill of Materials (3-Tier Pricing)\n✅ Implementation Plan & Timeline\n✅ Service & Maintenance Plan\n\nAll documents are customized based on your specific requirements and include detailed specifications, pricing, and timelines. Click 'View Documents' below to see the complete professional package.${pricingStatus}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, docMessage]);
    setShowDocuments(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 text-center relative">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Main</span>
          </Link>
          <div className="flex-1 text-center">
            <span className="font-bold text-lg">🚀 DEMO VERSION</span>
            <span className="ml-2">Experience the Power of Design-Rite AI Assessment</span>
          </div>
          <button
            onClick={() => setShowNdaModal(true)}
            className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all text-sm"
          >
            <FileText className="w-4 h-4" />
            Unlock Full Platform
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-purple-300" />
              <h1 className="text-3xl font-bold text-white">Design-Rite AI Discovery Assistant</h1>
            </div>
            <p className="text-white/70 text-lg">
              Systematic client discovery for security integrators - never miss a detail, never lose a requirement
            </p>
            <div className="mt-4 bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                💡 <strong>Demo Experience:</strong> This demonstration showcases our AI-powered discovery methodology.
                For full enterprise features including CRM integration, project management, and compliance automation,
                contact us to schedule a personalized demo.
              </p>
            </div>
          </div>

          {/* Quick Start Scenarios */}
          {!selectedScenario && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Choose a Demo Scenario</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {demoScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => selectScenario(scenario)}
                    className="bg-white/10 border border-white/20 rounded-xl p-4 text-left hover:bg-white/20 transition-all hover:scale-105"
                  >
                    <div className="text-3xl mb-2">{scenario.icon}</div>
                    <h3 className="text-white font-bold mb-2">{scenario.title}</h3>
                    <p className="text-white/70 text-sm">{scenario.description}</p>
                  </button>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-white/60 text-sm">Or start a custom conversation below</p>
              </div>
            </div>
          )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
              {/* Messages */}
              <div className="h-[600px] overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-white/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-white/60 text-sm">AI is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/20 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                    placeholder="Discuss client requirements, ask questions, or provide details..."
                    className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    disabled={isTyping}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress & Actions */}
          <div className="space-y-6">
            {/* Discovery Progress */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Discovery Progress</h3>
              <div className="space-y-2">
                {['WHO', 'WHAT', 'WHEN', 'WHERE', 'WHY', 'HOW', 'COMPLIANCE'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white/60">
                      {index + 1}
                    </div>
                    <span className="text-sm text-white/60">{step}</span>
                  </div>
                ))}
              </div>

              {sessionData.qualificationScore > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Qualification Score</span>
                    <span className={`font-bold ${
                      sessionData.qualificationScore >= 90 ? 'text-green-400' :
                      sessionData.qualificationScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {sessionData.qualificationScore}/100
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Client Info */}
            {sessionData.companyName && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Client Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Company:</span>
                    <span className="text-white">{sessionData.companyName}</span>
                  </div>
                  {sessionData.facilityType && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Facility:</span>
                      <span className="text-white">{sessionData.facilityType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/60">Phase:</span>
                    <span className="text-white capitalize">{sessionData.currentPhase.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {sessionData.currentPhase === 'documentation_ready' && (
                <button
                  onClick={generateDocuments}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Generate Documents
                </button>
              )}

              {sessionData.documentsGenerated.length > 0 && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Documents Ready
                  </h4>
                  <div className="space-y-2">
                    {sessionData.documentsGenerated.map(doc => (
                      <div key={doc} className="flex items-center justify-between text-sm">
                        <span className="text-green-200">{doc.replace('_', ' ')}</span>
                        <Download className="w-4 h-4 text-green-300 cursor-pointer hover:text-green-200" />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowDocuments(true)}
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium text-sm"
                  >
                    📄 View Document Previews
                  </button>
                </div>
              )}
            </div>

            {/* Enterprise Features Preview */}
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Full Platform Features
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-purple-200 font-medium">Project Management</div>
                    <div className="text-purple-300/70">Multi-project dashboard with status tracking</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-purple-200 font-medium">CRM Integration</div>
                    <div className="text-purple-300/70">Salesforce, HubSpot, Pipedrive sync</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-purple-200 font-medium">Mapping Software</div>
                    <div className="text-purple-300/70">System Surveyor, BlueBeam, Site Owl APIs</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-purple-200 font-medium">Import/Export</div>
                    <div className="text-purple-300/70">CAD files, compliance checklists, BOMs</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNdaModal(true)}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm"
              >
                Request Enterprise Demo
              </button>
            </div>

            {/* Benefits Reminder */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Why This Matters</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Systematic requirement capture</li>
                <li>• Nothing falls through cracks</li>
                <li>• Professional documentation</li>
                <li>• Higher close rates</li>
                <li>• Smoother implementations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* NDA Modal */}
        {showNdaModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Enterprise Platform Access</h2>
                  <button
                    onClick={() => setShowNdaModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    To access our full enterprise platform with live project management, CRM integrations,
                    and sensitive project data handling, please provide your information and accept our NDA.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Your Company Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="your@company.com"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="nda-accept"
                        checked={ndaAccepted}
                        onChange={(e) => setNdaAccepted(e.target.checked)}
                        className="mt-1"
                      />
                      <label htmlFor="nda-accept" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a
                          href="/nda"
                          target="_blank"
                          className="text-purple-600 hover:text-purple-700 underline"
                        >
                          Non-Disclosure Agreement
                        </a>{' '}
                        and understand that any sensitive project information shared will be protected
                        under this agreement.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNdaModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (userEmail && companyName && ndaAccepted) {
                        // Log to dedicated NDA table
                        await logNDAAcceptance(userEmail, {
                          company_name: companyName,
                          request_type: 'enterprise_demo'
                        });

                        // Also log as interaction
                        await logInteraction({
                          type: 'nda_accepted',
                          content: `User ${userEmail} from ${companyName} accepted NDA and requested enterprise access`
                        });

                        setNdaAccepted(true);
                        setShowNdaModal(false);
                        alert('Thank you! Our team will contact you within 24 hours to schedule your personalized enterprise demo.');
                      }
                    }}
                    disabled={!userEmail || !companyName || !ndaAccepted}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept NDA & Request Enterprise Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {showDocuments && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">📋 Generated Documents</h2>
                  <button
                    onClick={() => setShowDocuments(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Executive Summary */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">📊 Executive Summary</h3>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Project Overview</h4>
                          <p className="text-gray-700 text-sm mb-3">
                            <strong>Client:</strong> {sessionData.facilityType || 'Demo University Campus'}<br/>
                            <strong>Facility Type:</strong> Educational Institution<br/>
                            <strong>Assessment Date:</strong> {new Date().toLocaleDateString()}<br/>
                            <strong>Compliance Requirements:</strong> FERPA, ADA, Local Fire Codes
                          </p>
                          <h4 className="font-semibold text-gray-800 mb-2">Key Requirements</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• 15 building multi-campus security system</li>
                            <li>• Student dormitory access control</li>
                            <li>• Administrative building protection</li>
                            <li>• Research facility secured zones</li>
                            <li>• Emergency notification integration</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Investment Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Essential Package:</span><span className="font-semibold">$285,000</span></div>
                            <div className="flex justify-between"><span>Professional Package:</span><span className="font-semibold">$425,000</span></div>
                            <div className="flex justify-between"><span>Enterprise Package:</span><span className="font-semibold text-blue-600">$580,000</span></div>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-2 mt-4">Timeline</h4>
                          <p className="text-sm text-gray-700">
                            <strong>Design Phase:</strong> 3-4 weeks<br/>
                            <strong>Installation:</strong> 8-12 weeks<br/>
                            <strong>Training & Handover:</strong> 2 weeks
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statement of Work */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-2xl font-bold text-green-600 mb-4">📋 Statement of Work</h3>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Scope of Services</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <h5 className="font-medium text-gray-800">Design Services</h5>
                              <ul className="space-y-1 ml-4">
                                <li>• Site security assessment</li>
                                <li>• System architecture design</li>
                                <li>• CAD drawings and layouts</li>
                                <li>• Integration specifications</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800">Installation Services</h5>
                              <ul className="space-y-1 ml-4">
                                <li>• Access control system installation</li>
                                <li>• Video surveillance deployment</li>
                                <li>• Intrusion detection setup</li>
                                <li>• System integration & testing</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Deliverables</h4>
                          <div className="grid md:grid-cols-3 gap-3 text-sm">
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-green-700">Design Phase</h5>
                              <p>Site plans, equipment specs, installation drawings</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-green-700">Installation Phase</h5>
                              <p>Fully operational security system with documentation</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-green-700">Support Phase</h5>
                              <p>Training materials, warranties, maintenance plans</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bill of Materials */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-2xl font-bold text-purple-600 mb-4">💰 Bill of Materials</h3>
                    {realPricingData.lastUpdated && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <Database className="w-4 h-4" />
                          <span>Pricing updated with live data from {realPricingData.cameras.length + realPricingData.controllers.length + realPricingData.nvrs.length} products</span>
                          <span className="text-xs text-green-600">• Last updated: {realPricingData.lastUpdated.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )}
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                          <h4 className="font-bold text-gray-800 mb-3 text-center">Essential Package</h4>
                          <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-gray-800">${calculatePackagePricing().essential.toLocaleString()}</span>
                            {realPricingData.lastUpdated && (
                              <div className="text-xs text-green-600 mt-1">Live pricing</div>
                            )}
                          </div>
                          <ul className="text-sm space-y-2">
                            <li>• Basic access control (5 doors)</li>
                            <li>• 16-camera surveillance system</li>
                            <li>• Central monitoring station</li>
                            <li>• Basic intrusion detection</li>
                            <li>• 1-year warranty</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-blue-500 relative">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Recommended
                          </div>
                          <h4 className="font-bold text-blue-600 mb-3 text-center">Professional Package</h4>
                          <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-blue-600">${calculatePackagePricing().professional.toLocaleString()}</span>
                            {realPricingData.lastUpdated && (
                              <div className="text-xs text-green-600 mt-1">Live pricing</div>
                            )}
                          </div>
                          <ul className="text-sm space-y-2">
                            <li>• Advanced access control (15 doors)</li>
                            <li>• 32-camera IP surveillance</li>
                            <li>• Video analytics & facial recognition</li>
                            <li>• Perimeter intrusion detection</li>
                            <li>• Emergency notification system</li>
                            <li>• Mobile app integration</li>
                            <li>• 3-year warranty & support</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-2 border-purple-500">
                          <h4 className="font-bold text-purple-600 mb-3 text-center">Enterprise Package</h4>
                          <div className="text-center mb-4">
                            <span className="text-3xl font-bold text-purple-600">${calculatePackagePricing().enterprise.toLocaleString()}</span>
                            {realPricingData.lastUpdated && (
                              <div className="text-xs text-green-600 mt-1">Live pricing</div>
                            )}
                          </div>
                          <ul className="text-sm space-y-2">
                            <li>• Enterprise access control (25+ doors)</li>
                            <li>• 64-camera AI-powered system</li>
                            <li>• Advanced analytics & reporting</li>
                            <li>• Multi-layer security integration</li>
                            <li>• Command center setup</li>
                            <li>• 24/7 monitoring service</li>
                            <li>• 5-year comprehensive warranty</li>
                            <li>• Annual system upgrades</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Implementation Plan */}
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">🚀 Implementation Plan</h3>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="bg-white p-4 rounded border-l-4 border-orange-300">
                            <h4 className="font-semibold text-orange-700 mb-2">Phase 1: Design</h4>
                            <p className="text-sm text-gray-700 mb-2"><strong>Duration:</strong> 3-4 weeks</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Site survey & assessment</li>
                              <li>• System design & CAD</li>
                              <li>• Equipment specification</li>
                              <li>• Client approval</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <h4 className="font-semibold text-orange-700 mb-2">Phase 2: Procurement</h4>
                            <p className="text-sm text-gray-700 mb-2"><strong>Duration:</strong> 2-3 weeks</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Equipment ordering</li>
                              <li>• Material staging</li>
                              <li>• Pre-configuration</li>
                              <li>• Quality testing</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-700 mb-2">Phase 3: Installation</h4>
                            <p className="text-sm text-gray-700 mb-2"><strong>Duration:</strong> 8-12 weeks</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Infrastructure installation</li>
                              <li>• System deployment</li>
                              <li>• Integration & testing</li>
                              <li>• System commissioning</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-600">
                            <h4 className="font-semibold text-orange-700 mb-2">Phase 4: Handover</h4>
                            <p className="text-sm text-gray-700 mb-2"><strong>Duration:</strong> 2 weeks</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Staff training</li>
                              <li>• Documentation delivery</li>
                              <li>• Warranty activation</li>
                              <li>• Go-live support</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded">
                          <h4 className="font-semibold text-gray-800 mb-3">Critical Milestones</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>Design Approval</span>
                              <span className="text-orange-600 font-medium">Week 4</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>Equipment Delivery</span>
                              <span className="text-orange-600 font-medium">Week 7</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>System Testing Complete</span>
                              <span className="text-orange-600 font-medium">Week 16</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>Final Handover</span>
                              <span className="text-orange-600 font-medium">Week 18</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service & Maintenance Plan */}
                  <div className="border-l-4 border-red-500 pl-6">
                    <h3 className="text-2xl font-bold text-red-600 mb-4">🔧 Service & Maintenance Plan</h3>
                    <div className="bg-red-50 p-6 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Preventive Maintenance</h4>
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-red-700">Monthly Service</h5>
                              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                <li>• System health monitoring</li>
                                <li>• Software updates</li>
                                <li>• Performance optimization</li>
                              </ul>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-red-700">Quarterly Service</h5>
                              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                <li>• Hardware inspection</li>
                                <li>• Camera cleaning & calibration</li>
                                <li>• Access control audit</li>
                              </ul>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-red-700">Annual Service</h5>
                              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                <li>• Comprehensive system review</li>
                                <li>• Security assessment update</li>
                                <li>• Technology refresh planning</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Support Services</h4>
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-red-700">24/7 Technical Support</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                Round-the-clock phone and remote support for critical issues
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-red-700">4-Hour Response SLA</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                On-site technician dispatch for urgent repairs
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <h5 className="font-medium text-red-700">Parts & Labor Warranty</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                All replacement parts and labor covered under warranty
                              </p>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-3 mt-4">Service Pricing</h4>
                          <div className="bg-white p-3 rounded border">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Basic Support Plan:</span>
                                <span className="font-semibold">$2,400/month</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Premium Support Plan:</span>
                                <span className="font-semibold">$4,200/month</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Enterprise Support Plan:</span>
                                <span className="font-semibold">$6,800/month</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8 pt-6 border-t">
                  <button
                    onClick={() => setShowDocuments(false)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default IntegratorDiscoveryAssistant;