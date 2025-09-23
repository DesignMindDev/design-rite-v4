import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const limit = parseInt(searchParams.get('limit') || '20')
    const ndaaCompliant = searchParams.get('ndaa_compliant') === 'true'

    console.log('🔍 Product search request:', { query, manufacturer, category, ndaaCompliant })

    let supabaseQuery = supabase
      .from('products')
      .select(`
        id,
        manufacturer,
        model,
        name,
        category,
        sku,
        msrp,
        dealer_cost,
        map_price,
        street_price,
        specs,
        in_stock,
        discontinued,
        source_url,
        created_at,
        updated_at
      `)

    // Text search across multiple fields
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `manufacturer.ilike.%${query}%,model.ilike.%${query}%,name.ilike.%${query}%,category.ilike.%${query}%`
      )
    }

    // Filter by manufacturer
    if (manufacturer) {
      supabaseQuery = supabaseQuery.ilike('manufacturer', `%${manufacturer}%`)
    }

    // Filter by category
    if (category) {
      supabaseQuery = supabaseQuery.ilike('category', `%${category}%`)
    }

    // NDAA compliance filter (exclude banned manufacturers)
    if (ndaaCompliant) {
      const bannedManufacturers = ['Hikvision', 'Dahua', 'Hytera', 'ZTE', 'Huawei']
      supabaseQuery = supabaseQuery.not('manufacturer', 'in', `(${bannedManufacturers.join(',')})`)
    }

    // Price range filters
    if (minPrice) {
      supabaseQuery = supabaseQuery.gte('msrp', parseFloat(minPrice))
    }
    if (maxPrice) {
      supabaseQuery = supabaseQuery.lte('msrp', parseFloat(maxPrice))
    }

    // Only return products with valid pricing and in stock
    supabaseQuery = supabaseQuery
      .not('msrp', 'is', null)
      .eq('in_stock', true)
      .eq('discontinued', false)
      .order('updated_at', { ascending: false })
      .limit(limit)

    const { data: products, error } = await supabaseQuery

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    // Calculate profit margins and format for AI consumption
    const formattedProducts = products.map(product => {
      const margin = product.msrp && product.dealer_cost ?
        ((product.msrp - product.dealer_cost) / product.msrp * 100) : 0

      return {
        id: product.id,
        manufacturer: product.manufacturer,
        model: product.model,
        name: product.name,
        category: product.category,
        sku: product.sku,
        pricing: {
          msrp: product.msrp,
          dealerCost: product.dealer_cost,
          mapPrice: product.map_price,
          streetPrice: product.street_price,
          margin: Math.round(margin * 10) / 10,
          currency: 'USD'
        },
        specifications: product.specs || {},
        availability: {
          inStock: product.in_stock,
          discontinued: product.discontinued
        },
        compliance: {
          ndaaCompliant: !['Hikvision', 'Dahua', 'Hytera', 'ZTE', 'Huawei'].includes(product.manufacturer)
        },
        sourceUrl: product.source_url,
        lastUpdated: product.updated_at
      }
    })

    console.log(`✅ Found ${formattedProducts.length} products`)

    return NextResponse.json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
      searchParams: {
        query,
        manufacturer,
        category,
        ndaaCompliant,
        priceRange: minPrice || maxPrice ? { min: minPrice, max: maxPrice } : null
      }
    })

  } catch (error) {
    console.error('Product search error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 })
  }
}

// POST endpoint for bulk product recommendations for AI assessments
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      facilityType,
      securityConcerns,
      squareFootage,
      budget,
      requireNDAACompliance = true
    } = body

    console.log('🤖 AI Assessment product recommendation request:', { facilityType, budget })

    // Define product categories based on facility needs
    const productCategories = {
      'cameras': ['IP Camera', 'PTZ Camera', 'Dome Camera', 'Bullet Camera'],
      'access_control': ['Card Reader', 'Access Controller', 'Electric Lock'],
      'intrusion': ['Motion Detector', 'Glass Break Detector', 'Door Contact'],
      'fire_alarm': ['Smoke Detector', 'Pull Station', 'Fire Panel'],
      'networking': ['PoE Switch', 'Network Recorder', 'UPS']
    }

    const recommendations = {}

    // Get recommendations for each category
    for (const [categoryKey, categoryValues] of Object.entries(productCategories)) {
      let query = supabase
        .from('products')
        .select(`
          id, manufacturer, model, name, category, msrp, dealer_cost, specs,
          in_stock, discontinued
        `)
        .in('category', categoryValues)
        .eq('in_stock', true)
        .eq('discontinued', false)
        .not('msrp', 'is', null)

      // NDAA compliance
      if (requireNDAACompliance) {
        const bannedManufacturers = ['Hikvision', 'Dahua', 'Hytera', 'ZTE', 'Huawei']
        query = query.not('manufacturer', 'in', `(${bannedManufacturers.join(',')})`)
      }

      // Budget considerations
      if (budget) {
        const budgetNum = parseInt(budget.replace(/[^0-9]/g, ''))
        if (budgetNum < 50000) {
          // Lower budget - prefer cost-effective options
          query = query.lte('msrp', 1000)
        } else if (budgetNum < 200000) {
          // Medium budget - mid-range options
          query = query.lte('msrp', 3000)
        }
        // High budget - no price restrictions
      }

      query = query
        .order('msrp', { ascending: true })
        .limit(5)

      const { data: products, error } = await query

      if (!error && products.length > 0) {
        recommendations[categoryKey] = products.map(product => ({
          id: product.id,
          manufacturer: product.manufacturer,
          model: product.model,
          name: product.name,
          category: product.category,
          msrp: product.msrp,
          dealerCost: product.dealer_cost,
          margin: product.msrp && product.dealer_cost ?
            Math.round(((product.msrp - product.dealer_cost) / product.msrp * 100) * 10) / 10 : 0,
          specifications: product.specs || {},
          ndaaCompliant: !['Hikvision', 'Dahua', 'Hytera', 'ZTE', 'Huawei'].includes(product.manufacturer)
        }))
      }
    }

    console.log(`✅ Generated recommendations for ${Object.keys(recommendations).length} categories`)

    return NextResponse.json({
      success: true,
      facilityType,
      securityConcerns,
      recommendations,
      totalCategories: Object.keys(recommendations).length,
      ndaaCompliant: requireNDAACompliance,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Product recommendation error:', error)
    return NextResponse.json({
      error: 'Failed to generate product recommendations',
      message: error.message
    }, { status: 500 })
  }
}