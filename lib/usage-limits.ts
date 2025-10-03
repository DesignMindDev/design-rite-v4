import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface UsageLimits {
  assessments_per_month: number; // -1 = unlimited
  projects_per_month: number;
  storage_gb: number;
}

export interface UsageData {
  assessments_used: number;
  projects_created: number;
  storage_used_gb: number;
}

const TIER_LIMITS: Record<string, UsageLimits> = {
  trial: {
    assessments_per_month: 3,
    projects_per_month: 3,
    storage_gb: 1
  },
  starter: {
    assessments_per_month: 25,
    projects_per_month: 50,
    storage_gb: 5
  },
  professional: {
    assessments_per_month: -1, // Unlimited
    projects_per_month: -1,
    storage_gb: 100
  },
  enterprise: {
    assessments_per_month: -1,
    projects_per_month: -1,
    storage_gb: -1 // Unlimited
  }
};

/**
 * Get usage limits for a subscription tier
 */
export function getLimitsForTier(tier: string): UsageLimits {
  return TIER_LIMITS[tier] || TIER_LIMITS.trial;
}

/**
 * Get current usage for a user this month
 */
export async function getCurrentUsage(userId: string): Promise<UsageData> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Count assessments this month from ai_sessions table
  const { count: assessmentCount } = await supabase
    .from('ai_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  // Count projects (TODO: implement when projects table exists)
  const projectsCreated = 0;

  // Calculate storage (TODO: implement when file storage is tracked)
  const storageUsedGb = 0;

  return {
    assessments_used: assessmentCount || 0,
    projects_created: projectsCreated,
    storage_used_gb: storageUsedGb
  };
}

/**
 * Get user's subscription tier
 */
export async function getUserTier(userId: string): Promise<string> {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();

  return subscription?.tier || 'trial';
}

/**
 * Check if user can perform an action (assessment, project, etc)
 */
export async function checkUsageLimit(
  userId: string,
  action: 'assessment' | 'project' | 'storage'
): Promise<{ allowed: boolean; reason?: string; usage?: UsageData; limits?: UsageLimits }> {
  try {
    const tier = await getUserTier(userId);
    const limits = getLimitsForTier(tier);
    const usage = await getCurrentUsage(userId);

    let allowed = true;
    let reason: string | undefined;

    switch (action) {
      case 'assessment':
        if (limits.assessments_per_month !== -1 && usage.assessments_used >= limits.assessments_per_month) {
          allowed = false;
          reason = `Monthly assessment limit reached (${limits.assessments_per_month}). Upgrade for unlimited access.`;
        }
        break;

      case 'project':
        if (limits.projects_per_month !== -1 && usage.projects_created >= limits.projects_per_month) {
          allowed = false;
          reason = `Monthly project limit reached (${limits.projects_per_month}). Upgrade for more projects.`;
        }
        break;

      case 'storage':
        if (limits.storage_gb !== -1 && usage.storage_used_gb >= limits.storage_gb) {
          allowed = false;
          reason = `Storage limit reached (${limits.storage_gb}GB). Upgrade for more storage.`;
        }
        break;
    }

    return { allowed, reason, usage, limits };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    // On error, allow the action but log it
    return { allowed: true };
  }
}

/**
 * Track an assessment usage
 */
export async function trackAssessmentUsage(userId: string, assessmentType: string): Promise<void> {
  try {
    await supabase.from('ai_sessions').insert({
      user_id: userId,
      tool: assessmentType,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking assessment usage:', error);
  }
}

/**
 * Get usage percentage for display
 */
export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  return Math.min((used / limit) * 100, 100);
}

/**
 * Check if user should see upgrade prompt
 */
export function shouldShowUpgradePrompt(usage: UsageData, limits: UsageLimits): boolean {
  // Show prompt if user is at 80% of any limit
  if (limits.assessments_per_month !== -1) {
    const assessmentPercent = (usage.assessments_used / limits.assessments_per_month) * 100;
    if (assessmentPercent >= 80) return true;
  }

  if (limits.projects_per_month !== -1) {
    const projectPercent = (usage.projects_created / limits.projects_per_month) * 100;
    if (projectPercent >= 80) return true;
  }

  return false;
}
