import { NextResponse } from 'next/server';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, company, source, timestamp } = await request.json();

    // Validate required fields
    if (!email || !company) {
      return NextResponse.json(
        { error: 'Email and company are required' },
        { status: 400 }
      );
    }

    // Log the lead to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          email,
          company_name: company,
          source,
          created_at: timestamp,
          status: 'new'
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save lead data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Lead captured successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
