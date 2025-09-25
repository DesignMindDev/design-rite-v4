import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// Only create Supabase client if environment variables are available
let supabase: any = null
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Harvester dashboard data
export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase configuration missing:', {
        supabaseUrl: supabaseUrl ? 'present' : 'missing',
        supabaseServiceKey: supabaseServiceKey ? 'present' : 'missing',
        env: process.env.NODE_ENV
      })
      return NextResponse.json({
        error: 'Database not configured',
        message: 'Supabase environment variables are missing',
        debug: {
          supabaseUrl: supabaseUrl ? 'present' : 'missing',
          supabaseServiceKey: supabaseServiceKey ? 'present' : 'missing',
          env: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'overview'

    switch (view) {
      case 'overview':
        return await getOverviewData()
      case 'products':
        return await getProductsData(searchParams)
      case 'pricing':
        return await getPricingData()
      case 'harvest-status':
        return await getHarvestStatus()
      case 'reddit':
        return await getRedditData(searchParams)
      case 'youtube':
        return await getYouTubeData(searchParams)
      case 'manufacturers':
        return await getManufacturersData(searchParams)
      case 'publications':
        return await getPublicationsData(searchParams)
      case 'scheduler':
        return await getSchedulerData()
      default:
        return NextResponse.json({ error: 'Invalid view' }, { status: 400 })
    }
  } catch (error) {
    console.error('Harvester API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getOverviewData() {
  try {
    // Get product counts by manufacturer
    const { data: manufacturers, error: mfgError } = await supabase
      .from('products')
      .select('manufacturer, id')
      .not('manufacturer', 'is', null)

    // Count by manufacturer (handle if no products exist)
    const mfgCounts = manufacturers?.reduce((acc: any, item: any) => {
      acc[item.manufacturer] = (acc[item.manufacturer] || 0) + 1
      return acc
    }, {}) || {}

    // Get recent price changes
    const { data: priceChanges, error: priceError } = await supabase
      .from('price_history')
      .select(`
        id,
        price_type,
        old_price,
        new_price,
        percent_change,
        change_date,
        source,
        products (manufacturer, model, name)
      `)
      .order('change_date', { ascending: false })
      .limit(10)

    // Get total products count
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get products with pricing
    const { count: productsWithPricing, error: pricingCountError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('msrp', 'is', null)

    // NEW: Get Reddit and YouTube data
    const { count: redditPosts, error: redditError } = await supabase
      .from('reddit_posts')
      .select('*', { count: 'exact', head: true })

    const { count: youtubeVideos, error: youtubeError } = await supabase
      .from('youtube_videos')
      .select('*', { count: 'exact', head: true })

    // Get recent Reddit posts
    const { data: recentReddit, error: recentRedditError } = await supabase
      .from('reddit_posts')
      .select('title, subreddit, score, created_date, keywords_found')
      .order('created_date', { ascending: false })
      .limit(5)

    // Get recent YouTube videos
    const { data: recentYoutube, error: recentYoutubeError } = await supabase
      .from('youtube_videos')
      .select('title, channel_title, view_count, harvested_at')
      .order('harvested_at', { ascending: false })
      .limit(5)

    // NEW: Get adapters and documents data
    const { count: adaptersCount, error: adaptersError } = await supabase
      .from('adapters')
      .select('*', { count: 'exact', head: true })

    const { count: documentsCount, error: documentsError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })

    // Get manufacturer counts from adapters (check what columns exist first)
    const { data: adapterSample, error: adapterSampleError } = await supabase
      .from('adapters')
      .select('*')
      .limit(1)

    let adapterMfgCounts = {}
    if (adapterSample && adapterSample.length > 0) {
      // Check if manufacturer column exists, otherwise use brand or another column
      const columns = Object.keys(adapterSample[0])
      const mfgColumn = columns.find(col =>
        col.toLowerCase().includes('manufacturer') ||
        col.toLowerCase().includes('brand') ||
        col.toLowerCase().includes('vendor')
      )

      if (mfgColumn) {
        const { data: manufacturerData, error: manufacturerError } = await supabase
          .from('adapters')
          .select(mfgColumn)
          .not(mfgColumn, 'is', null)

        adapterMfgCounts = manufacturerData?.reduce((acc: any, item: any) => {
          const mfgName = item[mfgColumn]
          acc[mfgName] = (acc[mfgName] || 0) + 1
          return acc
        }, {}) || {}
      }
    }

    // Get recent documents
    const { data: recentDocuments, error: recentDocsError } = await supabase
      .from('documents')
      .select('title, source, document_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      success: true,
      data: {
        // Original product data
        totalProducts: totalProducts || 0,
        productsWithPricing: productsWithPricing || 0,
        pricingCoverage: totalProducts ? Math.round(((productsWithPricing || 0) / totalProducts) * 100) : 0,
        manufacturerCounts: mfgCounts,
        recentPriceChanges: priceChanges || [],

        // NEW: Social media intelligence data
        socialIntelligence: {
          redditPosts: redditPosts || 0,
          youtubeVideos: youtubeVideos || 0,
          recentReddit: recentReddit || [],
          recentYoutube: recentYoutube || []
        },

        // NEW: Product catalog data
        productCatalog: {
          adaptersCount: adaptersCount || 0,
          documentsCount: documentsCount || 0,
          manufacturerCounts: adapterMfgCounts,
          recentDocuments: recentDocuments || []
        },

        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Overview data error:', error)
    return NextResponse.json({ error: 'Failed to fetch overview data' }, { status: 500 })
  }
}

async function getProductsData(searchParams: URLSearchParams) {
  try {
    const manufacturer = searchParams.get('manufacturer') || ''
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let query = supabase
      .from('products')
      .select(`
        id,
        manufacturer,
        model,
        name,
        category,
        msrp,
        dealer_cost,
        map_price,
        street_price,
        in_stock,
        discontinued,
        price_updated_at,
        created_at
      `)

    // Apply filters
    if (manufacturer) {
      query = query.ilike('manufacturer', `%${manufacturer}%`)
    }

    if (search) {
      query = query.or(`model.ilike.%${search}%,name.ilike.%${search}%,category.ilike.%${search}%`)
    }

    // Get paginated results
    const { data: products, error: productsError } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (productsError) throw productsError

    // Get total count for pagination
    let countQuery = supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (manufacturer) {
      countQuery = countQuery.ilike('manufacturer', `%${manufacturer}%`)
    }

    if (search) {
      countQuery = countQuery.or(`model.ilike.%${search}%,name.ilike.%${search}%,category.ilike.%${search}%`)
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) throw countError

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Products data error:', error)
    return NextResponse.json({ error: 'Failed to fetch products data' }, { status: 500 })
  }
}

async function getPricingData() {
  try {
    // Get best margins view data
    const { data: bestMargins, error: marginsError } = await supabase
      .from('best_margins')
      .select('*')
      .limit(20)

    if (marginsError) throw marginsError

    // Get recent price changes view data
    const { data: recentChanges, error: changesError } = await supabase
      .from('recent_price_changes')
      .select('*')
      .limit(20)

    if (changesError) throw changesError

    // Get pricing statistics
    const { data: pricingStats, error: statsError } = await supabase
      .rpc('get_pricing_stats')

    return NextResponse.json({
      success: true,
      data: {
        bestMargins,
        recentChanges,
        pricingStats: pricingStats || []
      }
    })
  } catch (error) {
    console.error('Pricing data error:', error)
    return NextResponse.json({ error: 'Failed to fetch pricing data' }, { status: 500 })
  }
}

async function getHarvestStatus() {
  try {
    // Get latest upload tracking data
    const { data: uploadStatus, error: uploadError } = await supabase
      .from('price_uploads')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(10)

    if (uploadError) throw uploadError

    // Calculate harvest health metrics
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: recentUpdates, error: recentError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', yesterday.toISOString())

    if (recentError) throw recentError

    return NextResponse.json({
      success: true,
      data: {
        uploadStatus,
        recentUpdates,
        lastHarvestTime: uploadStatus?.[0]?.completed_date || null,
        harvestHealth: recentUpdates > 0 ? 'healthy' : 'stale'
      }
    })
  } catch (error) {
    console.error('Harvest status error:', error)
    return NextResponse.json({ error: 'Failed to fetch harvest status' }, { status: 500 })
  }
}

// POST - Trigger harvest operations
export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json({
        error: 'Database not configured',
        message: 'Supabase environment variables are missing'
      }, { status: 500 })
    }

    const body = await request.json()
    const { action, manufacturer } = body

    switch (action) {
      case 'trigger_harvest':
        return await triggerHarvest(manufacturer)
      case 'update_pricing':
        return await updatePricing()
      case 'schedule_harvest':
        return await scheduleHarvest(body)
      case 'update_schedule':
        return await updateSchedule(body)
      case 'delete_schedule':
        return await deleteSchedule(body.scheduleId)
      case 'add_adapter':
        return await addAdapter(body)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Harvester POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function triggerHarvest(manufacturer?: string) {
  try {
    // Skip database logging for now to avoid Supabase table issues
    // Just return success with instructions for manual execution
    return NextResponse.json({
      success: true,
      message: `Harvest request received for ${manufacturer || 'all manufacturers'}`,
      instructions: `To complete the harvest, run this command in your terminal:\n\ncd C:\\Users\\dkozi\\lowvolt-spec-harvester\npython harvest_cdw.py${manufacturer ? ' ' + manufacturer : ''}\n\nThis will update your database with the latest CDW pricing and proper model numbers.`
    })

  } catch (error) {
    console.error('Trigger harvest error:', error)
    return NextResponse.json({
      success: false,
      message: `Failed to trigger harvest for ${manufacturer || 'all manufacturers'}`,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

async function getRedditData(searchParams: URLSearchParams) {
  try {
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const search = searchParams.get('search') || ''
    const subreddit = searchParams.get('subreddit') || ''
    const offset = (page - 1) * limit

    let query = supabase
      .from('reddit_posts')
      .select(`
        id,
        subreddit,
        title,
        author,
        score,
        num_comments,
        url,
        text_content,
        keywords_found,
        product_models,
        created_date,
        harvested_at
      `)

    // Apply filters
    if (subreddit) {
      query = query.eq('subreddit', subreddit)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,text_content.ilike.%${search}%,keywords_found.ilike.%${search}%`)
    }

    // Get paginated results
    const { data: posts, error: postsError } = await query
      .range(offset, offset + limit - 1)
      .order('created_date', { ascending: false })

    if (postsError) throw postsError

    // Get total count for pagination
    let countQuery = supabase
      .from('reddit_posts')
      .select('*', { count: 'exact', head: true })

    if (subreddit) {
      countQuery = countQuery.eq('subreddit', subreddit)
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,text_content.ilike.%${search}%,keywords_found.ilike.%${search}%`)
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) throw countError

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Reddit data error:', error)
    return NextResponse.json({ error: 'Failed to fetch Reddit data' }, { status: 500 })
  }
}

async function getYouTubeData(searchParams: URLSearchParams) {
  try {
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const search = searchParams.get('search') || ''
    const channel = searchParams.get('channel') || ''
    const offset = (page - 1) * limit

    let query = supabase
      .from('youtube_videos')
      .select(`
        id,
        video_id,
        title,
        description,
        channel_title,
        published_at,
        thumbnail_url,
        url,
        view_count,
        like_count,
        comment_count,
        duration,
        product_models,
        search_term,
        harvested_at
      `)

    // Apply filters
    if (channel) {
      query = query.eq('channel_title', channel)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,channel_title.ilike.%${search}%`)
    }

    // Get paginated results
    const { data: videos, error: videosError } = await query
      .range(offset, offset + limit - 1)
      .order('harvested_at', { ascending: false })

    if (videosError) throw videosError

    // Get total count for pagination
    let countQuery = supabase
      .from('youtube_videos')
      .select('*', { count: 'exact', head: true })

    if (channel) {
      countQuery = countQuery.eq('channel_title', channel)
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,channel_title.ilike.%${search}%`)
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) throw countError

    return NextResponse.json({
      success: true,
      data: {
        videos,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('YouTube data error:', error)
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 })
  }
}

async function updatePricing() {
  // This would connect to your pricing APIs
  return NextResponse.json({
    success: true,
    message: 'Pricing update requested',
    instructions: 'Connect to distributor APIs for real-time pricing'
  })
}

// Simple in-memory scheduler (in production, use a database table)
let schedules: any[] = [
  {
    id: 1,
    name: 'Daily Reddit Harvest',
    type: 'reddit',
    schedule: '0 9 * * *', // 9 AM daily
    enabled: true,
    lastRun: null,
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Weekly YouTube Harvest',
    type: 'youtube',
    schedule: '0 10 * * 1', // 10 AM every Monday
    enabled: true,
    lastRun: null,
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  }
]

async function getSchedulerData() {
  try {
    // Get recent harvest activities from price_uploads table
    const { data: recentActivities, error: activitiesError } = await supabase
      .from('price_uploads')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      data: {
        schedules,
        recentActivities: recentActivities || [],
        stats: {
          totalSchedules: schedules.length,
          activeSchedules: schedules.filter(s => s.enabled).length,
          lastActivity: recentActivities?.[0]?.upload_date || null
        }
      }
    })
  } catch (error) {
    console.error('Scheduler data error:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduler data' }, { status: 500 })
  }
}

async function scheduleHarvest(body: any) {
  try {
    const { name, type, schedule, enabled = true } = body

    const newSchedule = {
      id: Math.max(...schedules.map(s => s.id), 0) + 1,
      name,
      type,
      schedule,
      enabled,
      lastRun: null,
      nextRun: calculateNextRun(schedule),
      created_at: new Date().toISOString()
    }

    schedules.push(newSchedule)

    return NextResponse.json({
      success: true,
      message: 'Harvest schedule created successfully',
      schedule: newSchedule
    })
  } catch (error) {
    console.error('Schedule harvest error:', error)
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 })
  }
}

async function updateSchedule(body: any) {
  try {
    const { scheduleId, name, type, schedule, enabled } = body

    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId)
    if (scheduleIndex === -1) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    schedules[scheduleIndex] = {
      ...schedules[scheduleIndex],
      name: name || schedules[scheduleIndex].name,
      type: type || schedules[scheduleIndex].type,
      schedule: schedule || schedules[scheduleIndex].schedule,
      enabled: enabled !== undefined ? enabled : schedules[scheduleIndex].enabled,
      nextRun: schedule ? calculateNextRun(schedule) : schedules[scheduleIndex].nextRun
    }

    return NextResponse.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule: schedules[scheduleIndex]
    })
  } catch (error) {
    console.error('Update schedule error:', error)
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 })
  }
}

async function deleteSchedule(scheduleId: number) {
  try {
    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId)
    if (scheduleIndex === -1) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    schedules.splice(scheduleIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully'
    })
  } catch (error) {
    console.error('Delete schedule error:', error)
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 })
  }
}

// Helper function to calculate next run time (simplified)
function calculateNextRun(cronExpression: string): string {
  // This is a simplified version - in production use a proper cron parser like 'node-cron'
  const now = new Date()
  now.setHours(now.getHours() + 1) // Next hour as default
  return now.toISOString()
}

async function addAdapter(body: any) {
  try {
    const { name, baseUrl, notes } = body

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    const { data, error } = await supabase
      .from('adapters')
      .insert([{
        name: name,
        slug: slug,
        base_url: baseUrl,
        enabled: true,
        notes: notes || null
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Adapter added successfully',
      adapter: data
    })
  } catch (error) {
    console.error('Add adapter error:', error)
    return NextResponse.json({ error: 'Failed to add adapter' }, { status: 500 })
  }
}

async function getManufacturersData(searchParams: URLSearchParams) {
  try {
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const search = searchParams.get('search') || ''
    const offset = (page - 1) * limit

    // First, get a sample to determine the schema
    const { data: sampleAdapter, error: sampleError } = await supabase
      .from('adapters')
      .select('*')
      .limit(1)

    if (sampleError) throw sampleError

    if (!sampleAdapter || sampleAdapter.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          adapters: [],
          manufacturerStats: [],
          pagination: { total: 0, page, limit, totalPages: 0 }
        }
      })
    }

    // Determine available columns
    const columns = Object.keys(sampleAdapter[0])
    const selectColumns = columns.slice(0, 10) // Select first 10 columns to avoid overwhelming response

    // Get manufacturer statistics from adapters
    let query = supabase
      .from('adapters')
      .select(selectColumns.join(', '))

    // Apply search filter on available text columns
    if (search) {
      const textColumns = selectColumns.filter(col =>
        typeof sampleAdapter[0][col] === 'string'
      )
      if (textColumns.length > 0) {
        const searchConditions = textColumns.map(col => `${col}.ilike.%${search}%`).join(',')
        query = query.or(searchConditions)
      }
    }

    // Get paginated results
    const { data: adapters, error: adaptersError } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (adaptersError) throw adaptersError

    // Get manufacturer summary stats
    const mfgColumn = columns.find(col =>
      col.toLowerCase().includes('manufacturer') ||
      col.toLowerCase().includes('brand') ||
      col.toLowerCase().includes('vendor') ||
      col.toLowerCase().includes('company')
    )

    let manufacturerCounts = {}
    if (mfgColumn) {
      const { data: manufacturerStats, error: statsError } = await supabase
        .from('adapters')
        .select(mfgColumn)
        .not(mfgColumn, 'is', null)

      if (!statsError && manufacturerStats) {
        manufacturerCounts = manufacturerStats.reduce((acc: any, item: any) => {
          const mfgName = item[mfgColumn]
          acc[mfgName] = (acc[mfgName] || 0) + 1
          return acc
        }, {})
      }
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('adapters')
      .select('*', { count: 'exact', head: true })

    if (search) {
      const textColumns = selectColumns.filter(col =>
        typeof sampleAdapter[0][col] === 'string'
      )
      if (textColumns.length > 0) {
        const searchConditions = textColumns.map(col => `${col}.ilike.%${search}%`).join(',')
        countQuery = countQuery.or(searchConditions)
      }
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) throw countError

    return NextResponse.json({
      success: true,
      data: {
        adapters,
        manufacturerStats: Object.entries(manufacturerCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a: any, b: any) => b.count - a.count),
        schema: {
          columns: columns,
          manufacturerColumn: mfgColumn || 'none'
        },
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Manufacturers data error:', error)
    return NextResponse.json({ error: 'Failed to fetch manufacturers data' }, { status: 500 })
  }
}

async function getPublicationsData(searchParams: URLSearchParams) {
  try {
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const search = searchParams.get('search') || ''
    const source = searchParams.get('source') || ''
    const offset = (page - 1) * limit

    // First, get a sample to determine the schema
    const { data: sampleDocument, error: sampleError } = await supabase
      .from('documents')
      .select('*')
      .limit(1)

    if (sampleError) throw sampleError

    if (!sampleDocument || sampleDocument.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          documents: [],
          sourceStats: [],
          pagination: { total: 0, page, limit, totalPages: 0 }
        }
      })
    }

    // Determine available columns
    const columns = Object.keys(sampleDocument[0])
    const selectColumns = columns.slice(0, 10) // Select first 10 columns to avoid overwhelming response

    let query = supabase
      .from('documents')
      .select(selectColumns.join(', '))

    // Apply filters
    if (source && columns.includes('source')) {
      query = query.eq('source', source)
    }

    if (search) {
      const textColumns = selectColumns.filter(col =>
        typeof sampleDocument[0][col] === 'string'
      )
      if (textColumns.length > 0) {
        const searchConditions = textColumns.map(col => `${col}.ilike.%${search}%`).join(',')
        query = query.or(searchConditions)
      }
    }

    // Get paginated results
    const { data: documents, error: documentsError } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (documentsError) throw documentsError

    // Get source statistics
    let sourceStats = []
    if (columns.includes('source')) {
      const { data: sourceData, error: sourceStatsError } = await supabase
        .from('documents')
        .select('source')
        .not('source', 'is', null)

      if (!sourceStatsError && sourceData) {
        const sourceCounts = sourceData.reduce((acc: any, item: any) => {
          const sourceName = item.source
          acc[sourceName] = (acc[sourceName] || 0) + 1
          return acc
        }, {})

        sourceStats = Object.entries(sourceCounts)
          .map(([name, count]) => ({ name, total: count }))
          .sort((a: any, b: any) => b.total - a.total)
      }
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })

    if (source && columns.includes('source')) {
      countQuery = countQuery.eq('source', source)
    }

    if (search) {
      const textColumns = selectColumns.filter(col =>
        typeof sampleDocument[0][col] === 'string'
      )
      if (textColumns.length > 0) {
        const searchConditions = textColumns.map(col => `${col}.ilike.%${search}%`).join(',')
        countQuery = countQuery.or(searchConditions)
      }
    }

    const { count: totalCount, error: countError } = await countQuery

    if (countError) throw countError

    return NextResponse.json({
      success: true,
      data: {
        documents,
        sourceStats,
        schema: {
          columns: columns,
          hasSource: columns.includes('source'),
          hasContent: columns.includes('content')
        },
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Publications data error:', error)
    return NextResponse.json({ error: 'Failed to fetch publications data' }, { status: 500 })
  }
}