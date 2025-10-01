import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ChatConversation {
  id: string;
  thread_id: string;
  user_message: string;
  assistant_response: string;
  provider: string;
  assistant_id: string;
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    // Fetch all conversations in time range
    const { data: conversations, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    const conversationData = (conversations || []) as ChatConversation[];

    // Calculate conversation metrics
    const metrics = calculateConversationMetrics(conversationData, now);

    // Calculate provider statistics
    const providerStats = calculateProviderStats(conversationData);

    // Analyze topics and keywords
    const topicAnalysis = analyzeTopics(conversationData);

    // Identify common questions
    const commonQuestions = identifyCommonQuestions(conversationData);

    // Generate time series data
    const timeSeriesData = generateTimeSeriesData(conversationData, timeRange);

    // Get recent conversations for activity feed
    const recentConversations = conversationData.slice(-20).reverse().map(conv => ({
      id: conv.id,
      thread_id: conv.thread_id,
      user_message: conv.user_message.substring(0, 100),
      assistant_response: conv.assistant_response.substring(0, 100),
      provider: conv.provider,
      created_at: conv.created_at
    }));

    return NextResponse.json({
      metrics,
      providerStats,
      topicAnalysis,
      commonQuestions,
      timeSeriesData,
      recentConversations
    });

  } catch (error) {
    console.error('Chatbot analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateConversationMetrics(conversations: ChatConversation[], now: Date): ConversationMetrics {
  const total = conversations.length;

  // Today's conversations
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayCount = conversations.filter(conv =>
    new Date(conv.created_at) >= todayStart
  ).length;

  // Average response length
  const totalResponseLength = conversations.reduce((sum, conv) =>
    sum + conv.assistant_response.length, 0
  );
  const avgResponseLength = total > 0 ? Math.round(totalResponseLength / total) : 0;

  // Average user message length
  const totalUserMessageLength = conversations.reduce((sum, conv) =>
    sum + conv.user_message.length, 0
  );
  const avgUserMessageLength = total > 0 ? Math.round(totalUserMessageLength / total) : 0;

  // Fallback rate
  const fallbackCount = conversations.filter(conv =>
    conv.provider === 'fallback' || conv.provider.includes('fallback')
  ).length;
  const fallbackRate = total > 0 ? Math.round((fallbackCount / total) * 100) : 0;

  // Average messages per thread
  const threadCounts: Record<string, number> = {};
  conversations.forEach(conv => {
    threadCounts[conv.thread_id] = (threadCounts[conv.thread_id] || 0) + 1;
  });
  const uniqueThreads = Object.keys(threadCounts).length;
  const avgMessagesPerThread = uniqueThreads > 0 ?
    Math.round((total / uniqueThreads) * 10) / 10 : 0;

  return {
    total,
    todayCount,
    avgResponseLength,
    avgUserMessageLength,
    fallbackRate,
    avgMessagesPerThread
  };
}

function calculateProviderStats(conversations: ChatConversation[]): ProviderStats[] {
  const providerData: Record<string, {
    count: number;
    totalResponseLength: number;
    timestamps: Date[];
  }> = {};

  conversations.forEach(conv => {
    const provider = conv.provider;
    if (!providerData[provider]) {
      providerData[provider] = {
        count: 0,
        totalResponseLength: 0,
        timestamps: []
      };
    }
    providerData[provider].count++;
    providerData[provider].totalResponseLength += conv.assistant_response.length;
    providerData[provider].timestamps.push(new Date(conv.created_at));
  });

  const total = conversations.length;

  return Object.entries(providerData)
    .map(([provider, data]) => ({
      provider,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      avgResponseLength: Math.round(data.totalResponseLength / data.count),
      avgResponseTime: calculateAvgResponseTime(data.timestamps)
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateAvgResponseTime(timestamps: Date[]): number {
  if (timestamps.length < 2) return 0;

  const intervals: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const diff = timestamps[i].getTime() - timestamps[i - 1].getTime();
    intervals.push(diff);
  }

  const avgMs = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  return Math.round(avgMs / 1000); // Convert to seconds
}

function analyzeTopics(conversations: ChatConversation[]): TopicAnalysis[] {
  // Define topic keywords
  const topics = {
    'Pricing & Quotes': ['price', 'cost', 'quote', 'estimate', 'budget', 'pricing', 'expensive', 'cheap'],
    'Product Features': ['feature', 'capability', 'can it', 'does it', 'support', 'integration', 'function'],
    'Technical Support': ['error', 'issue', 'problem', 'bug', 'not working', 'help', 'fix', 'troubleshoot'],
    'Getting Started': ['how to', 'start', 'begin', 'setup', 'install', 'onboard', 'tutorial', 'guide'],
    'Security Systems': ['camera', 'access control', 'alarm', 'surveillance', 'security', 'door', 'sensor'],
    'Compliance': ['compliance', 'regulation', 'ferpa', 'hipaa', 'gdpr', 'cjis', 'requirement'],
    'Account & Billing': ['account', 'subscription', 'payment', 'invoice', 'billing', 'cancel', 'renew'],
    'General Inquiry': ['what is', 'tell me', 'explain', 'information', 'about', 'overview']
  };

  const topicMatches: Record<string, { count: number; examples: string[] }> = {};

  conversations.forEach(conv => {
    const message = conv.user_message.toLowerCase();
    let matched = false;

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        if (!topicMatches[topic]) {
          topicMatches[topic] = { count: 0, examples: [] };
        }
        topicMatches[topic].count++;
        if (topicMatches[topic].examples.length < 3) {
          topicMatches[topic].examples.push(conv.user_message.substring(0, 80));
        }
        matched = true;
        break; // Only count first match
      }
    }

    // Catch-all for unmatched
    if (!matched) {
      if (!topicMatches['Other']) {
        topicMatches['Other'] = { count: 0, examples: [] };
      }
      topicMatches['Other'].count++;
      if (topicMatches['Other'].examples.length < 3) {
        topicMatches['Other'].examples.push(conv.user_message.substring(0, 80));
      }
    }
  });

  const total = conversations.length;

  return Object.entries(topicMatches)
    .map(([topic, data]) => ({
      topic,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      examples: data.examples
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 topics
}

function identifyCommonQuestions(conversations: ChatConversation[]): CommonQuestion[] {
  // Normalize and group similar questions
  const questionGroups: Record<string, {
    count: number;
    responseLengths: number[];
    providers: string[];
  }> = {};

  conversations.forEach(conv => {
    const message = conv.user_message.toLowerCase().trim();

    // Normalize question (remove punctuation, extra spaces)
    const normalized = message
      .replace(/[?!.,;:]/g, '')
      .replace(/\s+/g, ' ')
      .substring(0, 100);

    // Group by first 50 characters for similarity
    const key = normalized.substring(0, 50);

    if (!questionGroups[key]) {
      questionGroups[key] = {
        count: 0,
        responseLengths: [],
        providers: []
      };
    }

    questionGroups[key].count++;
    questionGroups[key].responseLengths.push(conv.assistant_response.length);
    questionGroups[key].providers.push(conv.provider);
  });

  return Object.entries(questionGroups)
    .filter(([, data]) => data.count >= 2) // Only questions asked 2+ times
    .map(([question, data]) => {
      const avgResponseLength = Math.round(
        data.responseLengths.reduce((sum, len) => sum + len, 0) / data.responseLengths.length
      );

      // Find most common provider
      const providerCounts = data.providers.reduce((acc, provider) => {
        acc[provider] = (acc[provider] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const primaryProvider = Object.entries(providerCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      return {
        question: question + '...',
        count: data.count,
        avgResponseLength,
        primaryProvider
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 common questions
}

function generateTimeSeriesData(conversations: ChatConversation[], timeRange: string): TimeSeriesData[] {
  const dataPoints: Record<string, {
    conversations: number;
    fallbacks: number;
    totalResponseLength: number;
  }> = {};

  // Determine date format based on time range
  const dateFormat = timeRange === '24h' ? 'hour' : 'day';

  conversations.forEach(conv => {
    const date = new Date(conv.created_at);
    let key: string;

    if (dateFormat === 'hour') {
      key = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
    } else {
      key = `${date.getMonth() + 1}/${date.getDate()}`;
    }

    if (!dataPoints[key]) {
      dataPoints[key] = {
        conversations: 0,
        fallbacks: 0,
        totalResponseLength: 0
      };
    }

    dataPoints[key].conversations++;
    if (conv.provider === 'fallback' || conv.provider.includes('fallback')) {
      dataPoints[key].fallbacks++;
    }
    dataPoints[key].totalResponseLength += conv.assistant_response.length;
  });

  return Object.entries(dataPoints)
    .map(([date, data]) => ({
      date,
      conversations: data.conversations,
      fallbacks: data.fallbacks,
      avgResponseLength: Math.round(data.totalResponseLength / data.conversations)
    }))
    .sort((a, b) => {
      // Sort chronologically
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
}
