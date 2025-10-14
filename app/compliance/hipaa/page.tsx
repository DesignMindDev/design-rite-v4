'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UnifiedNavigation from '../../components/UnifiedNavigation';
import { useAuthCache } from '../../hooks/useAuthCache';

export default function HIPAACompliance() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { isAuthenticated, extendSession } = useAuthCache();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
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
            <button
              onClick={() => {
                if (isAuthenticated) {
                  extendSession();
                  router.push('/ai-assessment');
                } else {
                  // Redirect to portal for authentication
                  window.location.href = process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3001/auth'
                    : 'https://portal.design-rite.com/auth';
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              Start HIPAA Assessment
            </button>
            <button
              onClick={() => {
                const securityGuideContent = `HIPAA SECURITY GUIDE
=====================

Comprehensive Physical Security Controls for Healthcare Facilities

1. FACILITY ACCESS CONTROLS (§164.310(a)(1))
   - Implement badge-based access control systems
   - Establish visitor management procedures
   - Create secure areas for PHI storage
   - Install security cameras in appropriate areas
   - Maintain access logs for audit purposes

2. WORKSTATION SECURITY (§164.310(b))
   - Configure workstations for specific functions
   - Implement automatic screen locks
   - Position monitors away from public view
   - Use privacy screens where necessary
   - Establish clean desk policies

3. DEVICE AND MEDIA CONTROLS (§164.310(d))
   - Track all devices containing PHI
   - Implement secure disposal procedures
   - Use encryption for portable devices
   - Control media reuse and disposal
   - Document hardware movements

4. ADMINISTRATIVE SAFEGUARDS
   - Designate HIPAA Security Officer
   - Conduct workforce training programs
   - Implement information access management
   - Establish security incident procedures
   - Create contingency plans

5. TECHNICAL SAFEGUARDS
   - Implement unique user identification
   - Set up automatic logoff procedures
   - Deploy audit controls and monitoring
   - Ensure data integrity controls
   - Use transmission security measures

6. RISK ASSESSMENT PROCEDURES
   - Identify potential threats and vulnerabilities
   - Assess likelihood and impact of threats
   - Document existing security measures
   - Determine risk levels and priorities
   - Develop mitigation strategies

7. BUSINESS ASSOCIATE AGREEMENTS
   - Identify all business associates
   - Execute proper BAA contracts
   - Monitor vendor compliance
   - Conduct periodic reviews
   - Document relationships

8. BREACH NOTIFICATION REQUIREMENTS
   - Establish breach identification procedures
   - Implement 60-day notification timeline
   - Create patient notification templates
   - Document breach assessment processes
   - Maintain breach logs

9. EMPLOYEE TRAINING MODULES
   - HIPAA privacy fundamentals
   - Physical security procedures
   - Workstation security practices
   - Incident reporting procedures
   - Password and access management

10. COMPLIANCE MONITORING
    - Regular security assessments
    - Policy and procedure reviews
    - Audit log monitoring
    - Vulnerability scanning
    - Penetration testing

For detailed implementation guidance, consult with qualified HIPAA compliance experts.

© 2025 Design-Rite Security Solutions. All rights reserved.`;

                const blob = new Blob([securityGuideContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'HIPAA-Security-Guide.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600/10 transition-all"
            >
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
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    extendSession();
                    router.push('/contact');
                  } else {
                    // Redirect to portal for authentication
                    window.location.href = process.env.NODE_ENV === 'development'
                      ? 'http://localhost:3001/auth'
                      : 'https://portal.design-rite.com/auth';
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all"
              >
                Schedule HIPAA Consultation
              </button>
              <button
                onClick={() => {
                  const implementationGuideContent = `HIPAA IMPLEMENTATION GUIDE
==========================

Step-by-Step Implementation Plan for Healthcare Organizations

PHASE 1: FOUNDATION (Weeks 1-4)

1. LEADERSHIP COMMITMENT
   - Executive sponsorship and support
   - Budget allocation for HIPAA compliance
   - Appointment of HIPAA Security Officer
   - Formation of compliance team

2. INITIAL RISK ASSESSMENT
   - Inventory all systems handling PHI
   - Identify current security measures
   - Document gaps and vulnerabilities
   - Prioritize remediation efforts

3. POLICY DEVELOPMENT
   - Create HIPAA privacy policies
   - Develop security procedures
   - Establish incident response plans
   - Draft employee handbooks

PHASE 2: TECHNICAL IMPLEMENTATION (Weeks 5-12)

4. ACCESS CONTROLS
   - Implement unique user IDs
   - Deploy role-based access
   - Set up automatic logoff
   - Configure password policies

5. AUDIT SYSTEMS
   - Deploy logging mechanisms
   - Set up monitoring tools
   - Create audit procedures
   - Establish review schedules

6. ENCRYPTION AND TRANSMISSION
   - Encrypt data at rest
   - Secure data in transit
   - Implement VPN solutions
   - Deploy secure email systems

7. PHYSICAL SECURITY
   - Install access control systems
   - Deploy surveillance cameras
   - Secure workstation areas
   - Implement device tracking

PHASE 3: ADMINISTRATIVE CONTROLS (Weeks 13-16)

8. WORKFORCE TRAINING
   - Conduct HIPAA awareness sessions
   - Provide role-specific training
   - Create training documentation
   - Implement testing procedures

9. BUSINESS ASSOCIATE MANAGEMENT
   - Identify all business associates
   - Execute BAA agreements
   - Monitor vendor compliance
   - Establish review procedures

10. INCIDENT RESPONSE
    - Create incident response team
    - Develop escalation procedures
    - Establish notification processes
    - Create documentation templates

PHASE 4: ONGOING COMPLIANCE (Weeks 17+)

11. CONTINUOUS MONITORING
    - Regular risk assessments
    - Periodic security audits
    - Policy reviews and updates
    - Training refreshers

12. DOCUMENTATION AND REPORTING
    - Maintain compliance records
    - Generate audit reports
    - Track remediation efforts
    - Document lessons learned

13. BREACH PREPAREDNESS
    - Regular breach response drills
    - Update notification procedures
    - Review insurance coverage
    - Maintain legal relationships

KEY MILESTONES:
- Week 4: Complete initial assessment
- Week 8: Deploy technical controls
- Week 12: Complete physical security
- Week 16: Finish training programs
- Week 20: Achieve full compliance

SUCCESS METRICS:
- Zero security incidents
- 100% staff training completion
- Successful audit outcomes
- Reduced compliance costs
- Improved patient trust

For customized implementation support, contact our HIPAA compliance experts.

© 2025 Design-Rite Security Solutions. All rights reserved.`;

                const blob = new Blob([implementationGuideContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'HIPAA-Implementation-Guide.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border border-blue-600 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600/10 transition-all"
            >
              Download Implementation Guide
            </button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}