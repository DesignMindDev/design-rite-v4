import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';

interface AIUsageMetric {
  id: string;
  timestamp: string;
  provider: string;
  taskType: 'code' | 'creative' | 'analytical' | 'general';
  requestLength: number;
  responseLength: number;
  responseTime: number;
  context: string;
  success: boolean;
  userSatisfaction?: number; // 1-5 rating
}

export async function POST(request: NextRequest) {
  try {
    const metric: Omit<AIUsageMetric, 'id'> = await request.json();

    // Generate unique ID
    const id = `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullMetric: AIUsageMetric = { id, ...metric };

    // Store metric (for your n8n monster analytics!)
    await storeAIMetric(fullMetric);

    return NextResponse.json({ success: true, metricId: id });

  } catch (error) {
    console.error('AI Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to store analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const provider = searchParams.get('provider');
    const taskType = searchParams.get('taskType');

    const analytics = await getAIAnalytics(timeframe, provider, taskType);

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('AI Analytics retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function storeAIMetric(metric: AIUsageMetric) {
  try {
    const analyticsDir = path.join(process.cwd(), 'data', 'ai-analytics');

    // Ensure directory exists
    if (!fs.existsSync(analyticsDir)) {
      fs.mkdirSync(analyticsDir, { recursive: true });
    }

    // Store by date for efficient querying
    const date = new Date().toISOString().split('T')[0];
    const filePath = path.join(analyticsDir, `${date}.json`);

    let metrics: AIUsageMetric[] = [];
    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath, 'utf8');
      metrics = JSON.parse(existing);
    }

    metrics.push(metric);
    fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));

    console.log(`AI Metric stored: ${metric.provider} ${metric.taskType} - ${metric.responseTime}ms`);

  } catch (error) {
    console.error('Failed to store AI metric:', error);
    // Don't throw - analytics failure shouldn't break the main flow
  }
}

async function getAIAnalytics(timeframe: string, provider?: string | null, taskType?: string | null) {
  try {
    const analyticsDir = path.join(process.cwd(), 'data', 'ai-analytics');

    if (!fs.existsSync(analyticsDir)) {
      return getEmptyAnalytics();
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    // Load metrics from relevant files
    let allMetrics: AIUsageMetric[] = [];
    const files = fs.readdirSync(analyticsDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const fileDate = new Date(file.replace('.json', ''));
      if (fileDate >= startDate && fileDate <= endDate) {
        const filePath = path.join(analyticsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const metrics = JSON.parse(content);
        allMetrics.push(...metrics);
      }
    }

    // Filter by time range
    allMetrics = allMetrics.filter(m => {
      const metricDate = new Date(m.timestamp);
      return metricDate >= startDate && metricDate <= endDate;
    });

    // Apply filters
    if (provider) {
      allMetrics = allMetrics.filter(m => m.provider === provider);
    }
    if (taskType) {
      allMetrics = allMetrics.filter(m => m.taskType === taskType);
    }

    // Calculate analytics
    return calculateAnalytics(allMetrics);

  } catch (error) {
    console.error('Failed to get AI analytics:', error);
    return getEmptyAnalytics();
  }
}

function calculateAnalytics(metrics: AIUsageMetric[]) {
  if (metrics.length === 0) {
    return getEmptyAnalytics();
  }

  // Provider performance
  const providerStats = metrics.reduce((acc, m) => {
    if (!acc[m.provider]) {
      acc[m.provider] = {
        count: 0,
        totalResponseTime: 0,
        successCount: 0,
        satisfactionSum: 0,
        satisfactionCount: 0
      };
    }

    acc[m.provider].count++;
    acc[m.provider].totalResponseTime += m.responseTime;
    if (m.success) acc[m.provider].successCount++;
    if (m.userSatisfaction) {
      acc[m.provider].satisfactionSum += m.userSatisfaction;
      acc[m.provider].satisfactionCount++;
    }

    return acc;
  }, {} as any);

  // Calculate averages and scores
  const providerPerformance = Object.entries(providerStats).map(([provider, stats]: [string, any]) => ({
    provider,
    usage: stats.count,
    avgResponseTime: Math.round(stats.totalResponseTime / stats.count),
    successRate: Math.round((stats.successCount / stats.count) * 100),
    avgSatisfaction: stats.satisfactionCount > 0 ?
      Math.round((stats.satisfactionSum / stats.satisfactionCount) * 10) / 10 : null,
    // Performance score (combines speed, success, satisfaction)
    performanceScore: calculatePerformanceScore(stats)
  }));

  // Task type performance
  const taskStats = metrics.reduce((acc, m) => {
    if (!acc[m.taskType]) {
      acc[m.taskType] = { count: 0, totalResponseTime: 0, successCount: 0 };
    }
    acc[m.taskType].count++;
    acc[m.taskType].totalResponseTime += m.responseTime;
    if (m.success) acc[m.taskType].successCount++;
    return acc;
  }, {} as any);

  const taskPerformance = Object.entries(taskStats).map(([taskType, stats]: [string, any]) => ({
    taskType,
    usage: stats.count,
    avgResponseTime: Math.round(stats.totalResponseTime / stats.count),
    successRate: Math.round((stats.successCount / stats.count) * 100)
  }));

  // Time series data for charts
  const timeSeriesData = generateTimeSeriesData(metrics);

  // Recommendations for optimal provider selection
  const recommendations = generateProviderRecommendations(providerPerformance, taskPerformance);

  return {
    summary: {
      totalRequests: metrics.length,
      avgResponseTime: Math.round(metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length),
      overallSuccessRate: Math.round((metrics.filter(m => m.success).length / metrics.length) * 100),
      uniqueProviders: Object.keys(providerStats).length
    },
    providerPerformance: providerPerformance.sort((a, b) => b.performanceScore - a.performanceScore),
    taskPerformance,
    timeSeriesData,
    recommendations
  };
}

function calculatePerformanceScore(stats: any): number {
  const speedScore = Math.max(0, 100 - (stats.totalResponseTime / stats.count) / 100); // Faster = higher score
  const successScore = (stats.successCount / stats.count) * 100;
  const satisfactionScore = stats.satisfactionCount > 0 ?
    (stats.satisfactionSum / stats.satisfactionCount) * 20 : 50; // Default to 50 if no ratings

  return Math.round((speedScore + successScore + satisfactionScore) / 3);
}

function generateTimeSeriesData(metrics: AIUsageMetric[]) {
  // Group by hour for detailed analysis
  const hourlyData = metrics.reduce((acc, m) => {
    const hour = new Date(m.timestamp).toISOString().slice(0, 13);
    if (!acc[hour]) {
      acc[hour] = { requests: 0, totalResponseTime: 0, errors: 0 };
    }
    acc[hour].requests++;
    acc[hour].totalResponseTime += m.responseTime;
    if (!m.success) acc[hour].errors++;
    return acc;
  }, {} as any);

  return Object.entries(hourlyData).map(([hour, data]: [string, any]) => ({
    timestamp: hour,
    requests: data.requests,
    avgResponseTime: Math.round(data.totalResponseTime / data.requests),
    errorRate: Math.round((data.errors / data.requests) * 100)
  })).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function generateProviderRecommendations(providerPerformance: any[], taskPerformance: any[]) {
  const recommendations = [];

  // Find best provider overall
  const bestProvider = providerPerformance[0];
  if (bestProvider) {
    recommendations.push({
      type: 'overall',
      title: `${bestProvider.provider} is performing best overall`,
      description: `Performance score: ${bestProvider.performanceScore}/100`,
      action: `Consider setting ${bestProvider.provider} as default`
    });
  }

  // Find performance issues
  const slowProviders = providerPerformance.filter(p => p.avgResponseTime > 5000);
  slowProviders.forEach(provider => {
    recommendations.push({
      type: 'warning',
      title: `${provider.provider} response time is slow`,
      description: `Average ${provider.avgResponseTime}ms response time`,
      action: 'Consider investigating or reducing priority'
    });
  });

  // Find underutilized high-performers
  const underutilized = providerPerformance.filter(p =>
    p.performanceScore > 80 && p.usage < providerPerformance[0].usage * 0.3
  );
  underutilized.forEach(provider => {
    recommendations.push({
      type: 'opportunity',
      title: `${provider.provider} is underutilized`,
      description: `High performance (${provider.performanceScore}/100) but low usage`,
      action: 'Consider increasing routing to this provider'
    });
  });

  return recommendations;
}

function getEmptyAnalytics() {
  return {
    summary: {
      totalRequests: 0,
      avgResponseTime: 0,
      overallSuccessRate: 0,
      uniqueProviders: 0
    },
    providerPerformance: [],
    taskPerformance: [],
    timeSeriesData: [],
    recommendations: []
  };
}
