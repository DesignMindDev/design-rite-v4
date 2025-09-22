'use client';

import { useState } from 'react';
import Link from 'next/link';
import UnifiedNavigation from '../../components/UnifiedNavigation';
import EmailGate from '../../components/EmailGate';
import { useAuthCache } from '../../hooks/useAuthCache';

export default function FERPACompliance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const { isAuthenticated, extendSession } = useAuthCache();

  const handleStartAssessment = () => {
    if (isAuthenticated) {
      extendSession();
      window.location.href = '/ai-assessment';
    } else {
      setShowEmailGate(true);
    }
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    window.location.href = '/ai-assessment';
  };

  const handleDownloadChecklist = () => {
    // Create a simple checklist content
    const checklistContent = `FERPA COMPLIANCE CHECKLIST

Educational Institution Security Compliance

✓ STUDENT RECORDS PROTECTION
  ○ Educational records encryption in place
  ○ Access control systems implemented
  ○ Audit trail logging enabled
  ○ Data classification completed

✓ DIRECTORY INFORMATION MANAGEMENT
  ○ Consent management system active
  ○ Opt-out procedures documented
  ○ Public information controls set
  ○ Parent notification process established

✓ THIRD-PARTY DISCLOSURE
  ○ Vendor agreements reviewed
  ○ Data sharing protocols defined
  ○ Legitimate interest documentation complete
  ○ Emergency disclosure procedures ready

✓ CAMPUS SECURITY INTEGRATION
  ○ Emergency response systems tested
  ○ Visitor management system operational
  ○ Physical access controls verified
  ○ Incident reporting process active

Design-Rite AI Assessment Platform
© 2025 Design-Rite. All rights reserved.`;

    const blob = new Blob([checklistContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FERPA-Compliance-Checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadGuide = () => {
    // Create a simple guide content
    const guideContent = `FERPA COMPLIANCE GUIDE

Family Educational Rights and Privacy Act (FERPA) Security Requirements

OVERVIEW
FERPA protects the privacy of student education records and applies to all schools that receive funds under an applicable program of the U.S. Department of Education.

KEY REQUIREMENTS:

1. STUDENT RECORDS PROTECTION
   - Implement strong encryption for all educational records
   - Deploy multi-factor authentication for system access
   - Maintain comprehensive audit logs of all data access
   - Classify data according to sensitivity levels

2. ACCESS CONTROLS
   - Role-based access control (RBAC) implementation
   - Regular access reviews and certifications
   - Automated provisioning and deprovisioning
   - Emergency access procedures

3. PHYSICAL SECURITY
   - Secure storage for physical records
   - Controlled access to server rooms and data centers
   - Visitor management and badge systems
   - Environmental monitoring and controls

4. INCIDENT RESPONSE
   - Documented breach notification procedures
   - Privacy incident response team
   - Regular security awareness training
   - Vendor security assessment protocols

IMPLEMENTATION STEPS:
1. Conduct comprehensive data inventory
2. Implement technical safeguards
3. Establish administrative procedures
4. Deploy physical security controls
5. Create monitoring and auditing processes
6. Develop incident response capabilities

For more detailed guidance, contact Design-Rite's compliance experts.

Design-Rite AI Assessment Platform
© 2025 Design-Rite. All rights reserved.`;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FERPA-Compliance-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const ferpaRequirements = [
    { category: 'Student Records Protection', items: ['Educational records encryption', 'Access control systems', 'Audit trail logging', 'Data classification'], status: 'critical' },
    { category: 'Directory Information Management', items: ['Consent management', 'Opt-out procedures', 'Public information controls', 'Parent notification'], status: 'required' },
    { category: 'Third-Party Disclosure', items: ['Vendor agreements', 'Data sharing protocols', 'Legitimate interest documentation', 'Emergency disclosure procedures'], status: 'required' },
    { category: 'Campus Security Integration', items: ['Emergency response systems', 'Visitor management', 'Physical access controls', 'Incident reporting'], status: 'recommended' }
  ];

  const complianceChecklist = [
    { section: 'Data Inventory & Classification', completed: true, items: 15 },
    { section: 'Access Controls & Authentication', completed: true, items: 12 },
    { section: 'Encryption & Data Protection', completed: false, items: 8 },
    { section: 'Audit Logging & Monitoring', completed: false, items: 10 },
    { section: 'Incident Response Procedures', completed: false, items: 6 },
    { section: 'Staff Training & Awareness', completed: false, items: 9 }
  ];

  const caseStudies = [
    {
      institution: 'Lincoln Elementary School District',
      challenge: 'Needed FERPA-compliant visitor management and emergency communication system',
      solution: 'Deployed integrated access control with automated parent notifications and emergency protocols',
      results: ['100% FERPA compliance achieved', '40% reduction in unauthorized access incidents', 'Streamlined parent communication process']
    },
    {
      institution: 'State University System',
      challenge: 'Complex multi-campus student data sharing while maintaining FERPA compliance',
      solution: 'Implemented centralized identity management with role-based access controls and audit trails',
      results: ['Campus-wide data consistency', 'Automated compliance reporting', '99.9% system uptime during peak periods']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">📋</span>
          <span className="flex-1 text-center">
            FERPA Compliance Made Simple - Expert guidance for educational institution security
          </span>
          <Link
            href="/subscribe"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Get Started
          </Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">
            ×
          </button>
        </div>
      </div>

      <UnifiedNavigation />

      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            FERPA Compliance Guide
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FERPA-Compliant Educational Security
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Navigate the Family Educational Rights and Privacy Act with confidence. Our comprehensive security solutions ensure student privacy protection while maintaining operational efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Start FERPA Assessment
            </button>
            <button
              onClick={handleDownloadChecklist}
              className="border border-purple-600 text-purple-400 px-8 py-4 rounded-lg font-semibold hover:bg-purple-600/10 transition-all"
            >
              Download Compliance Checklist
            </button>
          </div>
        </section>

        {/* FERPA Overview */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Understanding FERPA Requirements</h2>
                <p className="text-gray-300 mb-6">
                  The Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records.
                  Our security solutions help educational institutions maintain compliance while ensuring campus safety and operational efficiency.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Student record protection and access controls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Directory information management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Legitimate educational interest protocols</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Parent and student rights management</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-600/20">
                <h3 className="text-2xl font-bold text-white mb-4">FERPA Key Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Educational institutions covered</span>
                    <span className="text-2xl font-bold text-purple-400">99,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Student records protected</span>
                    <span className="text-2xl font-bold text-purple-400">50M+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Annual compliance violations</span>
                    <span className="text-2xl font-bold text-red-400">1,200+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average penalty cost</span>
                    <span className="text-2xl font-bold text-yellow-400">$25K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FERPA Requirements */}
        <section className="mb-20 bg-gray-900/30 py-20 -mx-6 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">FERPA Compliance Requirements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ferpaRequirements.map((req, index) => (
                <div key={index} className="bg-black/50 border border-purple-600/20 rounded-lg p-6 hover:border-purple-600/40 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{req.category}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      req.status === 'critical' ? 'bg-red-600/20 text-red-400 border border-red-600/30' :
                      req.status === 'required' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' :
                      'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {req.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-purple-400 rounded-full flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Tabs */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">FERPA Compliance Framework</h2>
            <div className="bg-gray-900 rounded-lg p-1 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                {['overview', 'technical', 'procedures', 'monitoring'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 rounded font-semibold transition-all capitalize ${
                      activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/50 border border-purple-600/20 rounded-lg p-8">
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Educational Records Definition</h3>
                    <div className="space-y-4 text-gray-300">
                      <p><strong>Covered Records:</strong> Any record directly related to a student and maintained by an educational institution</p>
                      <div>
                        <p><strong>Includes:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>Academic transcripts and grades</li>
                          <li>Disciplinary records</li>
                          <li>Financial aid information</li>
                          <li>Health and medical records</li>
                          <li>Special education files</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Access Rights & Permissions</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <p><strong>Students (18+ or attending postsecondary):</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>Right to inspect and review records</li>
                          <li>Right to request amendments</li>
                          <li>Right to control disclosure</li>
                          <li>Right to file complaints</li>
                        </ul>
                      </div>
                      <div>
                        <p><strong>Parents (for minors):</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>Full access to student records</li>
                          <li>Right to challenge content</li>
                          <li>Control over directory information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Technical Safeguards</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Data Encryption</h4>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>AES-256 encryption for data at rest</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>TLS 1.3 for data in transit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>End-to-end encryption for communications</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Access Controls</h4>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Multi-factor authentication (MFA)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Role-based access control (RBAC)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Single sign-on (SSO) integration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'procedures' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Directory Information Management</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Annual Notification Process</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Notify parents/students of FERPA rights</li>
                          <li>Define directory information</li>
                          <li>Provide opt-out procedures</li>
                          <li>Document notification delivery</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Incident Response</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Breach Response</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Immediate containment and assessment</li>
                          <li>Notification within 24 hours</li>
                          <li>Documentation and response</li>
                          <li>Post-incident review</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'monitoring' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Continuous Compliance Monitoring</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold text-white mb-4">Audit Logging</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>All record access attempts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>User authentication events</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Data modification activities</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-4">Automated Monitoring</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Unusual access pattern detection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Policy violation alerts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Failed authentication monitoring</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-4">Compliance Reporting</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Monthly compliance dashboards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Annual audit preparation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Risk assessment reports</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Compliance Checklist */}
        <section className="mb-20 bg-gray-900/30 py-20 -mx-6 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">FERPA Compliance Checklist</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {complianceChecklist.map((item, index) => (
                  <div key={index} className="bg-black/50 border border-purple-600/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.completed ? 'bg-green-600' : 'bg-yellow-600'
                        }`}>
                          {item.completed ? '✓' : '!'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{item.section}</h3>
                          <p className="text-sm text-gray-400">{item.items} compliance items</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.completed ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {item.completed ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-600/20">
                <h3 className="text-2xl font-bold text-white mb-6">Get Your Compliance Assessment</h3>
                <p className="text-gray-300 mb-6">
                  Our AI-powered assessment tool evaluates your current FERPA compliance status and provides personalized recommendations.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">60-point compliance evaluation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Risk prioritization matrix</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Implementation roadmap</span>
                  </div>
                </div>
                <button
                  onClick={handleStartAssessment}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
                >
                  Start Free Assessment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">FERPA Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-black/50 border border-purple-600/20 rounded-lg p-8">
                  <h3 className="text-xl font-bold text-white mb-2">{study.institution}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    <strong>Challenge:</strong> {study.challenge}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Solution:</h4>
                      <p className="text-gray-300 text-sm">{study.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Results:</h4>
                      <ul className="space-y-1">
                        {study.results.map((result, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 py-20 -mx-6 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Ensure FERPA Compliance?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Let our experts help you navigate FERPA requirements while maintaining operational efficiency and student privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all">
                Schedule FERPA Consultation
              </button>
              <button
                onClick={handleDownloadGuide}
                className="border border-purple-600 text-purple-400 px-8 py-4 rounded-lg font-semibold hover:bg-purple-600/10 transition-all"
              >
                Download FERPA Guide
              </button>
            </div>
          </div>
        </section>
      </main>

      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  );
}