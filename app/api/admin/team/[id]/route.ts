import { NextRequest, NextResponse } from 'next/server'
// Force dynamic rendering (do not pre-render at build time)
export const dynamic = 'force-dynamic';
import fs from 'fs'
import path from 'path'

const TEAM_DATA_PATH = path.join(process.cwd(), 'data', 'team.json')

interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  imagePath: string
  initials: string
  href?: string
}

// Load team data
function loadTeamData(): TeamMember[] {
  if (!fs.existsSync(TEAM_DATA_PATH)) {
    return []
  }

  const data = fs.readFileSync(TEAM_DATA_PATH, 'utf8')
  return JSON.parse(data)
}

// Save team data
function saveTeamData(teamMembers: TeamMember[]) {
  const dataDir = path.dirname(TEAM_DATA_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(TEAM_DATA_PATH, JSON.stringify(teamMembers, null, 2))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const teamMembers = loadTeamData()

    const index = teamMembers.findIndex(member => member.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Remove the team member
    const removedMember = teamMembers.splice(index, 1)[0]
    saveTeamData(teamMembers)

    // Optionally, you could also delete the associated image file here
    // if (removedMember.imagePath && removedMember.imagePath.includes('/uploads/')) {
    //   // Delete the image file from uploads directory
    // }

    return NextResponse.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}