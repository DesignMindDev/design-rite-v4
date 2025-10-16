'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Zap,
  Server,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  RefreshCw,
  Terminal,
  FileText,
  Settings,
  AlertCircle
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy' | 'offline';
  responseTime?: string;
  error?: string;
  details?: any;
}

interface StatusResponse {
  timestamp: string;
  overall: 'healthy' | 'degraded' | 'error';
  summary: string;
  services: ServiceStatus[];
}

interface Tool {
  name: string;
  description: string;
  service: string;
  port: number;
}

interface OrchestrationRecord {
  id: string;
  task_description: string;
  tools_used: string[];
  status: string;
  result: any;
  execution_time_ms: number;
  created_at: string;
}

export default function SuperAgentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'history' | 'orchestrate'>('overview');
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [history, setHistory] = useState<OrchestrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Orchestration form state
  const [taskInput, setTaskInput] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);

  // Load status on mount and refresh every 10 seconds
  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load tools when tab switches
  useEffect(() => {
    if (activeTab === 'tools') {
      loadTools();
    } else if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/super-agent/status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to load service status');
      console.error('Status load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTools = async () => {
    try {
      const response = await fetch('/api/super-agent/tools');
      const data = await response.json();
      setTools(data.tools || []);
    } catch (err) {
      console.error('Tools load error:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/super-agent/history?limit=20');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error('History load error:', err);
    }
  };

  const handleOrchestrate = async () => {
    if (!taskInput.trim()) return;

    setIsOrchestrating(true);
    setOrchestrationResult(null);

    try {
      const response = await fetch('/api/super-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskInput,
          tools: selectedTools.length > 0 ? selectedTools : undefined,
          context: {
            timestamp: new Date().toISOString(),
            platform: 'Design-Rite V4',
          },
        }),
      });

      const result = await response.json();
      setOrchestrationResult(result);

      if (response.ok) {
        // Reload history to show new task
        loadHistory();
      }
    } catch (err) {
      setOrchestrationResult({
        error: 'Orchestration failed',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsOrchestrating(false);
    }
  };

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'unhealthy':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'unhealthy':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'offline':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
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
                  Super Agent Orchestrator
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage microservices and orchestration
                </p>
              </div>
            </div>

            <button
              onClick={loadStatus}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 hover:text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800/40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'tools', label: 'Tools', icon: Settings },
              { id: 'history', label: 'History', icon: FileText },
              { id: 'orchestrate', label: 'Orchestrate', icon: PlayCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400 bg-gray-800/60'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Summary */}
            {status && (
              <div className={`rounded-xl p-6 border ${
                status.overall === 'healthy'
                  ? 'bg-green-500/10 border-green-500/30'
                  : status.overall === 'degraded'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">System Status</h2>
                    <p className="text-gray-300">{status.summary}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Last updated: {new Date(status.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${
                    status.overall === 'healthy'
                      ? 'bg-green-500/20 text-green-300'
                      : status.overall === 'degraded'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {status.overall.toUpperCase()}
                  </div>
                </div>
              </div>
            )}

            {/* Services Grid */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                Microservices
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {status?.services.map((service, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-6 border ${getStatusColor(service.status)} bg-gray-800/60`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <h3 className="font-bold text-white">{service.name}</h3>
                      </div>
                      {service.responseTime && (
                        <span className="text-xs bg-gray-700/50 px-2 py-1 rounded">
                          {service.responseTime}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{service.url}</p>
                    {service.error && (
                      <p className="text-xs text-red-300 bg-red-500/10 p-2 rounded">
                        {service.error}
                      </p>
                    )}
                    {service.status === 'healthy' && service.details && (
                      <div className="text-xs text-gray-400 bg-gray-700/30 p-2 rounded mt-2">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(service.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                Quick Actions
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('orchestrate')}
                  className="flex items-center gap-3 p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 hover:text-white rounded-lg transition-colors"
                >
                  <PlayCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Start Orchestration</div>
                    <div className="text-xs text-gray-400">Run a new task</div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="flex items-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 hover:text-white rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">View History</div>
                    <div className="text-xs text-gray-400">See past orchestrations</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Available Tools ({tools.length})
              </h2>
              <div className="grid gap-4">
                {tools.map((tool, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/60 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-gray-300 mb-3">{tool.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-2 text-purple-400">
                            <Server className="w-4 h-4" />
                            {tool.service}
                          </span>
                          <span className="flex items-center gap-2 text-gray-400">
                            <Globe className="w-4 h-4" />
                            Port {tool.port}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {tools.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No tools available. Super Agent service may be offline.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Orchestration History ({history.length})
              </h2>
              <div className="space-y-4">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gray-800/60 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2">
                          {record.task_description}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === 'completed'
                              ? 'bg-green-500/20 text-green-300'
                              : record.status === 'failed'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {record.status}
                          </span>
                          <span className="text-gray-400">
                            {new Date(record.created_at).toLocaleString()}
                          </span>
                          {record.execution_time_ms && (
                            <span className="text-gray-400">
                              {record.execution_time_ms}ms
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {record.tools_used && record.tools_used.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-2">Tools Used:</p>
                        <div className="flex flex-wrap gap-2">
                          {record.tools_used.map((tool, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-600/20 border border-purple-500/50 text-purple-300 rounded-lg text-sm"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {record.result && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
                          View Result
                        </summary>
                        <pre className="mt-2 p-4 bg-gray-900/50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(record.result, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orchestration history yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orchestrate Tab */}
        {activeTab === 'orchestrate' && (
          <div className="space-y-6">
            <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Create Orchestration Task
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Task Description
                  </label>
                  <textarea
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Describe what you want the Super Agent to do..."
                    className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Select Tools (optional - leave empty for auto-selection)
                  </label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {tools.map((tool) => (
                      <label
                        key={tool.name}
                        className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTools.includes(tool.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTools([...selectedTools, tool.name]);
                            } else {
                              setSelectedTools(selectedTools.filter(t => t !== tool.name));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-white">{tool.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleOrchestrate}
                  disabled={!taskInput.trim() || isOrchestrating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrchestrating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Orchestrating...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Execute Task
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Orchestration Result */}
            {orchestrationResult && (
              <div className={`rounded-xl p-6 border ${
                orchestrationResult.error
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <h3 className="font-bold text-white text-lg mb-3">
                  {orchestrationResult.error ? 'Orchestration Failed' : 'Orchestration Complete'}
                </h3>
                <pre className="text-sm bg-gray-900/50 p-4 rounded overflow-x-auto">
                  {JSON.stringify(orchestrationResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
