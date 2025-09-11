'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EnterpriseROICalculatorPage() {
  const [facilities, setFacilities] = useState(10)
  const [assessmentsPerYear, setAssessmentsPerYear] = useState(50)
  const [hoursPerAssessment, setHoursPerAssessment] = useState(12)
  const [hourlyRate, setHourlyRate] = useState(75)
  const [projectsLost, setProjectsLost] = useState(20)
  const [avgProjectValue, setAvgProjectValue] = useState(25000)
  
  const [results, setResults] = useState({
    currentCosts: 0,
    designRiteCosts: 0,
    timeSavings: 0,
    costSavings: 0,
    projectsSaved: 0,
    additionalRevenue: 0,
    totalSavings: 0,
    roi: 0
  })

  useEffect(() => {
    calculateROI()
  }, [facilities, assessmentsPerYear, hoursPerAssessment, hourlyRate, projectsLost, avgProjectValue])

  const calculateROI = () => {
    // Current annual costs
    const currentLaborCosts = assessmentsPerYear * hoursPerAssessment * hourlyRate
    const lostProjectRevenue = (projectsLost / 100) * assessmentsPerYear * avgProjectValue
    const currentTotalCosts = currentLaborCosts + lostProjectRevenue

    // With Design-Rite (90% time reduction)
    const newHoursPerAssessment = hoursPerAssessment * 0.1
    const newLaborCosts = assessmentsPerYear * newHoursPerAssessment * hourlyRate
    const designRiteSubscription = facilities * 200 * 12 // $200/month per facility
    const newTotalCosts = newLaborCosts + designRiteSubscription

    // Savings calculations
    const timeSavingsHours = assessmentsPerYear * (hoursPerAssessment - newHoursPerAssessment)
    const laborSavings = timeSavingsHours * hourlyRate
    const projectsSavedCount = Math.floor((projectsLost / 100) * assessmentsPerYear * 0.7) // 70% of lost projects recovered
    const additionalRevenue = projectsSavedCount * avgProjectValue
    const totalAnnualSavings = laborSavings + additionalRevenue
    const netSavings = totalAnnualSavings - designRiteSubscription
    const roiPercentage = designRiteSubscription > 0 ? (netSavings / designRiteSubscription) * 100 : 0

    setResults({
      currentCosts: currentTotalCosts,
      designRiteCosts: newTotalCosts,
      timeSavings: timeSavingsHours,
      costSavings: laborSavings,
      projectsSaved: projectsSavedCount,
      additionalRevenue: additionalRevenue,
      totalSavings: netSavings,
      roi: roiPercentage
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/enterprise" className="text-gray-300 hover:text-white transition-colors">
              Back to Enterprise
            </Link>
            <Link href="/contact" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Contact Sales
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Header */}
        <section className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Enterprise ROI Calculator
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Calculate your potential savings with Design-Rite's AI-powered security assessment platform.
            Adjust the parameters below to see how much your organization could save.
          </p>
        </section>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Input Parameters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-8">Your Current Situation</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Number of Facilities</label>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={facilities}
                  onChange={(e) => setFacilities(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>1</span>
                  <span className="text-white font-bold">{facilities} facilities</span>
                  <span>500+</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Security Assessments Per Year</label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={assessmentsPerYear}
                  onChange={(e) => setAssessmentsPerYear(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>10</span>
                  <span className="text-white font-bold">{assessmentsPerYear} assessments</span>
                  <span>1000+</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Hours Per Assessment (Current Process)</label>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={hoursPerAssessment}
                  onChange={(e) => setHoursPerAssessment(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>4h</span>
                  <span className="text-white font-bold">{hoursPerAssessment} hours</span>
                  <span>40h</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Average Hourly Rate (Internal Cost)</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>$50</span>
                  <span className="text-white font-bold">${hourlyRate}/hour</span>
                  <span>$150</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Projects Lost Due to Slow Turnaround (%)</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={projectsLost}
                  onChange={(e) => setProjectsLost(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>0%</span>
                  <span className="text-white font-bold">{projectsLost}%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Average Project Value</label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={avgProjectValue}
                  onChange={(e) => setAvgProjectValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>$5K</span>
                  <span className="text-white font-bold">{formatCurrency(avgProjectValue)}</span>
                  <span>$100K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {formatCurrency(results.totalSavings)}
                </div>
                <div className="text-green-300 font-semibold">Annual Net Savings</div>
              </div>
              
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {Math.round(results.roi)}%
                </div>
                <div className="text-blue-300 font-semibold">ROI</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Savings Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-gray-300">Time Savings</span>
                  <span className="text-white font-bold">{formatNumber(results.timeSavings)} hours/year</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-gray-300">Labor Cost Savings</span>
                  <span className="text-green-400 font-bold">{formatCurrency(results.costSavings)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-gray-300">Projects Recovered</span>
                  <span className="text-white font-bold">{results.projectsSaved} projects</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-gray-300">Additional Revenue</span>
                  <span className="text-green-400 font-bold">{formatCurrency(results.additionalRevenue)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-gray-300">Design-Rite Subscription</span>
                  <span className="text-red-400 font-bold">-{formatCurrency(facilities * 200 * 12)}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 bg-green-500/10 rounded-lg px-4 mt-4">
                  <span className="text-white font-bold text-lg">Net Annual Savings</span>
                  <span className="text-green-400 font-bold text-xl">{formatCurrency(results.totalSavings)}</span>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-4">Calculation Assumptions</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Design-Rite reduces assessment time by 90%</li>
                <li>• 70% of lost projects can be recovered with faster turnaround</li>
                <li>• Design-Rite subscription: $200/month per facility</li>
                <li>• Results are estimates based on typical enterprise usage</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-purple-100 mb-6">
                Schedule a personalized demo to see how Design-Rite can transform your security operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all inline-block"
                >
                  Schedule Enterprise Demo
                </Link>
                <Link 
                  href="/enterprise"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-all inline-block"
                >
                  Learn More About Enterprise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-white/70">© 2025 Design-Rite. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  )
}