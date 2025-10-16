import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Lead Scoring Automation
 *
 * Analyzes AI conversations to identify and score potential leads based on:
 * - Question quality and specificity
 * - Technical depth
 * - Business intent signals
 * - Engagement level
 * - Product interest indicators
 */

interface LeadScore {
  userHash: string;
  sessionId: string;
  score: number; // 0-100
  tier: 'hot' | 'warm' | 'cold';
  signals: string[];
  conversationSummary: {
    messageCount: number;
    avgMessageLength: number;
    topics: string[];
    lastActivity: string;
  };
  recommendedAction: string;
  notes: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { timeframe = '24h', minScore = 50, includeAllScores = false } = await request.json();

    console.log(`[Automation] Scoring leads from last ${timeframe}...`);

    // Calculate timeframe
    const hours = parseTimeframe(timeframe);
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    // Fetch conversations
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
        leads: [],
        message: 'No conversations found in this timeframe'
      });
    }

    // Group by user/session
    const sessions = groupBySession(conversations);

    // Score each session
    const scoredLeads: LeadScore[] = [];
    for (const [sessionId, sessionConversations] of Object.entries(sessions)) {
      const score = scoreSession(sessionConversations as any[]);
      if (includeAllScores || score.score >= minScore) {
        scoredLeads.push(score);
      }
    }

    // Sort by score (highest first)
    scoredLeads.sort((a, b) => b.score - a.score);

    // Categorize leads
    const hotLeads = scoredLeads.filter(l => l.tier === 'hot');
    const warmLeads = scoredLeads.filter(l => l.tier === 'warm');
    const coldLeads = scoredLeads.filter(l => l.tier === 'cold');

    console.log(`[Automation] Lead scoring complete: ${hotLeads.length} hot, ${warmLeads.length} warm, ${coldLeads.length} cold`);

    // Store lead scores (for historical tracking)
    await storeLeadScores(scoredLeads);

    // Generate notifications for hot leads
    const notifications = generateLeadNotifications(hotLeads);

    return NextResponse.json({
      success: true,
      summary: {
        total: scoredLeads.length,
        hot: hotLeads.length,
        warm: warmLeads.length,
        cold: coldLeads.length,
        averageScore: Math.round(scoredLeads.reduce((sum, l) => sum + l.score, 0) / scoredLeads.length)
      },
      leads: scoredLeads,
      notifications,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Automation] Lead scoring error:', error);
    return NextResponse.json(
      {
        error: 'Failed to score leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function parseTimeframe(timeframe: string): number {
  const match = timeframe.match(/^(\d+)([hd])$/);
  if (!match) return 24;
  const value = parseInt(match[1]);
  const unit = match[2];
  return unit === 'h' ? value : value * 24;
}

function groupBySession(conversations: any[]): Record<string, any[]> {
  const sessions: Record<string, any[]> = {};
  conversations.forEach(conv => {
    const sessionId = conv.session_id;
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }
    sessions[sessionId].push(conv);
  });
  return sessions;
}

function scoreSession(conversations: any[]): LeadScore {
  let score = 0;
  const signals: string[] = [];
  const notes: string[] = [];

  const userHash = conversations[0].user_hash;
  const sessionId = conversations[0].session_id;
  const messageCount = conversations.length;

  // Base score from engagement
  score += Math.min(messageCount * 5, 30); // Up to 30 points for engagement
  if (messageCount >= 5) {
    signals.push('High engagement (5+ messages)');
  }

  // Message length analysis
  const avgMessageLength = conversations.reduce((sum, c) => sum + c.user_message.length, 0) / messageCount;
  if (avgMessageLength > 100) {
    score += 15;
    signals.push('Detailed questions (avg 100+ chars)');
  }

  // Business intent keywords
  const businessKeywords = [
    'pricing', 'cost', 'quote', 'proposal', 'contract', 'purchase', 'buy',
    'team', 'company', 'business', 'enterprise', 'deploy', 'implement',
    'integration', 'security', 'compliance', 'ROI', 'budget'
  ];

  const allMessages = conversations.map(c => c.user_message.toLowerCase()).join(' ');
  const businessMatches = businessKeywords.filter(keyword => allMessages.includes(keyword));

  score += businessMatches.length * 5; // 5 points per business keyword
  if (businessMatches.length > 0) {
    signals.push(`Business intent: ${businessMatches.join(', ')}`);
  }

  // Technical depth (security/compliance questions = serious buyer)
  const technicalKeywords = [
    'security', 'compliance', 'HIPAA', 'FERPA', 'CJIS', 'encryption',
    'authentication', 'audit', 'vulnerability', 'pen test', 'ISO',
    'API', 'integration', 'infrastructure', 'scalability'
  ];

  const technicalMatches = technicalKeywords.filter(keyword => allMessages.includes(keyword));
  score += technicalMatches.length * 7; // 7 points per technical keyword
  if (technicalMatches.length > 0) {
    signals.push(`Technical depth: ${technicalMatches.join(', ')}`);
  }

  // Urgency indicators
  const urgencyKeywords = ['urgent', 'ASAP', 'quickly', 'soon', 'deadline', 'immediately'];
  const urgencyMatches = urgencyKeywords.filter(keyword => allMessages.includes(keyword));
  if (urgencyMatches.length > 0) {
    score += 10;
    signals.push('Urgency indicated');
  }

  // Product-specific interest
  const productFeatures = [
    'AI assessment', 'security estimate', 'spatial studio', 'floor plan',
    'camera placement', 'quote generation', 'proposal', 'BOM'
  ];

  const featureMatches = productFeatures.filter(feature => allMessages.includes(feature.toLowerCase()));
  if (featureMatches.length > 0) {
    score += 10;
    signals.push(`Interested in: ${featureMatches.join(', ')}`);
  }

  // Question quality (questions are a good signal)
  const questionCount = conversations.filter(c => c.user_message.includes('?')).length;
  if (questionCount >= 3) {
    score += 10;
    signals.push(`${questionCount} questions asked`);
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine tier
  let tier: 'hot' | 'warm' | 'cold' = 'cold';
  let recommendedAction = 'Monitor for future activity';

  if (score >= 70) {
    tier = 'hot';
    recommendedAction = 'Reach out immediately with personalized demo offer';
    notes.push('High-value lead - immediate follow-up recommended');
  } else if (score >= 50) {
    tier = 'warm';
    recommendedAction = 'Send relevant case studies or product resources';
    notes.push('Engaged user - nurture with educational content');
  } else {
    notes.push('Low engagement - may need more awareness building');
  }

  // Extract topics
  const topics = extractTopics(conversations);

  return {
    userHash,
    sessionId,
    score,
    tier,
    signals,
    conversationSummary: {
      messageCount,
      avgMessageLength: Math.round(avgMessageLength),
      topics,
      lastActivity: conversations[conversations.length - 1].timestamp
    },
    recommendedAction,
    notes
  };
}

function extractTopics(conversations: any[]): string[] {
  const allText = conversations.map(c => c.user_message.toLowerCase()).join(' ');
  const topics: string[] = [];

  const topicKeywords: Record<string, string[]> = {
    'Security Systems': ['security', 'camera', 'surveillance', 'access control'],
    'Compliance': ['HIPAA', 'FERPA', 'CJIS', 'compliance', 'audit'],
    'AI Tools': ['AI', 'artificial intelligence', 'automation', 'smart'],
    'Pricing': ['price', 'cost', 'quote', 'budget', 'ROI'],
    'Integration': ['integrate', 'API', 'system', 'connect'],
    'Technical': ['technical', 'architecture', 'infrastructure', 'deployment']
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      topics.push(topic);
    }
  }

  return topics.length > 0 ? topics : ['General Inquiry'];
}

async function storeLeadScores(leads: LeadScore[]) {
  try {
    // Log for now, can store in dedicated table later
    console.log(`[Automation] Storing ${leads.length} lead scores...`);

    // TODO: Create lead_scores table and insert here
    /*
    const { error } = await supabase
      .from('lead_scores')
      .insert(leads.map(lead => ({
        user_hash: lead.userHash,
        session_id: lead.sessionId,
        score: lead.score,
        tier: lead.tier,
        signals: lead.signals,
        summary: lead.conversationSummary,
        recommended_action: lead.recommendedAction,
        notes: lead.notes,
        scored_at: new Date().toISOString()
      })));

    if (error) throw error;
    */

  } catch (error) {
    console.error('[Automation] Failed to store lead scores:', error);
  }
}

function generateLeadNotifications(hotLeads: LeadScore[]): Array<{
  type: string;
  message: string;
  lead: LeadScore;
}> {
  return hotLeads.map(lead => ({
    type: 'hot_lead_alert',
    message: `Hot lead detected: ${lead.score} points, ${lead.conversationSummary.messageCount} messages, topics: ${lead.conversationSummary.topics.join(', ')}`,
    lead
  }));
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: 'POST /api/automation/score-leads',
    description: 'Score leads based on AI conversation patterns',
    parameters: {
      timeframe: 'Time window (e.g., "24h", "7d")',
      minScore: 'Minimum score threshold (0-100)',
      includeAllScores: 'Include all leads regardless of score (boolean)'
    },
    scoringCriteria: {
      engagement: 'Message count and conversation length (up to 30 points)',
      businessIntent: 'Pricing, purchasing, deployment keywords (5 points each)',
      technicalDepth: 'Security, compliance, integration keywords (7 points each)',
      urgency: 'ASAP, urgent, deadline keywords (10 points)',
      productInterest: 'Specific feature mentions (10 points)',
      questionQuality: 'Number of questions asked (10 points)'
    },
    tiers: {
      hot: '70-100 points (immediate follow-up)',
      warm: '50-69 points (nurture with content)',
      cold: '0-49 points (monitor)'
    }
  });
}
