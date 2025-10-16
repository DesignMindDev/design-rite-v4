import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * AI Conversation Analytics Automation
 *
 * Analyzes recent AI conversations for:
 * - Usage patterns
 * - Popular topics
 * - Provider performance
 * - User engagement
 * - Anomaly detection
 */

interface ConversationAnalytics {
  timeframe: string;
  totalConversations: number;
  totalMessages: number;
  uniqueUsers: number;
  providerBreakdown: Record<string, number>;
  averageConversationLength: number;
  topFeatures: Array<{ feature: string; count: number }>;
  messageTypeBreakdown: {
    code: number;
    creative: number;
    analytical: number;
    general: number;
  };
  anomalies: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { timeframe = '24h', includeDetails = false } = await request.json();

    console.log(`[Automation] Analyzing conversations from last ${timeframe}...`);

    // Calculate timeframe
    const hours = parseTimeframe(timeframe);
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    // Fetch conversations from Supabase
    const { data: conversations, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .gte('timestamp', startTime)
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          timeframe,
          totalConversations: 0,
          message: 'No conversations found in this timeframe'
        }
      });
    }

    // Analyze conversations
    const analytics = analyzeConversations(conversations, timeframe);

    // Detect anomalies
    const anomalies = detectAnomalies(conversations, analytics);
    analytics.anomalies = anomalies;

    // Log analytics to console
    console.log('[Automation] Analytics:', JSON.stringify(analytics, null, 2));

    // Store analytics snapshot in database (for historical tracking)
    await storeAnalyticsSnapshot(analytics);

    // Check for high-priority alerts
    const alerts = generateAlerts(analytics, anomalies);

    return NextResponse.json({
      success: true,
      analytics,
      alerts,
      processedAt: new Date().toISOString(),
      conversationSample: includeDetails ? conversations.slice(0, 10) : undefined
    });

  } catch (error) {
    console.error('[Automation] Analyze conversations error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze conversations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function parseTimeframe(timeframe: string): number {
  const match = timeframe.match(/^(\d+)([hd])$/);
  if (!match) return 24; // Default to 24 hours

  const value = parseInt(match[1]);
  const unit = match[2];

  return unit === 'h' ? value : value * 24;
}

function analyzeConversations(conversations: any[], timeframe: string): ConversationAnalytics {
  const uniqueUsers = new Set(conversations.map(c => c.user_hash)).size;
  const providerBreakdown: Record<string, number> = {};
  const featureBreakdown: Record<string, number> = {};
  const messageTypes = { code: 0, creative: 0, analytical: 0, general: 0 };

  // Session tracking
  const sessions: Record<string, number> = {};

  conversations.forEach(conv => {
    // Provider breakdown
    providerBreakdown[conv.ai_provider] = (providerBreakdown[conv.ai_provider] || 0) + 1;

    // Feature breakdown
    const feature = conv.metadata?.feature || 'unknown';
    featureBreakdown[feature] = (featureBreakdown[feature] || 0) + 1;

    // Session counting
    sessions[conv.session_id] = (sessions[conv.session_id] || 0) + 1;

    // Message type classification
    const messageType = classifyMessage(conv.user_message);
    messageTypes[messageType]++;
  });

  const sessionLengths = Object.values(sessions);
  const averageConversationLength = sessionLengths.length > 0
    ? sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length
    : 0;

  const topFeatures = Object.entries(featureBreakdown)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    timeframe,
    totalConversations: Object.keys(sessions).length,
    totalMessages: conversations.length,
    uniqueUsers,
    providerBreakdown,
    averageConversationLength: Math.round(averageConversationLength * 10) / 10,
    topFeatures,
    messageTypeBreakdown: messageTypes,
    anomalies: []
  };
}

function classifyMessage(message: string): 'code' | 'creative' | 'analytical' | 'general' {
  const lower = message.toLowerCase();

  const codeKeywords = ['code', 'function', 'programming', 'javascript', 'python', 'typescript', 'react', 'api', 'debug', 'error'];
  const creativeKeywords = ['write', 'story', 'creative', 'blog', 'content', 'marketing', 'copy', 'design'];
  const analyticalKeywords = ['analyze', 'data', 'statistics', 'calculate', 'research', 'explain', 'compare'];

  if (codeKeywords.some(keyword => lower.includes(keyword))) return 'code';
  if (creativeKeywords.some(keyword => lower.includes(keyword))) return 'creative';
  if (analyticalKeywords.some(keyword => lower.includes(keyword))) return 'analytical';
  return 'general';
}

function detectAnomalies(conversations: any[], analytics: ConversationAnalytics): Array<{
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}> {
  const anomalies: Array<{ type: string; description: string; severity: 'low' | 'medium' | 'high' }> = [];

  // Check for high error rates
  const errorConversations = conversations.filter(c =>
    c.ai_response?.toLowerCase().includes('error') ||
    c.ai_response?.toLowerCase().includes('sorry') ||
    c.ai_response?.length < 20
  );

  if (errorConversations.length > conversations.length * 0.1) {
    anomalies.push({
      type: 'high_error_rate',
      description: `${errorConversations.length} conversations (${Math.round(errorConversations.length / conversations.length * 100)}%) had errors or very short responses`,
      severity: 'high'
    });
  }

  // Check for unusual activity spikes
  if (analytics.totalMessages > 100) {
    anomalies.push({
      type: 'high_activity',
      description: `Unusually high activity: ${analytics.totalMessages} messages in ${analytics.timeframe}`,
      severity: 'medium'
    });
  }

  // Check for provider imbalance
  const providerCounts = Object.values(analytics.providerBreakdown);
  const maxProviderUsage = Math.max(...providerCounts);
  const minProviderUsage = Math.min(...providerCounts);

  if (providerCounts.length > 1 && maxProviderUsage > minProviderUsage * 5) {
    anomalies.push({
      type: 'provider_imbalance',
      description: `One provider is being used 5x more than others. Consider load balancing.`,
      severity: 'low'
    });
  }

  return anomalies;
}

async function storeAnalyticsSnapshot(analytics: ConversationAnalytics) {
  try {
    // Store in a dedicated analytics_snapshots table (to be created)
    // For now, just log
    console.log('[Automation] Analytics snapshot stored:', {
      timestamp: new Date().toISOString(),
      summary: {
        conversations: analytics.totalConversations,
        messages: analytics.totalMessages,
        users: analytics.uniqueUsers
      }
    });

    // TODO: Create analytics_snapshots table and insert here
  } catch (error) {
    console.error('[Automation] Failed to store analytics snapshot:', error);
  }
}

function generateAlerts(analytics: ConversationAnalytics, anomalies: any[]): Array<{
  type: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  action?: string;
}> {
  const alerts: Array<{ type: string; message: string; priority: 'low' | 'medium' | 'high'; action?: string }> = [];

  // High anomaly alert
  const highSeverityAnomalies = anomalies.filter(a => a.severity === 'high');
  if (highSeverityAnomalies.length > 0) {
    alerts.push({
      type: 'anomaly_detected',
      message: `${highSeverityAnomalies.length} high-severity anomalies detected`,
      priority: 'high',
      action: 'Review automation dashboard immediately'
    });
  }

  // High engagement alert
  if (analytics.averageConversationLength > 10) {
    alerts.push({
      type: 'high_engagement',
      message: `Users are highly engaged (avg ${analytics.averageConversationLength} messages per conversation)`,
      priority: 'medium',
      action: 'Consider reaching out to highly engaged users for feedback'
    });
  }

  // Provider performance alert
  if (analytics.providerBreakdown['openai'] && analytics.providerBreakdown['claude']) {
    const openaiShare = analytics.providerBreakdown['openai'] / analytics.totalMessages * 100;
    if (openaiShare > 80 || openaiShare < 20) {
      alerts.push({
        type: 'provider_distribution',
        message: `Provider distribution skewed: ${Math.round(openaiShare)}% OpenAI`,
        priority: 'low',
        action: 'Review provider selection algorithm'
      });
    }
  }

  return alerts;
}

export async function GET(request: NextRequest) {
  // Quick analytics endpoint
  return NextResponse.json({
    endpoint: 'POST /api/automation/analyze-conversations',
    description: 'Analyze AI conversation patterns and generate insights',
    parameters: {
      timeframe: 'Time window (e.g., "24h", "7d", "30d")',
      includeDetails: 'Include sample conversations (boolean)'
    },
    example: {
      timeframe: '24h',
      includeDetails: false
    }
  });
}
