/**
 * Suspend User API Endpoint
 * Allows admins to suspend user accounts
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

    if (session.user.role !== 'super_admin' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user details before suspending
    const { data: user } = await supabase
      .from('users')
      .select('email, role')
      .eq('id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent suspending super admins (unless you're a super admin)
    if (user.role === 'super_admin' && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Cannot suspend super admins' }, { status: 403 });
    }

    // Suspend the user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        status: 'suspended',
        notes: `Suspended by ${session.user.email} on ${new Date().toISOString()}`
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error suspending user:', updateError);
      return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 });
    }

    // Log the suspension
    await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action: 'user_suspended',
        resource_type: 'user',
        resource_id: userId,
        details: {
          suspended_user_email: user.email,
          suspended_by: session.user.email
        },
        success: true,
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Suspend user API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
