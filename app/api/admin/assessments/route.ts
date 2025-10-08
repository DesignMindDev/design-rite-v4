import { NextResponse } from 'next/server';
// Force dynamic rendering (do not pre-render at build time)
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - Fetch all assessments with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: assessments, error, count } = await query;

    if (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }

    // Also get stats
    const { data: stats } = await supabase
      .from('assessments')
      .select('status, processing_time_ms, created_at');

    const totalCount = count || 0;
    const completedToday = stats?.filter(s =>
      s.status === 'completed' &&
      new Date(s.created_at).toDateString() === new Date().toDateString()
    ).length || 0;

    const avgProcessingTime = stats?.reduce((sum, s) => sum + (s.processing_time_ms || 0), 0) / (stats?.length || 1);
    const successRate = stats?.filter(s => s.status === 'completed').length / (stats?.length || 1) * 100;

    return NextResponse.json({
      assessments,
      totalCount,
      stats: {
        total: totalCount,
        completedToday,
        avgProcessingTime: Math.round(avgProcessingTime),
        successRate: Math.round(successRate)
      }
    });

  } catch (error) {
    console.error('Admin assessments API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete an assessment (admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting assessment:', error);
      return NextResponse.json({ error: 'Failed to delete assessment' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Assessment deleted successfully' });

  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}