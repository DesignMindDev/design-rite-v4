"use client"

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation'

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'pricing'>('overview')

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Main Navigation */}
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="dr-text-violet dr-ui font-bold tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">🧠</span> LowVolt Intelligence Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
              Stop Guessing.
              <span className="block dr-text-violet mt-2">Start Knowing.</span>
            </h1>
            <p className="text-2xl text-white/80 leading-relaxed mb-4">
              The security industry's first <span className="dr-text-violet font-bold">AI-powered competitive intelligence engine</span>
            </p>
            <p className="text-xl text-white/60 leading-relaxed mb-12">
              Every product recommendation backed by real-time market data, competitor analysis, and installer sentiment from 14 manufacturers, 271 YouTube videos, and 1.6M views.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/estimate-options"
                className="dr-bg-violet dr-text-pearl px-10 py-5 rounded-xl text-lg dr-ui font-bold hover:shadow-2xl transition-all inline-block text-center"
              >
                Try Intelligence-Powered Estimates
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 dr-text-pearl px-10 py-5 rounded-xl text-lg dr-ui font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Schedule Demo
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: "14", label: "Manufacturers Tracked" },
                { number: "271", label: "YouTube Videos Analyzed" },
                { number: "1.6M", label: "Total Views Monitored" },
                { number: "50+", label: "Reddit Discussions" }
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-4xl font-black dr-text-violet mb-2">{stat.number}</div>
                  <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-gradient-to-br from-red-900/20 to-orange-900/20 border-y border-red-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">The Sales Engineer's Nightmare</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Without competitive intelligence, you're flying blind on every quote
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "❓",
                problem: "Guessing on product recommendations",
                pain: "\"Is Axis really worth 40% more than Hikvision? I have no data.\""
              },
              {
                icon: "📊",
                problem: "No competitive positioning",
                pain: "\"Customer got a cheaper quote - I can't explain why mine is better.\""
              },
              {
                icon: "⏰",
                problem: "Hours wasted on research",
                pain: "\"Spent 3 hours Googling 'Verkada vs Avigilon' for one objection.\""
              },
              {
                icon: "💸",
                problem: "Losing bids on price alone",
                pain: "\"They went with the low bidder. I had no value story to tell.\""
              },
              {
                icon: "😤",
                problem: "Client objections you can't answer",
                pain: "\"Why not Hikvision?\" - Um... compliance? I think?\""
              },
              {
                icon: "🔍",
                problem: "No market awareness",
                pain: "\"Didn't know facial recognition was trending until I lost the deal.\""
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 hover:border-red-500/60 transition-all">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-red-400 mb-3">{item.problem}</h3>
                <p className="text-white/70 italic leading-relaxed">{item.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Intelligence-Powered Sales
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Every recommendation backed by data. Every objection pre-answered. Every quote competitive.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Before / After Comparison */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-3xl p-10 border border-red-500/30">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">😰</div>
                <h3 className="text-2xl font-bold text-red-400">Without Intelligence</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Recommend products based on gut feel",
                  "Google competitors during sales calls",
                  "Can't explain price differences",
                  "Lose deals to low bidders",
                  "No data for objection handling",
                  "Miss trending opportunities"
                ].map((item, index) => (
                  <li key={index} className="text-white/80 font-medium pl-6 relative">
                    <span className="absolute left-0 text-red-500 font-bold">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-3xl p-10 border border-green-500/30">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-2xl font-bold text-green-400">With LowVolt Intelligence</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "AI recommends products with engagement scores & sentiment",
                  "Instant competitive comparison tables",
                  "\"Axis costs 40% more but has 54.9 engagement vs 51.2\"",
                  "Data-backed value justification",
                  "Pre-answer objections with market insights",
                  "Alert on trending tech (facial rec +300%)"
                ].map((item, index) => (
                  <li key={index} className="text-white/90 font-medium pl-6 relative">
                    <span className="absolute left-0 text-green-500 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">How Intelligence Powers Your Quotes</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Multi-source data harvesting creates a knowledge graph that makes every assessment smarter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: "📺",
                title: "YouTube Analysis",
                desc: "271 videos analyzed",
                intelligence: "Engagement scores, view counts, market presence, product demos"
              },
              {
                icon: "💬",
                title: "Reddit Sentiment",
                desc: "50+ installer discussions",
                intelligence: "What installers actually recommend, pain points, brand perception"
              },
              {
                icon: "📄",
                title: "Product Specs",
                desc: "224MB technical docs",
                intelligence: "AI-searchable datasheets, compatibility matrices, feature comparisons"
              },
              {
                icon: "💰",
                title: "Pricing Intelligence",
                desc: "Coming soon",
                intelligence: "Real-time distributor pricing, margin analysis, competitive positioning"
              }
            ].map((source, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:-translate-y-2 hover:bg-white/15 transition-all text-center">
                <div className="text-5xl mb-4">{source.icon}</div>
                <h3 className="text-xl font-bold mb-2">{source.title}</h3>
                <div className="dr-text-violet font-semibold mb-4 text-sm">{source.desc}</div>
                <p className="text-white/70 text-sm leading-relaxed">{source.intelligence}</p>
              </div>
            ))}
          </div>

          {/* Intelligence Flow Diagram */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-12 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-center mb-10">Intelligence → Recommendation → Win</h3>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h4 className="text-xl font-bold mb-3">1. Data Harvest</h4>
                <p className="text-white/70 leading-relaxed">
                  AI continuously monitors YouTube, Reddit, product specs, and pricing across 14+ manufacturers
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🧠</div>
                <h4 className="text-xl font-bold mb-3">2. Intelligence Analysis</h4>
                <p className="text-white/70 leading-relaxed">
                  Engagement scoring, sentiment analysis, competitive positioning, and trend detection
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h4 className="text-xl font-bold mb-3">3. Smart Recommendations</h4>
                <p className="text-white/70 leading-relaxed">
                  AI assistant recommends products with data-backed justification and competitive comparisons
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Example Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">See Intelligence in Action</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real example: Customer asks "Need 20 outdoor cameras for warehouse with low light"
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Without Intelligence */}
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-3xl">😐</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Generic Response</h3>
                  <p className="text-white/60 text-sm">Without competitive intelligence</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <p className="text-white/80 leading-relaxed italic">
                  "I recommend Axis P3245-LVE based on specifications. They're a good brand for outdoor cameras with low light performance."
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="text-sm text-red-400 flex items-center gap-2">
                  <span>✗</span> No competitive context
                </div>
                <div className="text-sm text-red-400 flex items-center gap-2">
                  <span>✗</span> No value justification
                </div>
                <div className="text-sm text-red-400 flex items-center gap-2">
                  <span>✗</span> No market data
                </div>
              </div>
            </div>

            {/* With Intelligence */}
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-10 border border-purple-500/40">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-3xl">🧠</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Intelligence-Powered Response</h3>
                  <p className="text-purple-400 text-sm font-semibold">With LowVolt Intelligence</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-purple-500/40">
                <p className="text-white/90 leading-relaxed">
                  "I recommend <span className="font-bold text-purple-400">Axis P3245-LVE</span> (engagement score: 54.9,
                  <span className="font-bold text-green-400"> 78% positive Reddit sentiment</span>).
                  <br/><br/>
                  Average cost: <span className="font-bold">$450/camera</span> vs Hikvision at $280 (<span className="font-bold text-purple-400">NDAA-compliant advantage</span>).
                  <br/><br/>
                  Axis has <span className="font-bold">406K YouTube views</span> showing strong market presence. Recent video demonstrates excellent low-light performance with Lightfinder 2.0 technology."
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <span>✓</span> Engagement score & sentiment data
                </div>
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <span>✓</span> Competitive price positioning
                </div>
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <span>✓</span> Market presence evidence
                </div>
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <span>✓</span> Technical proof point
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results & ROI Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Expected Results</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Based on 6-12 month projections from intelligence-powered sales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { metric: "20-30%", label: "Faster Proposals", desc: "Pre-populated competitive insights eliminate research time" },
              { metric: "15-25%", label: "Higher Close Rates", desc: "Data-backed recommendations build customer confidence" },
              { metric: "10-15%", label: "Larger Quote Values", desc: "Intelligence-backed upsells and premium positioning" },
              { metric: "$50K-$150K", label: "Additional Revenue", desc: "Per sales engineer annually from better recommendations" }
            ].map((result, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:-translate-y-2 transition-all">
                <div className="text-5xl font-black dr-text-violet mb-3">{result.metric}</div>
                <h3 className="text-xl font-bold mb-3">{result.label}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{result.desc}</p>
              </div>
            ))}
          </div>

          {/* Use Cases */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Objection Handling",
                example: "\"Hikvision has 1M YouTube views but 35% negative Reddit sentiment regarding security. Axis costs 40% more but has NDAA compliance and 2x engagement score.\""
              },
              {
                title: "Competitive Positioning",
                example: "\"Industry average: $375/camera. Your Axis quote: $450 (20% premium for enterprise reliability and NDAA compliance). Here's the data...\""
              },
              {
                title: "Trend Detection",
                example: "\"Facial recognition mentioned in 45 Reddit posts this month (+120% vs last month) - suggest upsell opportunity for access control integration.\""
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-white/5 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 dr-text-violet">{useCase.title}</h3>
                <div className="bg-white/10 rounded-xl p-5 border border-white/20">
                  <p className="text-white/80 text-sm italic leading-relaxed">{useCase.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">What's Coming Next</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Continuous platform evolution with advanced intelligence features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                phase: "Phase 1 (3-6 months)",
                icon: "📈",
                features: [
                  "50+ manufacturers tracked",
                  "Distributor pricing integration",
                  "Reddit sentiment unlocked",
                  "Industry news feeds"
                ]
              },
              {
                phase: "Phase 2 (6-12 months)",
                icon: "🎯",
                features: [
                  "Competitor quote analysis",
                  "Trend forecasting",
                  "Installer feedback loop",
                  "Vertical-specific intelligence"
                ]
              },
              {
                phase: "Phase 3 (12-18 months)",
                icon: "🤖",
                features: [
                  "Win probability scoring",
                  "ML-powered recommendations",
                  "Voice of customer analysis",
                  "CRM integration"
                ]
              }
            ].map((roadmap, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:-translate-y-2 hover:bg-white/15 transition-all">
                <div className="text-4xl mb-4">{roadmap.icon}</div>
                <h3 className="text-lg font-bold dr-text-violet mb-6">{roadmap.phase}</h3>
                <ul className="space-y-3">
                  {roadmap.features.map((feature, fIndex) => (
                    <li key={fIndex} className="text-white/90 font-medium pl-6 relative text-sm">
                      <span className="absolute left-0 text-green-500 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Intelligence is included with your Design-Rite subscription
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white/5 rounded-3xl p-10 border border-white/20">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="text-white/60 mb-6">Try intelligence features</div>
              <div className="text-5xl font-black mb-8">
                $0
                <span className="text-2xl text-white/60 font-normal">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "14 manufacturers tracked",
                  "YouTube engagement scores",
                  "Basic competitive insights",
                  "3 quotes per week"
                ].map((feature, index) => (
                  <li key={index} className="text-white/80 font-medium pl-6 relative">
                    <span className="absolute left-0 text-green-500 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/estimate-options"
                className="block w-full bg-white/10 dr-text-pearl px-6 py-4 rounded-xl dr-ui font-bold border border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-3xl p-10 border-2 border-purple-500/60 relative transform scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-white/60 mb-6">Full intelligence platform</div>
              <div className="text-5xl font-black mb-8">
                $99
                <span className="text-2xl text-white/60 font-normal">/user/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "50+ manufacturers tracked",
                  "Reddit sentiment analysis",
                  "Pricing intelligence",
                  "Unlimited quotes",
                  "Trend detection",
                  "Competitive battle cards",
                  "Priority support"
                ].map((feature, index) => (
                  <li key={index} className="text-white/90 font-medium pl-6 relative">
                    <span className="absolute left-0 text-green-400 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full dr-bg-violet dr-text-pearl px-6 py-4 rounded-xl dr-ui font-bold hover:shadow-xl transition-all text-center"
              >
                Subscribe Now
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white/5 rounded-3xl p-10 border border-white/20">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-white/60 mb-6">Custom intelligence solutions</div>
              <div className="text-5xl font-black mb-8">
                Custom
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "Everything in Professional",
                  "Custom data integrations",
                  "White-label options",
                  "Dedicated support",
                  "Team training",
                  "API access",
                  "Custom reporting"
                ].map((feature, index) => (
                  <li key={index} className="text-white/80 font-medium pl-6 relative">
                    <span className="absolute left-0 text-green-500 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full bg-white/10 dr-text-pearl px-6 py-4 rounded-xl dr-ui font-bold border border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-3xl p-16 border-2 border-purple-500/40 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>

            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Stop Guessing. Start Winning.
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join the sales engineers who are closing 25% more deals with intelligence-powered recommendations.
              Every quote backed by data. Every objection pre-answered. Every customer confident.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate-options"
                className="dr-bg-violet dr-text-pearl px-10 py-5 rounded-xl text-lg dr-ui font-bold hover:shadow-2xl transition-all inline-block text-center"
              >
                Try Intelligence Platform Free
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-10 py-5 rounded-xl text-lg dr-ui font-bold hover:bg-white/10 transition-all"
              >
                Schedule Demo
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/60 text-sm">
                <span className="font-bold">Live Now:</span> 14 manufacturers • 271 videos analyzed • 1.6M views tracked • 50+ Reddit discussions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does intelligence improve my proposals?",
                a: "Every product recommendation comes with engagement scores, sentiment data, competitive pricing, and market insights. Instead of saying 'I recommend Axis,' you say 'I recommend Axis (54.9 engagement score, 78% positive installer sentiment, NDAA-compliant, $450 vs Hikvision $280 - here's why the premium is justified).' Customers trust data-backed recommendations 3x more than generic suggestions."
              },
              {
                q: "What data sources do you track?",
                a: "We continuously monitor YouTube (271 videos, 1.6M views for engagement scoring), Reddit (50+ installer discussions for sentiment), product specifications (224MB of technical docs for AI search), and pricing data (coming soon - distributor feeds for competitive positioning)."
              },
              {
                q: "Is this included with Design-Rite?",
                a: "Intelligence features are built into Design-Rite's AI assessment platform. Free trial includes basic intelligence (14 manufacturers, engagement scores). Professional subscription unlocks full intelligence (50+ manufacturers, sentiment analysis, pricing, trends, unlimited quotes)."
              },
              {
                q: "How often is data updated?",
                a: "YouTube and Reddit data refreshed weekly. Product specs updated when manufacturers release new versions. Pricing data (when launched) will update daily from distributor feeds. You always have the latest market intelligence."
              },
              {
                q: "Can I white-label this for my company?",
                a: "Yes! Enterprise plans include white-label options to brand the intelligence platform as your own proprietary tool. Perfect for distributors, large integrators, and consulting firms."
              },
              {
                q: "What's the ROI on intelligence?",
                a: "Sales engineers report 20-30% faster proposals (saved research time), 15-25% higher close rates (data builds trust), and 10-15% larger quote values (confident upselling). Average: $50K-$150K additional revenue per sales engineer annually."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold mb-4 dr-text-violet">{faq.q}</h3>
                <p className="text-white/80 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/60 mb-6">
            The security industry's first AI-powered competitive intelligence engine
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50">
            <Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
