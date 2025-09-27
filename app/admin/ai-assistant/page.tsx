'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { MessageSquare, Clock, User, Bot, RefreshCw, Eye, ArrowLeft, Sparkles, Hash } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface AISession {
  id: number;
  session_id: string;
  user_hash: string;
  session_name: string;
  ai_provider: string;
  assessment_data: any;
  created_at: string;
  last_activity: string;
  message_count: number;
}

interface AIConversation {
  id: number;
  session_id: string;
  user_hash: string;
  user_message: string;
  ai_response: string;
  ai_provider: string;
  timestamp: string;
  assessment_data: any;
  metadata: any;
}

export default function AIAssistantAdminPage() {
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<AISession | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalConversations: 0,
    todayCount: 0,
    avgMessagesPerSession: 0,
    topProvider: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('ai_sessions')
        .select('*')
        .order('last_activity', { ascending: false })
        .limit(100);

      if (sessionsError) throw sessionsError;

      // Load conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(500);

      if (conversationsError) throw conversationsError;

      setSessions(sessionsData || []);
      setConversations(conversationsData || []);
      calculateStats(sessionsData || [], conversationsData || []);
    } catch (err) {
      console.error('Error loading AI Assistant data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionsData: AISession[], conversationsData: AIConversation[]) => {
    const today = new Date().toDateString();
    const todayConversations = conversationsData.filter(conv =>
      new Date(conv.timestamp).toDateString() === today
    );

    const avgMessages = sessionsData.length > 0
      ? Math.round(conversationsData.length / sessionsData.length)
      : 0;

    const providerCounts = conversationsData.reduce((acc, conv) => {
      acc[conv.ai_provider] = (acc[conv.ai_provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProvider = Object.entries(providerCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    setStats({
      totalSessions: sessionsData.length,
      totalConversations: conversationsData.length,
      todayCount: todayConversations.length,
      avgMessagesPerSession: avgMessages,
      topProvider
    });
  };

  const loadSessionConversations = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error loading session conversations:', err);
      return [];
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.ai_provider === filter;
    const matchesSearch =
      session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user_hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ai_provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'simulated': return 'bg-gray-100 text-gray-800';
      case 'openai-gpt4': return 'bg-green-100 text-green-800';
      case 'openai-gpt35': return 'bg-blue-100 text-blue-800';
      case 'claude-3-opus': return 'bg-purple-100 text-purple-800';
      case 'claude-3-sonnet': return 'bg-indigo-100 text-indigo-800';
      case 'existing-endpoint': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Admin</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Assistant Analytics</h1>
                <p className="text-gray-400">Monitor AI Assistant sessions and conversations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Hash className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Messages</p>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today</p>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Msgs/Session</p>
                <p className="text-2xl font-bold">{stats.avgMessagesPerSession}</p>
              </div>
              <Bot className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Top Provider</p>
                <p className="text-2xl font-bold capitalize">{stats.topProvider}</p>
              </div>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Providers</option>
              <option value="simulated">Simulated</option>
              <option value="openai-gpt4">OpenAI GPT-4</option>
              <option value="openai-gpt35">OpenAI GPT-3.5</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="existing-endpoint">Existing Endpoint</option>
            </select>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3">Loading AI Assistant data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No sessions found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters.' : 'AI Assistant sessions will appear here as users interact with the AI.'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Session</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User Hash</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Messages</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{session.session_name}</div>
                          <div className="text-xs text-gray-400 font-mono">{session.session_id.substring(0, 16)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                        {session.user_hash.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProviderColor(session.ai_provider)}`}>
                          {session.ai_provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {session.message_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTimestamp(session.last_activity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={async () => {
                            const sessionConversations = await loadSessionConversations(session.session_id);
                            setSelectedSession({...session, conversations: sessionConversations} as any);
                          }}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">AI Assistant Session Details</h2>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Session Name</label>
                    <p className="text-white">{selectedSession.session_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Session ID</label>
                    <p className="text-white font-mono text-sm break-all">{selectedSession.session_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">User Hash</label>
                    <p className="text-white font-mono text-sm">{selectedSession.user_hash}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">AI Provider</label>
                    <p className="text-white">{selectedSession.ai_provider}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Created</label>
                    <p className="text-white">{formatTimestamp(selectedSession.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Activity</label>
                    <p className="text-white">{formatTimestamp(selectedSession.last_activity)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Message Count</label>
                    <p className="text-white">{selectedSession.message_count}</p>
                  </div>
                </div>
              </div>

              {/* Assessment Data */}
              {selectedSession.assessment_data && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assessment Data</label>
                  <div className="bg-gray-700 p-4 rounded max-h-40 overflow-y-auto">
                    <pre className="text-white text-xs whitespace-pre-wrap">{JSON.stringify(selectedSession.assessment_data, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Conversations */}
              {(selectedSession as any).conversations && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-4">Conversation History</label>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(selectedSession as any).conversations.map((conv: AIConversation, index: number) => (
                      <div key={conv.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-400 mb-1">User Message</label>
                          <div className="bg-gray-700 p-3 rounded">
                            <p className="text-white text-sm whitespace-pre-wrap">{conv.user_message}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-400 mb-1">AI Response</label>
                          <div className="bg-gray-700 p-3 rounded">
                            <p className="text-white text-sm whitespace-pre-wrap">{conv.ai_response}</p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Provider: {conv.ai_provider}</span>
                          <span>{formatTimestamp(conv.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}