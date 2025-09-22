'use client';

import { useState } from 'react';
import Link from 'next/link';
import UnifiedNavigation from '../../components/UnifiedNavigation';

export default function HIPAACompliance() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🏥</span>
          <span className="flex-1 text-center">
            HIPAA Compliance Made Simple - Expert guidance for healthcare security
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            HIPAA Compliance Guide
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            HIPAA-Compliant Healthcare Security
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Protect patient health information with comprehensive HIPAA compliance solutions. Secure your healthcare facility while maintaining operational excellence and patient trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105">
              Start HIPAA Assessment
            </button>
            <button className="border border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600/10 transition-all">
              Download Security Guide
            </button>
          </div>
        </section>

        {/* HIPAA Overview */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Understanding HIPAA Requirements</h2>
                <p className="text-gray-300 mb-6">
                  The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for protecting patient health information.
                  Our comprehensive security solutions ensure your healthcare facility maintains compliance while delivering exceptional patient care.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Physical safeguards for facilities and equipment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Technical safeguards for electronic PHI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Administrative safeguards and policies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Patient rights and privacy protection</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-600/20">
                <h3 className="text-2xl font-bold text-white mb-4">HIPAA Impact Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Healthcare Data Breaches (2023)</span>
                    <span className="text-2xl font-bold text-yellow-400">809</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Records Exposed</span>
                    <span className="text-2xl font-bold text-blue-400">70K+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Penalty Cost</span>
                    <span className="text-2xl font-bold text-red-400">$3.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Compliance Deadline</span>
                    <span className="text-2xl font-bold text-blue-400">60 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HIPAA Requirements */}
        <section className="mb-20 bg-gray-900/30 py-20 -mx-6 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">HIPAA Security Requirements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/50 border border-blue-600/20 rounded-lg p-6 hover:border-blue-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Physical Safeguards</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                    critical
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Facility access controls
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Workstation security
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Device controls
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Media controls
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-blue-600/20 rounded-lg p-6 hover:border-blue-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Administrative Safeguards</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                    critical
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Security officer designation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Workforce training
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Information access management
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Security awareness
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-blue-600/20 rounded-lg p-6 hover:border-blue-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Technical Safeguards</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                    critical
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Access control
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Audit controls
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Integrity controls
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Transmission security
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-blue-600/20 rounded-lg p-6 hover:border-blue-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">
                    required
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Security vulnerabilities
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Threat analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Impact assessment
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                    Mitigation strategies
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Tabs */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">HIPAA Security Framework</h2>
            <div className="bg-gray-900 rounded-lg p-1 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                {['overview', 'physical', 'technical', 'administrative'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 rounded font-semibold transition-all capitalize ${
                      activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/50 border border-blue-600/20 rounded-lg p-8">
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Protected Health Information (PHI)</h3>
                    <div className="space-y-4 text-gray-300">
                      <p><strong>Definition:</strong> Any individually identifiable health information transmitted or maintained by covered entities</p>
                      <div>
                        <p><strong>Includes:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>Medical records and patient charts</li>
                          <li>Billing and payment information</li>
                          <li>Insurance claims and coverage details</li>
                          <li>Laboratory results and test reports</li>
                          <li>Prescription and medication data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Covered Entities & Business Associates</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <p><strong>Covered Entities:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>Healthcare providers (hospitals, clinics, doctors)</li>
                          <li>Health plans (insurance companies, HMOs)</li>
                          <li>Healthcare clearinghouses</li>
                          <li>Medicare/Medicaid programs</li>
                        </ul>
                      </div>
                      <div>
                        <p><strong>Business Associates:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>IT service providers and cloud vendors</li>
                          <li>Medical transcription services</li>
                          <li>Billing and collection agencies</li>
                          <li>Legal and accounting firms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'physical' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Physical Safeguards (§164.310)</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Facility Access Controls</h4>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Restricted access to facilities and equipment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Visitor access controls and escorts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Access authorization procedures</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Workstation Use & Device Controls</h4>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Function-specific workstation policies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Hardware inventory and tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Secure disposal of confidential information</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Technical Safeguards (§164.312)</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Access Control</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Unique user identification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Automatic logoff procedures</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Role-based access controls</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Audit Controls</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Activity logging and monitoring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Regular audit log reviews</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Anomaly detection systems</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Transmission Security</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>End-to-end encryption protocols</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Secure email and messaging</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Network segmentation and firewalls</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'administrative' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Required Administrative Safeguards</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Security Officer (§164.308(a)(2))</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Designated security officer responsible for HIPAA compliance</li>
                          <li>Authority to implement and maintain security policies</li>
                          <li>Regular security risk assessments and updates</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Workforce Training (§164.308(a)(5))</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Initial and ongoing HIPAA awareness training</li>
                          <li>Role-specific security procedures training</li>
                          <li>Annual training completion documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Policies and Procedures</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Contingency Plan (§164.308(a)(7))</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Data backup and disaster recovery procedures</li>
                          <li>Emergency mode operation plans</li>
                          <li>Business continuity planning</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Security Incident Procedures</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Incident identification and reporting</li>
                          <li>Breach assessment and notification procedures</li>
                          <li>Post-incident analysis and improvements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-20 -mx-6 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Achieve Complete HIPAA Compliance</h2>
            <p className="text-xl text-gray-300 mb-8">
              Protect patient information, avoid costly penalties, and maintain trust with comprehensive HIPAA compliance solutions designed for healthcare environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all">
                Schedule HIPAA Consultation
              </button>
              <button className="border border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600/10 transition-all">
                Download Implementation Guide
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}