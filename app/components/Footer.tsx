'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface SiteSettings {
  logoPath: string
  footerLogoPath: string
}

interface FooterProps {
  redirectToApp?: () => void
}

export default function Footer({ redirectToApp }: FooterProps) {
  const [settings, setSettings] = useState<SiteSettings>({ logoPath: '', footerLogoPath: '' })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const defaultRedirectToApp = () => {
    window.location.href = '/waitlist'
  }

  const handleRedirect = redirectToApp || defaultRedirectToApp

  return (
    <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-3 text-white font-black text-2xl mb-4">
              {settings.footerLogoPath ? (
                <Image
                  src={settings.footerLogoPath}
                  alt="Design-Rite Footer Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
                  DR
                </div>
              )}
              Design-Rite
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Transforming security system design with AI-powered intelligence. Professional assessments, automated
              proposals, and comprehensive documentation for the modern security industry.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><button onClick={handleRedirect} className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</button></li>
              <li><Link href="/professional-proposals" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Proposal Generator</Link></li>
              <li><Link href="/white-label" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">White-Label</Link></li>
              <li><Link href="/api" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">API Access</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link href="/integrators" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Security Integrators</Link></li>
              <li><Link href="/enterprise" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Enterprise</Link></li>
              <li><Link href="/education" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Education</Link></li>
              <li><Link href="/healthcare" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Healthcare</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600/30 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div>© 2025 Design-Rite. All rights reserved.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="mailto:hello@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</a>
            <a href="https://linkedin.com/company/design-rite" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</a>
            <a href="https://twitter.com/designrite" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</a>
          </div>
        </div>
      </div>
    </footer>
  )
}