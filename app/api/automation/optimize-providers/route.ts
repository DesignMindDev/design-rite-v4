import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * AI Provider Performance Optimizer
 *
 * Analyzes provider performance and automatically adjusts:
 * - Provider priorities
 * - Task routing rules
 * - Failover configurations
 * - Cost optimization
 */

interface ProviderPerformance {
  provider: string;
  totalRequests: number;
  avgResponseLength: number;
  errorRate: number;
  avgMessageLength: number;
  messageTypes: Record<string, number>;
  performanceScore: number; // 0-100
  costEstimate: number;
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { timeframe = '7d', applyOptimizations = false } = await request.json();

    console.log(`[Automation] Analyzing provider performance from last ${timeframe}...`);

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
        message: 'No data available for performance analysis'
      });
    }

    // Analyze each provider
    const providerPerformance = analyzeProviders(conversations);

    // Generate optimization recommendations
    const optimizations = generateOptimizations(providerPerformance);

    // Apply optimizations if requested
    let applied = null;
    if (applyOptimizations) {
      applied = await applyProviderOptimizations(optimizations);
    }

    console.log('[Automation] Provider optimization complete:', JSON.stringify(providerPerformance, null, 2));

    return NextResponse.json({
      success: true,
      performance: providerPerformance,
      optimizations,
      applied,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Automation] Provider optimization error:', error);
    return NextResponse.json(
      {
        error: 'Failed to optimize providers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function parseTimeframe(timeframe: string): number {
  const match = timeframe.match(/^(\d+)([hd])$/);
  if (!match) return 24 * 7; // Default to 7 days
  const value = parseInt(match[1]);
  const unit = match[2];
  return unit === 'h' ? value : value * 24;
}

function analyzeProviders(conversations: any[]): Record<string, ProviderPerformance> {
  const providers: Record<string, any[]> = {};

  // Group by provider
  conversations.forEach(conv => {
    const provider = conv.ai_provider;
    if (!providers[provider]) {
      providers[provider] = [];
    }
    providers[provider].push(conv);
  });

  // Analyze each provider
  const performance: Record<string, ProviderPerformance> = {};

  for (const [provider, convs] of Object.entries(providers)) {
    const totalRequests = convs.length;

    // Calculate avg response length
    const avgResponseLength = convs.reduce((sum, c) => sum + (c.ai_response?.length || 0), 0) / totalRequests;

    // Calculate error rate
    const errors = convs.filter(c =>
      !c.ai_response ||
      c.ai_response.length < 20 ||
      c.ai_response.toLowerCase().includes('error') ||
      c.ai_response.toLowerCase().includes('sorry, i')
    ).length;
    const errorRate = (errors / totalRequests) * 100;

    // Calculate avg message length
    const avgMessageLength = convs.reduce((sum, c) => sum + c.user_message.length, 0) / totalRequests;

    // Message type distribution
    const messageTypes: Record<string, number> = {};
    convs.forEach(c => {
      const type = classifyMessage(c.user_message);
      messageTypes[type] = (messageTypes[type] || 0) + 1;
    });

    // Performance score calculation
    let performanceScore = 100;
    performanceScore -= errorRate * 2; // Penalize errors heavily
    performanceScore -= Math.max(0, avgResponseLength - 1000) / 100; // Penalize overly long responses
    performanceScore = Math.max(0, Math.min(100, performanceScore));

    // Cost estimate (rough approximation)
    const costPerRequest = provider === 'openai' ? 0.002 : 0.003; // GPT-4 vs Claude pricing
    const costEstimate = totalRequests * costPerRequest;

    // Generate recommendations
    const recommendations: string[] = [];

    if (errorRate > 5) {
      recommendations.push(`High error rate (${errorRate.toFixed(1)}%) - consider fallback provider`);
    }

    if (avgResponseLength > 2000) {
      recommendations.push('Responses are very long - may need prompt optimization');
    }

    if (messageTypes['code'] > totalRequests * 0.5) {
      recommendations.push('Primarily code tasks - Claude may perform better');
    }

    if (messageTypes['creative'] > totalRequests * 0.5) {
      recommendations.push('Primarily creative tasks - OpenAI may perform better');
    }

    if (performanceScore < 80) {
      recommendations.push(`Performance score below 80 - review ${provider} configuration`);
    }

    performance[provider] = {
      provider,
      totalRequests,
      avgResponseLength: Math.round(avgResponseLength),
      errorRate: Math.round(errorRate * 10) / 10,
      avgMessageLength: Math.round(avgMessageLength),
      messageTypes,
      performanceScore: Math.round(performanceScore),
      costEstimate: Math.round(costEstimate * 100) / 100,
      recommendations
    };
  }

  return performance;
}

function classifyMessage(message: string): string {
  const lower = message.toLowerCase();
  if (['code', 'function', 'programming', 'javascript', 'python'].some(k => lower.includes(k))) {
    return 'code';
  }
  if (['write', 'story', 'creative', 'blog', 'content'].some(k => lower.includes(k))) {
    return 'creative';
  }
  if (['analyze', 'data', 'statistics', 'calculate'].some(k => lower.includes(k))) {
    return 'analytical';
  }
  return 'general';
}

function generateOptimizations(performance: Record<string, ProviderPerformance>): Array<{
  type: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
}> {
  const optimizations: Array<{ type: string; description: string; impact: 'high' | 'medium' | 'low'; action: string }> = [];

  const providers = Object.values(performance);

  // Compare providers
  if (providers.length >= 2) {
    const sorted = providers.sort((a, b) => b.performanceScore - a.performanceScore);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    if (best.performanceScore - worst.performanceScore > 20) {
      optimizations.push({
        type: 'provider_priority',
        description: `${best.provider} outperforming ${worst.provider} by ${(best.performanceScore - worst.performanceScore).toFixed(1)} points`,
        impact: 'high',
        action: `Increase priority for ${best.provider} in routing logic`
      });
    }
  }

  // Cost optimization
  const totalCost = providers.reduce((sum, p) => sum + p.costEstimate, 0);
  if (totalCost > 10) {
    optimizations.push({
      type: 'cost_optimization',
      description: `Total cost ${totalCost.toFixed(2)} in analysis period`,
      impact: 'medium',
      action: 'Consider caching common responses or using cheaper models for simple queries'
    });
  }

  // Error rate optimization
  providers.forEach(p => {
    if (p.errorRate > 5) {
      optimizations.push({
        type: 'error_reduction',
        description: `${p.provider} has ${p.errorRate.toFixed(1)}% error rate`,
        impact: 'high',
        action: `Add retry logic with fallback to alternate provider for ${p.provider}`
      });
    }
  });

  // Task-specific routing
  providers.forEach(p => {
    const { messageTypes } = p;
    const dominantType = Object.entries(messageTypes).sort((a, b) => b[1] - a[1])[0];

    if (dominantType && dominantType[1] > p.totalRequests * 0.6) {
      optimizations.push({
        type: 'task_routing',
        description: `${p.provider} handling mostly ${dominantType[0]} tasks (${((dominantType[1] / p.totalRequests) * 100).toFixed(1)}%)`,
        impact: 'low',
        action: `Optimize ${p.provider} for ${dominantType[0]} tasks or route to specialist provider`
      });
    }
  });

  return optimizations;
}

async function applyProviderOptimizations(optimizations: any[]): Promise<{
  success: boolean;
  applied: string[];
  errors: string[];
}> {
  const applied: string[] = [];
  const errors: string[] = [];

  try {
    // Load current provider configuration
    const providersPath = path.join(process.cwd(), 'data', 'ai-providers.json');
    const providersData = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

    // Apply high-impact optimizations
    for (const opt of optimizations.filter(o => o.impact === 'high')) {
      try {
        if (opt.type === 'provider_priority') {
          // Adjust provider priorities
          const providerMatch = opt.action.match(/Increase priority for (\w+)/);
          if (providerMatch) {
            const providerName = providerMatch[1];
            const provider = providersData.providers.find((p: any) =>
              p.provider_type === providerName || p.name.toLowerCase().includes(providerName.toLowerCase())
            );

            if (provider && provider.priority > 1) {
              provider.priority -= 1; // Lower number = higher priority
              applied.push(`Increased priority for ${providerName} (now priority ${provider.priority})`);
            }
          }
        }
      } catch (error) {
        errors.push(`Failed to apply ${opt.type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Save updated configuration
    if (applied.length > 0) {
      fs.writeFileSync(providersPath, JSON.stringify(providersData, null, 2));
      console.log('[Automation] Provider configuration updated:', applied);
    }

    return {
      success: true,
      applied,
      errors
    };

  } catch (error) {
    console.error('[Automation] Failed to apply optimizations:', error);
    return {
      success: false,
      applied,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: 'POST /api/automation/optimize-providers',
    description: 'Analyze and optimize AI provider performance',
    parameters: {
      timeframe: 'Time window for analysis (e.g., "7d", "30d")',
      applyOptimizations: 'Automatically apply high-impact optimizations (boolean)'
    },
    metrics: {
      performanceScore: '0-100 score based on error rate and response quality',
      errorRate: 'Percentage of failed or poor responses',
      costEstimate: 'Estimated API costs in USD',
      messageTypes: 'Distribution of task types per provider'
    },
    optimizations: {
      provider_priority: 'Adjust routing priorities based on performance',
      error_reduction: 'Add retry/fallback logic for high-error providers',
      cost_optimization: 'Reduce costs via caching or cheaper models',
      task_routing: 'Route specific task types to optimal providers'
    }
  });
}
