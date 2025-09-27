import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const projectId = formData.get('projectId') as string || 'general'
    const uploadedBy = formData.get('uploadedBy') as string || 'admin'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadResults = []

    for (const file of files) {
      if (!file || file.size === 0) continue

      // Generate unique filename
      const fileId = crypto.randomUUID()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${fileId}.${fileExtension}`

      // Create upload directory
      const uploadDir = join(process.cwd(), 'public', 'creative-studio', 'assets')
      await mkdir(uploadDir, { recursive: true })

      // Save file
      const filePath = join(uploadDir, fileName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Generate AI analysis (simulated for now)
      const aiAnalysis = generateImageAnalysis(file.name, file.type)

      // Auto-generate tags based on filename and AI analysis
      const tags = generateTags(file.name, aiAnalysis)

      // Save to database
      const { data: asset, error } = await supabase
        .from('creative_assets')
        .insert({
          filename: file.name,
          file_path: `/creative-studio/assets/${fileName}`,
          file_type: file.type,
          ai_analysis: aiAnalysis,
          tags: tags,
          project_id: projectId,
          uploaded_by: uploadedBy,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to save asset to database' },
          { status: 500 }
        )
      }

      uploadResults.push({
        id: asset.id,
        filename: file.name,
        file_path: `/creative-studio/assets/${fileName}`,
        file_type: file.type,
        ai_analysis: aiAnalysis,
        tags: tags,
        size: file.size
      })
    }

    return NextResponse.json({
      success: true,
      assets: uploadResults,
      message: `Successfully uploaded ${uploadResults.length} asset(s)`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload assets' },
      { status: 500 }
    )
  }
}

function generateImageAnalysis(filename: string, fileType: string): any {
  const isImage = fileType.startsWith('image/')
  const lowercaseFilename = filename.toLowerCase()

  // Simulate AI visual analysis based on filename and type
  const analysis = {
    type: isImage ? 'image' : 'document',
    confidence: 0.85 + Math.random() * 0.15,
    detected_objects: [],
    scene_description: '',
    technical_details: {},
    suggested_use_cases: [],
    estimated_setting: 'unknown'
  }

  if (isImage) {
    // Analyze based on filename keywords
    if (lowercaseFilename.includes('camera') || lowercaseFilename.includes('surveillance')) {
      analysis.detected_objects = ['security camera', 'mounting hardware', 'cables']
      analysis.scene_description = 'Professional security camera equipment in installation setting'
      analysis.technical_details = {
        estimated_resolution: '4K',
        type: 'IP Camera',
        features: ['Night Vision', 'Motion Detection', 'Weather Resistant']
      }
      analysis.suggested_use_cases = ['Product showcase', 'Installation guide', 'Technical documentation']
      analysis.estimated_setting = 'commercial'
    } else if (lowercaseFilename.includes('office') || lowercaseFilename.includes('building')) {
      analysis.detected_objects = ['building facade', 'entrance', 'windows', 'access control']
      analysis.scene_description = 'Modern office building with security infrastructure'
      analysis.technical_details = {
        estimated_size: 'Medium-large commercial building',
        access_points: 'Multiple entrances identified',
        security_level: 'Standard commercial'
      }
      analysis.suggested_use_cases = ['Case study', 'Before/after story', 'Customer success story']
      analysis.estimated_setting = 'commercial'
    } else if (lowercaseFilename.includes('warehouse') || lowercaseFilename.includes('dock')) {
      analysis.detected_objects = ['loading dock', 'warehouse structure', 'industrial equipment']
      analysis.scene_description = 'Industrial warehouse with multiple loading docks and security coverage'
      analysis.technical_details = {
        estimated_coverage: '50,000+ sq ft',
        loading_docks: '8-12 identified',
        lighting: '24/7 operations suggested'
      }
      analysis.suggested_use_cases = ['Industrial case study', 'Security upgrade story', 'ROI demonstration']
      analysis.estimated_setting = 'industrial'
    } else if (lowercaseFilename.includes('team') || lowercaseFilename.includes('install')) {
      analysis.detected_objects = ['technicians', 'installation equipment', 'safety gear']
      analysis.scene_description = 'Professional installation team working on security system deployment'
      analysis.technical_details = {
        team_size: '2-4 technicians',
        equipment: 'Professional installation tools',
        safety: 'Proper safety protocols observed'
      }
      analysis.suggested_use_cases = ['Team showcase', 'Behind-the-scenes content', 'Process documentation']
      analysis.estimated_setting = 'on-site'
    } else {
      analysis.scene_description = 'General security or technology related image'
      analysis.suggested_use_cases = ['Blog post illustration', 'Social media content', 'General marketing']
    }
  }

  return analysis
}

function generateTags(filename: string, aiAnalysis: any): string[] {
  const tags = new Set<string>()
  const lowercaseFilename = filename.toLowerCase()

  // Add tags based on filename
  if (lowercaseFilename.includes('camera')) tags.add('cameras')
  if (lowercaseFilename.includes('office')) tags.add('office-buildings')
  if (lowercaseFilename.includes('warehouse')) tags.add('warehouses')
  if (lowercaseFilename.includes('team')) tags.add('team-photos')
  if (lowercaseFilename.includes('install')) tags.add('installation')
  if (lowercaseFilename.includes('access')) tags.add('access-control')
  if (lowercaseFilename.includes('door')) tags.add('access-control')
  if (lowercaseFilename.includes('security')) tags.add('security-systems')

  // Add tags based on AI analysis
  if (aiAnalysis.estimated_setting === 'commercial') tags.add('commercial')
  if (aiAnalysis.estimated_setting === 'industrial') tags.add('industrial')
  if (aiAnalysis.detected_objects?.includes('security camera')) tags.add('surveillance')
  if (aiAnalysis.detected_objects?.includes('loading dock')) tags.add('logistics')

  // Add default tags
  tags.add('design-rite')
  if (aiAnalysis.type === 'image') tags.add('photography')

  return Array.from(tags)
}