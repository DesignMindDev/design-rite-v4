import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('creative_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (projectId && projectId !== 'all') {
      query = query.eq('project_id', projectId)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    const { data: assets, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch assets' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      assets: assets || [],
      count: assets?.length || 0
    })

  } catch (error) {
    console.error('Assets fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('id')

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('creative_assets')
      .delete()
      .eq('id', assetId)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete asset' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    })

  } catch (error) {
    console.error('Asset delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, tags, project_id, filename } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Asset ID required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (tags !== undefined) updateData.tags = tags
    if (project_id !== undefined) updateData.project_id = project_id
    if (filename !== undefined) updateData.filename = filename

    const { data: asset, error } = await supabase
      .from('creative_assets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: 'Failed to update asset' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      asset,
      message: 'Asset updated successfully'
    })

  } catch (error) {
    console.error('Asset update error:', error)
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    )
  }
}