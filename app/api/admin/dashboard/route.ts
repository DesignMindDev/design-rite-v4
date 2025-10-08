/**
// Force dynamic rendering (do not pre-render at build time)
export const dynamic = 'force-dynamic';
 * Super Admin Dashboard API
 * Provides stats, user list, and recent activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabaseAuth.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin and admin can access dashboard
    if (session.user.role !== 'super_admin' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch dashboard statistics
    const today = new Date().toISOString().split('T')[0];

    // Total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'deleted');

    // Active users (logged in last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeNow } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', twentyFourHoursAgo)
      .eq('status', 'active');

    // Quotes today (from activity_logs)
    const { count: quotesToday } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'quote_generated')
      .gte('timestamp', today);

    // AI sessions today
    const { count: aiSessionsToday } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'ai_assessment_completed')
      .gte('timestamp', today);

    // Fetch all users (or filter by created_by for regular admins)
    let usersQuery = supabase
      .from('users')
      .select('id, email, full_name, role, company, status, last_login, login_count, created_at')
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    // Regular admins can only see users they created
    if (session.user.role === 'admin') {
      usersQuery = usersQuery.eq('created_by', session.user.id);
    }

    const { data: users, error: usersError } = await usersQuery;

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // Fetch recent activity (last 50 actions)
    let activityQuery = supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        resource_type,
        timestamp,
        success,
        user_id,
        ip_address,
        users:user_id (
          full_name,
          email
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);

    // Regular admins can only see activity from their users
    if (session.user.role === 'admin') {
      const userIds = users?.map(u => u.id) || [];
      if (userIds.length > 0) {
        activityQuery = activityQuery.in('user_id', userIds);
      }
    }

    const { data: activityLogs, error: activityError } = await activityQuery;

    if (activityError) {
      console.error('Error fetching activity:', activityError);
    }

    // Transform activity logs to include user name
    const recentActivity = activityLogs?.map(log => ({
      id: log.id,
      action: log.action,
      resource_type: log.resource_type,
      timestamp: log.timestamp,
      success: log.success,
      user_name: (log.users as any)?.full_name || 'Unknown User',
      user_email: (log.users as any)?.email || '',
      ip_address: log.ip_address
    })) || [];

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeNow: activeNow || 0,
        quotesToday: quotesToday || 0,
        aiSessionsToday: aiSessionsToday || 0
      },
      users: users || [],
      recentActivity
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
