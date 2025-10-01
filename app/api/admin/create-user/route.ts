/**
 * Create User API Endpoint
 * Allows admins to create new users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin and admin can create users
    if (session.user.role !== 'super_admin' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { email, password, full_name, role, company, phone, access_code, notes } = body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Email, password, full name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role restrictions for regular admins
    if (session.user.role === 'admin') {
      if (role === 'super_admin' || role === 'admin') {
        return NextResponse.json(
          { error: 'Admins can only create User or Manager roles' },
          { status: 403 }
        );
      }
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if access code already exists (if provided)
    if (access_code) {
      const { data: existingCode } = await supabase
        .from('users')
        .select('id')
        .eq('access_code', access_code)
        .single();

      if (existingCode) {
        return NextResponse.json(
          { error: 'This access code is already in use' },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const password_hash = await hash(password, 10);

    // Create the user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        full_name,
        role,
        company: company || null,
        phone: phone || null,
        access_code: access_code || null,
        notes: notes || null,
        status: 'active',
        created_by: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        login_count: 0,
        failed_login_attempts: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user: ' + insertError.message },
        { status: 500 }
      );
    }

    // Log the user creation activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: session.user.id,
        action: 'user_created',
        resource_type: 'user',
        resource_id: newUser.id,
        details: {
          new_user_email: email,
          new_user_role: role,
          created_by: session.user.email
        },
        success: true,
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

  } catch (error) {
    console.error('Create user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
