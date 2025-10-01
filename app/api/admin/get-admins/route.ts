import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all admin and super_admin users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .in('role', ['admin', 'super_admin'])
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (usersError) {
      throw usersError;
    }

    // Get permissions for each admin
    const adminsWithPermissions = await Promise.all(
      users.map(async (user) => {
        // Super admins have all permissions
        if (user.role === 'super_admin') {
          return {
            ...user,
            permissions: {
              can_view_revenue: true,
              can_view_quick_stats: true,
              can_view_user_list: true,
              can_view_recent_activity: true,
              can_export_data: true,
              can_view_analytics: true,
              can_manage_team: true,
              can_manage_blog: true,
              can_manage_videos: true,
              can_create_users: true,
              can_edit_users: true,
              can_delete_users: true,
            },
          };
        }

        // Get permissions from admin_permissions table
        const { data: permissions } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        return {
          ...user,
          permissions: permissions || {
            can_view_revenue: false,
            can_view_quick_stats: true,
            can_view_user_list: true,
            can_view_recent_activity: true,
            can_export_data: false,
            can_view_analytics: false,
            can_manage_team: false,
            can_manage_blog: false,
            can_manage_videos: false,
            can_create_users: false,
            can_edit_users: false,
            can_delete_users: false,
          },
        };
      })
    );

    return NextResponse.json({
      admins: adminsWithPermissions.filter((admin) => admin.role === 'admin'), // Don't show super_admins in the list
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}
