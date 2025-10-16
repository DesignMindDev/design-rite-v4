// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

// Creative Studio Projects API
// Manages project creation, retrieval, and updates

interface ProjectCreateRequest {
  name: string
  description?: string
  type?: string
}

interface ProjectUpdateRequest {
  name?: string
  description?: string
  status?: string
  metadata?: Record<string, any>
}

// GET /api/creative-studio/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'creative-studio'
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabaseAdmin
      .from('projects')
      .select(`
        id,
        name,
        description,
        type,
        status,
        created_at,
        updated_at,
        metadata
      `)
      .eq('type', type)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      projects: projects || [],
      total: projects?.length || 0,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/creative-studio/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body: ProjectCreateRequest = await request.json()

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || '',
        type: body.type || 'creative-studio',
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: 'Failed to create project', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      project,
      message: 'Project created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Projects POST error:', error)

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

// PATCH /api/creative-studio/projects - Update project
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const body: ProjectUpdateRequest = await request.json()

    // Build update object with only provided fields
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.description !== undefined) updateData.description = body.description.trim()
    if (body.status !== undefined) updateData.status = body.status
    if (body.metadata !== undefined) updateData.metadata = body.metadata

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Failed to update project', details: error.message },
        { status: 500 }
      )
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      project,
      message: 'Project updated successfully'
    })

  } catch (error) {
    console.error('Projects PATCH error:', error)

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

// DELETE /api/creative-studio/projects - Delete project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { error: 'Failed to delete project', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Projects DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}