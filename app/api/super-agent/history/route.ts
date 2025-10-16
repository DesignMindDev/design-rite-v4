import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Super Agent History API
 * Tracks orchestration tasks and their outcomes
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');

    console.log('[Super Agent History] Fetching history, limit:', limit);

    let query = supabase
      .from('orchestration_tracking')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Super Agent History] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch history', details: error.message },
        { status: 500 }
      );
    }

    console.log('[Super Agent History] Retrieved', data?.length || 0, 'records');

    return NextResponse.json({
      history: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('[Super Agent History] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve orchestration history',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const {
      task_description,
      tools_used,
      status,
      result,
      execution_time_ms,
      user_id,
    } = body;

    console.log('[Super Agent History] Logging orchestration task:', task_description);

    const { data, error } = await supabase
      .from('orchestration_tracking')
      .insert([
        {
          task_description,
          tools_used: tools_used || [],
          status: status || 'completed',
          result: result || {},
          execution_time_ms: execution_time_ms || null,
          user_id: user_id || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Super Agent History] Insert error:', error);
      return NextResponse.json(
        { error: 'Failed to log orchestration task', details: error.message },
        { status: 500 }
      );
    }

    console.log('[Super Agent History] Task logged successfully:', data.id);

    return NextResponse.json({
      success: true,
      id: data.id,
      message: 'Orchestration task logged successfully',
    });
  } catch (error) {
    console.error('[Super Agent History] Error logging task:', error);

    return NextResponse.json(
      {
        error: 'Failed to log orchestration task',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
