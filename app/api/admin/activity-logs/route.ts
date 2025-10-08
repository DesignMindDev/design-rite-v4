import { NextRequest, NextResponse } from 'next/server';
// Force dynamic rendering (do not pre-render at build time)
export const dynamic = 'force-dynamic';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get requesting user's role
    const { data: requestingUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!requestingUser || !['super_admin', 'admin'].includes(requestingUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if user has permission to view activity
    if (requestingUser.role === 'admin') {
      const { data: permissions } = await supabase
        .from('admin_permissions')
        .select('can_view_activity')
        .eq('user_id', session.user.id)
        .single();

      if (!permissions?.can_view_activity) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    // Fetch admin access logs with user details
    const { data: logs, error: logsError } = await supabase
      .from('admin_access_logs')
      .select(`
        id,
        timestamp,
        user_id,
        path_accessed,
        permission_checked,
        access_allowed,
        ip_address,
        user_agent,
        method,
        details
      `)
      .order('timestamp', { ascending: false })
      .limit(500);

    if (logsError) {
      console.error('Error fetching logs:', logsError);
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }

    // Enrich logs with user information
    const enrichedLogs = await Promise.all(
      (logs || []).map(async (log) => {
        const { data: user } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', log.user_id)
          .single();

        return {
          ...log,
          user_email: user?.email || 'Unknown',
          user_name: user?.full_name || 'Unknown User',
        };
      })
    );

    return NextResponse.json({
      logs: enrichedLogs,
      total: enrichedLogs.length,
    });

  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs', details: error.message },
      { status: 500 }
    );
  }
}
