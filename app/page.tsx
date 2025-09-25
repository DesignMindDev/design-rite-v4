"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UnifiedNavigation from './components/UnifiedNavigation';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeStormItem, setActiveStormItem] = useState(0)
  const [isCalm, setIsCalm] = useState(false)

  const stormItems = [
    { icon: "☕", text: "Morning coffee, client calls with urgent changes", delay: 0, type: "problem" },
    { icon: "🚀", text: "Design-Rite auto-generates BOMs from incomplete drawings", delay: 1, type: "solution" },
    { icon: "📞", text: "SOW edits and BOM revisions pile up", delay: 2, type: "problem" },
    { icon: "⚡", text: "Our AI creates professional proposals in 5 minutes", delay: 3, type: "solution" },
    { icon: "📑", text: "Another RFI, another clarification needed", delay: 4, type: "problem" },
    { icon: "🎯", text: "Smart compliance templates handle CJIS, FERPA, HIPAA", delay: 5, type: "solution" },
    { icon: "📝", text: "Leadership wants it yesterday, client wants it cheaper", delay: 6, type: "problem" },
    { icon: "🏆", text: "Virtual site walks eliminate travel and guesswork", delay: 7, type: "solution" },
    { icon: "🧩", text: "Scoping incomplete drawings with half the info", delay: 8, type: "problem" },
    { icon: "✨", text: "Real-time pricing from 3,000+ security products", delay: 9, type: "solution" }
  ]

  const solutions = [
    { icon: "🚶‍♂️", title: "Virtual Site Walks", desc: "Map scopes without visits" },
    { icon: "📄", title: "Auto BOMs & SOWs", desc: "No more missing zones" },
    { icon: "📋", title: "Compliance Ready", desc: "CJIS, FERPA, HIPAA built-in" },
    { icon: "⚡", title: "Instant Proposals", desc: "Days to minutes" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStormItem((prev) => (prev + 1) % stormItems.length)
    }, 5000) // Even slower timing for better readability
    return () => clearInterval(interval)
  }, [])

  const redirectToWaitlist = () => {
    window.location.href = '/waitlist'
  }

  const scheduleDemo = () => {
    window.location.href = '/watch-demo'
  }

  const redirectToEstimate = () => {
    window.location.href = '/estimate-options'
  }

  const calmTheStorm = () => {
    setIsCalm(true)
    setTimeout(() => setIsCalm(false), 5000)
  }

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl overflow-x-hidden">
      <style jsx>{`
        @keyframes tornado-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes whirlwind-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes popup-appear {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          15% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
          }
        }

        @keyframes calm-fade {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }

        @keyframes solution-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .tornado {
          animation: tornado-spin 8s linear infinite;
        }

        .whirlwind {
          animation: whirlwind-spin 6s linear infinite;
        }

        .popup-item {
          animation: popup-appear 4s ease-in-out infinite;
        }

        .calm .tornado {
          animation: calm-fade 1s ease-out forwards;
        }

        .solution-pop {
          animation: solution-appear 0.8s ease-out forwards;
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes paper-fly-1 {
          0% { transform: translateX(-200px) translateY(100px) rotate(0deg); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translateX(0px) translateY(-50px) rotate(180deg); }
          75% { opacity: 1; }
          100% { transform: translateX(200px) translateY(100px) rotate(360deg); opacity: 0; }
        }

        @keyframes paper-fly-2 {
          0% { transform: translateX(150px) translateY(-100px) rotate(45deg); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translateX(-50px) translateY(50px) rotate(225deg); }
          75% { opacity: 1; }
          100% { transform: translateX(-200px) translateY(-100px) rotate(405deg); opacity: 0; }
        }

        @keyframes paper-fly-3 {
          0% { transform: translateX(-100px) translateY(-150px) rotate(90deg); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translateX(100px) translateY(0px) rotate(270deg); }
          75% { opacity: 1; }
          100% { transform: translateX(-150px) translateY(150px) rotate(450deg); opacity: 0; }
        }

        .flying-paper-1 {
          animation: paper-fly-1 8s linear infinite;
        }

        .flying-paper-2 {
          animation: paper-fly-2 6s linear infinite;
        }

        .flying-paper-3 {
          animation: paper-fly-3 7s linear infinite;
        }
      `}</style>

      {/* Main Navigation Header */}
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="dr-text-violet dr-ui font-bold tracking-widest uppercase mb-4">
              For Sales Engineers in Security/Low-Voltage
            </div>
            <h1 className="dr-heading-xl dr-text-pearl leading-tight mb-8 pb-2">
              Caught in the daily storm?
              <span className="block dr-text-violet mt-2">We'll calm the chaos</span>
            </h1>
            <p className="dr-body text-gray-300 mb-10 leading-relaxed">
              Stop juggling incomplete drawings, endless revisions, and impossible deadlines.
              Our platform turns your chaotic Tuesday into a productive win.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={redirectToEstimate}
                className="dr-bg-violet dr-text-pearl px-8 py-4 rounded-xl dr-ui font-bold hover:shadow-xl transition-all"
              >
                🚀 Try Security Estimate
              </button>
              <button
                onClick={redirectToWaitlist}
                className="bg-white/10 dr-text-pearl px-8 py-4 rounded-xl dr-ui font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                Join Waitlist
              </button>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="text-3xl font-black dr-text-violet block">10x</span>
                <span className="text-gray-400 dr-ui font-medium">Faster BOMs</span>
              </div>
              <div>
                <span className="text-3xl font-black dr-text-violet block">95%</span>
                <span className="text-gray-400 dr-ui font-medium">Less Revisions</span>
              </div>
              <div>
                <span className="text-3xl font-black dr-text-violet block">500+</span>
                <span className="text-gray-400 dr-ui font-medium">Sales Engineers</span>
              </div>
            </div>
          </div>

          {/* Animated Storm/Whirlwind */}
          <div className={`relative h-[600px] ${isCalm ? 'calm' : ''}`}>
            {/* The Main Whirlwind */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="tornado whirlwind w-[400px] h-[400px] rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 border-4 border-red-500/40 flex items-center justify-center relative">
                {/* Inner swirl pattern */}
                <div className="absolute inset-8 rounded-full border-4 border-red-400/30 whirlwind" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
                <div className="absolute inset-16 rounded-full border-2 border-red-300/20 whirlwind" style={{animationDuration: '3s'}}></div>
                <div className="absolute inset-24 rounded-full border border-red-200/10 whirlwind" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
                <div className="text-6xl opacity-50">🌪️</div>

                {/* Flying Papers & Office Items */}
                <div className="flying-paper-1 absolute text-2xl opacity-60">📄</div>
                <div className="flying-paper-2 absolute text-xl opacity-50">📋</div>
                <div className="flying-paper-3 absolute text-2xl opacity-40">📑</div>
                <div className="flying-paper-1 absolute text-lg opacity-30" style={{animationDelay: '2s'}}>📄</div>
                <div className="flying-paper-2 absolute text-2xl opacity-45" style={{animationDelay: '1.5s'}}>📋</div>
                <div className="flying-paper-3 absolute text-xl opacity-35" style={{animationDelay: '3s'}}>📑</div>

                {/* Office Chaos Items */}
                <div className="flying-paper-1 absolute text-2xl opacity-55" style={{animationDelay: '0.5s'}}>🖥️</div>
                <div className="flying-paper-2 absolute text-lg opacity-45" style={{animationDelay: '2.5s'}}>📱</div>
                <div className="flying-paper-3 absolute text-xl opacity-50" style={{animationDelay: '1s'}}>☕</div>
                <div className="flying-paper-1 absolute text-lg opacity-40" style={{animationDelay: '3.5s'}}>🖊️</div>
                <div className="flying-paper-2 absolute text-2xl opacity-35" style={{animationDelay: '4s'}}>📞</div>
                <div className="flying-paper-3 absolute text-xl opacity-45" style={{animationDelay: '0.8s'}}>⌨️</div>
                <div className="flying-paper-1 absolute text-lg opacity-50" style={{animationDelay: '4.5s'}}>🖱️</div>
                <div className="flying-paper-2 absolute text-2xl opacity-40" style={{animationDelay: '1.2s'}}>💻</div>
                <div className="flying-paper-3 absolute text-xl opacity-30" style={{animationDelay: '5s'}}>📺</div>
              </div>
            </div>

            {/* Large Popup Messages - One at a time with longer text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {stormItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full popup-item ${
                    index === activeStormItem ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: `${item.delay}s`,
                    top: '-220px',
                    width: '300px'
                  }}
                >
                  <div className="bg-red-900/90 border-2 border-red-500/60 rounded-xl p-6 backdrop-blur-sm shadow-2xl">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{item.icon}</div>
                      <div className="text-red-100 dr-ui font-medium leading-relaxed">{item.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calm Solutions (when storm calms) */}
            {isCalm && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6">
                  {solutions.map((solution, index) => (
                    <div
                      key={index}
                      className="solution-pop bg-green-900/90 border-2 border-green-500/60 rounded-xl p-6 backdrop-blur-sm shadow-xl"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    >
                      <div className="text-3xl mb-3">{solution.icon}</div>
                      <div className="dr-ui font-bold text-green-200 mb-2">{solution.title}</div>
                      <div className="dr-ui text-green-300">{solution.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calm Button */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <button
                onClick={calmTheStorm}
                className="dr-bg-violet dr-text-pearl px-8 py-4 rounded-xl dr-ui font-semibold hover:shadow-xl transition-all floating"
              >
                ✨ Calm the Storm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-24 bg-black/50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="dr-heading-lg font-black mb-6 pb-2 dr-text-pearl">
            The Daily Chaos Every Sales Engineer Knows
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* The Storm */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
              <h3 className="dr-subheading font-bold text-red-300 mb-6">😤 Your Tuesday Morning</h3>
              <div className="space-y-3 text-red-200 text-left">
                <div className="dr-ui font-medium">📐 Scoping incomplete drawings</div>
                <div className="dr-ui font-medium">💰 Estimating with half the info</div>
                <div className="dr-ui font-medium">⚡ Writing proposals faster than engineering can review</div>
                <div className="dr-ui font-medium">🔥 Leadership wants it yesterday, client wants it cheaper</div>
              </div>
            </div>

            {/* The Calm */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8">
              <h3 className="dr-subheading font-bold text-green-300 mb-6">✨ With Design-Rite</h3>
              <div className="space-y-3 text-green-200 text-left">
                <div className="dr-ui font-medium">🚶‍♂️ Virtual site walks, no travel needed</div>
                <div className="dr-ui font-medium">📄 Auto-generated BOMs & SOWs</div>
                <div className="dr-ui font-medium">📋 Compliance templates (CJIS, FERPA, HIPAA)</div>
                <div className="dr-ui font-medium">⚡ Professional proposals in minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="dr-heading-lg font-black mb-6 pb-2 dr-text-pearl">
            Sales Engineers Getting Their Life Back
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 text-center hover:-translate-y-1 transition-all">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="dr-body text-gray-300 mb-4 italic leading-relaxed">
                "Went from weekend proposal marathons to Monday morning wins. Finally!"
              </p>
              <div className="font-semibold dr-text-violet dr-ui">- Jake R., Senior Sales Engineer</div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 text-center hover:-translate-y-1 transition-all">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="dr-body text-gray-300 mb-4 italic leading-relaxed">
                "Close rate up 30%. I respond same day while competitors are 'working on it.'"
              </p>
              <div className="font-semibold dr-text-violet dr-ui">- Tom L., Sales Engineer</div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 text-center hover:-translate-y-1 transition-all">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="dr-body text-gray-300 mb-4 italic leading-relaxed">
                "Compliance templates saved 40 hours last month. No more midnight research."
              </p>
              <div className="font-semibold dr-text-violet dr-ui">- Maria S., Technical Sales</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-violet-600/10 to-violet-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="dr-heading-lg font-black dr-text-pearl mb-6">
            Ready to Escape the Storm?
          </h2>
          <p className="dr-body text-gray-300 mb-10 leading-relaxed">
            Join 500+ Sales Engineers who've traded chaos for clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={redirectToEstimate}
              className="dr-bg-violet dr-text-pearl px-8 py-4 rounded-xl dr-ui font-bold hover:shadow-xl transition-all"
            >
              🚀 Try Security Estimate Now
            </button>
            <button
              onClick={redirectToWaitlist}
              className="bg-white/10 dr-text-pearl px-8 py-4 rounded-xl dr-ui font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              📝 Join Waitlist
            </button>
          </div>

          <div className="mt-8 text-gray-400 dr-ui">
            <div>✅ Free beta access</div>
            <div>✅ Built by Sales Engineers</div>
            <div>✅ Get your weekends back</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dr-bg-charcoal border-t dr-border-violet py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 dr-text-pearl font-black text-2xl mb-4">
                <div className="w-10 h-10 dr-bg-violet rounded-lg flex items-center justify-center font-black text-lg">
                  DR
                </div>
                Design-Rite
              </div>
              <p className="dr-body text-gray-300 leading-relaxed">
                Calming the chaos for Sales Engineers everywhere.
              </p>
            </div>
            <div>
              <h3 className="dr-text-pearl dr-ui font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/estimate-options">Security Estimate</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/waitlist">Join Waitlist</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/watch-demo">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="dr-text-pearl dr-ui font-bold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/integrators">Security Integrators</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/enterprise">Enterprise</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/education">Education</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/consultants">Consultants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="dr-text-pearl dr-ui font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/about">About Us</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/contact">Contact</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/careers">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600/30 pt-8 text-center text-gray-400 dr-ui">
            <div className="dr-ui">© 2025 Design-Rite. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}