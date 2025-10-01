'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare, Clock, User, Bot, RefreshCw, Eye, ArrowLeft,
  TrendingUp, AlertCircle, Zap, Award, BarChart3
} from 'lucide-react';
import MetricCard from '../../components/dashboard/MetricCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';

interface ChatConversation {
  id: string;
  thread_id: string;
  user_message: string;
  assistant_response: string;
  provider: string;
  created_at: string;
}

interface ConversationMetrics {
  total: number;
  todayCount: number;
  avgResponseLength: number;
  avgUserMessageLength: number;
  fallbackRate: number;
  avgMessagesPerThread: number;
}

interface ProviderStats {
  provider: string;
  count: number;
  percentage: number;
  avgResponseLength: number;
  avgResponseTime: number;
}

interface TopicAnalysis {
  topic: string;
  count: number;
  percentage: number;
  examples: string[];
}

interface CommonQuestion {
  question: string;
  count: number;
  avgResponseLength: number;
  primaryProvider: string;
}

interface TimeSeriesData {
  date: string;
  conversations: number;
  fallbacks: number;
  avgResponseLength: number;
}

interface AnalyticsData {
  metrics: ConversationMetrics;
  providerStats: ProviderStats[];
  topicAnalysis: TopicAnalysis[];
  commonQuestions: CommonQuestion[];
  timeSeriesData: TimeSeriesData[];
  recentConversations: ChatConversation[];
}

export default function ChatbotAdminPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicAnalysis | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const timeRangeLabels = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days'
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/chatbot-analytics?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Chatbot analytics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              Chatbot Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor AI assistant conversations, topics, and performance
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex gap-2 bg-white rounded-lg border border-gray-300 p-1">
              {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {timeRangeLabels[range]}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-red-900">Failed to load analytics</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading or Content */}
      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Conversation Metrics */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="Total Conversations"
                value={data.metrics.total.toLocaleString()}
                icon={<MessageSquare className="w-6 h-6" />}
                color="blue"
                description={timeRangeLabels[timeRange]}
              />
              <MetricCard
                title="Today's Count"
                value={data.metrics.todayCount}
                icon={<Clock className="w-6 h-6" />}
                color="green"
              />
              <MetricCard
                title="Avg Response Length"
                value={`${data.metrics.avgResponseLength} chars`}
                icon={<Bot className="w-6 h-6" />}
                color="purple"
              />
              <MetricCard
                title="Avg User Message"
                value={`${data.metrics.avgUserMessageLength} chars`}
                icon={<User className="w-6 h-6" />}
                color="blue"
              />
              <MetricCard
                title="Fallback Rate"
                value={`${data.metrics.fallbackRate}%`}
                icon={<AlertCircle className="w-6 h-6" />}
                color={data.metrics.fallbackRate < 10 ? 'green' : data.metrics.fallbackRate < 25 ? 'yellow' : 'red'}
                description={data.metrics.fallbackRate < 10 ? 'Excellent' : data.metrics.fallbackRate < 25 ? 'Good' : 'Needs attention'}
              />
              <MetricCard
                title="Msgs Per Thread"
                value={data.metrics.avgMessagesPerThread}
                icon={<TrendingUp className="w-6 h-6" />}
                color="green"
                description="Engagement"
              />
            </div>
          </section>

          {/* Time Series Chart */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Over Time</h2>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
              <TimeSeriesChart
                data={data.timeSeriesData}
                xKey="date"
                yKeys={['conversations', 'fallbacks']}
                colors={['#9333EA', '#EF4444']}
                height={300}
              />
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span className="text-sm text-gray-600">Conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span className="text-sm text-gray-600">Fallbacks</span>
                </div>
              </div>
            </div>
          </section>

          {/* Provider Performance & Topic Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider Performance */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Performance</h2>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 space-y-4">
                {data.providerStats.map((provider) => (
                  <div key={provider.provider} className="pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        {provider.provider}
                      </h3>
                      <span className="text-sm font-medium text-purple-600">
                        {provider.count} ({provider.percentage}%)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Avg Response:</span>
                        <span className="ml-2 font-medium">{provider.avgResponseLength} chars</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Time:</span>
                        <span className="ml-2 font-medium">{provider.avgResponseTime}s</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${provider.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Topic Analysis */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Topic Analysis</h2>
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200 space-y-3">
                {data.topicAnalysis.map((topic) => (
                  <div
                    key={topic.topic}
                    className="pb-3 border-b border-gray-200 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        {topic.topic}
                      </h3>
                      <span className="text-sm font-medium text-blue-600">
                        {topic.count} ({topic.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${topic.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Common Questions */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Common Questions</h2>
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Response
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primary Provider
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.commonQuestions.map((question, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {truncateText(question.question, 80)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                          {question.count}x
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {question.avgResponseLength} chars
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {question.primaryProvider}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Conversations */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Conversations</h2>
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thread</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assistant Response</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.recentConversations.map((conversation, index) => (
                    <tr key={conversation.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(conversation.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {conversation.thread_id.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        {truncateText(conversation.user_message, 100)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        {truncateText(conversation.assistant_response, 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {conversation.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedConversation(conversation)}
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
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
          </section>
        </div>
      ) : null}

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Conversation Details</h2>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Thread ID</label>
                    <p className="text-gray-900 font-mono text-sm break-all">{selectedConversation.thread_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Provider</label>
                    <p className="text-gray-900">{selectedConversation.provider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Timestamp</label>
                    <p className="text-gray-900">{formatTimestamp(selectedConversation.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">User Message</label>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-40 overflow-y-auto">
                    <pre className="text-gray-900 text-sm whitespace-pre-wrap">{selectedConversation.user_message}</pre>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Assistant Response</label>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-60 overflow-y-auto">
                    <pre className="text-gray-900 text-sm whitespace-pre-wrap">{selectedConversation.assistant_response}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic Examples Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedTopic.topic}</h2>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {selectedTopic.count} conversations ({selectedTopic.percentage}%)
              </p>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Example Questions:</h3>
              <div className="space-y-3">
                {selectedTopic.examples.map((example, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <p className="text-gray-900 text-sm">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
