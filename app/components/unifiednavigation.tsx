"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavigationProps {
  activeSection?: string
}

export default function UnifiedNavigation({ activeSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const redirectToApp = () => {
    router.push('/app')
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🎓</span>
          <span className="flex-1 text-center">
            Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access to security design mastery
          </span>
          <Link 
            href="/subscribe"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Join Waitlist
          </Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">
            ×
          </button>
        </div>
      </div>

      {/* Utility Bar */}
      <div className="bg-black/90 border-b border-purple-600/10 py-2 text-xs">
        <div className="max-w-6xl mx-auto px-8 flex justify-end items-center gap-8">
          <Link href="/login" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>👤</span> Login
          </Link>
          <Link href="/pricing" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>💰</span> Plans & Pricing
          </Link>
          <Link href="/help" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>❓</span> Help Center
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>📧</span> Contact Us
          </Link>
        </div>
      </div>

      {/* Main Navigation Header */}
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
              <Link href="#platform" className={`text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full ${activeSection === 'platform' ? 'text-purple-600 after:w-full' : ''}`}>
                Platform
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <button onClick={redirectToApp} className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2 w-full text-left">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">
                    🔍
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">AI Assessment</div>
                    <div className="text-xs text-gray-400 leading-tight">Intelligent security analysis</div>
                  </div>
                </button>
                <Link href="/proposal" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">
                    📋
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Proposal Generator</div>
                    <div className="text-xs text-gray-400 leading-tight">Professional BOMs & pricing</div>
                  </div>
                </Link>
                <Link href="/white-label" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">White-Label Solutions</div>
                    <div className="text-xs text-gray-400 leading-tight">Branded platforms for partners</div>
                  </div>
                </Link>
                <Link href="/api" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">
                    ⚡
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">API Access</div>
                    <div className="text-xs text-gray-400 leading-tight">Integrate with your systems</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Solutions Dropdown */}
            <li className="relative group">
              <Link href="#solutions" className={`text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full ${activeSection === 'solutions' ? 'text-purple-600 after:w-full' : ''}`}>
                Solutions
              </Link>
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
                    <div className="text-xs text-gray-400 leading-tight">Expert-level assessments</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Partners Dropdown */}
            <li className="relative group">
              <Link href="#partners" className={`text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full ${activeSection === 'partners' ? 'text-purple-600 after:w-full' : ''}`}>
                Partners
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/white-label-program" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏷️
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">White-Label Program</div>
                    <div className="text-xs text-gray-400 leading-tight">Brand our platform as your own</div>
                  </div>
                </Link>
                <Link href="/integration" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🔗
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Technology Partners</div>
                    <div className="text-xs text-gray-400 leading-tight">Integration ecosystem</div>
                  </div>
                </Link>
                <Link href="/referral" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    💰
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Referral Program</div>
                    <div className="text-xs text-gray-400 leading-tight">Earn commission for referrals</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* About Dropdown */}
            <li className="relative group">
              <Link href="#about" className={`text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full ${activeSection === 'about' ? 'text-purple-600 after:w-full' : ''}`}>
                About
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Company</div>
                    <div className="text-xs text-gray-400 leading-tight">Our mission and vision</div>
                  </div>
                </Link>
                <Link href="/team" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    👥
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Team</div>
                    <div className="text-xs text-gray-400 leading-tight">Meet the founders</div>
                  </div>
                </Link>
                <Link href="/careers" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Careers</div>
                    <div className="text-xs text-gray-400 leading-tight">Join our growing team</div>
                  </div>
                </Link>
                <Link href="/academy" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🎓
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Design-Rite Academy</div>
                    <div className="text-xs text-gray-400 leading-tight">Security design education</div>
                  </div>
                </Link>
              </div>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/subscribe" className="bg-purple-600/20 text-purple-600 border border-purple-600/30 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-600/30 hover:border-purple-600 transition-all">
              Subscribe
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/demo" className="bg-purple-600/10 text-purple-600 border border-purple-600/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-purple-600/20 hover:border-purple-600 transition-all">
                Watch Demo
              </Link>
              <button 
                onClick={redirectToApp}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all"
              >
                Try It Free
              </button>
            </div>
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
              <Link href="/integrators" className="block text-white/80 hover:text-white py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white py-2">Enterprise Security</Link>
              <Link href="/education" className="block text-white/80 hover:text-white py-2">Education</Link>
              <Link href="/healthcare" className="block text-white/80 hover:text-white py-2">Healthcare</Link>
              <Link href="/consultants" className="block text-white/80 hover:text-white py-2">Security Consultants</Link>
              <Link href="/about" className="block text-white/80 hover:text-white py-2">About</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white py-2">Contact</Link>
              <div className="pt-4 border-t border-white/10">
                <Link href="/login" className="block text-white/80 hover:text-white py-2">Sign In</Link>
                <button onClick={redirectToApp} className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-lg mt-2">
                  Try Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}