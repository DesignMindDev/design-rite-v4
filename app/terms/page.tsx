'use client';

import React from 'react';
import UnifiedNavigation from '../components/UnifiedNavigation';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <UnifiedNavigation />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Terms of Service
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
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Design-Rite ("Company", "we", "our", or "us") concerning your access to and use of our AI-powered security design platform.
            </p>
            <p className="mt-4">
              By accessing or using Design-Rite, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Account Registration and Access</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">2.1 Account Creation</h3>
            <p>To access certain features of our platform, you must register for an account. You agree to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security and confidentiality of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">2.2 Account Eligibility</h3>
            <p>You must be at least 18 years old and have the legal capacity to enter into contracts to use our services.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">2.3 Account Types</h3>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li><strong>Guest Access:</strong> Limited trial features with IP-based rate limiting</li>
              <li><strong>User Account:</strong> Standard subscription with daily/monthly limits</li>
              <li><strong>Professional Account:</strong> Enhanced features and higher limits</li>
              <li><strong>Enterprise Account:</strong> Custom solutions with dedicated support</li>
            </ul>
          </section>

          {/* Subscription and Billing */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Subscription and Billing</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">3.1 Subscription Plans</h3>
            <p>We offer various subscription plans with different features and pricing. Current plan details are available at <a href="/pricing" className="text-purple-400 hover:text-purple-300">/pricing</a>.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">3.2 Payment Terms</h3>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Subscriptions are billed monthly or annually in advance</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We use Stripe for secure payment processing</li>
              <li>You authorize us to charge your payment method for all fees</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">3.3 Price Changes</h3>
            <p>We may modify subscription prices with 30 days' notice. Price changes do not affect current subscription periods but will apply upon renewal.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">3.4 Cancellation and Refunds</h3>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>You may cancel your subscription at any time</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial months or unused features</li>
              <li>You retain access to paid features until the end of the billing period</li>
              <li>Refunds may be provided at our discretion for exceptional circumstances</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.1 Permitted Use</h3>
            <p>You may use Design-Rite for:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Generating security assessments and proposals for legitimate business purposes</li>
              <li>Creating professional documentation for security projects</li>
              <li>Accessing pricing intelligence for security products</li>
              <li>Managing security design projects and client relationships</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.2 Prohibited Activities</h3>
            <p>You agree NOT to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Use the platform for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems or data</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>Scrape, crawl, or use automated tools to access our platform without permission</li>
              <li>Share your account credentials with others</li>
              <li>Resell or redistribute our services without authorization</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Interfere with or disrupt the platform's functionality</li>
              <li>Use the platform to harass, abuse, or harm others</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">4.3 Rate Limiting</h3>
            <p>We enforce rate limits to ensure fair usage:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Guest users: 3 estimates per week (IP-based)</li>
              <li>Standard users: 10 quotes/day, 50 quotes/month</li>
              <li>Professional/Enterprise: Higher limits or unlimited (per plan)</li>
            </ul>
            <p className="mt-4 text-yellow-400">Excessive usage may result in account suspension or additional charges.</p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">5.1 Our IP</h3>
            <p>Design-Rite and all related content, features, and functionality are owned by us and protected by copyright, trademark, and other intellectual property laws.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">5.2 Your Content</h3>
            <p>You retain all rights to the content you create using our platform, including:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Security assessments and proposals you generate</li>
              <li>Project data and facility information you input</li>
              <li>Files and documents you upload</li>
            </ul>
            <p className="mt-4">
              By using our platform, you grant us a limited license to process, store, and analyze your content solely to provide our services and improve our AI models.
            </p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">5.3 AI-Generated Content</h3>
            <p>Content generated by our AI tools is provided to you for your use, but we retain the right to analyze aggregated, anonymized data to improve our models.</p>
          </section>

          {/* AI Services and Accuracy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. AI Services and Accuracy</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">6.1 AI-Powered Features</h3>
            <p>Our platform uses artificial intelligence (Claude, GPT-4, Gemini) to generate security assessments and recommendations.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">6.2 No Guarantee of Accuracy</h3>
            <p className="text-yellow-400 font-semibold">
              AI-generated content is provided for informational purposes only. We do not guarantee the accuracy, completeness, or suitability of AI recommendations for any specific project.
            </p>
            <p className="mt-4">You are responsible for:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Reviewing and verifying all AI-generated recommendations</li>
              <li>Ensuring compliance with local codes and regulations</li>
              <li>Conducting proper site surveys and assessments</li>
              <li>Making final decisions on security system design</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">6.3 Professional Responsibility</h3>
            <p>Design-Rite is a tool to assist security professionals, not a replacement for professional judgment, licensing, or expertise.</p>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data and Privacy</h2>
            <p>
              Your use of Design-Rite is also governed by our <a href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>, which explains how we collect, use, and protect your information.
            </p>
            <p className="mt-4">Key privacy commitments:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>We do not sell your personal information</li>
              <li>We use encryption for data in transit and at rest</li>
              <li>We comply with GDPR and CCPA requirements</li>
              <li>You have the right to access, correct, and delete your data</li>
            </ul>
          </section>

          {/* Third-Party Integrations */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Integrations</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">8.1 System Surveyor Integration</h3>
            <p>Our integration with System Surveyor allows you to import field survey data. Use of System Surveyor is subject to their separate terms and conditions.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">8.2 Payment Processing</h3>
            <p>We use Stripe for payment processing. Stripe's terms and privacy policy also apply to payment transactions.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">8.3 AI Providers</h3>
            <p>We use third-party AI services (OpenAI, Anthropic, Google) to power our platform. These services process your inputs according to their privacy policies.</p>
          </section>

          {/* Disclaimers and Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers and Limitations of Liability</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">9.1 Service "AS IS"</h3>
            <p className="text-yellow-400 font-semibold">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">9.2 No Professional Advice</h3>
            <p>
              Design-Rite does not provide professional engineering, legal, or compliance advice. Our platform is a tool to assist professionals, not a substitute for professional services.
            </p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">9.3 Limitation of Liability</h3>
            <p className="text-yellow-400 font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DESIGN-RITE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="mt-4">
              Our total liability for any claims arising from these Terms or your use of the platform shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Design-Rite, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including attorney fees) arising from:
            </p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Your violation of these Terms</li>
              <li>Your use or misuse of the platform</li>
              <li>Your violation of any rights of third parties</li>
              <li>Your negligence or willful misconduct</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">11.1 Your Right to Terminate</h3>
            <p>You may terminate your account at any time by canceling your subscription or contacting support.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">11.2 Our Right to Terminate</h3>
            <p>We may suspend or terminate your access immediately, without prior notice, for:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Abuse of our platform or systems</li>
              <li>Any reason at our sole discretion</li>
            </ul>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">11.3 Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Your right to access the platform ceases immediately</li>
              <li>You may download your data within 30 days of termination</li>
              <li>We may delete your data after the retention period</li>
              <li>No refunds will be provided for the remaining subscription period</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">12.1 Informal Resolution</h3>
            <p>Before filing a claim, you agree to contact us at <a href="mailto:legal@design-rite.com" className="text-purple-400 hover:text-purple-300">legal@design-rite.com</a> to attempt to resolve the dispute informally.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">12.2 Arbitration Agreement</h3>
            <p>
              If we cannot resolve the dispute informally, you agree that any dispute will be resolved through binding arbitration in accordance with the American Arbitration Association's rules, rather than in court.
            </p>
            <p className="mt-4 text-yellow-400">
              <strong>You waive your right to a jury trial and the right to participate in class actions.</strong>
            </p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">12.3 Exceptions</h3>
            <p>This arbitration agreement does not apply to:</p>
            <ul className="list-disc ml-8 mt-2 space-y-2">
              <li>Intellectual property disputes</li>
              <li>Small claims court actions (under $10,000)</li>
              <li>Injunctive relief for violations of intellectual property rights</li>
            </ul>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. General Provisions</h2>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">13.1 Governing Law</h3>
            <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">13.2 Changes to Terms</h3>
            <p>
              We may modify these Terms at any time. Material changes will be communicated via email or platform notification at least 30 days before taking effect. Continued use after changes constitutes acceptance.
            </p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">13.3 Severability</h3>
            <p>If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force and effect.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">13.4 Entire Agreement</h3>
            <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Design-Rite regarding your use of the platform.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">13.5 Assignment</h3>
            <p>You may not assign or transfer these Terms without our written consent. We may assign these Terms to any affiliate or successor.</p>

            <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-3">13.6 No Waiver</h3>
            <p>Our failure to enforce any provision does not constitute a waiver of that provision or any other provision.</p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact:</p>
            <div className="mt-4 bg-purple-900/20 border border-purple-600/30 rounded-lg p-6">
              <p className="font-semibold text-white">Design-Rite Legal Team</p>
              <p className="mt-2">Email: <a href="mailto:legal@design-rite.com" className="text-purple-400 hover:text-purple-300">legal@design-rite.com</a></p>
              <p>General: <a href="mailto:info@design-rite.com" className="text-purple-400 hover:text-purple-300">info@design-rite.com</a></p>
              <p>Support: <a href="mailto:support@design-rite.com" className="text-purple-400 hover:text-purple-300">support@design-rite.com</a></p>
              <p className="mt-4 text-sm text-gray-400">We will respond to legal inquiries within 5 business days.</p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex justify-between items-center border-t border-purple-600/20 pt-8">
          <a href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
            → View Privacy Policy
          </a>
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
