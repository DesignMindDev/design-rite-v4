"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleTryPlatformClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/platform-access';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/integrators" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Security Integrators</Link></li>
            <li><Link href="/enterprise" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Enterprise</Link></li>
            <li><Link href="/education" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Education</Link></li>
            <li><Link href="/solutions" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Solutions</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/subscribe" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Join Waitlist
            </Link>
            <button
              onClick={handleTryPlatformClick}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Try Platform
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/integrators" className="block text-white/80 hover:text-white transition-colors py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white transition-colors py-2">Enterprise</Link>
              <Link href="/education" className="block text-white/80 hover:text-white transition-colors py-2">Education</Link>
              <Link href="/solutions" className="block text-white/80 hover:text-white transition-colors py-2">Solutions</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white transition-colors py-2">Contact</Link>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/subscribe" className="block text-center text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Join Waitlist
                </Link>
                <button
                  onClick={handleTryPlatformClick}
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Try Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full mx-auto px-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-6">
              DR
            </div>
            <h1 className="text-3xl font-bold mb-4">Authentication Coming Soon</h1>
            <p className="text-white/80 text-lg">
              Full authentication and user accounts will be available with our Q4 2025 platform launch.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center mb-8">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-4">Early Access Available</h3>
            <p className="text-white/80 mb-6">
              Join our waitlist to be notified when the full platform launches with secure user authentication, saved assessments, and subscription management.
            </p>
            <Link 
              href="/subscribe"
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02]"
            >
              Join Waitlist
            </Link>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Try Platform Demo
              </h4>
              <p className="text-white/70 text-sm mb-4">Experience our AI security assessment without signing up.</p>
              <button
                onClick={handleTryPlatformClick}
                className="w-full bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Try Demo Now
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">📹</span>
                Watch Demo Video
              </h4>
              <p className="text-white/70 text-sm mb-4">See how Design-Rite transforms security system design.</p>
              <button 
                onClick={() => router.push('/watch-demo')}
                className="w-full bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Watch Demo
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              ← Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="text-center">
            <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-xs">
                DR
              </div>
              Design-Rite
            </Link>
            <p className="text-white/60">
              © 2025 Design-Rite™. All rights reserved. | Revolutionary AI-Powered Security Solutions
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}


