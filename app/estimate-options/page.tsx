'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calculator, MessageSquare, Clock, FileText, Zap, Users, ArrowLeft, ArrowRight, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { authHelpers } from '@/lib/supabase';
import { sessionManager } from '../../lib/sessionManager';

const EstimateOptionsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading

  // Track option selection
  const handleOptionClick = (option: string, description: string) => {
    sessionManager.trackActivity({
      action: 'option_selected',
      tool: 'estimate-options',
      data: {
        selected_tool: option,
        description: description,
        authenticated: isAuthenticated,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`🎯 User selected: ${option}`)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authHelpers.getCurrentUser();

        if (user) {
          // Supabase authenticated user
          setIsAuthenticated(true);
          sessionManager.getOrCreateUser({
            email: user.email,
            name: user.user_metadata?.name || user.email,
            company: user.user_metadata?.company
          });
        } else {
          // Check for existing guest session
          const existingUser = sessionManager.getCurrentUser();
          if (existingUser && existingUser.email && existingUser.company) {
            // Valid guest session exists
            console.log('🔄 Valid guest session found:', existingUser.email);
            setIsAuthenticated(true);
          } else {
            // No valid session - redirect to get authentication
            console.log('❌ No valid session found, redirecting to home');
            setIsAuthenticated(false);
            return;
          }
        }

        // Track estimate options page visit
        sessionManager.trackActivity({
          action: 'estimate_options_visited',
          tool: 'estimate-options',
          data: {
            authenticated: !!user,
            user_email: user?.email || null,
            timestamp: new Date().toISOString()
          }
        });

        console.log('🎯 Estimate Options page - session initialized');
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/?auth=required';
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">
            Please sign in to access the security estimation platform.
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Go Home & Sign In
            </Link>
            <p className="text-sm text-gray-500">
              Click "Try Platform" in the header to authenticate
            </p>
          </div>
        </div>
      </div>
    );
  }
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
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:dr-text-violet transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="dr-heading-xl mb-6">Choose Your Security Assessment Approach</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Three progressive approaches to security system estimation and refinement. Start simple and enhance
            as needed, or jump directly to the most advanced AI-powered conversation-driven refinement.
          </p>
        </div>

        {/* Progressive AI Workflow */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="text-purple-400">★</span>
            <span>Quick</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="text-purple-400">★★</span>
            <span>Comprehensive</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500" />
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="text-purple-400">★★★</span>
            <span>AI-Enhanced</span>
          </div>
        </div>

        {/* 3-Column Options Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Column 1: Quick Security Estimate */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group relative">
            <div className="absolute top-4 right-4 text-purple-400 text-xs font-bold">★ QUICK</div>
            <div className="flex items-center mb-6">
              <div className="p-3 dr-bg-violet rounded-xl mr-3">
                <Calculator className="w-6 h-6 dr-text-pearl" />
              </div>
              <div>
                <h2 className="text-xl font-bold dr-text-violet">Quick Security Estimate</h2>
                <p className="text-gray-300 text-sm">Self-guided form with instant results</p>
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
                <li>• Option to upgrade to AI Discovery or AI Assistant refinement</li>
              </ul>
              <p className="text-blue-300 text-sm mt-4 font-medium">
                💡 Perfect starting point - can enhance later with AI tools
              </p>
            </div>

            <Link
              href="/security-estimate"
              onClick={() => handleOptionClick('security-estimate', 'Quick 5-minute security system estimate')}
              className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-4 px-6 rounded-xl text-lg transition-all group-hover:scale-105"
            >
              Start Quick Estimate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <p className="text-xs text-gray-400 mt-4 text-center">
              No signup required • Results in 5 minutes
            </p>
          </div>

          {/* Column 2: AI Discovery Assistant */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group relative">
            <div className="absolute top-4 right-4 text-purple-400 text-xs font-bold">★★ COMPREHENSIVE</div>
            <div className="flex items-center mb-6">
              <div className="p-3 dr-bg-violet rounded-xl mr-3">
                <MessageSquare className="w-6 h-6 dr-text-pearl" />
              </div>
              <div>
                <h2 className="text-xl font-bold dr-text-violet">AI Discovery Assistant</h2>
                <p className="text-gray-300 text-sm">Thorough AI-powered assessment • 15-20 minutes</p>
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
              href="/ai-discovery"
              onClick={() => handleOptionClick('ai-discovery', 'Comprehensive 15-20 minute AI-powered security assessment')}
              className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl text-sm transition-all group-hover:scale-105"
            >
              Start AI Discovery
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Comprehensive discovery • Professional-grade proposal
            </p>
          </div>

          {/* Column 3: AI Assistant Refinement */}
          <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group relative">
            <div className="absolute top-4 right-4 text-purple-400 text-xs font-bold">★★★ AI-ENHANCED</div>
            <div className="flex items-center mb-6">
              <div className="p-3 dr-bg-violet rounded-xl mr-3">
                <Bot className="w-6 h-6 dr-text-pearl" />
              </div>
              <div>
                <h2 className="text-xl font-bold dr-text-violet">AI Assistant Refinement</h2>
                <p className="text-gray-300 text-sm">Enhance any assessment with AI • 5-10 minutes</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 dr-text-pearl">Perfect for:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Sparkles className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Refining existing proposals</span>
                </li>
                <li className="flex items-center">
                  <RefreshCw className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Adding specific requirements</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Natural language improvements</span>
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 dr-text-violet mr-2" />
                  <span>Client-requested changes</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-4 dr-text-pearl">What you'll get:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• AI-powered chat interface for conversational refinements</li>
                <li>• Natural language specification adjustments and optimizations</li>
                <li>• Real-time pricing updates as changes are discussed</li>
                <li>• Enhanced proposals with AI insights and recommendations</li>
                <li>• Iterative improvement suggestions based on best practices</li>
                <li>• Professional output maintained throughout refinement process</li>
              </ul>
              <p className="text-green-300 text-sm mt-4 font-medium">
                💬 Example: "Add more cameras to parking" → AI updates entire proposal instantly
              </p>
            </div>

            <Link
              href="/ai-assistant"
              onClick={() => handleOptionClick('ai-assistant', 'Interactive AI assistant for security consultation and refinement')}
              className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl text-sm transition-all group-hover:scale-105"
            >
              Start AI Assistant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <p className="text-xs text-gray-400 mt-4 text-center">
              AI-powered refinement • Upload existing assessments • Natural language interface
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center italic">
              *Accepts: PDF, DOC, DOCX, TXT files up to 10MB
            </p>
          </div>
        </div>

        {/* Enhanced 3-Column Comparison Table */}
        <div className="mt-16 bg-gray-800/40 rounded-2xl p-8 border border-gray-600/30">
          <h2 className="text-2xl font-bold mb-8 text-center dr-text-violet">Complete Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600/30">
                  <th className="text-left py-4 pr-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-3 font-semibold">Quick Estimate<br/><span className="text-xs text-purple-400">★</span></th>
                  <th className="text-center py-4 px-3 font-semibold">AI Discovery<br/><span className="text-xs text-purple-400">★★</span></th>
                  <th className="text-center py-4 pl-3 font-semibold">AI Assistant<br/><span className="text-xs text-purple-400">★★★</span></th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Time to Complete</td>
                  <td className="text-center py-3 px-3">5 minutes</td>
                  <td className="text-center py-3 px-3">15-20 minutes</td>
                  <td className="text-center py-3 pl-3">5-10 minutes</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Real Pricing Data</td>
                  <td className="text-center py-3 px-3">✅</td>
                  <td className="text-center py-3 px-3">✅</td>
                  <td className="text-center py-3 pl-3">✅</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Custom Recommendations</td>
                  <td className="text-center py-3 px-3">Basic</td>
                  <td className="text-center py-3 px-3">Advanced</td>
                  <td className="text-center py-3 pl-3">AI-Enhanced</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Proposal Documents</td>
                  <td className="text-center py-3 px-3">Summary</td>
                  <td className="text-center py-3 px-3">Full Package</td>
                  <td className="text-center py-3 pl-3">Enhanced</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Compliance Analysis</td>
                  <td className="text-center py-3 px-3">—</td>
                  <td className="text-center py-3 px-3">✅</td>
                  <td className="text-center py-3 pl-3">✅</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Natural Language Input</td>
                  <td className="text-center py-3 px-3">—</td>
                  <td className="text-center py-3 px-3">—</td>
                  <td className="text-center py-3 pl-3">✅</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 pr-6">Iterative Refinement</td>
                  <td className="text-center py-3 px-3">—</td>
                  <td className="text-center py-3 px-3">—</td>
                  <td className="text-center py-3 pl-3">✅</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6">Starting Point</td>
                  <td className="text-center py-3 px-3">From Scratch</td>
                  <td className="text-center py-3 px-3">From Scratch</td>
                  <td className="text-center py-3 pl-3">Any Assessment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Progressive Workflow CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">🚀 Recommended Workflow</h3>
          <p className="text-gray-300 mb-6 max-w-4xl mx-auto">
            Start with Quick Estimate for immediate results, upgrade to AI Discovery for comprehensive proposals,
            then use AI Assistant to refine and perfect your assessment based on client feedback.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/security-estimate"
              onClick={() => handleOptionClick('security-estimate', 'Quick estimate from recommendation section')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Start with Quick Estimate
            </Link>
            <Link
              href="/contact"
              className="bg-gray-700 hover:bg-gray-600 dr-text-pearl font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Speak with an Expert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateOptionsPage;