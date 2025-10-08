import { NextResponse } from 'next/server';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

// Hardcode the values directly (temporary fix to get it working)
const supabaseUrl = 'https://ickwrbdpuorzdpzqbqpf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  console.log('🚀 Waitlist API called');
  
  try {
    // Get the data from the request
    const data = await request.json();
    console.log('📦 Received data:', data);
    
    // Extract fields
    const { email, company, role, facilities, source } = data;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('waitlist_subscribers')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is what we want
      console.error('Check error:', checkError);
    }
    
    if (existing) {
      console.log('⚠️ Email already exists:', email);
      return NextResponse.json(
        { 
          success: true,
          message: 'You are already on the waitlist!',
          alreadyExists: true 
        },
        { status: 200 }
      );
    }
    
    // Save to database
    const { data: newSubscriber, error: insertError } = await supabase
      .from('waitlist_subscribers')
      .insert([
        {
          email: email.toLowerCase(),
          company_name: company || null,
          role: role || null,
          facilities_count: facilities || null,
          source_page: source || 'waitlist-page',
          created_at: new Date().toISOString(),
          opted_in: true,
          email_verified: false
        }
      ])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Database error:', insertError);
      return NextResponse.json(
        { error: insertError.message || 'Failed to join waitlist.' },
        { status: 500 }
      );
    }
    
    console.log('✅ New waitlist subscriber added:', email);
    
    // Also update lead score (optional - won't fail if table doesn't exist)
    try {
      await supabase
        .from('lead_scores')
        .upsert({
          email: email.toLowerCase(),
          total_score: 50,
          engagement_score: 20,
          profile_score: role === 'security_integrator' ? 30 : 20,
          last_activity: new Date().toISOString(),
          lead_status: 'new'
        });
    } catch (scoreError) {
      console.log('Lead score update skipped');
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully joined the waitlist!',
        data: {
          email: newSubscriber.email,
          position: Math.floor(Math.random() * 500) + 100
        }
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('💥 Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// Test endpoint to verify API is working
export async function GET() {
  try {
    // Test the connection
    const { count, error } = await supabase
      .from('waitlist_subscribers')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return NextResponse.json({
        message: 'API endpoint active but database error',
        error: error.message
      });
    }
    
    return NextResponse.json({
      message: '✅ Waitlist API is working!',
      subscriberCount: count || 0,
      timestamp: new Date().toISOString(),
      status: 'Connected to Supabase successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      message: 'API endpoint active but error occurred',
      error: error.message
    });
  }
}
