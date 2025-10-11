"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'

export default function ProjectManagementPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Main Navigation Header */}
      <UnifiedNavigation />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <span className="text-2xl">🎯</span>
              <span>Smart Project Orchestration</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              AI-Enhanced <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Project Management</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Streamline every aspect of your security installation projects with AI-powered scheduling, resource optimization, and predictive analytics. From initial assessment to final commissioning, manage complex deployments with unprecedented efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/app')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try Project Demo
              </button>
              <Link 
                href="/watch-demo"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Watch Demo Video
              </Link>
            </div>
          </div>
        </section>

        {/* Project Lifecycle */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Complete Project Lifecycle Management</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">📋</div>
              <h3 className="text-2xl font-bold mb-4">Planning & Design</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• AI-powered resource estimation</li>
                <li>• Automated scheduling optimization</li>
                <li>• Risk assessment and mitigation</li>
                <li>• Vendor coordination</li>
                <li>• Budget tracking and forecasting</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">🚧</div>
              <h3 className="text-2xl font-bold mb-4">Implementation</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• Real-time progress tracking</li>
                <li>• Crew coordination and dispatch</li>
                <li>• Material delivery scheduling</li>
                <li>• Quality control checkpoints</li>
                <li>• Issue escalation workflows</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">✅</div>
              <h3 className="text-2xl font-bold mb-4">Completion & Support</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• Automated testing protocols</li>
                <li>• Client training coordination</li>
                <li>• Warranty tracking</li>
                <li>• Performance monitoring</li>
                <li>• Maintenance scheduling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Intelligent Project Dashboard</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6">Live Project Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Design Phase</span>
                  <span className="text-green-400 font-bold">100%</span>
                </div>
                <div className="bg-green-600/20 h-2 rounded-full">
                  <div className="bg-green-500 h-full w-full rounded-full"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Equipment Procurement</span>
                  <span className="text-blue-400 font-bold">78%</span>
                </div>
                <div className="bg-gray-600/30 h-2 rounded-full">
                  <div className="bg-blue-500 h-full w-3/4 rounded-full"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Installation</span>
                  <span className="text-orange-400 font-bold">23%</span>
                </div>
                <div className="bg-gray-600/30 h-2 rounded-full">
                  <div className="bg-orange-500 h-full w-1/4 rounded-full"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Testing & Commissioning</span>
                  <span className="text-gray-400 font-bold">0%</span>
                </div>
                <div className="bg-gray-600/30 h-2 rounded-full">
                  <div className="bg-gray-500 h-full w-0 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6">Resource Allocation</h3>
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Team Alpha</span>
                    <span className="text-green-400 text-sm">On Schedule</span>
                  </div>
                  <div className="text-white/70 text-sm">Installing cameras - Floors 3-5</div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Team Beta</span>
                    <span className="text-orange-400 text-sm">Delayed</span>
                  </div>
                  <div className="text-white/70 text-sm">Access control - Waiting for parts</div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Equipment</span>
                    <span className="text-blue-400 text-sm">87% Delivered</span>
                  </div>
                  <div className="text-white/70 text-sm">Network switches arriving Friday</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">AI-Powered Project Intelligence</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  🔮
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Predictive Analytics</h3>
                  <p className="text-white/80">AI analyzes project patterns to predict potential delays, resource bottlenecks, and cost overruns before they occur.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  📊
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Smart Scheduling</h3>
                  <p className="text-white/80">Optimize crew schedules, equipment availability, and task dependencies to minimize project duration and maximize efficiency.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  🎯
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Risk Management</h3>
                  <p className="text-white/80">Identify and mitigate project risks with AI-powered analysis of weather, supply chain, regulatory, and technical factors.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold mb-6">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">23%</div>
                  <div className="text-white/70 text-sm">Faster Completion</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">89%</div>
                  <div className="text-white/70 text-sm">On-Time Delivery</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">15%</div>
                  <div className="text-white/70 text-sm">Cost Reduction</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">97%</div>
                  <div className="text-white/70 text-sm">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Seamless Integration</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-4">Mobile App</h3>
              <p className="text-white/80">Field teams can update progress, submit photos, and communicate issues in real-time through our mobile application.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-4">API Integration</h3>
              <p className="text-white/80">Connect with existing CRM, accounting, and inventory systems through our comprehensive REST API and webhooks.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-bold mb-4">Cloud Sync</h3>
              <p className="text-white/80">Automatic data synchronization ensures all team members have access to the latest project information anywhere, anytime.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
            <div className="text-5xl mb-6">📊</div>
            <h2 className="text-3xl font-bold mb-6">Transform Your Project Management</h2>
            <p className="text-xl text-white/80 mb-8">
              Experience the power of AI-enhanced project management. Deliver projects faster, more efficiently, and with better outcomes for your clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/app')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try Project Demo
              </button>
              <Link 
                href="/subscribe"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Get Early Access
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer redirectToApp={() => router.push('/subscribe')} />
    </div>
  )
}


