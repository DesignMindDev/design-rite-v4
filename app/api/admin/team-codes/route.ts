import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const TEAM_CODES_PATH = path.join(process.cwd(), 'data', 'team-codes.json')
const ACTIVITY_LOG_PATH = path.join(process.cwd(), 'data', 'team-activity.json')

interface TeamCode {
  id: string
  code: string
  memberName: string
  role: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
  usageCount: number
}

interface ActivityLog {
  timestamp: string
  memberName: string
  code: string
  action: string
  ipAddress?: string
  userAgent?: string
}

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(TEAM_CODES_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load team codes
function loadTeamCodes(): TeamCode[] {
  ensureDataDirectory()

  if (!fs.existsSync(TEAM_CODES_PATH)) {
    // Initialize with default team member codes
    const defaultCodes: TeamCode[] = [
      {
        id: "1",
        code: "DR-DK-2025",
        memberName: "Dan Kozich",
        role: "Founder & Principal Designer",
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: "2",
        code: "DR-PL-2025",
        memberName: "Philip Lisk",
        role: "Managing Director",
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: "3",
        code: "DR-MC-2025",
        memberName: "Munnyman Communications",
        role: "Development Team",
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0
      }
    ]

    fs.writeFileSync(TEAM_CODES_PATH, JSON.stringify(defaultCodes, null, 2))
    return defaultCodes
  }

  const data = fs.readFileSync(TEAM_CODES_PATH, 'utf8')
  return JSON.parse(data)
}

// Save team codes
function saveTeamCodes(codes: TeamCode[]) {
  ensureDataDirectory()
  fs.writeFileSync(TEAM_CODES_PATH, JSON.stringify(codes, null, 2))
}

// Log team member activity
function logActivity(activity: ActivityLog) {
  ensureDataDirectory()

  let activities: ActivityLog[] = []
  if (fs.existsSync(ACTIVITY_LOG_PATH)) {
    const data = fs.readFileSync(ACTIVITY_LOG_PATH, 'utf8')
    activities = JSON.parse(data)
  }

  activities.push(activity)

  // Keep only last 1000 activities
  if (activities.length > 1000) {
    activities = activities.slice(-1000)
  }

  fs.writeFileSync(ACTIVITY_LOG_PATH, JSON.stringify(activities, null, 2))
}

// GET - Retrieve all team codes (admin only)
export async function GET() {
  try {
    const teamCodes = loadTeamCodes()
    return NextResponse.json(teamCodes)
  } catch (error) {
    console.error('Error loading team codes:', error)
    return NextResponse.json({ error: 'Failed to load team codes' }, { status: 500 })
  }
}

// POST - Create new team code or validate existing code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, code, memberName, role } = body

    if (action === 'validate') {
      // Validate team member code
      const teamCodes = loadTeamCodes()
      const teamCode = teamCodes.find(tc => tc.code === code && tc.isActive)

      if (teamCode) {
        // Update usage stats
        teamCode.lastUsed = new Date().toISOString()
        teamCode.usageCount += 1
        saveTeamCodes(teamCodes)

        // Log activity
        logActivity({
          timestamp: new Date().toISOString(),
          memberName: teamCode.memberName,
          code: teamCode.code,
          action: 'AI_ACCESS',
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        })

        return NextResponse.json({
          valid: true,
          member: {
            name: teamCode.memberName,
            role: teamCode.role,
            id: teamCode.id
          }
        })
      } else {
        return NextResponse.json({ valid: false })
      }
    }

    if (action === 'create') {
      // Create new team code
      const teamCodes = loadTeamCodes()

      // Generate unique code
      const codePrefix = memberName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
      const newCode = `DR-${codePrefix}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

      const newTeamCode: TeamCode = {
        id: Date.now().toString(),
        code: newCode,
        memberName,
        role,
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0
      }

      teamCodes.push(newTeamCode)
      saveTeamCodes(teamCodes)

      return NextResponse.json({ success: true, teamCode: newTeamCode })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing team code request:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

// PUT - Update team code
export async function PUT(request: NextRequest) {
  try {
    const updatedCode: TeamCode = await request.json()
    const teamCodes = loadTeamCodes()

    const index = teamCodes.findIndex(code => code.id === updatedCode.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Team code not found' }, { status: 404 })
    }

    teamCodes[index] = { ...teamCodes[index], ...updatedCode }
    saveTeamCodes(teamCodes)

    return NextResponse.json({ success: true, teamCode: teamCodes[index] })
  } catch (error) {
    console.error('Error updating team code:', error)
    return NextResponse.json({ error: 'Failed to update team code' }, { status: 500 })
  }
}

// DELETE - Remove team code
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Team code ID required' }, { status: 400 })
    }

    const teamCodes = loadTeamCodes()
    const index = teamCodes.findIndex(code => code.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Team code not found' }, { status: 404 })
    }

    const removedCode = teamCodes.splice(index, 1)[0]
    saveTeamCodes(teamCodes)

    return NextResponse.json({ success: true, message: 'Team code deleted successfully' })
  } catch (error) {
    console.error('Error deleting team code:', error)
    return NextResponse.json({ error: 'Failed to delete team code' }, { status: 500 })
  }
}