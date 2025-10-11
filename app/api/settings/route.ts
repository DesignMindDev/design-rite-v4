import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

interface SiteSettings {
  logoPath: string
  footerLogoPath: string
  demoVideoUrl: string
}

// Load settings (public read-only access)
function loadSettings(): SiteSettings {
  const defaultSettings: SiteSettings = {
    logoPath: '',
    footerLogoPath: '',
    demoVideoUrl: ''
  }

  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      return defaultSettings
    }

    const data = fs.readFileSync(SETTINGS_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

// Public GET endpoint - no authentication required
export async function GET() {
  try {
    const settings = loadSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error loading settings:', error)
    // Return empty settings instead of error to avoid console noise
    return NextResponse.json({ logoPath: '', footerLogoPath: '', demoVideoUrl: '' })
  }
}
