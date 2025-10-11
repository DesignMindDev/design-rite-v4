'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UnifiedNavigation from '../components/UnifiedNavigation';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <UnifiedNavigation />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Last Updated: October 10, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 pb-24">
        <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 space-y-8 text-gray-300 leading-relaxed">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Design-Rite ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered security design platform.
            </p>
            <p className="mt-4">
              By accessing or using Design-Rite, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">2.1 Personal Information</h3>
            <p>We may collect personally identifiable information that you voluntarily provide to us when you:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Register for an account</li>
              <li>Use our security assessment tools</li>
              <li>Subscribe to our services</li>
              <li>Contact us for support</li>
              <li>Sign up for our waitlist or newsletter</li>
            </ul>
            <p className="mt-4">This information may include:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Name and business name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company information</li>
              <li>Billing and payment information</li>
              <li>Professional credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">2.2 Project and Assessment Data</h3>
            <p>When you use our platform, we collect:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Security assessment questionnaire responses</li>
              <li>Facility information and building details</li>
              <li>Security requirements and specifications</li>
              <li>Equipment selections and preferences</li>
              <li>Generated proposals and documentation</li>
              <li>Uploaded files (floor plans, System Surveyor exports, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">2.3 Technical Information</h3>
            <p>We automatically collect certain information when you visit our platform:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Usage data and platform interaction patterns</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Performance and error logs</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Provide, operate, and maintain our security design platform</li>
              <li>Process your security assessments and generate proposals</li>
              <li>Improve and personalize your user experience</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns and improve our AI models</li>
              <li>Detect, prevent, and address technical issues or fraud</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* Information Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.1 Service Providers</h3>
            <p>We may share your information with third-party service providers who perform services on our behalf, including:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Supabase (database and authentication)</li>
              <li>Stripe (payment processing)</li>
              <li>OpenAI, Anthropic, Google (AI processing)</li>
              <li>Render.com (hosting services)</li>
              <li>Calendly (demo scheduling)</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.2 Business Transfers</h3>
            <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.3 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.4 We Do NOT Share</h3>
            <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your information, including:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Row-level security (RLS) in our database</li>
              <li>Limited access to personal information by our team</li>
            </ul>
            <p className="mt-4 text-yellow-400">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="mt-4">
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or compliance purposes.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">7.1 GDPR (European Users)</h3>
            <p>If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request erasure of your data ("right to be forgotten")</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">7.2 CCPA (California Users)</h3>
            <p>If you are a California resident, you have the right to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Know what personal information is collected</li>
              <li>Know whether your information is sold or disclosed</li>
              <li>Opt-out of the sale of personal information</li>
              <li>Request deletion of your information</li>
              <li>Non-discrimination for exercising your rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">7.3 How to Exercise Your Rights</h3>
            <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@design-rite.com" className="text-purple-400 hover:text-purple-300">privacy@design-rite.com</a></p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Maintain your session and authentication state</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized recommendations</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites or services (such as System Surveyor integration). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
            <p>
              Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete that information.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="mt-4">
              Significant changes will be communicated via email or a prominent notice on our platform. Your continued use of the platform after such modifications constitutes your acknowledgment and acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-4 bg-purple-900/20 border border-purple-600/30 rounded-lg p-6">
              <p className="font-semibold text-white">Design-Rite Privacy Team</p>
              <p className="mt-2">Email: <a href="mailto:privacy@design-rite.com" className="text-purple-400 hover:text-purple-300">privacy@design-rite.com</a></p>
              <p>General Inquiries: <a href="mailto:info@design-rite.com" className="text-purple-400 hover:text-purple-300">info@design-rite.com</a></p>
              <p className="mt-4 text-sm text-gray-400">We will respond to your privacy inquiries within 30 days.</p>
            </div>
          </section>

          {/* Data Processing Addendum */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Data Processing Addendum (For Enterprise Customers)</h2>
            <p>
              Enterprise customers requiring a Data Processing Addendum (DPA) for GDPR compliance should contact <a href="mailto:sales@design-rite.com" className="text-purple-400 hover:text-purple-300">sales@design-rite.com</a> to request our standard DPA.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <Footer redirectToApp={() => router.push('/estimate-options')} />
    </div>
  );
}
