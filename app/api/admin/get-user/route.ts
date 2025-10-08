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

    // Get userId from query params
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Admins can only view users they created (unless super_admin)
    if (requestingUser.role === 'admin' && user.created_by !== session.user.id) {
      return NextResponse.json({ error: 'Cannot view this user' }, { status: 403 });
    }

    // Fetch user permissions
    const { data: permissions } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If no permissions exist, return default permissions
    const defaultPermissions = {
      can_manage_team: false,
      can_manage_blog: false,
      can_manage_videos: false,
      can_manage_settings: false,
      can_create_users: false,
      can_edit_users: false,
      can_delete_users: false,
      can_assign_permissions: false,
      can_view_activity: false,
      can_export_data: false,
      can_view_analytics: false,
      can_access_admin_panel: false,
      can_manage_integrations: false,
    };

    // Get module permissions from user record
    const defaultModulePermissions = {
      operations_dashboard: false,
      ai_management: false,
      data_harvesting: false,
      marketing_content: false,
      about_us: false,
      team_management: false,
      logo_management: false,
      video_management: false,
      blog_management: false,
    };

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status,
        company: user.company,
        phone: user.phone,
        access_code: user.access_code,
        notes: user.notes,
      },
      permissions: permissions || defaultPermissions,
      modulePermissions: user.module_permissions || defaultModulePermissions,
    });

  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}
