import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AttributionData {
  channel: string;
  firstTouch: number;
  lastTouch: number;
  assisted: number;
  conversions: number;
}

interface CohortData {
  cohort: string;
  leads: number;
  trials: number;
  customers: number;
  retentionRate: number;
}

interface LifecycleStage {
  stage: string;
  count: number;
  avgDays: number;
  conversionRate: number;
}

interface UserJourney {
  userId: string;
  email: string;
  touchpoints: Array<{
    timestamp: string;
    channel: string;
    action: string;
    page: string;
  }>;
  firstTouch: string;
  lastTouch: string;
  totalTouchpoints: number;
  daysInJourney: number;
  converted: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '90d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '180d':
        startDate.setDate(now.getDate() - 180);
        break;
      case '365d':
        startDate.setDate(now.getDate() - 365);
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

    // Calculate attribution data
    const attributionData = calculateAttribution(leadsData, activitiesData);

    // Calculate cohort analysis
    const cohortData = calculateCohorts(leadsData, timeRange);

    // Calculate lifecycle stages
    const lifecycleStages = calculateLifecycleStages(leadsData);

    // Get sample user journeys
    const sampleJourneys = getSampleJourneys(leadsData, activitiesData);

    // Calculate retention curve
    const retentionCurve = calculateRetentionCurve(leadsData);

    // Calculate average journey length
    const avgJourneyMetrics = calculateAvgJourneyMetrics(leadsData);

    return NextResponse.json({
      attributionData,
      cohortData,
      lifecycleStages,
      sampleJourneys,
      retentionCurve,
      avgJourneyMetrics
    });

  } catch (error) {
    console.error('User journey analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function calculateAttribution(leads: any[], activities: any[]): AttributionData[] {
  const channelStats: Record<string, {
    firstTouch: number;
    lastTouch: number;
    assisted: number;
    conversions: number;
  }> = {};

  leads.forEach(lead => {
    const leadActivities = activities.filter(a =>
      a.user_hash === lead.email || a.session_id?.includes(lead.email)
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    if (leadActivities.length === 0) return;

    // First touch
    const firstChannel = lead.lead_source || 'Direct';
    if (!channelStats[firstChannel]) {
      channelStats[firstChannel] = { firstTouch: 0, lastTouch: 0, assisted: 0, conversions: 0 };
    }
    channelStats[firstChannel].firstTouch++;

    // Last touch
    const lastChannel = lead.lead_source || 'Direct';
    channelStats[lastChannel].lastTouch++;

    // Assisted touches (middle touchpoints)
    const middleChannels = new Set(leadActivities.slice(1, -1).map(a => a.referrer || 'Direct'));
    middleChannels.forEach(channel => {
      if (!channelStats[channel]) {
        channelStats[channel] = { firstTouch: 0, lastTouch: 0, assisted: 0, conversions: 0 };
      }
      channelStats[channel].assisted++;
    });

    // Conversions
    if (lead.converted_to_customer) {
      channelStats[lastChannel].conversions++;
    }
  });

  return Object.entries(channelStats)
    .map(([channel, stats]) => ({
      channel,
      ...stats
    }))
    .sort((a, b) => b.firstTouch - a.firstTouch);
}

function calculateCohorts(leads: any[], timeRange: string): CohortData[] {
  const cohortInterval = timeRange === '30d' || timeRange === '90d' ? 'week' : 'month';
  const cohorts: Record<string, {
    leads: number;
    trials: number;
    customers: number;
  }> = {};

  leads.forEach(lead => {
    const date = new Date(lead.created_at);
    let cohortKey: string;

    if (cohortInterval === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      cohortKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    } else {
      cohortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!cohorts[cohortKey]) {
      cohorts[cohortKey] = { leads: 0, trials: 0, customers: 0 };
    }

    cohorts[cohortKey].leads++;
    if (lead.trial_started) cohorts[cohortKey].trials++;
    if (lead.converted_to_customer) cohorts[cohortKey].customers++;
  });

  return Object.entries(cohorts)
    .map(([cohort, data]) => ({
      cohort,
      ...data,
      retentionRate: data.leads > 0 ? Math.round((data.customers / data.leads) * 100) : 0
    }))
    .sort((a, b) => a.cohort.localeCompare(b.cohort));
}

function calculateLifecycleStages(leads: any[]): LifecycleStage[] {
  const stages = [
    { stage: 'New Lead', filter: (l: any) => l.lead_status === 'new' },
    { stage: 'Engaged', filter: (l: any) => l.page_views > 1 && l.lead_status !== 'new' },
    { stage: 'Qualified', filter: (l: any) => l.lead_status === 'qualified' || l.lead_score >= 70 },
    { stage: 'Demo', filter: (l: any) => l.demo_booked || l.demo_completed },
    { stage: 'Trial', filter: (l: any) => l.trial_started },
    { stage: 'Customer', filter: (l: any) => l.converted_to_customer }
  ];

  const total = leads.length;

  return stages.map((stage, index) => {
    const stageLeads = leads.filter(stage.filter);
    const count = stageLeads.length;

    // Calculate average days in stage
    const avgDays = stageLeads.length > 0
      ? Math.round(
          stageLeads.reduce((sum, lead) => {
            const created = new Date(lead.created_at).getTime();
            const lastActivity = new Date(lead.last_activity_at).getTime();
            return sum + (lastActivity - created) / (1000 * 60 * 60 * 24);
          }, 0) / stageLeads.length
        )
      : 0;

    // Conversion rate to next stage
    const nextStageLeads = index < stages.length - 1
      ? leads.filter(stages[index + 1].filter).length
      : count;
    const conversionRate = count > 0 ? Math.round((nextStageLeads / count) * 100) : 0;

    return {
      stage: stage.stage,
      count,
      avgDays,
      conversionRate
    };
  });
}

function getSampleJourneys(leads: any[], activities: any[]): UserJourney[] {
  // Get converted customers + some high-value leads
  const interestingLeads = [
    ...leads.filter(l => l.converted_to_customer).slice(0, 5),
    ...leads.filter(l => !l.converted_to_customer && l.lead_score >= 80).slice(0, 3)
  ];

  return interestingLeads.map(lead => {
    const userActivities = activities
      .filter(a => a.user_hash === lead.email || a.session_id?.includes(lead.email))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const touchpoints = userActivities.map(a => ({
      timestamp: a.created_at,
      channel: a.referrer || 'Direct',
      action: a.event_type || 'page_view',
      page: a.page_url || a.page_title || 'Unknown'
    }));

    const firstTouch = userActivities[0]?.created_at || lead.created_at;
    const lastTouch = lead.last_activity_at || lead.created_at;
    const daysInJourney = Math.round(
      (new Date(lastTouch).getTime() - new Date(firstTouch).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      userId: lead.id,
      email: lead.email,
      touchpoints: touchpoints.slice(0, 20), // Limit to 20 touchpoints
      firstTouch,
      lastTouch,
      totalTouchpoints: userActivities.length,
      daysInJourney,
      converted: lead.converted_to_customer
    };
  }).filter(j => j.touchpoints.length > 0);
}

function calculateRetentionCurve(leads: any[]): Array<{ day: number; retained: number; percentage: number }> {
  const convertedLeads = leads.filter(l => l.converted_to_customer);
  if (convertedLeads.length === 0) return [];

  const days = [1, 7, 14, 30, 60, 90];
  const now = new Date();

  return days.map(day => {
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - day);

    const eligibleLeads = convertedLeads.filter(l =>
      new Date(l.created_at) <= cutoffDate
    );

    const retainedLeads = eligibleLeads.filter(l => {
      const lastActivity = new Date(l.last_activity_at);
      const daysSinceCreation = (lastActivity.getTime() - new Date(l.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreation >= day;
    });

    return {
      day,
      retained: retainedLeads.length,
      percentage: eligibleLeads.length > 0 ? Math.round((retainedLeads.length / eligibleLeads.length) * 100) : 0
    };
  });
}

function calculateAvgJourneyMetrics(leads: any[]): {
  avgDaysToConversion: number;
  avgTouchpointsToConversion: number;
  avgLeadScore: number;
  totalLeads: number;
  convertedLeads: number;
  overallConversionRate: number;
} {
  const convertedLeads = leads.filter(l => l.converted_to_customer);
  const total = leads.length;
  const converted = convertedLeads.length;

  const avgDaysToConversion = converted > 0
    ? Math.round(
        convertedLeads.reduce((sum, lead) => {
          const days = (new Date(lead.last_activity_at).getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / converted
      )
    : 0;

  const avgTouchpointsToConversion = converted > 0
    ? Math.round(convertedLeads.reduce((sum, l) => sum + l.page_views, 0) / converted)
    : 0;

  const avgLeadScore = total > 0
    ? Math.round(leads.reduce((sum, l) => sum + (l.lead_score || 0), 0) / total)
    : 0;

  return {
    avgDaysToConversion,
    avgTouchpointsToConversion,
    avgLeadScore,
    totalLeads: total,
    convertedLeads: converted,
    overallConversionRate: total > 0 ? Math.round((converted / total) * 100) : 0
  };
}
