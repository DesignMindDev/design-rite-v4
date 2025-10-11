'use client';

import { useState } from 'react';
import Link from 'next/link';
import UnifiedNavigation from '../../components/UnifiedNavigation';
import EmailGate from '../../components/EmailGate';
import Footer from '../../components/Footer';
import { useAuthCache } from '../../hooks/useAuthCache';

export default function GeneralSecurityCompliance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmailGate, setShowEmailGate] = useState(false);
  const { isAuthenticated, extendSession } = useAuthCache();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
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
            <button
              onClick={() => {
                if (isAuthenticated) {
                  extendSession();
                  window.location.href = '/ai-discovery';
                } else {
                  setShowEmailGate(true);
                }
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Start Security Assessment
            </button>
            <button
              onClick={() => {
                const frameworkGuideContent = `ENTERPRISE SECURITY COMPLIANCE FRAMEWORK GUIDE
=====================================================

Comprehensive Security Framework Implementation Guide

1. FRAMEWORK SELECTION AND ASSESSMENT

   NIST CYBERSECURITY FRAMEWORK (CSF)
   - Best for: Critical infrastructure, federal agencies, financial services
   - Implementation Timeline: 12-18 months
   - Key Components: Identify, Protect, Detect, Respond, Recover
   - Cost Range: $500K - $2M+ (enterprise scale)

   SOC 2 TYPE II
   - Best for: Cloud providers, SaaS platforms, technology services
   - Implementation Timeline: 6-12 months
   - Key Components: Security, Availability, Processing Integrity, Confidentiality, Privacy
   - Cost Range: $150K - $500K annually

   ISO 27001
   - Best for: Global organizations, information security focus
   - Implementation Timeline: 12-24 months
   - Key Components: 114 security controls across 14 domains
   - Cost Range: $200K - $800K (including certification)

   PCI DSS
   - Best for: Payment processing, e-commerce, financial transactions
   - Implementation Timeline: 6-9 months
   - Key Components: 12 requirements across 6 control objectives
   - Cost Range: $100K - $400K

2. IMPLEMENTATION PHASES

   PHASE 1: FOUNDATION (Months 1-3)
   - Executive leadership commitment and budget approval
   - Appointment of Chief Information Security Officer (CISO)
   - Formation of cross-functional security team
   - Initial risk assessment and gap analysis
   - Policy framework development

   PHASE 2: TECHNICAL CONTROLS (Months 4-8)
   - Identity and access management implementation
   - Network security architecture deployment
   - Endpoint protection and monitoring
   - Data encryption at rest and in transit
   - Security information and event management (SIEM)

   PHASE 3: OPERATIONAL CONTROLS (Months 9-12)
   - Security awareness training programs
   - Incident response procedures
   - Business continuity and disaster recovery
   - Vendor management and third-party assessments
   - Continuous monitoring and audit programs

   PHASE 4: MATURITY AND OPTIMIZATION (Months 13+)
   - Advanced threat hunting capabilities
   - Zero-trust architecture implementation
   - Automation and orchestration tools
   - Threat intelligence integration
   - Continuous improvement processes

3. CRITICAL SUCCESS FACTORS

   ORGANIZATIONAL ALIGNMENT
   - C-suite sponsorship and support
   - Clear roles and responsibilities
   - Adequate budget and resource allocation
   - Change management processes

   TECHNICAL EXCELLENCE
   - Architecture security by design
   - Regular vulnerability assessments
   - Penetration testing programs
   - Security code reviews

   OPERATIONAL DISCIPLINE
   - Regular policy reviews and updates
   - Consistent training and awareness
   - Metrics and performance monitoring
   - Third-party risk management

4. COMPLIANCE METRICS AND KPIs

   SECURITY METRICS
   - Mean time to detect (MTTD): < 24 hours
   - Mean time to respond (MTTR): < 4 hours
   - Vulnerability remediation time: < 30 days (high risk)
   - Security awareness training completion: 100%

   BUSINESS METRICS
   - Audit findings reduction: 50% year-over-year
   - Insurance premium reductions: 15-25%
   - Customer trust scores improvement
   - Regulatory penalty avoidance

5. COMMON PITFALLS AND MITIGATION

   IMPLEMENTATION CHALLENGES
   - Scope creep and timeline delays
   - Insufficient change management
   - Inadequate testing and validation
   - Poor documentation and training

   MITIGATION STRATEGIES
   - Phased implementation approach
   - Regular stakeholder communication
   - Comprehensive testing protocols
   - Detailed documentation standards

6. COST-BENEFIT ANALYSIS

   IMPLEMENTATION COSTS
   - Technology and infrastructure: 40-50%
   - Consulting and professional services: 25-35%
   - Internal resources and training: 15-25%
   - Ongoing maintenance and support: 10-15%

   EXPECTED BENEFITS
   - Risk reduction: 60-80% decrease in security incidents
   - Compliance efficiency: 50% reduction in audit time
   - Operational efficiency: 30% improvement in incident response
   - Business value: Enhanced customer trust and market differentiation

7. INDUSTRY-SPECIFIC CONSIDERATIONS

   HEALTHCARE: HIPAA, HITECH, FDA 21 CFR Part 11
   FINANCIAL: SOX, GLBA, PCI DSS, FFIEC
   GOVERNMENT: FedRAMP, FISMA, NIST 800-171, CMMC
   TECHNOLOGY: SOC 2, Cloud Security Alliance, ISO 27001

For detailed implementation support and customized roadmaps, consult with qualified security compliance experts.

© 2025 Design-Rite Security Solutions. All rights reserved.`;

                const blob = new Blob([frameworkGuideContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Security-Framework-Guide.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border border-green-600 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-600/10 transition-all"
            >
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
              <Link
                href="/contact"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all inline-block text-center"
              >
                Schedule Security Consultation
              </Link>
              <button
                onClick={() => {
                  const complianceMatrixContent = `SECURITY COMPLIANCE MATRIX
===========================

Comprehensive Framework Comparison and Requirements Mapping

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                FRAMEWORK COMPARISON MATRIX                                 │
├─────────────────┬─────────────┬─────────────┬─────────────┬─────────────┬───────────────┤
│ CONTROL AREA    │ NIST CSF    │ SOC 2       │ ISO 27001   │ PCI DSS     │ HIPAA         │
├─────────────────┼─────────────┼─────────────┼─────────────┼─────────────┼───────────────┤
│ ACCESS CONTROL  │ PR.AC       │ CC6         │ A.9         │ Req 7,8     │ §164.312(a)   │
│ ASSET MGMT      │ ID.AM       │ CC1         │ A.8         │ Req 2       │ §164.310(d)   │
│ ENCRYPTION      │ PR.DS       │ CC6         │ A.10        │ Req 3,4     │ §164.312(a)   │
│ INCIDENT RSP    │ RS          │ CC7         │ A.16        │ Req 12      │ §164.308(a)   │
│ MONITORING      │ DE          │ CC7         │ A.12        │ Req 10      │ §164.312(b)   │
│ RISK ASSESS     │ ID.RA       │ CC3         │ A.12        │ Req 12      │ §164.308(a)   │
│ TRAINING        │ PR.AT       │ CC2         │ A.7         │ Req 12      │ §164.308(a)   │
│ VENDOR MGMT     │ ID.SC       │ CC9         │ A.15        │ Req 12      │ §164.314(a)   │
└─────────────────┴─────────────┴─────────────┴─────────────┴─────────────┴───────────────┘

INDUSTRY-SPECIFIC REQUIREMENTS MATRIX
=====================================

FINANCIAL SERVICES
------------------
Primary Frameworks: SOX, GLBA, PCI DSS, FFIEC
Key Requirements:
✓ Data Encryption (AES-256)
✓ Multi-Factor Authentication
✓ Audit Trail Retention (7 years)
✓ Incident Response (4 hours max)
✓ Business Continuity (RPO: 1 hour, RTO: 4 hours)
✓ Third-Party Risk Assessment
✓ Regular Penetration Testing
✓ Employee Background Checks

HEALTHCARE
----------
Primary Frameworks: HIPAA, HITECH, FDA 21 CFR Part 11
Key Requirements:
✓ PHI Encryption at Rest and Transit
✓ Access Controls (Role-Based)
✓ Audit Logging (All PHI Access)
✓ Breach Notification (60 days)
✓ Employee Training (Annual)
✓ Business Associate Agreements
✓ Risk Assessment (Annual)
✓ Contingency Planning

GOVERNMENT/DEFENSE
------------------
Primary Frameworks: FedRAMP, FISMA, NIST 800-171, CMMC
Key Requirements:
✓ FIPS 140-2 Level 3 Encryption
✓ Continuous Monitoring
✓ Supply Chain Security
✓ Incident Reporting (CISA)
✓ Multi-Factor Authentication
✓ Network Segmentation
✓ Security Control Inheritance
✓ Authority to Operate (ATO)

TECHNOLOGY/SAAS
---------------
Primary Frameworks: SOC 2, ISO 27001, Cloud Security Alliance
Key Requirements:
✓ Security Controls Testing
✓ Availability Monitoring (99.9%+)
✓ Data Processing Integrity
✓ Customer Data Segregation
✓ Change Management
✓ Vulnerability Management
✓ Security Awareness Training
✓ Third-Party Assessments

COMPLIANCE IMPLEMENTATION ROADMAP
==================================

WEEKS 1-4: ASSESSMENT PHASE
- Conduct compliance gap analysis
- Identify applicable frameworks
- Document current state architecture
- Estimate implementation costs
- Develop project timeline
- Secure executive sponsorship

WEEKS 5-12: FOUNDATION PHASE
- Establish governance structure
- Develop policies and procedures
- Implement identity management
- Deploy monitoring tools
- Conduct baseline risk assessment
- Begin employee training program

WEEKS 13-24: IMPLEMENTATION PHASE
- Deploy technical controls
- Implement security processes
- Conduct security testing
- Execute training programs
- Perform vendor assessments
- Document compliance evidence

WEEKS 25-36: OPTIMIZATION PHASE
- Conduct internal audits
- Refine security processes
- Optimize monitoring and alerting
- Enhance incident response
- Prepare for external audit
- Continuous improvement

WEEKS 37+: MAINTENANCE PHASE
- Regular compliance assessments
- Ongoing security monitoring
- Annual policy reviews
- Continuous training updates
- Vendor compliance monitoring
- Framework updates and changes

COST ESTIMATION GUIDELINES
==========================

SMALL ORGANIZATION (< 100 employees)
- Initial Implementation: $100K - $300K
- Annual Maintenance: $50K - $100K
- Audit Costs: $25K - $50K annually

MEDIUM ORGANIZATION (100-1000 employees)
- Initial Implementation: $300K - $800K
- Annual Maintenance: $100K - $250K
- Audit Costs: $50K - $125K annually

LARGE ORGANIZATION (1000+ employees)
- Initial Implementation: $800K - $2M+
- Annual Maintenance: $250K - $500K+
- Audit Costs: $125K - $300K+ annually

ROI ANALYSIS
============

BENEFITS:
- Risk Reduction: 60-80% decrease in security incidents
- Insurance Savings: 15-25% premium reduction
- Audit Efficiency: 50% reduction in audit preparation time
- Customer Trust: Improved retention and acquisition
- Competitive Advantage: Differentiation in marketplace

COST AVOIDANCE:
- Regulatory Penalties: $1M - $100M+ per incident
- Data Breach Costs: $4.45M average (2023 IBM study)
- Business Disruption: 23 days average downtime
- Legal and Forensic Costs: $500K - $5M+ per incident
- Reputation Damage: 25% customer loss average

For customized compliance matrices and implementation roadmaps, contact our security experts.

© 2025 Design-Rite Security Solutions. All rights reserved.`;

                const blob = new Blob([complianceMatrixContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Security-Compliance-Matrix.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border border-green-600 text-green-400 px-8 py-4 rounded-lg font-semibold hover:bg-green-600/10 transition-all"
            >
              Download Compliance Matrix
            </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Email Gate Modal */}
      {showEmailGate && (
        <EmailGate
          onClose={() => setShowEmailGate(false)}
          onSuccess={() => {
            setShowEmailGate(false);
            // The useAuthCache hook will handle the authentication state
          }}
        />
      )}
    </div>
  );
}