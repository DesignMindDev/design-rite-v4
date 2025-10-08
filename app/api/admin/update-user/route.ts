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

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { user: userData, permissions: permissionData, modulePermissions } = body;
    const userId = userData?.id;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Fetch existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Admins can only update users they created (unless super_admin)
    if (requestingUser.role === 'admin' && existingUser.created_by !== session.user.id) {
      return NextResponse.json({ error: 'Cannot update this user' }, { status: 403 });
    }

    // Prevent editing super_admin users unless requester is super_admin
    if (existingUser.role === 'super_admin' && requestingUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Cannot edit super admin users' }, { status: 403 });
    }

    // Prevent admins from assigning permissions if they don't have can_assign_permissions
    if (requestingUser.role === 'admin' && permissionData) {
      const { data: requesterPermissions } = await supabase
        .from('admin_permissions')
        .select('can_assign_permissions')
        .eq('user_id', session.user.id)
        .single();

      if (!requesterPermissions?.can_assign_permissions) {
        return NextResponse.json({ error: 'You do not have permission to assign permissions' }, { status: 403 });
      }
    }

    // Update user data
    if (userData) {
      const updateData: any = {
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        status: userData.status,
        company: userData.company,
        phone: userData.phone,
        access_code: userData.access_code,
        notes: userData.notes,
        updated_at: new Date().toISOString(),
      };

      // Update module permissions if provided
      if (modulePermissions) {
        updateData.module_permissions = modulePermissions;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }
    }

    // Update permissions
    if (permissionData) {
      // Check if permissions record exists
      const { data: existingPermissions } = await supabase
        .from('admin_permissions')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingPermissions) {
        // Update existing permissions
        const { error: permError } = await supabase
          .from('admin_permissions')
          .update({
            ...permissionData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (permError) {
          console.error('Error updating permissions:', permError);
          return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
        }
      } else {
        // Create new permissions record
        const { error: permError } = await supabase
          .from('admin_permissions')
          .insert({
            user_id: userId,
            ...permissionData,
          });

        if (permError) {
          console.error('Error creating permissions:', permError);
          return NextResponse.json({ error: 'Failed to create permissions' }, { status: 500 });
        }
      }
    }

    // Log the activity
    await supabase.from('activity_logs').insert({
      user_id: session.user.id,
      action: 'update_user',
      resource_type: 'user',
      resource_id: userId,
      details: {
        updated_user_id: userId,
        updated_fields: Object.keys(userData || {}),
        permissions_updated: !!permissionData,
      },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}
