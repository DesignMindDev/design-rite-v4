/**
 * Delete User API Endpoint
 * Soft deletes user accounts (super admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super admins can delete users
    if (session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can delete users' }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Get user details before deleting
    const { data: user } = await supabase
      .from('users')
      .select('email, role')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete the user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        status: 'deleted',
        notes: `Deleted by ${session.user.email} on ${new Date().toISOString()}`
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error deleting user:', updateError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    // Log the deletion
    await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action: 'user_deleted',
        resource_type: 'user',
        resource_id: userId,
        details: {
          deleted_user_email: user.email,
          deleted_user_role: user.role,
          deleted_by: session.user.email
        },
        success: true,
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete user API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
