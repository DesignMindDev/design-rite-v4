// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { checkUsageLimit, getUserTier, getCurrentUsage, getLimitsForTier } from '@/lib/usage-limits';
import { handleAPIError, AuthErrors, withErrorHandling } from '@/lib/api-error-handler';

export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw AuthErrors.UNAUTHORIZED;
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') as 'assessment' | 'project' | 'storage' || 'assessment';

    const result = await checkUsageLimit(session.user.id, action);

    return NextResponse.json(result);
  }, 'Usage Check - GET');
}

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw AuthErrors.UNAUTHORIZED;
    }

    // Get complete usage stats for dashboard
    const tier = await getUserTier(session.user.id);
    const limits = getLimitsForTier(tier);
    const usage = await getCurrentUsage(session.user.id);

    return NextResponse.json({
      tier,
      limits,
      usage,
      percentages: {
        assessments: limits.assessments_per_month === -1 ? 0 : (usage.assessments_used / limits.assessments_per_month) * 100,
        projects: limits.projects_per_month === -1 ? 0 : (usage.projects_created / limits.projects_per_month) * 100,
        storage: limits.storage_gb === -1 ? 0 : (usage.storage_used_gb / limits.storage_gb) * 100
      }
    });
  }, 'Usage Check - POST');
}
