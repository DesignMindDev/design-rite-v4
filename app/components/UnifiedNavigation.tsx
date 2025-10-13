'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSupabaseAuth } from '@/app/hooks/useSupabaseAuth';

interface SiteSettings {
  logoPath: string
  footerLogoPath: string
}

export default function UnifiedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({ logoPath: '', footerLogoPath: '' });
  const { isAuthenticated, signOut } = useSupabaseAuth();

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      // Silently fail - use default logo
      console.error('Failed to load settings:', error)
    }
  }

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redirect directly to portal auth
    const portalUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/auth'
      : 'https://portal.design-rite.com/auth';
    window.location.href = portalUrl;
  };

  const handleTryPlatformClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Redirect to portal auth for authentication/signup
    const portalUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/auth'
      : 'https://portal.design-rite.com/auth';
    window.location.href = portalUrl;
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <React.Fragment>
      {/* Main Navigation Header */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b dr-border-violet py-4">
      <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {settings.logoPath ? (
            <Image
              src={settings.logoPath}
              alt="Design-Rite - AI-Powered Security Design Platform"
              width={180}
              height={45}
              className="h-20 w-auto hover:opacity-90 transition-opacity"
              priority
            />
          ) : (
            <div className="flex items-center gap-3 dr-text-pearl font-black text-2xl">
              <div className="w-10 h-10 dr-bg-violet rounded-lg flex items-center justify-center font-black text-lg">
                DR
              </div>
              Design-Rite
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-10">

          {/* Platform Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:dr-text-violet font-medium transition-all relative py-2 block dr-ui cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-600 after:to-violet-700 after:transition-all hover:after:w-full">
              Platform
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl dr-border-violet rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/security-estimate" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📊
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Quick Security Estimate</div>
                  <div className="dr-ui text-gray-400 leading-tight">Self-guided form • 5 minutes</div>
                </div>
              </Link>

              <Link href="/ai-discovery" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🚀
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">AI Discovery Assistant</div>
                  <div className="dr-ui text-gray-400 leading-tight">Thorough AI-powered assessment • 15-20 min</div>
                </div>
              </Link>

              <Link href="/ai-assistant" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🤖
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">AI Assistant Refinement</div>
                  <div className="dr-ui text-gray-400 leading-tight">Enhance any assessment with AI • 5-10 min</div>
                </div>
              </Link>

              <Link href="/compliance-analyst" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ✅
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Compliance Tools</div>
                  <div className="dr-ui text-gray-400 leading-tight">Regulatory compliance analysis</div>
                </div>
              </Link>

              <Link href="/professional-proposals" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📋
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Proposal Generator</div>
                  <div className="dr-ui text-gray-400 leading-tight">Professional BOMs & pricing</div>
                </div>
              </Link>

              <Link href="/pricing-intelligence" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  💰
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Pricing Intelligence</div>
                  <div className="dr-ui text-gray-400 leading-tight">Live product pricing & trends</div>
                </div>
              </Link>

              <Link href="/intelligence" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2 border border-purple-500/40 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                  🧠
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1 flex items-center gap-2">
                    LowVolt Intelligence
                    <span className="text-xs bg-purple-500 px-2 py-0.5 rounded-full">NEW</span>
                  </div>
                  <div className="dr-ui text-gray-400 leading-tight">AI competitive intelligence platform</div>
                </div>
              </Link>

              <div className="border-t dr-border-violet my-2"></div>

              <Link href="/white-label" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏷️
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">White Label Solutions</div>
                  <div className="dr-ui text-gray-400 leading-tight">Branded platforms for partners</div>
                </div>
              </Link>
            </div>
          </li>

          {/* Solutions Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:dr-text-violet font-medium transition-all relative py-2 block dr-ui cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-600 after:to-violet-700 after:transition-all hover:after:w-full">
              Solutions
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl dr-border-violet rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/integrators" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🔧
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Security Integrators</div>
                  <div className="dr-ui text-gray-400 leading-tight">Design & proposal automation</div>
                </div>
              </Link>

              <Link href="/enterprise" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏢
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Enterprise Security</div>
                  <div className="dr-ui text-gray-400 leading-tight">In-house team solutions</div>
                </div>
              </Link>

              <Link href="/education" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🎓
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Education</div>
                  <div className="dr-ui text-gray-400 leading-tight">FERPA compliant school security</div>
                </div>
              </Link>

              <Link href="/healthcare" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏥
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Healthcare</div>
                  <div className="dr-ui text-gray-400 leading-tight">HIPAA compliant medical security</div>
                </div>
              </Link>

              <Link href="/consultants" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  💼
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Security Consultants</div>
                  <div className="dr-ui text-gray-400 leading-tight">Expert advisory services</div>
                </div>
              </Link>
            </div>
          </li>

          {/* Compliance Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:dr-text-violet font-medium transition-all relative py-2 block dr-ui cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-600 after:to-violet-700 after:transition-all hover:after:w-full">
              Compliance
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl dr-border-violet rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/compliance" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📋
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Compliance Overview</div>
                  <div className="dr-ui text-gray-400 leading-tight">Regulatory frameworks & standards</div>
                </div>
              </Link>

              <Link href="/compliance-check" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🎓
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">FERPA Compliance Check</div>
                  <div className="dr-ui text-gray-400 leading-tight">Quick educational compliance assessment</div>
                </div>
              </Link>

              <Link href="/compliance-check" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏥
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">HIPAA Compliance Check</div>
                  <div className="dr-ui text-gray-400 leading-tight">Healthcare compliance assessment</div>
                </div>
              </Link>

              <Link href="/compliance/general-security" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Security Frameworks</div>
                  <div className="dr-ui text-gray-400 leading-tight">NIST, SOC 2, ISO 27001</div>
                </div>
              </Link>
            </div>
          </li>

          {/* Pricing - Simple Link */}
          <li>
            <Link href="/pricing" className="text-gray-300 hover:dr-text-violet font-medium transition-all dr-ui">
              Pricing
            </Link>
          </li>

          {/* Partners - Simple Link */}
          <li>
            <Link className="text-gray-300 hover:dr-text-violet font-medium transition-all dr-ui" href="/partners">
              Partners
            </Link>
          </li>

          {/* Company Dropdown */}
          <li className="relative group">
            <span className="text-gray-300 hover:dr-text-violet font-medium transition-all relative py-2 block dr-ui cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-600 after:to-violet-700 after:transition-all hover:after:w-full">
              Company
            </span>
            <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl dr-border-violet rounded-xl p-4 min-w-[220px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">

              <Link href="/blog" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📝
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Blog</div>
                  <div className="dr-ui text-gray-400 leading-tight">Insights & updates</div>
                </div>
              </Link>

              <Link href="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ℹ️
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">About Us</div>
                  <div className="dr-ui text-gray-400 leading-tight">Our mission & vision</div>
                </div>
              </Link>

              <Link href="/careers" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1 mb-2">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  💼
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Careers</div>
                  <div className="dr-ui text-gray-400 leading-tight">Join our team</div>
                </div>
              </Link>
              <Link href="/contact" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-violet-600/10 hover:dr-text-pearl transition-all hover:translate-x-1">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📧
                </div>
                <div>
                  <div className="font-semibold dr-ui dr-text-pearl mb-1">Contact</div>
                  <div className="dr-ui text-gray-400 leading-tight">Get in touch</div>
                </div>
              </Link>
            </div>
          </li>
        </ul>

        {/* Utility Menu */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-gray-300 hover:dr-text-violet font-medium transition-all dr-ui text-sm"
          >
            Subscribe
          </Link>
          {isAuthenticated ? (
            <>
              <a
                href={process.env.NODE_ENV === 'development' ? 'http://localhost:3040/profile' : 'https://portal.design-rite.com/profile'}
                className="text-gray-300 hover:dr-text-violet font-medium transition-all dr-ui text-sm"
              >
                👤 Account
              </a>
              <button
                onClick={handleLogout}
                className="dr-bg-violet dr-text-pearl px-6 py-2.5 rounded-lg font-semibold dr-ui hover:bg-purple-700 transition-all hover:scale-105 shadow-lg hover:shadow-purple-600/25"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleSignInClick}
              className="dr-bg-violet dr-text-pearl px-6 py-2.5 rounded-lg font-semibold dr-ui hover:bg-purple-700 transition-all hover:scale-105 shadow-lg hover:shadow-purple-600/25"
            >
              Sign In / Try for Free
            </button>
          )}
        </div>

        {/* Mobile Menu Buttons */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="dr-bg-violet dr-text-pearl px-4 py-2 rounded-lg font-semibold dr-ui hover:bg-purple-700 transition-all shadow-lg text-sm"
              type="button"
              aria-label="Logout"
            >
              🚪 Logout
            </button>
          )}
          <button
            className="dr-text-pearl text-2xl p-2 touch-manipulation active:bg-white/10 rounded transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        </div>
      </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 relative z-[1010]">
          <div className="px-6 py-4 space-y-4">

            {/* Platform Section */}
            <div>
              <div className="text-gray-400 dr-ui uppercase tracking-wider mb-2">Platform</div>
              <Link href="/security-estimate" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">
                📊 Quick Security Estimate
              </Link>
              <Link href="/ai-discovery" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🚀 AI Discovery Assistant</Link>
              <Link href="/ai-assistant" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">
                🤖 AI Assistant Refinement
              </Link>
              <Link href="/compliance-analyst" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">✅ Compliance Tools</Link>
              <Link href="/professional-proposals" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">📋 Proposal Generator</Link>
              <Link href="/pricing-intelligence" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">💰 Pricing Intelligence</Link>
              <Link href="/intelligence" className="block text-white/80 hover:dr-text-pearl py-2 pl-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded border border-purple-500/40">
                🧠 LowVolt Intelligence <span className="text-xs bg-purple-500 px-1.5 py-0.5 rounded-full ml-2">NEW</span>
              </Link>
              <Link href="/white-label" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🏷️ White Label Solutions</Link>
            </div>

            {/* Solutions Section */}
            <div className="border-t border-white/10 pt-2">
              <div className="text-gray-400 dr-ui uppercase tracking-wider mb-2">Solutions</div>
              <Link href="/integrators" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🔧 Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🏢 Enterprise Security</Link>
              <Link href="/education" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🎓 Education</Link>
              <Link href="/healthcare" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🏥 Healthcare</Link>
              <Link href="/consultants" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">💼 Security Consultants</Link>
            </div>

            {/* Compliance Section */}
            <div className="border-t border-white/10 pt-2">
              <div className="text-gray-400 dr-ui uppercase tracking-wider mb-2">Compliance</div>
              <Link href="/compliance" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">📋 Compliance Overview</Link>
              <Link href="/compliance-check" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🎓 FERPA Check</Link>
              <Link href="/compliance-check" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🏥 HIPAA Check</Link>
              <Link href="/compliance/general-security" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">🔒 Security Frameworks</Link>
            </div>

            {/* Pricing Link */}
            <Link href="/pricing" className="block text-white/80 hover:dr-text-pearl py-2 border-t border-white/10 pt-2">💰 Pricing</Link>

            {/* Partners Link */}
            <Link href="/partners" className="block text-white/80 hover:dr-text-pearl py-2">🤝 Partners</Link>

            {/* Company Section */}
            <div className="border-t border-white/10 pt-2">
              <div className="text-gray-400 dr-ui uppercase tracking-wider mb-2">Company</div>
              <Link href="/blog" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">📝 Blog</Link>
              <Link href="/about" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">ℹ️ About Us</Link>
              <Link href="/careers" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">💼 Careers</Link>
              <Link href="/support" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">❓ Support</Link>
              <Link href="/contact" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">📧 Contact</Link>
            </div>

            {/* Utility Menu */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-gray-400 dr-ui uppercase tracking-wider mb-2">Quick Links</div>
              <Link href="/pricing" className="block text-white/80 hover:dr-text-pearl py-2 pl-4">💳 Subscribe</Link>
            </div>

            {/* Sign In and CTA */}
            <div className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <a
                    href={process.env.NODE_ENV === 'development' ? 'http://localhost:3040/profile' : 'https://portal.design-rite.com/profile'}
                    className="block w-full text-left text-white/80 hover:dr-text-pearl py-2 pl-4 transition-colors"
                  >
                    👤 Manage Account
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left dr-bg-violet dr-text-pearl px-4 py-2 rounded-lg mt-2 touch-manipulation active:bg-purple-800 transition-colors"
                    type="button"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignInClick}
                    className="block w-full text-left text-white/80 hover:dr-text-pearl py-2 transition-colors"
                    type="button"
                  >
                    👤 Sign In
                  </button>
                  <button
                    onClick={handleSignInClick}
                    className="block w-full text-left dr-bg-violet dr-text-pearl px-4 py-2 rounded-lg mt-2 touch-manipulation active:bg-purple-800 transition-colors"
                    type="button"
                  >
                    👤 Sign In / Try Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </React.Fragment>
  );
}