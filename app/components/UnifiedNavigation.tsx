'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UnifiedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const redirectToApp = () => {
    window.location.href = '/ai-assessment';
  };

  const redirectToWaitlist = () => {
    window.location.href = '/waitlist';
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
      <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
            DR
          </div>
          Design-Rite
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-10">

          {/* Platform Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
              Platform
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/ai-assessment" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🧠
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">AI Security Assessment</div>
                  <div className="text-xs text-gray-400 leading-tight">Intelligent discovery consultation</div>
                </div>
              </Link>

              <Link href="/compliance-analyst" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ✅
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Compliance Tools</div>
                  <div className="text-xs text-gray-400 leading-tight">Regulatory compliance analysis</div>
                </div>
              </Link>

              <Link href="/professional-proposals" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📋
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Proposal Generator</div>
                  <div className="text-xs text-gray-400 leading-tight">Professional BOMs & pricing</div>
                </div>
              </Link>

              <Link href="/white-label" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏷️
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">White Label Solutions</div>
                  <div className="text-xs text-gray-400 leading-tight">Branded platforms for partners</div>
                </div>
              </Link>
            </div>
          </li>

          {/* Solutions Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
              Solutions
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/integrators" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🔧
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Security Integrators</div>
                  <div className="text-xs text-gray-400 leading-tight">Design & proposal automation</div>
                </div>
              </Link>

              <Link href="/enterprise" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏢
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Enterprise Security</div>
                  <div className="text-xs text-gray-400 leading-tight">In-house team solutions</div>
                </div>
              </Link>

              <Link href="/education" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🎓
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Education</div>
                  <div className="text-xs text-gray-400 leading-tight">FERPA compliant school security</div>
                </div>
              </Link>

              <Link href="/healthcare" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏥
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Healthcare</div>
                  <div className="text-xs text-gray-400 leading-tight">HIPAA compliant medical security</div>
                </div>
              </Link>

              <Link href="/consultants" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  💼
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Security Consultants</div>
                  <div className="text-xs text-gray-400 leading-tight">Expert advisory services</div>
                </div>
              </Link>
            </div>
          </li>

          {/* Compliance Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
              Compliance
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/compliance" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📋
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Compliance Overview</div>
                  <div className="text-xs text-gray-400 leading-tight">Regulatory frameworks & standards</div>
                </div>
              </Link>

              <Link href="/compliance/ferpa" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🎓
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">FERPA Compliance</div>
                  <div className="text-xs text-gray-400 leading-tight">Educational records protection</div>
                </div>
              </Link>

              <Link href="/compliance/hipaa" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏥
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">HIPAA Compliance</div>
                  <div className="text-xs text-gray-400 leading-tight">Healthcare data protection</div>
                </div>
              </Link>

              <Link href="/compliance/general-security" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Security Frameworks</div>
                  <div className="text-xs text-gray-400 leading-tight">NIST, SOC 2, ISO 27001</div>
                </div>
              </Link>
            </div>
          </li>

          {/* Pricing - Simple Link */}
          <li>
            <Link href="/pricing" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
              Pricing
            </Link>
          </li>

          {/* Partners - Simple Link */}
          <li>
            <Link className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm" href="/partners">
              Partners
            </Link>
          </li>

          {/* Company Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
              Company
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[220px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ℹ️
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">About Us</div>
                  <div className="text-xs text-gray-400 leading-tight">Our mission & vision</div>
                </div>
              </Link>

              <Link href="/careers" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  💼
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Careers</div>
                  <div className="text-xs text-gray-400 leading-tight">Join our team</div>
                </div>
              </Link>
              <Link href="/contact" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📧
                </div>
                <div>
                  <div className="font-semibold text-sm text-white mb-1">Contact</div>
                  <div className="text-xs text-gray-400 leading-tight">Get in touch</div>
                </div>
              </Link>
            </div>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={redirectToWaitlist}
            className="bg-white/10 text-white px-4 py-2 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
          >
            Try It Free
          </button>
          <button
            onClick={redirectToWaitlist}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Join Waitlist
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white text-2xl p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="px-6 py-4 space-y-4">

            {/* Platform Section */}
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Platform</div>
              <Link href="/ai-assessment" className="block text-white/80 hover:text-white py-2 pl-4">🧠 AI Security Assessment</Link>
              <Link href="/compliance-analyst" className="block text-white/80 hover:text-white py-2 pl-4">✅ Compliance Tools</Link>
              <Link href="/professional-proposals" className="block text-white/80 hover:text-white py-2 pl-4">📋 Proposal Generator</Link>
              <Link href="/white-label" className="block text-white/80 hover:text-white py-2 pl-4">🏷️ White Label Solutions</Link>
            </div>

            {/* Solutions Section */}
            <div className="border-t border-white/10 pt-2">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Solutions</div>
              <Link href="/integrators" className="block text-white/80 hover:text-white py-2 pl-4">🔧 Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white py-2 pl-4">🏢 Enterprise Security</Link>
              <Link href="/education" className="block text-white/80 hover:text-white py-2 pl-4">🎓 Education</Link>
              <Link href="/healthcare" className="block text-white/80 hover:text-white py-2 pl-4">🏥 Healthcare</Link>
              <Link href="/consultants" className="block text-white/80 hover:text-white py-2 pl-4">💼 Security Consultants</Link>
            </div>

            {/* Compliance Section */}
            <div className="border-t border-white/10 pt-2">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Compliance</div>
              <Link href="/compliance" className="block text-white/80 hover:text-white py-2 pl-4">📋 Compliance Overview</Link>
              <Link href="/compliance/ferpa" className="block text-white/80 hover:text-white py-2 pl-4">🎓 FERPA Compliance</Link>
              <Link href="/compliance/hipaa" className="block text-white/80 hover:text-white py-2 pl-4">🏥 HIPAA Compliance</Link>
              <Link href="/compliance/general-security" className="block text-white/80 hover:text-white py-2 pl-4">🔒 Security Frameworks</Link>
            </div>

            {/* Pricing Link */}
            <Link href="/pricing" className="block text-white/80 hover:text-white py-2 border-t border-white/10 pt-2">💰 Pricing</Link>

            {/* Partners Link */}
            <Link href="/partners" className="block text-white/80 hover:text-white py-2">🤝 Partners</Link>

            {/* Company Section */}
            <div className="border-t border-white/10 pt-2">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Company</div>
              <Link href="/about" className="block text-white/80 hover:text-white py-2 pl-4">ℹ️ About Us</Link>
              <Link href="/careers" className="block text-white/80 hover:text-white py-2 pl-4">💼 Careers</Link>
              <Link href="/support" className="block text-white/80 hover:text-white py-2 pl-4">❓ Support</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white py-2 pl-4">📧 Contact</Link>
            </div>

            {/* Sign In and CTA */}
            <div className="pt-4 border-t border-white/10">
              <Link href="/login" className="block text-white/80 hover:text-white py-2">👤 Sign In</Link>
              <button onClick={redirectToApp} className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-lg mt-2">
                🚀 Try AI Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}