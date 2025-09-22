'use client';

import { useState } from 'react';
import Link from 'next/link';
import UnifiedNavigation from '../../components/UnifiedNavigation';

export default function GeneralSecurityCompliance() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🔒</span>
          <span className="flex-1 text-center">
            Enterprise Security Compliance - NIST, SOC 2, ISO 27001 expertise
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
          <div className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Security Compliance Guide
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Enterprise Security Compliance Framework
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Navigate complex security compliance requirements with confidence. Our comprehensive solutions help organizations achieve and maintain compliance with industry-leading security standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105">
              Start Security Assessment
            </button>
            <button className="border border-green-600 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-600/10 transition-all">
              Download Framework Guide
            </button>
          </div>
        </section>

        {/* Security Frameworks Overview */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Security Compliance Frameworks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/50 border border-green-600/20 rounded-lg p-6 hover:border-green-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">NIST Cybersecurity Framework</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                    critical
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">Federal Standard</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Critical Infrastructure
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Federal Agencies
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Financial Services
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-green-600/20 rounded-lg p-6 hover:border-green-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">SOC 2 Type II</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                    critical
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">Service Organization</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Cloud Providers
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    SaaS Platforms
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Technology Services
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-green-600/20 rounded-lg p-6 hover:border-green-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">ISO 27001</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">
                    required
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">International Standard</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Global Organizations
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Information Security
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Risk Management
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-green-600/20 rounded-lg p-6 hover:border-green-600/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">PCI DSS</h3>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400 border border-red-600/30">
                    critical
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">Payment Card Industry</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Payment Processing
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    E-commerce
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                    Financial Transactions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Tabs */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Security Compliance Deep Dive</h2>
            <div className="bg-gray-900 rounded-lg p-1 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                {['overview', 'nist', 'soc2', 'iso27001'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 rounded font-semibold transition-all capitalize ${
                      activeTab === tab ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'nist' ? 'NIST CSF' : tab === 'soc2' ? 'SOC 2' : tab === 'iso27001' ? 'ISO 27001' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/50 border border-green-600/20 rounded-lg p-8">
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Security Compliance Fundamentals</h3>
                    <div className="space-y-4 text-gray-300">
                      <p><strong>Purpose:</strong> Security compliance frameworks provide structured approaches to protecting organizational assets, data, and operations from cyber threats.</p>
                      <div>
                        <p><strong>Core Principles:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li><strong>Confidentiality:</strong> Protecting sensitive information from unauthorized access</li>
                          <li><strong>Integrity:</strong> Ensuring data accuracy and preventing unauthorized modifications</li>
                          <li><strong>Availability:</strong> Maintaining system uptime and service accessibility</li>
                          <li><strong>Accountability:</strong> Tracking and auditing all system activities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Choosing the Right Framework</h3>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <p><strong>Industry-Specific Requirements:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li><strong>Healthcare:</strong> HIPAA, HITECH, FDA 21 CFR Part 11</li>
                          <li><strong>Financial:</strong> SOX, PCI DSS, GLBA, FFIEC guidance</li>
                          <li><strong>Government:</strong> FedRAMP, FISMA, NIST 800-171, CMMC</li>
                          <li><strong>Technology:</strong> SOC 2, ISO 27001, Cloud Security Alliance</li>
                        </ul>
                      </div>
                      <div>
                        <p><strong>Implementation Benefits:</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4 mt-2">
                          <li>Reduced cybersecurity risk and incident frequency</li>
                          <li>Enhanced customer trust and competitive advantage</li>
                          <li>Lower insurance premiums and better coverage</li>
                          <li>Regulatory compliance and penalty avoidance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'nist' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">NIST Cybersecurity Framework (CSF)</h3>
                  <p className="text-gray-400 mb-6">Voluntary framework developed by the National Institute of Standards and Technology to help organizations manage cybersecurity risk</p>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Identify (ID)</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Asset Management (ID.AM)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Business Environment (ID.BE)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Governance (ID.GV)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Risk Assessment (ID.RA)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Protect (PR)</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Identity Management & Access Control</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Awareness and Training</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Data Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Protective Technology</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Detect, Respond, Recover</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div>
                          <p className="font-semibold text-white mb-2">Detect (DE):</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Anomalies and Events</li>
                            <li>• Continuous Monitoring</li>
                            <li>• Detection Processes</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-2">Respond (RS):</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Response Planning</li>
                            <li>• Communications</li>
                            <li>• Analysis & Mitigation</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-white mb-2">Recover (RC):</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Recovery Planning</li>
                            <li>• Improvements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'soc2' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">SOC 2 (Service Organization Control 2)</h3>
                  <p className="text-gray-400 mb-6">Auditing standard for service organizations that store customer data in the cloud, focusing on security, availability, processing integrity, confidentiality, and privacy</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Trust Service Criteria</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <h5 className="font-semibold text-white mb-2">Security (Required)</h5>
                          <p className="text-gray-300 text-sm mb-2">Protection against unauthorized access, use, or modification of information</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>• Access controls and user authentication</li>
                            <li>• System monitoring and intrusion detection</li>
                            <li>• Change management processes</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <h5 className="font-semibold text-white mb-2">Availability (Optional)</h5>
                          <p className="text-gray-300 text-sm mb-2">System accessibility for operation, use, or maintenance as committed</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>• System capacity and performance monitoring</li>
                            <li>• Backup and disaster recovery procedures</li>
                            <li>• Network and system redundancy</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/50 rounded-lg">
                          <h5 className="font-semibold text-white mb-2">Processing Integrity (Optional)</h5>
                          <p className="text-gray-300 text-sm mb-2">System processing is complete, valid, accurate, timely, and authorized</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>• Data input validation and authorization</li>
                            <li>• Processing completeness and accuracy controls</li>
                            <li>• Error identification and correction procedures</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-blue-800/20 rounded-lg border border-blue-600/30">
                          <h5 className="font-semibold text-white mb-2">SOC 2 Types</h5>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold text-blue-400">Type I:</span>
                              <span className="text-gray-300 ml-2">Design and implementation of controls at a specific point in time</span>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-400">Type II:</span>
                              <span className="text-gray-300 ml-2">Operating effectiveness of controls over a period of time (6-12 months)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'iso27001' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">ISO 27001 Information Security Management</h3>
                  <p className="text-gray-400 mb-6">International standard for information security management systems (ISMS), providing a systematic approach to managing sensitive company information</p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">ISMS Requirements (Clauses 4-10)</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Context of Organization:</strong> Understanding organizational context and stakeholder needs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Leadership:</strong> Top management commitment and information security policy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Planning:</strong> Risk assessment, treatment, and information security objectives</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Support:</strong> Resources, competence, awareness, communication</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Operation:</strong> Risk treatment implementation and operation of controls</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Performance Evaluation:</strong> Monitoring, measurement, analysis, and internal audit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span><strong>Improvement:</strong> Nonconformity, corrective action, and continual improvement</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Annex A Control Categories</h4>
                      <div className="space-y-3 text-gray-300 text-sm">
                        <div className="p-3 bg-gray-800/50 rounded">
                          <div className="font-semibold text-white">A.5 Information Security Policies (2 controls)</div>
                          <div className="text-xs text-gray-400">Management direction and support for information security</div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded">
                          <div className="font-semibold text-white">A.6 Organization of Information Security (7 controls)</div>
                          <div className="text-xs text-gray-400">Internal organization and mobile devices/teleworking</div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded">
                          <div className="font-semibold text-white">A.7 Human Resource Security (6 controls)</div>
                          <div className="text-xs text-gray-400">Prior to, during, and termination of employment</div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded">
                          <div className="font-semibold text-white">A.8 Asset Management (10 controls)</div>
                          <div className="text-xs text-gray-400">Asset inventory, information classification, and media handling</div>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded">
                          <div className="font-semibold text-white">A.9 Access Control (14 controls)</div>
                          <div className="text-xs text-gray-400">User access management and system access control</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Industry-Specific Compliance */}
        <section className="mb-20 bg-gray-900/30 py-20 -mx-6 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Industry-Specific Compliance Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/50 border border-green-600/20 rounded-lg p-8">
                <h3 className="text-xl font-bold text-white mb-2">Financial Services</h3>
                <p className="text-red-400 font-semibold text-sm mb-4">
                  Penalties: Up to $100M+ per violation
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Regulations:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">SOX</span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">GLBA</span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">PCI DSS</span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">FFIEC</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Requirements:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Data encryption
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Audit trails
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Access controls
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Business continuity
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-black/50 border border-green-600/20 rounded-lg p-8">
                <h3 className="text-xl font-bold text-white mb-2">Government & Defense</h3>
                <p className="text-red-400 font-semibold text-sm mb-4">
                  Penalties: Contract termination + legal action
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Regulations:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">FedRAMP</span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">FISMA</span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">NIST 800-171</span>
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs rounded">CMMC</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Requirements:</h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Multi-factor authentication
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Continuous monitoring
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Supply chain security
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0"></div>
                        Incident reporting
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-900/30 to-blue-900/30 py-20 -mx-6 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Strengthen Your Security Posture?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Our security experts help organizations navigate complex compliance requirements and implement robust security frameworks tailored to your industry and risk profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all">
                Schedule Security Consultation
              </button>
              <button className="border border-green-600 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-600/10 transition-all">
                Download Compliance Matrix
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}