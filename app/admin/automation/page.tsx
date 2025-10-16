'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Play, Activity, TrendingUp, Users, Zap,
  CheckCircle, AlertTriangle, Clock, BarChart3, Target,
  RefreshCw, Download, Settings
} from 'lucide-react';

interface AutomationStats {
  conversationAnalytics?: any;
  leadScores?: any;
  providerPerformance?: any;
}

export default function AutomationDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'leads' | 'providers' | 'history'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AutomationStats>({});
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [automationHistory, setAutomationHistory] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    try {
      // Load from localStorage or API
      const savedStats = localStorage.getItem('automationStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }

      const savedLastRun = localStorage.getItem('automationLastRun');
      if (savedLastRun) {
        setLastRun(savedLastRun);
      }

      const savedHistory = localStorage.getItem('automationHistory');
      if (savedHistory) {
        setAutomationHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load automation data:', error);
    }
  };

  const runAutomation = async (type: 'all' | 'analytics' | 'leads' | 'providers') => {
    setIsLoading(true);
    const runId = `run_${Date.now()}`;

    try {
      const results: any = {};

      if (type === 'all' || type === 'analytics') {
        console.log('Running conversation analytics...');
        const analyticsRes = await fetch('/api/automation/analyze-conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeframe: '24h', includeDetails: false })
        });
        results.conversationAnalytics = await analyticsRes.json();
      }

      if (type === 'all' || type === 'leads') {
        console.log('Running lead scoring...');
        const leadsRes = await fetch('/api/automation/score-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeframe: '24h', minScore: 50 })
        });
        results.leadScores = await leadsRes.json();
      }

      if (type === 'all' || type === 'providers') {
        console.log('Running provider optimization...');
        const providersRes = await fetch('/api/automation/optimize-providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeframe: '7d', applyOptimizations: false })
        });
        results.providerPerformance = await providersRes.json();
      }

      // Update stats
      setStats(results);
      const now = new Date().toISOString();
      setLastRun(now);

      // Save to localStorage
      localStorage.setItem('automationStats', JSON.stringify(results));
      localStorage.setItem('automationLastRun', now);

      // Add to history
      const historyEntry = {
        id: runId,
        type,
        timestamp: now,
        status: 'success',
        results: {
          conversations: results.conversationAnalytics?.analytics?.totalConversations || 0,
          leads: results.leadScores?.summary?.hot || 0,
          providers: Object.keys(results.providerPerformance?.performance || {}).length
        }
      };

      const newHistory = [historyEntry, ...automationHistory].slice(0, 20);
      setAutomationHistory(newHistory);
      localStorage.setItem('automationHistory', JSON.stringify(newHistory));

    } catch (error) {
      console.error('Automation error:', error);
      alert('Automation failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header */}
      <div className="bg-gray-800/60 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Admin</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  Native Automation System
                </h1>
                <p className="text-gray-400 text-sm">AI-powered automation without n8n</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => runAutomation('all')}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Run All Automation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/40 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
              { id: 'leads', label: 'Lead Scoring', icon: Target },
              { id: 'providers', label: 'Provider Performance', icon: TrendingUp },
              { id: 'history', label: 'History', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white bg-gray-700/30'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/20'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Last Run Info */}
        {lastRun && (
          <div className="mb-6 bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Last automation run</p>
                  <p className="text-white font-medium">
                    {new Date(lastRun).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => runAutomation('all')}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm text-gray-400">Conversations</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.conversationAnalytics?.analytics?.totalConversations || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-red-400" />
                  <h3 className="text-sm text-gray-400">Hot Leads</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.leadScores?.summary?.hot || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Score 70-100</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm text-gray-400">Unique Users</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.conversationAnalytics?.analytics?.uniqueUsers || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active users</p>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm text-gray-400">Avg Engagement</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats.conversationAnalytics?.analytics?.averageConversationLength?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Messages per session</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => runAutomation('analytics')}
                  disabled={isLoading}
                  className="flex items-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">Analyze Conversations</p>
                    <p className="text-xs text-gray-400">Usage patterns & anomalies</p>
                  </div>
                </button>

                <button
                  onClick={() => runAutomation('leads')}
                  disabled={isLoading}
                  className="flex items-center gap-3 p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Target className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">Score Leads</p>
                    <p className="text-xs text-gray-400">Identify high-value prospects</p>
                  </div>
                </button>

                <button
                  onClick={() => runAutomation('providers')}
                  disabled={isLoading}
                  className="flex items-center gap-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">Optimize Providers</p>
                    <p className="text-xs text-gray-400">Performance & cost analysis</p>
                  </div>
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                System Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-2">Orchestration Layer</p>
                  <p className="text-white font-mono">Super Agent (Port 9500)</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Tool System</p>
                  <p className="text-white font-mono">MCP Server (Port 8000)</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Database</p>
                  <p className="text-white font-mono">Supabase PostgreSQL</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Runtime</p>
                  <p className="text-white font-mono">Next.js Serverless</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg">
                <p className="text-purple-300 text-sm">
                  ✨ <strong>No n8n required</strong> - Native TypeScript automation with full control
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {stats.conversationAnalytics?.analytics ? (
              <>
                {/* Provider Breakdown */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Provider Distribution</h3>
                    <button
                      onClick={() => exportData(stats.conversationAnalytics, 'conversation-analytics')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(stats.conversationAnalytics.analytics.providerBreakdown).map(([provider, count]: [string, any]) => {
                      const percentage = (count / stats.conversationAnalytics.analytics.totalMessages) * 100;
                      return (
                        <div key={provider}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300 capitalize">{provider}</span>
                            <span className="text-white font-medium">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Message Types */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Message Type Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.conversationAnalytics.analytics.messageTypeBreakdown).map(([type, count]: [string, any]) => (
                      <div key={type} className="text-center">
                        <p className="text-3xl font-bold text-white mb-1">{count}</p>
                        <p className="text-sm text-gray-400 capitalize">{type}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anomalies */}
                {stats.conversationAnalytics.analytics.anomalies.length > 0 && (
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Anomalies Detected
                    </h3>
                    <div className="space-y-3">
                      {stats.conversationAnalytics.analytics.anomalies.map((anomaly: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${
                            anomaly.severity === 'high'
                              ? 'bg-red-600/10 border-red-500/30'
                              : anomaly.severity === 'medium'
                              ? 'bg-yellow-600/10 border-yellow-500/30'
                              : 'bg-blue-600/10 border-blue-500/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                              anomaly.severity === 'high' ? 'text-red-400' :
                              anomaly.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                            }`} />
                            <div className="flex-1">
                              <p className="text-white font-medium capitalize">{anomaly.type.replace(/_/g, ' ')}</p>
                              <p className="text-gray-300 text-sm mt-1">{anomaly.description}</p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                anomaly.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                                anomaly.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-blue-500/20 text-blue-300'
                              }`}>
                                {anomaly.severity} severity
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-gray-700/50">
                <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No analytics data available</p>
                <button
                  onClick={() => runAutomation('analytics')}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Run Analytics Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {stats.leadScores?.leads && stats.leadScores.leads.length > 0 ? (
              <>
                {/* Lead Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-600/20 rounded-xl p-6 border border-red-500/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-red-400" />
                      <h3 className="text-sm text-gray-300">Hot Leads</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.leadScores.summary.hot}</p>
                    <p className="text-xs text-gray-400 mt-1">Score 70-100</p>
                  </div>

                  <div className="bg-yellow-600/20 rounded-xl p-6 border border-yellow-500/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-sm text-gray-300">Warm Leads</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.leadScores.summary.warm}</p>
                    <p className="text-xs text-gray-400 mt-1">Score 50-69</p>
                  </div>

                  <div className="bg-blue-600/20 rounded-xl p-6 border border-blue-500/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h3 className="text-sm text-gray-300">Cold Leads</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.leadScores.summary.cold}</p>
                    <p className="text-xs text-gray-400 mt-1">Score 0-49</p>
                  </div>
                </div>

                {/* Lead List */}
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Scored Leads</h3>
                    <button
                      onClick={() => exportData(stats.leadScores, 'lead-scores')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="space-y-3">
                    {stats.leadScores.leads.slice(0, 10).map((lead: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              lead.tier === 'hot' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                              lead.tier === 'warm' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                              'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                            }`}>
                              {lead.score} pts
                            </span>
                            <span className="text-gray-400 text-sm font-mono">{lead.sessionId.substring(0, 16)}...</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            lead.tier === 'hot' ? 'bg-red-600 text-white' :
                            lead.tier === 'warm' ? 'bg-yellow-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {lead.tier}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                          <span>{lead.conversationSummary.messageCount} messages</span>
                          <span>•</span>
                          <span>Topics: {lead.conversationSummary.topics.join(', ')}</span>
                        </div>
                        {lead.signals.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {lead.signals.map((signal: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">
                                {signal}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-400 italic">{lead.recommendedAction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-gray-700/50">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No lead scores available</p>
                <button
                  onClick={() => runAutomation('leads')}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Score Leads Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            {stats.providerPerformance?.performance ? (
              <>
                {Object.entries(stats.providerPerformance.performance).map(([provider, perf]: [string, any]) => (
                  <div key={provider} className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white capitalize">{provider}</h3>
                      <span className={`px-4 py-2 rounded-lg font-bold ${
                        perf.performanceScore >= 90 ? 'bg-green-600/20 text-green-300 border border-green-500/50' :
                        perf.performanceScore >= 70 ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/50' :
                        'bg-red-600/20 text-red-300 border border-red-500/50'
                      }`}>
                        {perf.performanceScore} / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Requests</p>
                        <p className="text-white font-bold text-xl">{perf.totalRequests}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Error Rate</p>
                        <p className="text-white font-bold text-xl">{perf.errorRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Avg Response</p>
                        <p className="text-white font-bold text-xl">{perf.avgResponseLength} chars</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Est. Cost</p>
                        <p className="text-white font-bold text-xl">${perf.costEstimate}</p>
                      </div>
                    </div>

                    {perf.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 font-medium mb-2">Recommendations:</p>
                        {perf.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-300">{rec}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Optimizations */}
                {stats.providerPerformance.optimizations && stats.providerPerformance.optimizations.length > 0 && (
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Optimization Opportunities</h3>
                    <div className="space-y-3">
                      {stats.providerPerformance.optimizations.map((opt: any, idx: number) => (
                        <div key={idx} className={`p-4 rounded-lg border ${
                          opt.impact === 'high' ? 'bg-red-600/10 border-red-500/30' :
                          opt.impact === 'medium' ? 'bg-yellow-600/10 border-yellow-500/30' :
                          'bg-blue-600/10 border-blue-500/30'
                        }`}>
                          <div className="flex items-start gap-3">
                            <TrendingUp className={`w-5 h-5 flex-shrink-0 ${
                              opt.impact === 'high' ? 'text-red-400' :
                              opt.impact === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                            }`} />
                            <div className="flex-1">
                              <p className="text-white font-medium">{opt.description}</p>
                              <p className="text-gray-300 text-sm mt-1">{opt.action}</p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                opt.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                                opt.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-blue-500/20 text-blue-300'
                              }`}>
                                {opt.impact} impact
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-gray-700/50">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No provider performance data available</p>
                <button
                  onClick={() => runAutomation('providers')}
                  disabled={isLoading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Analyze Providers Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {automationHistory.length > 0 ? (
              automationHistory.map(entry => (
                <div key={entry.id} className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium capitalize">{entry.type} Automation</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <span>{entry.results.conversations} conversations</span>
                    <span>{entry.results.leads} hot leads</span>
                    <span>{entry.results.providers} providers</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-gray-800/40 rounded-xl border border-gray-700/50">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No automation history yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
