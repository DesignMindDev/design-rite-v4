'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { MessageSquare, Clock, User, Bot, RefreshCw, Eye, ArrowLeft } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface ChatConversation {
  id: string;
  thread_id: string;
  user_message: string;
  assistant_response: string;
  provider: string;
  assistant_id: string;
  created_at: string;
}

export default function ChatbotAdminPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    todayCount: 0,
    avgResponseLength: 0,
    topProvider: ''
  });

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      setConversations(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: ChatConversation[]) => {
    const today = new Date().toDateString();
    const todayConversations = data.filter(conv =>
      new Date(conv.created_at).toDateString() === today
    );

    const avgLength = data.length > 0
      ? Math.round(data.reduce((sum, conv) => sum + conv.assistant_response.length, 0) / data.length)
      : 0;

    const providerCounts = data.reduce((acc, conv) => {
      acc[conv.provider] = (acc[conv.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProvider = Object.entries(providerCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    setStats({
      total: data.length,
      todayCount: todayConversations.length,
      avgResponseLength: avgLength,
      topProvider
    });
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = filter === 'all' || conv.provider === filter;
    const matchesSearch =
      conv.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.assistant_response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.thread_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
                <h1 className="text-2xl font-bold text-white">Chatbot Analytics</h1>
                <p className="text-gray-400">Monitor AI assistant conversations and performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadConversations}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Conversations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
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
                <p className="text-gray-400 text-sm">Avg Response Length</p>
                <p className="text-2xl font-bold">{stats.avgResponseLength}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Top Provider</p>
                <p className="text-2xl font-bold capitalize">{stats.topProvider}</p>
              </div>
              <User className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search conversations..."
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
              <option value="openai_assistant">OpenAI Assistant</option>
              <option value="fallback">Fallback</option>
              <option value="help_assistant">Help Assistant</option>
            </select>
          </div>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3">Loading conversations...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={loadConversations}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No conversations found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters.' : 'Conversations will appear here as users chat with the assistant.'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Thread</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assistant Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredConversations.map((conversation) => (
                    <tr key={conversation.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTimestamp(conversation.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                        {conversation.thread_id.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        {truncateText(conversation.user_message, 100)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        {truncateText(conversation.assistant_response, 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          conversation.provider === 'openai_assistant'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {conversation.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedConversation(conversation)}
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

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Conversation Details</h2>
                <button
                  onClick={() => setSelectedConversation(null)}
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Thread ID</label>
                    <p className="text-white font-mono text-sm break-all">{selectedConversation.thread_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Provider</label>
                    <p className="text-white">{selectedConversation.provider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Assistant ID</label>
                    <p className="text-white font-mono text-sm">{selectedConversation.assistant_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Timestamp</label>
                    <p className="text-white">{formatTimestamp(selectedConversation.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">User Message</label>
                  <div className="bg-gray-700 p-4 rounded max-h-40 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap">{selectedConversation.user_message}</pre>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assistant Response</label>
                  <div className="bg-gray-700 p-4 rounded max-h-60 overflow-y-auto">
                    <pre className="text-white text-sm whitespace-pre-wrap">{selectedConversation.assistant_response}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}