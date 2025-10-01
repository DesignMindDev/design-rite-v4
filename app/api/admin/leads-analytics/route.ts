import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
  dropoff: number;
}

interface LeadSourcePerformance {
  source: string;
  leads: number;
  avgScore: number;
  conversionRate: number;
  customers: number;
}

interface JourneyMetrics {
  avgTimeToConversion: number;
  avgPageViewsToConversion: number;
  avgSessionsToConversion: number;
  mostCommonFirstPage: string;
  mostCommonConversionPath: string[];
}

interface TimeSeriesData {
  date: string;
  newLeads: number;
  qualifiedLeads: number;
  trials: number;
  conversions: number;
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

    // Fetch leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    // Fetch web activities
    const { data: activities, error: activitiesError } = await supabase
      .from('web_activity_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
    }

    const leadsData = (leads || []) as any[];
    const activitiesData = (activities || []) as any[];

    // Calculate conversion funnel
    const conversionFunnel = calculateConversionFunnel(leadsData);

    // Calculate lead source performance
    const leadSourcePerformance = calculateLeadSourcePerformance(leadsData);

    // Calculate journey metrics
    const journeyMetrics = calculateJourneyMetrics(leadsData, activitiesData);

    // Generate time series data
    const timeSeriesData = generateTimeSeriesData(leadsData, timeRange);

    // Get top performing pages
    const topPages = getTopPages(activitiesData);

    // Get conversion paths
    const conversionPaths = getConversionPaths(leadsData, activitiesData);

    return NextResponse.json({
      conversionFunnel,
      leadSourcePerformance,
      journeyMetrics,
      timeSeriesData,
      topPages,
      conversionPaths
    });

  } catch (error) {
    console.error('Leads analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateConversionFunnel(leads: any[]): ConversionFunnelData[] {
  const total = leads.length;

  const stages = [
    { stage: 'New Lead', count: total },
    { stage: 'Engaged (Page Views)', count: leads.filter(l => l.page_views > 1).length },
    { stage: 'Used Tools', count: leads.filter(l => l.used_quick_estimate || l.used_ai_assessment).length },
    { stage: 'Demo Booked', count: leads.filter(l => l.demo_booked).length },
    { stage: 'Demo Completed', count: leads.filter(l => l.demo_completed).length },
    { stage: 'Trial Started', count: leads.filter(l => l.trial_started).length },
    { stage: 'Converted', count: leads.filter(l => l.converted_to_customer).length }
  ];

  return stages.map((stage, index) => {
    const percentage = total > 0 ? Math.round((stage.count / total) * 100) : 0;
    const dropoff = index > 0 ? stages[index - 1].count - stage.count : 0;
    return {
      ...stage,
      percentage,
      dropoff
    };
  });
}

function calculateLeadSourcePerformance(leads: any[]): LeadSourcePerformance[] {
  const sources: Record<string, {
    leads: number;
    totalScore: number;
    customers: number;
  }> = {};

  leads.forEach(lead => {
    const source = lead.lead_source || 'Unknown';
    if (!sources[source]) {
      sources[source] = {
        leads: 0,
        totalScore: 0,
        customers: 0
      };
    }
    sources[source].leads++;
    sources[source].totalScore += lead.lead_score || 0;
    if (lead.converted_to_customer) {
      sources[source].customers++;
    }
  });

  return Object.entries(sources)
    .map(([source, data]) => ({
      source,
      leads: data.leads,
      avgScore: Math.round(data.totalScore / data.leads),
      conversionRate: Math.round((data.customers / data.leads) * 100),
      customers: data.customers
    }))
    .sort((a, b) => b.leads - a.leads);
}

function calculateJourneyMetrics(leads: any[], activities: any[]): JourneyMetrics {
  // Calculate average time to conversion
  const convertedLeads = leads.filter(l => l.converted_to_customer);
  let avgTimeToConversion = 0;
  if (convertedLeads.length > 0) {
    const totalTime = convertedLeads.reduce((sum, lead) => {
      const firstVisit = new Date(lead.first_visit_at || lead.created_at).getTime();
      const lastActivity = new Date(lead.last_activity_at).getTime();
      return sum + (lastActivity - firstVisit);
    }, 0);
    avgTimeToConversion = Math.round(totalTime / convertedLeads.length / (1000 * 60 * 60 * 24)); // Days
  }

  // Average page views to conversion
  const avgPageViewsToConversion = convertedLeads.length > 0
    ? Math.round(convertedLeads.reduce((sum, l) => sum + l.page_views, 0) / convertedLeads.length)
    : 0;

  // Average sessions to conversion
  const avgSessionsToConversion = convertedLeads.length > 0
    ? Math.round(convertedLeads.reduce((sum, l) => sum + l.session_count, 0) / convertedLeads.length)
    : 0;

  // Most common first page
  const firstPages: Record<string, number> = {};
  activities
    .filter(a => a.event_type === 'page_view')
    .forEach(activity => {
      const url = activity.page_url || 'Unknown';
      firstPages[url] = (firstPages[url] || 0) + 1;
    });

  const mostCommonFirstPage = Object.entries(firstPages)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  // Most common conversion path (simplified)
  const conversionPath = [
    'Homepage',
    'Security Estimate',
    'AI Assessment',
    'Demo Booking',
    'Trial',
    'Customer'
  ];

  return {
    avgTimeToConversion,
    avgPageViewsToConversion,
    avgSessionsToConversion,
    mostCommonFirstPage,
    mostCommonConversionPath: conversionPath
  };
}

function generateTimeSeriesData(leads: any[], timeRange: string): TimeSeriesData[] {
  const dataPoints: Record<string, {
    newLeads: number;
    qualifiedLeads: number;
    trials: number;
    conversions: number;
  }> = {};

  // Determine date format based on time range
  const dateFormat = timeRange === '24h' ? 'hour' : 'day';

  leads.forEach(lead => {
    const date = new Date(lead.created_at);
    let key: string;

    if (dateFormat === 'hour') {
      key = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
    } else {
      key = `${date.getMonth() + 1}/${date.getDate()}`;
    }

    if (!dataPoints[key]) {
      dataPoints[key] = {
        newLeads: 0,
        qualifiedLeads: 0,
        trials: 0,
        conversions: 0
      };
    }

    dataPoints[key].newLeads++;
    if (lead.lead_status === 'qualified' || lead.lead_score >= 70) {
      dataPoints[key].qualifiedLeads++;
    }
    if (lead.trial_started) {
      dataPoints[key].trials++;
    }
    if (lead.converted_to_customer) {
      dataPoints[key].conversions++;
    }
  });

  return Object.entries(dataPoints)
    .map(([date, data]) => ({
      date,
      ...data
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
}

function getTopPages(activities: any[]): Array<{ page: string; views: number; uniqueVisitors: number }> {
  const pageViews = activities.filter(a => a.event_type === 'page_view');

  const pageStats: Record<string, { views: number; visitors: Set<string> }> = {};

  pageViews.forEach(activity => {
    const page = activity.page_url || activity.page_title || 'Unknown';
    if (!pageStats[page]) {
      pageStats[page] = {
        views: 0,
        visitors: new Set()
      };
    }
    pageStats[page].views++;
    if (activity.user_hash) {
      pageStats[page].visitors.add(activity.user_hash);
    }
  });

  return Object.entries(pageStats)
    .map(([page, stats]) => ({
      page,
      views: stats.views,
      uniqueVisitors: stats.visitors.size
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

function getConversionPaths(leads: any[], activities: any[]): Array<{
  path: string[];
  leads: number;
  conversions: number;
  conversionRate: number;
}> {
  // Group activities by user
  const userActivities: Record<string, any[]> = {};
  activities.forEach(activity => {
    const userId = activity.user_hash || activity.session_id;
    if (!userId) return;

    if (!userActivities[userId]) {
      userActivities[userId] = [];
    }
    userActivities[userId].push(activity);
  });

  // Analyze paths
  const paths: Record<string, { leads: number; conversions: number }> = {};

  Object.entries(userActivities).forEach(([userId, userActivitiesArray]) => {
    // Get key touchpoints
    const touchpoints: string[] = [];

    const hasQuickEstimate = userActivitiesArray.some(a => a.tool_name === 'quick_estimate');
    const hasAIAssessment = userActivitiesArray.some(a => a.tool_name === 'ai_assessment');
    const hasDemo = userActivitiesArray.some(a => a.event_type === 'demo_booked');
    const hasTrial = userActivitiesArray.some(a => a.event_action === 'trial_started');

    if (hasQuickEstimate) touchpoints.push('Quick Estimate');
    if (hasAIAssessment) touchpoints.push('AI Assessment');
    if (hasDemo) touchpoints.push('Demo');
    if (hasTrial) touchpoints.push('Trial');

    if (touchpoints.length > 0) {
      const pathKey = touchpoints.join(' → ');
      if (!paths[pathKey]) {
        paths[pathKey] = { leads: 0, conversions: 0 };
      }
      paths[pathKey].leads++;

      // Check if converted (match lead by email/hash)
      const lead = leads.find(l => l.email === userId || l.id === userId);
      if (lead?.converted_to_customer) {
        paths[pathKey].conversions++;
      }
    }
  });

  return Object.entries(paths)
    .map(([path, data]) => ({
      path: path.split(' → '),
      leads: data.leads,
      conversions: data.conversions,
      conversionRate: Math.round((data.conversions / data.leads) * 100)
    }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 10);
}
