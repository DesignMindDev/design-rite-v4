import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

// Creative Studio Floor Plan Designs API
// Manages CAD drawings, device placements, and design history

interface DesignCreateRequest {
  projectId: string
  name: string
  drawings?: any[]
  activeLayers?: string[]
  canvasDimensions?: { width: number; height: number }
}

interface DesignUpdateRequest {
  name?: string
  drawings?: any[]
  activeLayers?: string[]
  canvasDimensions?: { width: number; height: number }
}

interface DesignResponse {
  id: string
  projectId: string
  name: string
  drawings: any[]
  activeLayers: string[]
  canvasDimensions: { width: number; height: number }
  createdAt: string
  updatedAt: string
  version: number
  isActive: boolean
  metadata?: Record<string, any>
}

// GET /api/creative-studio/designs - Get floor plan designs for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const designId = searchParams.get('designId')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    if (!projectId && !designId) {
      return NextResponse.json(
        { error: 'Project ID or Design ID is required' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from('floor_plan_designs')
      .select(`
        id,
        project_id,
        name,
        drawings,
        active_layers,
        canvas_dimensions,
        created_at,
        updated_at,
        version,
        is_active,
        metadata
      `)

    if (designId) {
      query = query.eq('id', designId)
    } else if (projectId) {
      query = query.eq('project_id', projectId)
      if (!includeInactive) {
        query = query.eq('is_active', true)
      }
      query = query.order('updated_at', { ascending: false })
    }

    const { data: designs, error } = await query

    if (error) {
      console.error('Error fetching designs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch designs', details: error.message },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const transformedDesigns: DesignResponse[] = (designs || []).map(design => ({
      id: design.id,
      projectId: design.project_id,
      name: design.name,
      drawings: design.drawings || [],
      activeLayers: design.active_layers || [],
      canvasDimensions: design.canvas_dimensions || { width: 800, height: 600 },
      createdAt: design.created_at,
      updatedAt: design.updated_at,
      version: design.version,
      isActive: design.is_active,
      metadata: design.metadata
    }))

    if (designId) {
      const design = transformedDesigns[0]
      if (!design) {
        return NextResponse.json(
          { error: 'Design not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ design })
    }

    return NextResponse.json({
      designs: transformedDesigns,
      total: transformedDesigns.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Designs GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/creative-studio/designs - Create new design
export async function POST(request: NextRequest) {
  try {
    const body: DesignCreateRequest = await request.json()

    // Validation
    if (!body.projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Design name is required' },
        { status: 400 }
      )
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', body.projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create design
    const { data: design, error } = await supabaseAdmin
      .from('floor_plan_designs')
      .insert({
        project_id: body.projectId,
        name: body.name.trim(),
        drawings: body.drawings || [],
        active_layers: body.activeLayers || [
          'security-cameras',
          'detection-sensors',
          'access-control',
          'perimeter-security',
          'network-infrastructure',
          'power-backup'
        ],
        canvas_dimensions: body.canvasDimensions || { width: 800, height: 600 },
        version: 1,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating design:', error)
      return NextResponse.json(
        { error: 'Failed to create design', details: error.message },
        { status: 500 }
      )
    }

    // Transform response
    const response: DesignResponse = {
      id: design.id,
      projectId: design.project_id,
      name: design.name,
      drawings: design.drawings || [],
      activeLayers: design.active_layers || [],
      canvasDimensions: design.canvas_dimensions || { width: 800, height: 600 },
      createdAt: design.created_at,
      updatedAt: design.updated_at,
      version: design.version,
      isActive: design.is_active,
      metadata: design.metadata
    }

    return NextResponse.json({
      design: response,
      message: 'Design created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Designs POST error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/creative-studio/designs - Update existing design
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const designId = searchParams.get('designId')

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      )
    }

    const body: DesignUpdateRequest = await request.json()

    // Build update object with only provided fields
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.drawings !== undefined) updateData.drawings = body.drawings
    if (body.activeLayers !== undefined) updateData.active_layers = body.activeLayers
    if (body.canvasDimensions !== undefined) updateData.canvas_dimensions = body.canvasDimensions

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Increment version number for changes to drawings
    if (body.drawings !== undefined) {
      // Get current version
      const { data: currentDesign } = await supabaseAdmin
        .from('floor_plan_designs')
        .select('version')
        .eq('id', designId)
        .single()

      if (currentDesign) {
        updateData.version = (currentDesign.version || 1) + 1
      }
    }

    const { data: design, error } = await supabaseAdmin
      .from('floor_plan_designs')
      .update(updateData)
      .eq('id', designId)
      .select()
      .single()

    if (error) {
      console.error('Error updating design:', error)
      return NextResponse.json(
        { error: 'Failed to update design', details: error.message },
        { status: 500 }
      )
    }

    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      )
    }

    // Transform response
    const response: DesignResponse = {
      id: design.id,
      projectId: design.project_id,
      name: design.name,
      drawings: design.drawings || [],
      activeLayers: design.active_layers || [],
      canvasDimensions: design.canvas_dimensions || { width: 800, height: 600 },
      createdAt: design.created_at,
      updatedAt: design.updated_at,
      version: design.version,
      isActive: design.is_active,
      metadata: design.metadata
    }

    return NextResponse.json({
      design: response,
      message: 'Design updated successfully'
    })

  } catch (error) {
    console.error('Designs PATCH error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/creative-studio/designs - Delete design
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const designId = searchParams.get('designId')
    const softDelete = searchParams.get('softDelete') === 'true'

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      )
    }

    if (softDelete) {
      // Soft delete - mark as inactive
      const { error } = await supabaseAdmin
        .from('floor_plan_designs')
        .update({ is_active: false })
        .eq('id', designId)

      if (error) {
        console.error('Error soft deleting design:', error)
        return NextResponse.json(
          { error: 'Failed to deactivate design', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Design deactivated successfully'
      })
    } else {
      // Hard delete
      const { error } = await supabaseAdmin
        .from('floor_plan_designs')
        .delete()
        .eq('id', designId)

      if (error) {
        console.error('Error deleting design:', error)
        return NextResponse.json(
          { error: 'Failed to delete design', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Design deleted successfully'
      })
    }

  } catch (error) {
    console.error('Designs DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}