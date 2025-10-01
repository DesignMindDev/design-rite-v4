/**
 * Data Export API
 * Allows admins to export users, activity logs, and database backups
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin and admin can export data
    if (session.user.role !== 'super_admin' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json({ error: 'Export type is required' }, { status: 400 });
    }

    let data: any = null;
    let filename = '';
    let csvContent = '';

    switch (type) {
      case 'users':
        // Export users as CSV
        const { data: users } = await supabase
          .from('users')
          .select('id, email, full_name, role, company, phone, status, created_at, last_login, login_count')
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });

        if (users) {
          // Convert to CSV
          const headers = ['ID', 'Email', 'Full Name', 'Role', 'Company', 'Phone', 'Status', 'Created At', 'Last Login', 'Login Count'];
          csvContent = headers.join(',') + '\n';

          users.forEach(user => {
            const row = [
              user.id,
              user.email,
              user.full_name || '',
              user.role,
              user.company || '',
              user.phone || '',
              user.status,
              user.created_at,
              user.last_login || '',
              user.login_count
            ];
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
          });

          filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        }
        break;

      case 'activity':
        // Export activity logs as CSV (last 90 days)
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

        const { data: activityLogs } = await supabase
          .from('activity_logs')
          .select(`
            id,
            action,
            resource_type,
            resource_id,
            timestamp,
            success,
            ip_address,
            users:user_id (
              email,
              full_name
            )
          `)
          .gte('timestamp', ninetyDaysAgo)
          .order('timestamp', { ascending: false });

        if (activityLogs) {
          const headers = ['ID', 'User Email', 'User Name', 'Action', 'Resource Type', 'Resource ID', 'Timestamp', 'Success', 'IP Address'];
          csvContent = headers.join(',') + '\n';

          activityLogs.forEach(log => {
            const user = log.users as any;
            const row = [
              log.id,
              user?.email || '',
              user?.full_name || '',
              log.action,
              log.resource_type || '',
              log.resource_id || '',
              log.timestamp,
              log.success,
              log.ip_address || ''
            ];
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
          });

          filename = `activity_logs_export_${new Date().toISOString().split('T')[0]}.csv`;
        }
        break;

      case 'database':
        // Export full database backup as JSON (super admin only)
        if (session.user.role !== 'super_admin') {
          return NextResponse.json({ error: 'Only super admins can export database backups' }, { status: 403 });
        }

        const { data: allUsers } = await supabase.from('users').select('*');
        const { data: allActivity } = await supabase.from('activity_logs').select('*').limit(10000);
        const { data: allPermissions } = await supabase.from('permissions').select('*');
        const { data: allSessions } = await supabase.from('user_sessions').select('*');
        const { data: allUsage } = await supabase.from('usage_tracking').select('*');

        data = {
          export_date: new Date().toISOString(),
          exported_by: session.user.email,
          data: {
            users: allUsers,
            activity_logs: allActivity,
            permissions: allPermissions,
            user_sessions: allSessions,
            usage_tracking: allUsage
          }
        };

        filename = `database_backup_${new Date().toISOString().split('T')[0]}.json`;

        // Log the database export
        await supabase
          .from('activity_logs')
          .insert({
            user_id: session.user.id,
            action: 'database_exported',
            resource_type: 'database',
            success: true,
            timestamp: new Date().toISOString()
          });

        return new NextResponse(JSON.stringify(data, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    // Log the export activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action: 'data_exported',
        resource_type: type,
        details: { export_type: type },
        success: true,
        timestamp: new Date().toISOString()
      });

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
