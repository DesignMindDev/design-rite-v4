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
import { authHelpers } from '@/lib/supabase';
import UpgradeModal from '../components/UpgradeModal';

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
  progress?: number; // 0-100
  dueDate?: string;
  tool?: string;
  data?: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    projectsCreated: 0,
    assessmentsUsed: 0,
    assessmentLimit: 10,
    timeSaved: 0,
    plan: 'trial'
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string>();
  const [usageLimits, setUsageLimits] = useState<any>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to set session from hash first (if coming from portal)
        const hasSessionFromHash = await authHelpers.setSessionFromHash();

        if (hasSessionFromHash) {
          console.log('[Workspace] Session established from portal');
        }

        // Check if we have a valid session (optional - workspace works without auth)
        const session = await authHelpers.getCurrentSession();

        if (session) {
          // User is authenticated - load their data
          setUser(session.user);
        } else {
          // No session - allow guest access for now (for design/development)
          console.log('[Workspace] No session found - showing demo data');
          setUser(null);
        }

        // Fetch user stats and subscription (only if user is authenticated)
        let plan = 'trial'; // Default to trial for demo purposes
        let assessmentLimit = 3;
        let projectsCreated = 0;
        let assessmentsUsed = 0;
        let timeSaved = 0;

        if (session && session.user) {
          // Fetch subscription
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('tier, status, trial_end')
            .eq('user_id', session.user.id)
            .in('status', ['active', 'trialing'])
            .single();

          if (subscription) {
            // Check if still in trial
            if (subscription.status === 'trialing' && subscription.trial_end) {
              const trialEnd = new Date(subscription.trial_end);
              if (trialEnd > new Date()) {
                plan = 'trial';
                assessmentLimit = 10; // Trial gets 10 assessments
              } else {
                plan = 'free'; // Trial expired
                assessmentLimit = 3;
              }
            } else if (subscription.status === 'active') {
              plan = subscription.tier;
              switch (subscription.tier) {
                case 'starter':
                  assessmentLimit = 25;
                  break;
                case 'professional':
                case 'enterprise':
                  assessmentLimit = -1; // Unlimited
                  break;
                default:
                  plan = 'paid';
                  assessmentLimit = 25;
              }
            }
          } else {
            plan = 'free'; // Registered but no subscription
            assessmentLimit = 3;
          }

          // Fetch real project count from ai_sessions (all sessions for this user)
          const { count: projectCount } = await supabase
            .from('ai_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);

          projectsCreated = projectCount || 0;

          // Fetch real assessment usage from activity_logs (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { count: assessmentCount } = await supabase
            .from('activity_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .in('action', ['ai_assessment_started', 'ai_discovery_started', 'quick_estimate_completed']);

          assessmentsUsed = assessmentCount || 0;

          // Calculate time saved (rough estimate: 40 hours per project)
          timeSaved = projectsCreated * 40;

          // Fetch recent projects with progress and due dates
          const { data: projects } = await supabase
            .from('ai_sessions')
            .select('id, tool, created_at, data, status, progress, due_date')
            .eq('user_id', session.user.id)
            .order('due_date', { ascending: true, nullsFirst: false }) // Sort by due date (closest first)
            .limit(10);

          if (projects) {
            setRecentProjects(projects.map(p => {
              // Calculate progress based on status and data completeness
              let calculatedProgress = p.progress || 0;

              if (!p.progress) {
                // Auto-calculate progress if not set
                if (p.status === 'completed') {
                  calculatedProgress = 100;
                } else if (p.status === 'draft' || p.status === 'in_progress') {
                  // Estimate based on data completeness
                  const dataKeys = Object.keys(p.data || {});
                  const essentialFields = ['projectName', 'facilityType', 'squareFootage', 'budget'];
                  const completedFields = essentialFields.filter(field => p.data?.[field]);
                  calculatedProgress = Math.round((completedFields.length / essentialFields.length) * 80); // Max 80% for in-progress
                } else {
                  calculatedProgress = 10; // Just started
                }
              }

              return {
                id: p.id,
                name: p.data?.projectName || p.data?.facilityType || p.data?.companyName || 'Untitled Project',
                type: p.tool === 'ai-discovery' ? 'AI Discovery' : p.tool === 'security-estimate' ? 'Quick Estimate' : 'AI Assessment',
                createdAt: p.created_at,
                status: p.status || 'draft',
                progress: calculatedProgress,
                dueDate: p.due_date,
                tool: p.tool,
                data: p.data
              };
            }));
          }
        } else {
          // Guest user - no real data
          setRecentProjects([]);
        }

        setStats({
          projectsCreated,
          assessmentsUsed,
          assessmentLimit,
          timeSaved,
          plan
        });

        setLoading(false);

        // Fetch usage limits
        const usageRes = await fetch('/api/usage/check', { method: 'POST' });
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsageLimits(usageData);

          // Auto-show upgrade prompt if at 80% usage
          if (usageData.percentages.assessments >= 80) {
            setTimeout(() => setShowUpgradeModal(true), 2000); // Show after 2 seconds
          }
        }
      } catch (error) {
        console.error('Dashboard auth error:', error);
        // No redirect - just show demo data
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Inactivity timeout - logout after 1 hour of inactivity
  useEffect(() => {
    const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

    const checkInactivity = () => {
      const now = Date.now();
      if (user && now - lastActivity > INACTIVITY_TIMEOUT) {
        console.log('[Workspace] Inactivity timeout - logging out');
        handleSignOut();
      }
    };

    // Check inactivity every minute
    const intervalId = setInterval(checkInactivity, 60 * 1000);

    // Update last activity on user interactions
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Track mouse movement, keyboard, and clicks
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [user, lastActivity]);

  // Auto-save functionality - save work every 30 seconds
  useEffect(() => {
    if (!user) return; // Only auto-save for authenticated users

    const AUTO_SAVE_INTERVAL = 30 * 1000; // 30 seconds

    const autoSave = async () => {
      // Check sessionStorage for unsaved work
      const unsavedData = {
        quickEstimate: sessionStorage.getItem('quickEstimateData'),
        aiDiscovery: sessionStorage.getItem('aiDiscoveryData'),
        aiAssistant: sessionStorage.getItem('aiAssistantData')
      };

      // If there's unsaved data, save it to Supabase
      for (const [tool, data] of Object.entries(unsavedData)) {
        if (data) {
          try {
            const parsedData = JSON.parse(data);
            await supabase.from('ai_sessions').upsert({
              user_id: user.id,
              tool: tool.replace(/([A-Z])/g, '-$1').toLowerCase(),
              data: parsedData,
              updated_at: new Date().toISOString(),
              status: 'draft'
            }, { onConflict: 'user_id,tool' });

            console.log(`[Workspace] Auto-saved ${tool} data`);
          } catch (error) {
            console.error(`[Workspace] Auto-save failed for ${tool}:`, error);
          }
        }
      }
    };

    const intervalId = setInterval(autoSave, AUTO_SAVE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [user, supabase]);

  const handleBackToPortal = async () => {
    console.log('[Workspace] Navigating back to portal...')

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Encode the session for portal
        const authData = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user_email: session.user.email
        }

        const encodedAuth = encodeURIComponent(JSON.stringify(authData))

        // Determine portal URL
        const portalUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001'
          : 'https://portal.design-rite.com'

        // Navigate with auth hash
        const targetUrl = `${portalUrl}/dashboard#auth=${encodedAuth}`

        console.log('[Workspace] Redirecting to portal with session...')
        window.location.href = targetUrl
      } else {
        // No session, just navigate
        const portalUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001'
          : 'https://portal.design-rite.com'

        window.location.href = `${portalUrl}/auth`
      }
    } catch (error) {
      console.error('[Workspace] Error preparing portal navigation:', error)
      // Fallback
      const portalUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'https://portal.design-rite.com'

      window.location.href = `${portalUrl}/dashboard`
    }
  };

  const handleSignOut = async () => {
    // Sign out and redirect to portal dashboard
    await authHelpers.signOut();
    const portalUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/dashboard'
      : 'https://portal.design-rite.com/dashboard';
    window.location.href = portalUrl;
  };

  const handleToolAccess = async (toolUrl: string, e: React.MouseEvent) => {
    e.preventDefault();

    // Check usage limits before allowing access
    const response = await fetch('/api/usage/check?action=assessment');
    if (response.ok) {
      const { allowed, reason } = await response.json();

      if (!allowed && reason) {
        setUpgradeReason(reason);
        setShowUpgradeModal(true);
        return;
      }
    }

    // If allowed or check failed (fail open), navigate to tool
    router.push(toolUrl);
  };

  const handleContinueProject = (project: RecentProject) => {
    // Load project data into sessionStorage for AI Assistant to pick up
    const handoffKey = project.tool === 'security-estimate' ? 'quickEstimateData' :
                       project.tool === 'ai-discovery' ? 'aiDiscoveryData' :
                       'aiAssistantData';

    sessionStorage.setItem(handoffKey, JSON.stringify({
      ...project.data,
      projectId: project.id,
      resumedAt: new Date().toISOString()
    }));

    // Navigate to AI Assistant to continue work
    router.push('/ai-assistant');
  };

  const getPriorityColor = (project: RecentProject) => {
    if (!project.dueDate) return 'gray';

    const now = new Date();
    const dueDate = new Date(project.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'red'; // Overdue
    if (daysUntilDue <= 3) return 'orange'; // Urgent
    if (daysUntilDue <= 7) return 'yellow'; // Coming up
    return 'green'; // On track
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'yellow';
    if (progress >= 25) return 'orange';
    return 'red';
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
                {user ? `Welcome back, ${user.user_metadata?.full_name || user.email}!` : 'Welcome to Design-Rite Workspace!'} 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {user ? 'Your Security Design Workspace' : 'Professional Security System Estimation Tools'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToPortal}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 hover:text-white rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Back to Portal Dashboard</span>
              </button>
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 hover:text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              )}
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
              <div className="space-y-1">
                {stats.plan === 'trial' ? (
                  <>
                    <div className="text-lg font-bold text-white">Trial</div>
                    <div className="text-sm text-gray-400">
                      {stats.assessmentLimit - stats.assessmentsUsed}/{stats.assessmentLimit} remaining
                    </div>
                    <a
                      href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/pricing' : 'https://portal.design-rite.com/pricing'}
                      className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1"
                    >
                      <span>Upgrade Plan</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold text-white capitalize">
                      {stats.plan}
                    </div>
                    {stats.assessmentLimit === -1 ? (
                      <div className="text-sm text-green-400">Unlimited</div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        {stats.assessmentLimit} assessments/mo
                      </div>
                    )}
                    {stats.plan !== 'professional' && stats.plan !== 'enterprise' && (
                      <a
                        href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/pricing' : 'https://portal.design-rite.com/pricing'}
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-1"
                      >
                        <span>Upgrade Plan</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </>
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
          <h2 className="text-3xl font-bold text-white mb-8">Your Security Design Tools</h2>

          {/* 4-Column Tool Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
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
              <button
                onClick={(e) => handleToolAccess('/security-estimate', e)}
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start Quick Estimate
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
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
              <button
                onClick={(e) => handleToolAccess('/ai-discovery', e)}
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start AI Discovery
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
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
              <button
                onClick={(e) => handleToolAccess('/ai-assistant', e)}
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start AI Assistant
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* General AI Chat */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-6 border hover:shadow-2xl hover:shadow-purple-600/20 transition-all group relative">
              <div className="absolute top-4 right-4">
                <span className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded-full border border-green-500/40">NEW</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="p-3 dr-bg-violet rounded-xl mr-3">
                  <Sparkles className="w-6 h-6 dr-text-pearl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">General AI Chat</h3>
                  <p className="text-gray-400 text-sm">Unrestricted</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-sm">
                Unrestricted AI for any task. Code generation, content writing, brainstorming, and more.
              </p>
              <Link
                href="/general-ai-chat"
                className="w-full flex items-center justify-center dr-bg-violet hover:bg-purple-700 dr-text-pearl font-bold py-3 px-4 rounded-xl transition-all group-hover:scale-105"
              >
                Start AI Chat
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
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Progress</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Due Date</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                    <th className="text-right py-4 px-6 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => {
                    const priorityColor = getPriorityColor(project);
                    const progressColor = getProgressColor(project.progress || 0);
                    const daysUntilDue = project.dueDate
                      ? Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;

                    return (
                      <tr key={project.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {project.dueDate && (
                              <div className={`w-2 h-2 rounded-full ${
                                priorityColor === 'red' ? 'bg-red-500' :
                                priorityColor === 'orange' ? 'bg-orange-500' :
                                priorityColor === 'yellow' ? 'bg-yellow-500' :
                                priorityColor === 'green' ? 'bg-green-500' :
                                'bg-gray-500'
                              }`} title={daysUntilDue && daysUntilDue < 0 ? 'Overdue!' : daysUntilDue ? `${daysUntilDue} days left` : ''} />
                            )}
                            <span className="text-white font-medium">{project.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">{project.type}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2 min-w-[100px]">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  progressColor === 'green' ? 'bg-green-500' :
                                  progressColor === 'yellow' ? 'bg-yellow-500' :
                                  progressColor === 'orange' ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 min-w-[45px]">{project.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {project.dueDate ? (
                            <div className="flex flex-col">
                              <span className={`text-sm ${
                                priorityColor === 'red' ? 'text-red-400 font-semibold' :
                                priorityColor === 'orange' ? 'text-orange-400' :
                                priorityColor === 'yellow' ? 'text-yellow-400' :
                                'text-gray-400'
                              }`}>
                                {new Date(project.dueDate).toLocaleDateString()}
                              </span>
                              {daysUntilDue !== null && (
                                <span className="text-xs text-gray-500">
                                  {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                                   daysUntilDue === 0 ? 'Due today!' :
                                   `${daysUntilDue} days left`}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No deadline</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {project.status === 'in_progress' ? 'In Progress' : project.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            {project.status !== 'completed' && (
                              <button
                                onClick={() => handleContinueProject(project)}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors font-medium flex items-center gap-1"
                                title="Continue Working"
                              >
                                <ArrowRight className="w-4 h-4" />
                                Continue
                              </button>
                            )}
                            <button className="p-2 hover:bg-gray-600/30 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600/30 rounded-lg transition-colors" title="Download">
                              <Download className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upgrade Marketing Block (if free or trial) */}
        {(stats.plan === 'free' || stats.plan === 'trial') && (
          <div className="bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-purple-900/40 rounded-2xl p-10 border border-purple-500/40 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">
                {stats.plan === 'trial'
                  ? '🚀 Love the Platform? Upgrade Before Your Trial Ends!'
                  : '⚡ Unlock Unlimited Assessments & Premium Features'
                }
              </h3>
              <p className="text-gray-300 text-lg">
                {stats.plan === 'trial'
                  ? `You have ${stats.assessmentLimit - stats.assessmentsUsed} assessments remaining in your trial. Upgrade now to keep the momentum going with unlimited access.`
                  : 'Upgrade to Professional or Starter to unlock unlimited assessments, priority support, team collaboration, and advanced integrations.'
                }
              </p>
            </div>

            {/* Feature Comparison Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Current Plan (Trial or Free) */}
              <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-600/30">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 mb-3">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white capitalize">{stats.plan}</h4>
                  <p className="text-gray-400 text-sm">
                    {stats.plan === 'trial' ? 'Trial Period' : 'Free Tier'}
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{stats.assessmentLimit} assessments/month</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>All 3 estimation tools</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>AI-powered recommendations</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Project saving & resume</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>Limited support</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>No team collaboration</span>
                  </li>
                </ul>
              </div>

              {/* Starter Plan */}
              <div className="bg-purple-900/40 rounded-xl p-6 border border-purple-500/50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                </div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Starter</h4>
                  <p className="text-purple-300 text-sm font-semibold">$49/month</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="font-semibold">25 assessments/month</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Unlimited project saves</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Export to PDF/Excel</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Email support</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>BOM & proposal generation</span>
                  </li>
                </ul>
              </div>

              {/* Professional Plan */}
              <div className="bg-blue-900/40 rounded-xl p-6 border border-blue-500/50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
                </div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Professional</h4>
                  <p className="text-blue-300 text-sm font-semibold">$149/month</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span className="font-semibold">Unlimited assessments</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Priority support (24hr)</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>API access & integrations</span>
                  </li>
                  <li className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>Team collaboration (5 users)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <a
                href={process.env.NODE_ENV === 'development'
                  ? 'http://localhost:3001/pricing'
                  : 'https://portal.design-rite.com/pricing'
                }
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              >
                {stats.plan === 'trial' ? 'Upgrade Now' : 'View Pricing & Upgrade'}
                <ArrowRight className="w-5 h-5" />
              </a>
              <button
                onClick={handleBackToPortal}
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Back to Portal Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                ✨ <span className="text-purple-300 font-semibold">14-day free trial</span> on all paid plans • Cancel anytime • No credit card required
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
        currentTier={stats.plan}
        usage={usageLimits?.usage}
        limits={usageLimits?.limits}
      />
    </div>
  );
}
