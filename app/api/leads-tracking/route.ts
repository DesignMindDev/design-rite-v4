/**
 * Design-Rite Professional - Leads Tracking API
 * Manages lead data and web activity events
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/leads-tracking
 * Fetch leads with filtering and web activity journey
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const grade = searchParams.get('grade')
    const minScore = searchParams.get('min_score')
    const limit = parseInt(searchParams.get('limit') || '100')

    // If email provided, return single lead with journey
    if (email) {
      return await getLeadJourney(email)
    }

    // Otherwise return all leads with stats
    let query = supabase
      .from('leads')
      .select(`
        *,
        demo_bookings (
          id,
          event_name,
          start_time,
          lead_score as demo_score
        )
      `)
      .order('last_activity_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    // Apply filters
    if (status) {
      query = query.eq('lead_status', status)
    }
    if (grade) {
      query = query.eq('lead_grade', grade)
    }
    if (minScore) {
      query = query.gte('lead_score', parseInt(minScore))
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      throw error
    }

    // Calculate statistics
    const stats = await calculateLeadStats()

    return NextResponse.json({
      success: true,
      leads: leads || [],
      stats,
      total: leads?.length || 0
    })

  } catch (error) {
    console.error('Leads tracking API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/leads-tracking
 * Create or update lead, track web activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, lead_data, event_data } = body

    if (action === 'track_event') {
      // Track web activity event
      return await trackWebActivityEvent(event_data)
    } else if (action === 'update_lead') {
      // Update lead information
      return await updateLead(lead_data)
    } else if (action === 'create_lead') {
      // Create new lead
      return await createLead(lead_data)
    } else if (action === 'add_note') {
      // Add note to lead
      return await addLeadNote(lead_data)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Leads tracking POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Get lead journey with all web activity
 */
async function getLeadJourney(email: string) {
  // Get lead data
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select(`
      *,
      demo_bookings (*)
    `)
    .eq('email', email)
    .single()

  if (leadError || !lead) {
    return NextResponse.json(
      { success: false, error: 'Lead not found' },
      { status: 404 }
    )
  }

  // Get web activity events
  const { data: activities, error: activitiesError } = await supabase
    .from('web_activity_events')
    .select('*')
    .eq('lead_id', lead.id)
    .order('created_at', { ascending: false })

  // Get notes
  const { data: notes, error: notesError } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', lead.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    success: true,
    lead,
    activities: activities || [],
    notes: notes || []
  })
}

/**
 * Track web activity event
 */
async function trackWebActivityEvent(eventData: any) {
  const {
    email,
    session_id,
    event_type,
    event_category,
    event_action,
    event_label,
    page_url,
    page_title,
    referrer_url,
    tool_name,
    tool_data,
    user_agent,
    ip_address,
    time_on_page,
    scroll_depth
  } = eventData

  // Find or create lead
  let lead = null
  if (email) {
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single()

    if (existingLead) {
      lead = existingLead

      // Update lead activity metrics
      const updates: any = {
        last_activity_at: new Date().toISOString(),
        page_views: (existingLead.page_views || 0) + 1
      }

      // Update tool usage flags
      if (tool_name === 'quick_estimate') updates.used_quick_estimate = true
      if (tool_name === 'ai_assessment') updates.used_ai_assessment = true
      if (tool_name === 'system_surveyor') updates.used_system_surveyor = true
      if (event_type === 'quote_generated') {
        updates.quotes_generated = (existingLead.quotes_generated || 0) + 1
      }

      await supabase
        .from('leads')
        .update(updates)
        .eq('id', existingLead.id)
    }
  }

  // Insert web activity event
  const activityEvent = {
    lead_id: lead?.id || null,
    session_id,
    event_type,
    event_category,
    event_action,
    event_label,
    page_url,
    page_title,
    referrer_url,
    tool_name,
    tool_data: tool_data ? JSON.stringify(tool_data) : null,
    user_agent,
    ip_address,
    time_on_page,
    scroll_depth
  }

  const { data, error } = await supabase
    .from('web_activity_events')
    .insert([activityEvent])
    .select()

  if (error) {
    console.error('Error tracking event:', error)
    throw error
  }

  console.log('✅ Web activity tracked:', {
    event_type,
    email: email || 'anonymous',
    tool_name
  })

  return NextResponse.json({
    success: true,
    event: data[0]
  })
}

/**
 * Create new lead
 */
async function createLead(leadData: any) {
  const {
    email,
    name,
    company,
    phone,
    title,
    lead_source,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer_url,
    landing_page,
    company_size,
    industry,
    location,
    tags,
    notes
  } = leadData

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email is required' },
      { status: 400 }
    )
  }

  // Check if lead already exists
  const { data: existingLead } = await supabase
    .from('leads')
    .select('*')
    .eq('email', email)
    .single()

  if (existingLead) {
    return NextResponse.json(
      { success: false, error: 'Lead already exists', lead: existingLead },
      { status: 409 }
    )
  }

  const lead = {
    email,
    name,
    company,
    phone,
    title,
    lead_source,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer_url,
    landing_page,
    company_size,
    industry,
    location,
    tags,
    notes,
    first_visit_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()

  if (error) {
    console.error('Error creating lead:', error)
    throw error
  }

  console.log('✅ Lead created:', email)

  return NextResponse.json({
    success: true,
    lead: data[0]
  })
}

/**
 * Update existing lead
 */
async function updateLead(leadData: any) {
  const { id, email, ...updates } = leadData

  if (!id && !email) {
    return NextResponse.json(
      { success: false, error: 'Lead ID or email is required' },
      { status: 400 }
    )
  }

  // Add updated timestamp
  updates.updated_at = new Date().toISOString()

  let query = supabase
    .from('leads')
    .update(updates)

  if (id) {
    query = query.eq('id', id)
  } else {
    query = query.eq('email', email)
  }

  const { data, error } = await query.select()

  if (error) {
    console.error('Error updating lead:', error)
    throw error
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Lead not found' },
      { status: 404 }
    )
  }

  console.log('✅ Lead updated:', id || email)

  return NextResponse.json({
    success: true,
    lead: data[0]
  })
}

/**
 * Add note to lead
 */
async function addLeadNote(leadData: any) {
  const { lead_id, email, note, note_type, created_by } = leadData

  let leadId = lead_id

  // If email provided, find lead ID
  if (!leadId && email) {
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single()

    if (lead) {
      leadId = lead.id
    }
  }

  if (!leadId) {
    return NextResponse.json(
      { success: false, error: 'Lead ID or email is required' },
      { status: 400 }
    )
  }

  const noteData = {
    lead_id: leadId,
    note,
    note_type: note_type || 'manual',
    created_by: created_by || 'system'
  }

  const { data, error } = await supabase
    .from('lead_notes')
    .insert([noteData])
    .select()

  if (error) {
    console.error('Error adding note:', error)
    throw error
  }

  console.log('✅ Note added to lead:', leadId)

  return NextResponse.json({
    success: true,
    note: data[0]
  })
}

/**
 * Calculate lead statistics
 */
async function calculateLeadStats() {
  const { data: allLeads, error } = await supabase
    .from('leads')
    .select('lead_status, lead_grade, lead_score, trial_started, converted_to_customer, created_at')

  if (error || !allLeads) {
    return {
      total: 0,
      by_status: {},
      by_grade: {},
      average_score: 0,
      trial_started: 0,
      customers: 0,
      new_this_week: 0,
      new_this_month: 0
    }
  }

  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const stats = {
    total: allLeads.length,
    by_status: {} as Record<string, number>,
    by_grade: {} as Record<string, number>,
    average_score: 0,
    trial_started: allLeads.filter(l => l.trial_started).length,
    customers: allLeads.filter(l => l.converted_to_customer).length,
    new_this_week: allLeads.filter(l => new Date(l.created_at) > oneWeekAgo).length,
    new_this_month: allLeads.filter(l => new Date(l.created_at) > oneMonthAgo).length
  }

  // Count by status and grade
  allLeads.forEach(lead => {
    stats.by_status[lead.lead_status] = (stats.by_status[lead.lead_status] || 0) + 1
    stats.by_grade[lead.lead_grade] = (stats.by_grade[lead.lead_grade] || 0) + 1
  })

  // Calculate average score
  const totalScore = allLeads.reduce((sum, lead) => sum + (lead.lead_score || 0), 0)
  stats.average_score = allLeads.length > 0 ? Math.round(totalScore / allLeads.length) : 0

  return stats
}
