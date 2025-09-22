'use client';

import React from 'react';
import { ArrowLeft, FileText, Shield, Lock, Users, Building, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

const NDAPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/ai-assessment" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Assessment</span>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <h1 className="text-xl font-bold">Non-Disclosure Agreement</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-300 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Confidentiality & Data Protection</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Design-Rite takes your privacy and confidential information seriously. This Non-Disclosure Agreement
                  ensures that any sensitive project details, security requirements, or proprietary information you share
                  during our assessment process remains strictly confidential.
                </p>
              </div>
            </div>
          </div>

          {/* Key Protection Areas */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Facility Information</h3>
              </div>
              <p className="text-white/70 text-sm">
                Building layouts, access points, current security systems, vulnerabilities, and operational procedures.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Security Details</h3>
              </div>
              <p className="text-white/70 text-sm">
                Existing security protocols, threat assessments, incident history, and protection requirements.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Organizational Data</h3>
              </div>
              <p className="text-white/70 text-sm">
                Staff information, organizational structure, operational schedules, and business processes.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Compliance Requirements</h3>
              </div>
              <p className="text-white/70 text-sm">
                HIPAA, FERPA, FISMA, or other regulatory compliance needs and sensitive data handling requirements.
              </p>
            </div>
          </div>

          {/* NDA Terms */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Agreement Terms
            </h2>

            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="font-semibold text-white mb-2">1. Confidential Information</h3>
                <p className="text-sm leading-relaxed">
                  All information disclosed during the assessment process, including but not limited to facility layouts,
                  security systems, vulnerabilities, operational procedures, compliance requirements, and any other
                  proprietary or sensitive information related to your organization's security needs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">2. Non-Disclosure Obligation</h3>
                <p className="text-sm leading-relaxed">
                  Design-Rite agrees to hold all confidential information in strict confidence and will not disclose,
                  reproduce, or use such information for any purpose other than evaluating your security requirements
                  and preparing appropriate recommendations and proposals.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">3. Data Security</h3>
                <p className="text-sm leading-relaxed">
                  All shared information will be stored securely using industry-standard encryption and access controls.
                  Access is limited to authorized Design-Rite personnel directly involved in your project assessment
                  and proposal development.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">4. Duration</h3>
                <p className="text-sm leading-relaxed">
                  This agreement remains in effect for a period of five (5) years from the date of acceptance,
                  or until the confidential information becomes publicly available through no breach of this agreement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">5. Return of Information</h3>
                <p className="text-sm leading-relaxed">
                  Upon request or completion of the assessment process, Design-Rite will return or securely destroy
                  all confidential information and any copies thereof, except as required for legal compliance or
                  ongoing contractual obligations.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Questions About This Agreement?</h3>
                <p className="text-white/80 text-sm mb-4">
                  If you have any questions about this Non-Disclosure Agreement or our data protection practices,
                  please contact us before proceeding with the assessment.
                </p>
                <div className="space-y-1 text-sm text-blue-200">
                  <p><strong>Email:</strong> legal@design-rite.com</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Address:</strong> Design-Rite Security Solutions, 123 Security Blvd, Suite 100, Tech City, TC 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Link
              href="/ai-assessment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NDAPage;