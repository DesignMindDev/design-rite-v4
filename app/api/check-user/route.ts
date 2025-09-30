import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      console.log('⚠️ Supabase admin not available, treating as new user')
      return NextResponse.json({
        exists: false,
        message: 'User lookup not available, proceeding as new user'
      })
    }

    // Check if user exists in Supabase auth
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error checking user existence:', error)
      return NextResponse.json({
        exists: false,
        message: 'Could not verify user, proceeding as new user'
      })
    }

    // Find user by email
    const existingUser = users.find(user => user.email === email.toLowerCase())

    if (existingUser) {
      console.log('✅ Found existing user:', email)
      return NextResponse.json({
        exists: true,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          company: existingUser.user_metadata?.company,
          created_at: existingUser.created_at
        }
      })
    } else {
      console.log('🆕 New user:', email)
      return NextResponse.json({
        exists: false,
        message: 'New user detected'
      })
    }

  } catch (error) {
    console.error('Error in check-user API:', error)
    return NextResponse.json({
      exists: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}