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
      return NextResponse.json({
        error: 'Database not configured',
        message: 'Supabase environment variables are missing'
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
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Harvester POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function triggerHarvest(manufacturer?: string) {
  // Log harvest trigger request
  const { data, error } = await supabase
    .from('price_uploads')
    .insert([{
      filename: `Manual trigger - ${manufacturer || 'all'}`,
      distributor_name: 'System',
      status: 'triggered',
      total_rows: 0,
      rows_processed: 0
    }])
    .select()
    .single()

  if (error) throw error

  // In production, this would trigger your Python harvester
  // For now, return success with instructions
  return NextResponse.json({
    success: true,
    message: `Harvest triggered for ${manufacturer || 'all manufacturers'}`,
    harvestId: data.id,
    instructions: 'Run your Python harvester script to process this request'
  })
}

async function updatePricing() {
  // This would connect to your pricing APIs
  return NextResponse.json({
    success: true,
    message: 'Pricing update requested',
    instructions: 'Connect to distributor APIs for real-time pricing'
  })
}