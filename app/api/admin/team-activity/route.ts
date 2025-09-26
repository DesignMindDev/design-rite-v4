import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const ACTIVITY_LOG_PATH = path.join(process.cwd(), 'data', 'team-activity.json')

interface ActivityLog {
  timestamp: string
  memberName: string
  code: string
  action: string
  ipAddress?: string
  userAgent?: string
}

// GET - Retrieve team member activity logs
export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    const memberName = request.nextUrl.searchParams.get('member')

    if (!fs.existsSync(ACTIVITY_LOG_PATH)) {
      return NextResponse.json([])
    }

    const data = fs.readFileSync(ACTIVITY_LOG_PATH, 'utf8')
    let activities: ActivityLog[] = JSON.parse(data)

    // Filter by member if specified
    if (memberName) {
      activities = activities.filter(activity =>
        activity.memberName.toLowerCase().includes(memberName.toLowerCase())
      )
    }

    // Sort by most recent first
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit results
    const limitedActivities = activities.slice(0, limit)

    // Add summary stats
    const summary = {
      totalActivities: activities.length,
      uniqueMembers: [...new Set(activities.map(a => a.memberName))].length,
      last24Hours: activities.filter(a =>
        new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length,
      mostActiveMembers: getMostActiveMembers(activities)
    }

    return NextResponse.json({
      activities: limitedActivities,
      summary
    })

  } catch (error) {
    console.error('Error loading team activity:', error)
    return NextResponse.json({ error: 'Failed to load team activity' }, { status: 500 })
  }
}

function getMostActiveMembers(activities: ActivityLog[]) {
  const memberCounts = activities.reduce((acc, activity) => {
    acc[activity.memberName] = (acc[activity.memberName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(memberCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
}