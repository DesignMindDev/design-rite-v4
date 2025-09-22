'use client';

import { useState } from 'react';
import Link from 'next/link';
import UnifiedNavigation from '../components/UnifiedNavigation';
import EmailGate from '../components/EmailGate';

export default function AISecurityAssessmentPage() {
  const [showDocument, setShowDocument] = useState('');
  const [showEmailGate, setShowEmailGate] = useState(false);

  const handleTryDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmailGate(true);
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    window.location.href = '/ai-assessment';
  };

  const documents = {
    executive: {
      title: '📊 Executive Summary',
      preview: `EXECUTIVE SUMMARY
Security Assessment for Meridian University

PROJECT OVERVIEW
Client: Meridian University Campus
Facility Type: Educational Institution (15 buildings)
Assessment Date: ${new Date().toLocaleDateString()}
Compliance Requirements: FERPA, ADA, Local Fire Codes

KEY REQUIREMENTS
• 15 building multi-campus security system
• Student dormitory access control
• Administrative building protection
• Research facility secured zones
• Emergency notification integration

INVESTMENT SUMMARY
Essential Package: $285,000
Professional Package: $425,000
Enterprise Package: $580,000 (Recommended)

TIMELINE
Design Phase: 3-4 weeks
Installation: 8-12 weeks
Training & Handover: 2 weeks
Total Project Duration: 13-18 weeks`
    },
    sow: {
      title: '📋 Statement of Work',
      preview: `STATEMENT OF WORK
Security System Implementation

SCOPE OF SERVICES

Design Services:
• Site security assessment
• System architecture design
• CAD drawings and layouts
• Integration specifications
• Compliance documentation

Installation Services:
• Access control system installation
• Video surveillance deployment
• Intrusion detection setup
• System integration & testing
• Staff training programs

DELIVERABLES
Phase 1 - Design: Site plans, equipment specs, installation drawings
Phase 2 - Installation: Fully operational security system with documentation
Phase 3 - Support: Training materials, warranties, maintenance plans

PROJECT TIMELINE
Week 1-4: Design & Planning
Week 5-7: Procurement & Staging
Week 8-19: Installation & Testing
Week 20-21: Training & Handover`
    },
    bom: {
      title: '💰 Bill of Materials',
      preview: `BILL OF MATERIALS
3-Tier Security System Pricing

ESSENTIAL PACKAGE - $285,000
• Basic access control (5 doors)
• 16-camera surveillance system
• Central monitoring station
• Basic intrusion detection
• 1-year warranty
Target: Small facilities, basic security needs

PROFESSIONAL PACKAGE - $425,000 ⭐ RECOMMENDED
• Advanced access control (15 doors)
• 32-camera IP surveillance
• Video analytics & facial recognition
• Perimeter intrusion detection
• Emergency notification system
• Mobile app integration
• 3-year warranty & support
Target: Medium facilities, comprehensive security

ENTERPRISE PACKAGE - $580,000
• Enterprise access control (25+ doors)
• 64-camera AI-powered system
• Advanced analytics & reporting
• Multi-layer security integration
• Command center setup
• 24/7 monitoring service
• 5-year comprehensive warranty
• Annual system upgrades
Target: Large facilities, maximum security`
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            AI-POWERED SECURITY ASSESSMENT
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Professional Security Analysis with AI Precision
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Our revolutionary AI assessment platform generates comprehensive security evaluations, professional proposals, and detailed documentation in minutes. See the power of intelligent security design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleTryDemoClick}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all"
            >
              Try Free Demo
            </button>
            <Link
              href="/contact"
              className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Document Examples */}
      <section className="py-16 bg-black/50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-black text-center mb-4">
            Professional Documentation Examples
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            See the quality and detail of documents our AI generates for every security assessment
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {Object.entries(documents).map(([key, doc]) => (
              <div
                key={key}
                className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => setShowDocument(showDocument === key ? '' : key)}
              >
                <h3 className="text-xl font-bold text-white mb-4">{doc.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {key === 'executive' && 'Comprehensive project overview with investment summary and timeline'}
                  {key === 'sow' && 'Detailed scope of work with deliverables and project phases'}
                  {key === 'bom' && 'Three-tier pricing structure with equipment specifications'}
                </p>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                  {showDocument === key ? 'Hide Preview' : 'View Preview →'}
                </button>
              </div>
            ))}
          </div>

          {/* Document Preview */}
          {showDocument && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{documents[showDocument as keyof typeof documents].title}</h3>
                <button
                  onClick={() => setShowDocument('')}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="bg-white rounded-lg p-6">
                <pre className="text-gray-800 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {documents[showDocument as keyof typeof documents].preview}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-black text-center mb-12">
            Why Choose AI-Powered Assessment?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-2">10x Faster</h3>
              <p className="text-gray-400 text-sm">Complete assessments in minutes, not days</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold text-white mb-2">95% Accuracy</h3>
              <p className="text-gray-400 text-sm">AI-driven analysis with expert validation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                📋
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional Docs</h3>
              <p className="text-gray-400 text-sm">Client-ready proposals and documentation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                ✅
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compliance Ready</h3>
              <p className="text-gray-400 text-sm">FERPA, HIPAA, FISMA compliant designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Experience AI-Powered Security Assessment?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of security professionals using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTryDemoClick}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all"
            >
              Start Free Assessment Demo
            </button>
            <Link
              href="/contact"
              className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>

      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  );
}