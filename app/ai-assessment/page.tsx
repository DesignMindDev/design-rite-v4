"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Building2, Shield, Zap, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function AIAssessmentPage() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessionData, setSessionData] = useState({
    facilityType: '',
    squareFootage: '',
    securityConcerns: [],
    budget: '',
    compliance: [],
    timeline: '',
    currentSystems: '',
    stakeholders: [],
    riskLevel: '',
    priorities: []
  });
  
  const [aiInsights, setAiInsights] = useState([]);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  // Real AI insight generation using API
  const generateAIInsight = async (userInput, context) => {
    setIsGeneratingInsight(true);
    
    try {
      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionData: { 
            value: userInput,
            ...sessionData 
          },
          requestType: 'real-time-insight',
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.insight) {
        setAiInsights(prev => [...prev, { 
          insight: data.insight.insight,
          recommendation: data.insight.recommendation,
          context, 
          timestamp: Date.now(),
          priority: data.insight.priority,
          provider: data.provider || 'AI'
        }]);
      } else {
        // Fallback to local insights if API doesn't return data
        const fallbackInsight = generateLocalInsight(userInput, context);
        if (fallbackInsight) {
          setAiInsights(prev => [...prev, { 
            ...fallbackInsight, 
            context, 
            timestamp: Date.now(),
            provider: 'Local'
          }]);
        }
      }
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Fallback to local insights on error
      const fallbackInsight = generateLocalInsight(userInput, context);
      if (fallbackInsight) {
        setAiInsights(prev => [...prev, { 
          ...fallbackInsight, 
          context, 
          timestamp: Date.now(),
          provider: 'Local',
          note: 'Generated locally due to API unavailability'
        }]);
      }
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Fallback local insight generation
  const generateLocalInsight = (userInput, context) => {
    const localInsights = {
      'facilityType': {
        'office': {
          insight: "Corporate offices need balanced security for employee safety and asset protection",
          recommendation: "Focus on access control and visitor management systems"
        },
        'retail': {
          insight: "Retail environments require loss prevention with customer experience balance", 
          recommendation: "AI-powered theft detection and customer analytics are essential"
        },
        'warehouse': {
          insight: "Warehouses need perimeter security and cargo protection systems",
          recommendation: "Consider truck dock monitoring and inventory tracking integration"
        },
        'healthcare': {
          insight: "Healthcare facilities require HIPAA compliance and advanced access control",
          recommendation: "Biometric access and zone-based security with 24/7 monitoring"
        },
        'education': {
          insight: "Educational institutions need comprehensive safety and emergency response",
          recommendation: "Multi-zone lockdown capabilities and visitor screening systems"
        },
        'manufacturing': {
          insight: "Manufacturing plants need industrial-grade security with safety integration",
          recommendation: "Explosion-proof cameras and safety system integration required"
        }
      },
      'budget': {
        'low': {
          insight: "Your budget suggests a phased implementation approach would be most effective",
          recommendation: "Priority 1: Secure main entrances and critical areas first"
        },
        'medium': {
          insight: "Your budget allows for a comprehensive system with advanced features",
          recommendation: "Include AI analytics and integrated access control"
        },
        'high': {
          insight: "Premium budget enables enterprise-grade solutions with redundancy",
          recommendation: "Full integration with business systems and advanced analytics"
        }
      }
    };

    if (context === 'facilityType') {
      return localInsights.facilityType[userInput];
    } else if (context === 'budget') {
      const budgetValue = parseInt(userInput);
      const budgetCategory = budgetValue <= 50000 ? 'low' : budgetValue <= 100000 ? 'medium' : 'high';
      return localInsights.budget[budgetCategory];
    }

    return null;
  };

  // Generate full AI assessment
  const generateFullAssessment = async () => {
    try {
      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionData: sessionData,
          requestType: 'full-assessment'
        })
      });

      if (!response.ok) {
        throw new Error(`Assessment API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Full assessment error:', error);
      return null;
    }
  };

  const updateSessionData = (key, value) => {
    setSessionData(prev => ({ ...prev, [key]: value }));
    generateAIInsight(value, key);
  };

  const redirectToApp = () => {
    window.location.href = '/app'
  }

  const WelcomeStep = () => (
    <div className="text-center space-y-6 max-w-3xl mx-auto">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-300 rounded-full flex items-center justify-center">
        <Shield className="w-10 h-10 text-purple-800" />
      </div>
      <h1 className="text-4xl lg:text-5xl font-bold text-white">
        AI Security Consultant Demo
      </h1>
      <p className="text-xl text-white/80 leading-relaxed">
        Experience how our AI gathers information and provides instant insights. 
        In just 5 minutes, you'll see a complete security assessment with professional recommendations.
      </p>
      
      <div className="grid md:grid-cols-3 gap-4 my-8">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-2xl mb-2">🧠</div>
          <h3 className="font-semibold text-white mb-1">Smart Questions</h3>
          <p className="text-sm text-white/70">Questions adapt based on your answers</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold text-white mb-1">Instant Insights</h3>
          <p className="text-sm text-white/70">AI provides recommendations in real-time</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-white mb-1">Professional Output</h3>
          <p className="text-sm text-white/70">Complete assessment with specifications</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
        <p className="text-white/80">
          <strong className="text-white">What makes this different:</strong> Our AI doesn't just collect data - it analyzes and provides 
          insights in real-time, adapting questions based on your responses using multiple AI providers.
        </p>
      </div>
      
      <button 
        onClick={() => setCurrentStep('facility-info')}
        className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2 text-lg"
      >
        Start AI Assessment <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  const FacilityInfoStep = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-purple-300" />
          <h2 className="text-3xl font-bold text-white">Facility Information</h2>
        </div>
        <p className="text-white/70">Tell us about your facility so our AI can provide targeted recommendations</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <label className="block text-sm font-semibold text-purple-200 mb-3">
              Facility Type *
            </label>
            <select 
              className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              onChange={(e) => updateSessionData('facilityType', e.target.value)}
              value={sessionData.facilityType}
            >
              <option value="" className="text-gray-800">Select facility type</option>
              <option value="office" className="text-gray-800">Corporate Office</option>
              <option value="retail" className="text-gray-800">Retail Store</option>
              <option value="warehouse" className="text-gray-800">Warehouse/Distribution</option>
              <option value="healthcare" className="text-gray-800">Healthcare Facility</option>
              <option value="education" className="text-gray-800">Educational Institution</option>
              <option value="manufacturing" className="text-gray-800">Manufacturing Plant</option>
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <label className="block text-sm font-semibold text-purple-200 mb-3">
              Square Footage
            </label>
<input 
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="e.g., 25000"
  className="w-full p-4 bg-black/50 border border-purple-600/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
  value={sessionData.squareFootage || ''}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSessionData(prev => ({
      ...prev,
      squareFootage: value
    }));
  }}
/>       </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <label className="block text-sm font-semibold text-purple-200 mb-3">
              Primary Security Concerns (select all that apply)
            </label>
            <div className="grid grid-cols-1 gap-3">
              {['Asset Protection', 'Employee Safety', 'Visitor Management', 'Perimeter Security', 'Compliance Requirements', 'Emergency Response'].map(concern => (
                <label key={concern} className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
                  <input 
                    type="checkbox" 
                    className="text-purple-500 focus:ring-purple-400 focus:ring-2 rounded"
                    onChange={(e) => {
                      const concerns = e.target.checked 
                        ? [...sessionData.securityConcerns, concern]
                        : sessionData.securityConcerns.filter(c => c !== concern);
                      updateSessionData('securityConcerns', concerns);
                    }}
                    checked={sessionData.securityConcerns.includes(concern)}
                  />
                  <span className="text-purple-100 font-medium">{concern}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-400/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Insights
          </h3>
          
          <div className="space-y-4">
            {aiInsights.length === 0 && !isGeneratingInsight && (
              <p className="text-purple-200 text-sm">
                Start filling out the form to see AI-powered insights and recommendations appear here in real-time.
              </p>
            )}
            
            {aiInsights.map((insight, idx) => (
              <div key={insight.timestamp} className="bg-white/10 p-4 rounded-lg border-l-4 border-purple-400 animate-fadeIn">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white font-medium text-sm">{insight.insight}</p>
                  <span className="text-xs text-purple-300 bg-purple-800/30 px-2 py-1 rounded">
                    {insight.provider}
                  </span>
                </div>
                <p className="text-purple-200 text-xs">{insight.recommendation}</p>
                {insight.note && (
                  <p className="text-yellow-300 text-xs mt-1 italic">{insight.note}</p>
                )}
              </div>
            ))}
            
            {isGeneratingInsight && (
              <div className="bg-white/10 p-4 rounded-lg border-l-4 border-gray-400 animate-pulse">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-300 animate-spin" />
                  <p className="text-purple-200 text-sm">Analyzing your requirements...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {sessionData.facilityType && (
        <div className="text-center">
          <button 
            onClick={() => setCurrentStep('security-details')}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            Continue to Security Details <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );

  const SecurityDetailsStep = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-purple-300" />
          <h2 className="text-3xl font-bold text-white">Security Requirements</h2>
        </div>
        <p className="text-white/70">Help us understand your budget, timeline, and compliance needs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
          <label className="block text-sm font-semibold text-purple-200 mb-3">
            Budget Range
          </label>
          <select 
            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            onChange={(e) => updateSessionData('budget', e.target.value)}
            value={sessionData.budget}
          >
            <option value="" className="text-gray-800">Select budget range</option>
            <option value="25000" className="text-gray-800">Under $25,000</option>
            <option value="50000" className="text-gray-800">$25,000 - $50,000</option>
            <option value="100000" className="text-gray-800">$50,000 - $100,000</option>
            <option value="200000" className="text-gray-800">$100,000 - $200,000</option>
            <option value="500000" className="text-gray-800">$200,000+</option>
          </select>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
          <label className="block text-sm font-semibold text-purple-200 mb-3">
            Implementation Timeline
          </label>
          <select 
            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            onChange={(e) => updateSessionData('timeline', e.target.value)}
            value={sessionData.timeline}
          >
            <option value="" className="text-gray-800">Select timeline</option>
            <option value="immediate" className="text-gray-800">Immediate (&lt; 30 days)</option>
            <option value="quarter" className="text-gray-800">This Quarter (&lt; 90 days)</option>
            <option value="year" className="text-gray-800">This Year</option>
            <option value="planning" className="text-gray-800">Planning Phase</option>
          </select>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
        <label className="block text-sm font-semibold text-purple-200 mb-4">
          Compliance Requirements
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          {['CJIS', 'HIPAA', 'SOX', 'FERPA', 'GDPR', 'PCI DSS', 'None Required'].map(compliance => (
            <label key={compliance} className="flex items-center space-x-2 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-all">
              <input 
                type="checkbox" 
                className="text-purple-500 focus:ring-purple-400 focus:ring-2 rounded"
                onChange={(e) => {
                  const reqs = e.target.checked 
                    ? [...sessionData.compliance, compliance]
                    : sessionData.compliance.filter(c => c !== compliance);
                  updateSessionData('compliance', reqs);
                }}
                checked={sessionData.compliance.includes(compliance)}
              />
              <span className="text-purple-100 text-sm font-medium">{compliance}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={() => setCurrentStep('ai-results')}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all inline-flex items-center gap-2 text-lg"
        >
          Generate AI Assessment <Zap className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const AIResultsStep = () => (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">AI Assessment Complete</h2>
        <p className="text-white/70">Based on your responses, here's what our AI recommends</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-400" />
            Security Solution Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">IP Surveillance System</p>
                <p className="text-green-200 text-sm">24-32 cameras with 4K resolution and AI analytics</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Access Control System</p>
                <p className="text-blue-200 text-sm">Card-based access for 12-16 doors with mobile credentials</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">AI Analytics Platform</p>
                <p className="text-purple-200 text-sm">Intelligent alerts, people counting, and behavior analysis</p>
              </div>
            </div>
            {sessionData.compliance.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Compliance Features</p>
                  <p className="text-yellow-200 text-sm">{sessionData.compliance.join(', ')} compliant systems and documentation</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            AI-Generated Insights
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {aiInsights.map((insight, idx) => (
              <div key={insight.timestamp} className="bg-white/10 p-4 rounded-lg border-l-4 border-purple-400">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white font-medium text-sm">{insight.insight}</p>
                  <span className="text-xs text-purple-300 bg-purple-800/30 px-2 py-1 rounded">
                    {insight.provider}
                  </span>
                </div>
                <p className="text-purple-200 text-xs mb-2">{insight.recommendation}</p>
                <div className="text-xs text-purple-300 opacity-75">
                  Context: {insight.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-orange-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-white text-lg mb-2">This is just the beginning!</h4>
            <p className="text-orange-100 mb-4">
              In the full Design-Rite platform, you would receive:
            </p>
            <ul className="text-orange-100 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Detailed 15-page professional proposal with CAD drawings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Equipment specifications with exact model numbers and pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Compliance documentation and installation guidelines
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Multi-AI provider integration (Claude, GPT-4, Gemini) for optimal results
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Ready to see the full platform?</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/waitlist" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all">
            Join Waitlist - Q4 2025 Launch
          </Link>
          <Link href="/contact" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
            Schedule Demo
          </Link>
          <Link href="/" className="border border-white/20 text-white/80 px-6 py-4 rounded-xl font-semibold hover:bg-white/5 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Header - matches integrators page exactly */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          <ul className="hidden lg:flex items-center gap-10">
            <li><Link href="/platform" className="text-gray-300 hover:text-purple-600 font-medium transition-all">Platform</Link></li>
            <li><Link href="/solutions" className="text-purple-600 font-medium">Solutions</Link></li>
            <li><Link href="/partners" className="text-gray-300 hover:text-purple-600 font-medium transition-all">Partners</Link></li>
            <li><Link href="/about" className="text-gray-300 hover:text-purple-600 font-medium transition-all">About</Link></li>
            <li><Link href="/contact" className="text-gray-300 hover:text-purple-600 font-medium transition-all">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <button onClick={redirectToApp} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Try Platform
            </button>
          </div>

          <button className="lg:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-8">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center justify-between mb-6">
            {[
              { key: 'welcome', label: 'Welcome', icon: '🚀' },
              { key: 'facility-info', label: 'Facility Info', icon: '🏢' },
              { key: 'security-details', label: 'Security Details', icon: '🔒' },
              { key: 'ai-results', label: 'AI Results', icon: '✨' }
            ].map((step, idx) => (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center gap-3 ${
                  step.key === currentStep 
                    ? 'text-white' 
                    : ['welcome', 'facility-info', 'security-details'].indexOf(currentStep) > idx
                    ? 'text-purple-300'
                    : 'text-white/40'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    step.key === currentStep
                      ? 'bg-purple-600 text-white'
                      : ['welcome', 'facility-info', 'security-details'].indexOf(currentStep) > idx
                      ? 'bg-purple-600/30 text-purple-300'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium">{step.label}</div>
                  </div>
                </div>
                {idx < 3 && <ChevronRight className="w-5 h-5 text-white/40 mx-2 hidden sm:block" />}
              </div>
            ))}
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-700"
              style={{
                width: currentStep === 'welcome' ? '0%' : 
                       currentStep === 'facility-info' ? '25%' :
                       currentStep === 'security-details' ? '50%' : '100%'
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'welcome' && <WelcomeStep />}
          {currentStep === 'facility-info' && <FacilityInfoStep />}
          {currentStep === 'security-details' && <SecurityDetailsStep />}
          {currentStep === 'ai-results' && <AIResultsStep />}
        </div>

        {/* Back Button */}
        {currentStep !== 'welcome' && (
          <div className="max-w-4xl mx-auto mt-8">
            <button 
              onClick={() => {
                const steps = ['welcome', 'facility-info', 'security-details', 'ai-results'];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1]);
                }
              }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}