/**
 * Design-Rite Professional - Calendly Webhook Handler
 * Receives and processes Calendly event notifications for demo bookings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface CalendlyEvent {
  event: string
  payload: {
    event: {
      uri: string
      name: string
      start_time: string
      end_time: string
      location?: {
        type: string
        location?: string
        join_url?: string
      }
    }
    invitee: {
      uri: string
      name: string
      email: string
      questions_and_responses?: Array<{
        question: string
        answer: string
      }>
    }
  }
}

/**
 * POST /api/webhooks/calendly
 * Handles Calendly webhook events (invitee.created, invitee.canceled)
 */
export async function POST(request: NextRequest) {
  try {
    const payload: CalendlyEvent = await request.json()

    console.log('📅 Calendly webhook received:', {
      event: payload.event,
      invitee: payload.payload.invitee.email,
      time: new Date().toISOString()
    })

    const eventType = payload.event
    const eventData = payload.payload

    if (eventType === 'invitee.created') {
      await handleDemoBooking(eventData)
    } else if (eventType === 'invitee.canceled') {
      await handleDemoCancellation(eventData)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('❌ Calendly webhook error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Handle new demo booking from Calendly
 */
async function handleDemoBooking(eventData: CalendlyEvent['payload']) {
  const event = eventData.event
  const invitee = eventData.invitee

  // Extract custom question responses
  const responses = invitee.questions_and_responses || []
  const getResponse = (question: string): string | null => {
    const response = responses.find(r =>
      r.question.toLowerCase().includes(question.toLowerCase())
    )
    return response ? response.answer : null
  }

  // Calculate lead score based on responses
  const company = getResponse('company') || ''
  const challenge = getResponse('challenge') || ''
  const volume = getResponse('proposals') || getResponse('volume') || '0'
  const urgency = getResponse('urgency') || getResponse('timeline') || ''

  const leadScore = calculateLeadScore({
    company,
    challenge,
    volume,
    urgency
  })

  // Parse monthly proposal volume
  const monthlyVolume = parseInt(volume) || null

  const bookingData = {
    calendly_event_id: event.uri.split('/').pop(),
    calendly_event_uri: event.uri,
    event_name: event.name,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location ? JSON.stringify(event.location) : null,

    invitee_name: invitee.name,
    invitee_email: invitee.email,
    invitee_company: getResponse('company'),
    invitee_phone: getResponse('phone'),

    biggest_challenge: getResponse('biggest challenge') || getResponse('challenge'),
    current_proposal_process: getResponse('current process') || getResponse('proposal process'),
    monthly_proposal_volume: monthlyVolume,
    company_size: getResponse('company size'),
    urgency_level: getResponse('urgency') || getResponse('timeline'),

    lead_source: 'calendly_booking',
    lead_score: leadScore,
    follow_up_status: 'demo_scheduled',
    event_status: 'scheduled'
  }

  const { data, error } = await supabase
    .from('demo_bookings')
    .insert([bookingData])
    .select()

  if (error) {
    console.error('❌ Error saving demo booking:', error)
    throw error
  }

  console.log('✅ Demo booking saved:', {
    id: data[0].id,
    name: bookingData.invitee_name,
    email: bookingData.invitee_email,
    score: leadScore
  })

  // Send notifications
  await sendDemoNotification(bookingData)
}

/**
 * Handle demo cancellation from Calendly
 */
async function handleDemoCancellation(eventData: CalendlyEvent['payload']) {
  const event = eventData.event
  const eventId = event.uri.split('/').pop()

  const { error } = await supabase
    .from('demo_bookings')
    .update({
      event_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('calendly_event_id', eventId)

  if (error) {
    console.error('❌ Error updating cancelled booking:', error)
    throw error
  }

  console.log('🚫 Demo booking cancelled:', eventId)
}

/**
 * Calculate lead score based on prospect responses
 */
function calculateLeadScore(data: {
  company: string
  challenge: string
  volume: string
  urgency: string
}): number {
  let score = 50 // Base score

  // Company indicator
  if (data.company) score += 10

  // Challenge indicates pain level
  if (data.challenge) {
    const challengeLower = data.challenge.toLowerCase()
    if (challengeLower.includes('slow') || challengeLower.includes('time')) score += 15
    if (challengeLower.includes('compliance')) score += 20
    if (challengeLower.includes('losing') || challengeLower.includes('lose')) score += 25
    if (challengeLower.includes('manual') || challengeLower.includes('spreadsheet')) score += 15
  }

  // Volume indicates size/potential
  const volume = parseInt(data.volume) || 0
  if (volume >= 20) score += 25
  else if (volume >= 10) score += 20
  else if (volume >= 5) score += 10

  // Urgency indicates buying intent
  if (data.urgency) {
    const urgencyLower = data.urgency.toLowerCase()
    if (urgencyLower.includes('asap') || urgencyLower.includes('immediate')) score += 20
    if (urgencyLower.includes('month') || urgencyLower.includes('30 day')) score += 15
    if (urgencyLower.includes('week')) score += 25
  }

  return Math.min(score, 100)
}

/**
 * Send internal notification about new demo booking
 */
async function sendDemoNotification(bookingData: any) {
  const message = `
🎯 NEW DEMO BOOKED!

Name: ${bookingData.invitee_name}
Company: ${bookingData.invitee_company || 'Not specified'}
Email: ${bookingData.invitee_email}
Time: ${new Date(bookingData.start_time).toLocaleString()}
Lead Score: ${bookingData.lead_score}/100

Challenge: ${bookingData.biggest_challenge || 'Not specified'}
Proposals/month: ${bookingData.monthly_proposal_volume || 'Not specified'}
Urgency: ${bookingData.urgency_level || 'Not specified'}

Calendly Link: ${bookingData.calendly_event_uri}
  `.trim()

  console.log('📧 Demo notification:', message)

  // TODO: Integrate with Slack webhook or email service
  // if (process.env.SLACK_WEBHOOK_URL) {
  //   await fetch(process.env.SLACK_WEBHOOK_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text: message })
  //   })
  // }
}
