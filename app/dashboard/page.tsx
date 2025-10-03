'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calculator, MessageSquare, Clock, FileText, Zap, Users,
  ArrowRight, Bot, Sparkles, TrendingUp, LogOut, Settings,
  BarChart3, Download, Eye
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserStats {
  projectsCreated: number;
  assessmentsUsed: number;
  assessmentLimit: number;
  timeSaved: number;
  plan: string;
}

interface RecentProject {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    projectsCreated: 0,
    assessmentsUsed: 0,
    assessmentLimit: 3,
    timeSaved: 0,
    plan: 'trial'
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login?redirect=/dashboard');
          return;
        }

        setUser(session.user);

        // Fetch user stats and subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('tier, status')
          .eq('user_id', session.user.id)
          .in('status', ['active', 'trialing'])
          .single();

        // Set stats based on subscription
        let plan = 'trial';
        let assessmentLimit = 3;

        if (subscription) {
          plan = subscription.tier;
          switch (subscription.tier) {
            case 'starter':
              assessmentLimit = 25;
              break;
            case 'professional':
            case 'enterprise':
              assessmentLimit = -1; // Unlimited
              break;
          }
        }

        setStats({
          projectsCreated: 12, // TODO: Fetch from database
          assessmentsUsed: 8, // TODO: Fetch from activity logs
          assessmentLimit,
          timeSaved: 40, // TODO: Calculate from project data
          plan
        });

        // TODO: Fetch recent projects from database
        setRecentProjects([
          {
            id: '1',
            name: 'Elementary School Security Assessment',
            type: 'AI Discovery',
            createdAt: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            name: 'Office Building Quick Estimate',
            type: 'Quick Estimate',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Dashboard auth error:', error);
        router.push('/login?redirect=/dashboard');
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Top Stats Bar */}
      <div className="bg-gray-800/40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.user_metadata?.name || user?.email}! 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Your Security Design Workspace
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Account</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Mini Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Projects</span>
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.projectsCreated}</div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Assessments</span>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats.assessmentsUsed}
                {stats.assessmentLimit !== -1 && (
                  <span className="text-sm text-gray-400 ml-1">/ {stats.assessmentLimit}</span>
                )}
              </div>
              {stats.assessmentLimit !== -1 && (
                <div className="mt-2 w-full bg-gray-600 rounded-full h-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.assessmentsUsed / stats.assessmentLimit) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Time Saved</span>
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.timeSaved}h</div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Current Plan</span>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white capitalize">
                {stats.plan}
                {stats.plan === 'trial' && (
                  <Link href="/upgrade" className="text-xs text-purple-400 hover:text-purple-300 block mt-1">
                    Upgrade →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tools Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Your Security Design Tools</h2>
            <Link
              href="/estimate-options"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              View All Options →
            </Link>
          </div>

          {/* 3-Column Tool Grid - Same as estimate-options */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Estimate */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group">
              <div className="flex items-center mb-4">
                <div className="p-3 dr-bg-violet rounded-xl mr-3">
                  <Calculator className="w-6 h-6 dr-text-pearl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Quick Estimate</h3>
                  <p className="text-gray-400 text-sm">5 minutes</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Fast budget planning with instant cost breakdowns and real-time pricing.
              </p>
              <Link
                href="/security-estimate"
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start Quick Estimate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* AI Discovery */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group">
              <div className="flex items-center mb-4">
                <div className="p-3 dr-bg-violet rounded-xl mr-3">
                  <MessageSquare className="w-6 h-6 dr-text-pearl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Discovery</h3>
                  <p className="text-gray-400 text-sm">15-20 minutes</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Comprehensive AI-guided assessment with detailed proposals and compliance mapping.
              </p>
              <Link
                href="/ai-discovery"
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start AI Discovery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* AI Assistant */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group">
              <div className="flex items-center mb-4">
                <div className="p-3 dr-bg-violet rounded-xl mr-3">
                  <Bot className="w-6 h-6 dr-text-pearl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Assistant</h3>
                  <p className="text-gray-400 text-sm">5-10 minutes</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Refine any assessment with natural language. Upload existing proposals for enhancement.
              </p>
              <Link
                href="/ai-assistant"
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start AI Assistant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <div className="bg-gray-800/40 rounded-2xl p-12 text-center border border-gray-700/30">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">Start your first security assessment above</p>
              <Link
                href="/estimate-options"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="bg-gray-800/40 rounded-2xl border border-gray-700/30 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700/30 border-b border-gray-600/30">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Project Name</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Created</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{project.name}</td>
                      <td className="py-4 px-6 text-gray-400">{project.type}</td>
                      <td className="py-4 px-6 text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-600/30 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-600/30 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upgrade CTA (if on trial) */}
        {stats.plan === 'trial' && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">🚀 Unlock Unlimited Assessments</h3>
            <p className="text-gray-300 mb-6">
              Upgrade to Professional for unlimited projects, priority support, and advanced features
            </p>
            <Link
              href="/upgrade"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Upgrade Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
