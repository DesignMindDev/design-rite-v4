import { NextRequest, NextResponse } from 'next/server';
// Force dynamic rendering (do not pre-render at build time)
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, permissions } = await request.json();

    if (!userId || !permissions) {
      return NextResponse.json(
        { error: 'Missing userId or permissions' },
        { status: 400 }
      );
    }

    // Check if permissions record exists
    const { data: existing } = await supabase
      .from('admin_permissions')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing permissions
      const { error: updateError } = await supabase
        .from('admin_permissions')
        .update(permissions)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Insert new permissions
      const { error: insertError } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: userId,
          ...permissions,
        });

      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update permissions error:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
