'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, MessageSquare, Clock, FileText, Zap, Users, ArrowRight } from 'lucide-react';

const EstimateOptionsPage = () => {
  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold dr-text-violet">
              Design-Rite
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="hover:dr-text-violet transition-colors">Home</Link>
              <Link href="/solutions" className="hover:dr-text-violet transition-colors">Solutions</Link>
              <Link href="/contact" className="hover:dr-text-violet transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="dr-heading-xl mb-6">Get Your Security System Estimate</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Choose the approach that works best for you. Both methods provide professional-grade estimates
            backed by real pricing data and industry expertise.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Quick Security Estimate */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group">
            <div className="flex items-center mb-6">
              <div className="p-3 dr-bg-violet rounded-xl mr-4">
                <Calculator className="w-8 h-8 dr-text-pearl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dr-text-violet">Quick Security Estimate</h2>
                <p className="text-gray-300">Self-guided form with instant results</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 dr-text-pearl">Perfect for:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Clock className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Quick budget planning (5 minutes)</span>
                </li>
                <li className="flex items-center">
                  <Zap className="w-4 h-4 dr-text-violet mr-2" />
                  <span>High-level cost estimates</span>
                </li>
                <li className="flex items-center">
                  <FileText className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Standard security systems</span>
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Facilities under 100,000 sq ft</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 dr-text-pearl">What you'll get:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Equipment and installation cost breakdown</li>
                <li>• Real-time pricing from 3,000+ security products</li>
                <li>• Professional PDF estimate summary</li>
                <li>• Next steps and consultation options</li>
              </ul>
            </div>

            <Link
              href="/security-estimate"
              className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-4 px-6 rounded-xl text-lg transition-all group-hover:scale-105"
            >
              Start Quick Estimate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <p className="text-xs text-gray-400 mt-4 text-center">
              No signup required • Results in 5 minutes
            </p>
          </div>

          {/* AI Discovery Assistant */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group">
            <div className="flex items-center mb-6">
              <div className="p-3 dr-bg-violet rounded-xl mr-4">
                <MessageSquare className="w-8 h-8 dr-text-pearl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold dr-text-violet">AI Discovery Assistant</h2>
                <p className="text-gray-300">Thorough AI-powered assessment • Allow 15 minutes</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 dr-text-pearl">Perfect for:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <MessageSquare className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Complex or custom requirements</span>
                </li>
                <li className="flex items-center">
                  <FileText className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Detailed proposal development</span>
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Large or multi-site facilities</span>
                </li>
                <li className="flex items-center">
                  <Zap className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Compliance and regulatory needs</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 dr-text-pearl">What you'll get:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Comprehensive AI-guided discovery conversation</li>
                <li>• Detailed security system recommendations</li>
                <li>• Professional proposal documents with specifications</li>
                <li>• Complete compliance framework mapping</li>
                <li>• Real product recommendations with accurate pricing</li>
                <li>• Detailed implementation timeline and project phasing</li>
                <li>• Thorough risk assessment and mitigation strategies</li>
              </ul>
              <p className="text-yellow-300 text-sm mt-4 font-medium">
                ⏱️ Allow 15-20 minutes for a comprehensive, accurate proposal document
              </p>
            </div>

            <Link
              href="/ai-assessment"
              className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-4 px-6 rounded-xl text-lg transition-all group-hover:scale-105"
            >
              Start AI Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Comprehensive discovery • Professional-grade proposal • 15-20 minutes
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 bg-gray-800/40 rounded-2xl p-8 border border-gray-600/30">
          <h2 className="text-2xl font-bold mb-8 text-center dr-text-violet">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600/30">
                  <th className="text-left py-4 pr-8 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Quick Estimate</th>
                  <th className="text-center py-4 pl-4 font-semibold">AI Assistant</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 pr-8">Time to Complete</td>
                  <td className="text-center py-4 px-4">5 minutes</td>
                  <td className="text-center py-4 pl-4">15-20 minutes</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 pr-8">Real Pricing Data</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 pl-4">✅</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 pr-8">Custom Recommendations</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 pl-4">Advanced</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 pr-8">Proposal Documents</td>
                  <td className="text-center py-4 px-4">Summary</td>
                  <td className="text-center py-4 pl-4">Full Package</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-4 pr-8">Compliance Analysis</td>
                  <td className="text-center py-4 px-4">—</td>
                  <td className="text-center py-4 pl-4">✅</td>
                </tr>
                <tr>
                  <td className="py-4 pr-8">Account Required</td>
                  <td className="text-center py-4 px-4">No</td>
                  <td className="text-center py-4 pl-4">Optional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">
            Not sure which option is right for you?
          </p>
          <Link
            href="/contact"
            className="bg-gray-700 hover:bg-gray-600 dr-text-pearl font-semibold py-3 px-8 rounded-xl transition-all"
          >
            Speak with an Expert
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EstimateOptionsPage;