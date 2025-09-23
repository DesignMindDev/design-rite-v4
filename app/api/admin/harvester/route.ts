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
      case 'reddit':
        return await getRedditData(searchParams)
      case 'youtube':
        return await getYouTubeData(searchParams)
      case 'manufacturers':
        return await getManufacturersData(searchParams)
      case 'publications':
        return await getPublicationsData(searchParams)
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