import { NextRequest, NextResponse } from 'next/server'
import { searchCache } from '../../../../lib/search-cache'

// Research Assistant External Search API
// Integrates multiple search providers for comprehensive content discovery

interface SearchRequest {
  query: string
  category: 'industry-trends' | 'competitive-analysis' | 'technical-research' | 'content-ideas' | 'market-analysis'
  providers?: ('perplexity' | 'tavily' | 'google' | 'bing')[]
  limit?: number
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all'
  language?: string
}

interface SearchResult {
  id: string
  title: string
  snippet: string
  url: string
  source: string
  publishedDate?: string
  relevanceScore: number
  searchProvider: 'perplexity' | 'tavily' | 'google' | 'bing'
}

interface ExternalSearchResponse {
  query: string
  category: string
  results: SearchResult[]
  totalResults: number
  searchTime: number
  providers: string[]
  metadata: {
    cached: boolean
    timestamp: string
    requestId: string
  }
}

// Mock search results for different categories and providers
const generateMockResults = (query: string, category: string): SearchResult[] => {
  const baseResults = {
    'industry-trends': [
      {
        id: '1',
        title: 'AI Revolution in Physical Security: 2024 Market Trends',
        snippet: 'Artificial intelligence is transforming physical security with smart cameras, predictive analytics, and automated threat detection. Industry growth projected at 15% annually through 2026.',
        url: 'https://securityindustry.org/ai-trends-2024',
        source: 'Security Industry Association',
        publishedDate: '2024-01-15',
        relevanceScore: 0.95,
        searchProvider: 'perplexity' as const
      },
      {
        id: '2',
        title: 'Smart Building Security Integration: The Future is Now',
        snippet: 'IoT sensors, cloud-based management, and real-time analytics are creating comprehensive security ecosystems. 73% of enterprises planning smart security upgrades in 2024.',
        url: 'https://smartbuildings.com/security-integration-2024',
        source: 'Smart Buildings Magazine',
        publishedDate: '2024-01-12',
        relevanceScore: 0.89,
        searchProvider: 'google' as const
      },
      {
        id: '3',
        title: 'Cybersecurity Meets Physical Security: Convergence Trends',
        snippet: 'The merger of IT and physical security creates new opportunities and challenges. Zero-trust architecture extending to access control systems.',
        url: 'https://cybersectoday.com/physical-convergence',
        source: 'Cybersecurity Today',
        publishedDate: '2024-01-10',
        relevanceScore: 0.82,
        searchProvider: 'tavily' as const
      }
    ],
    'competitive-analysis': [
      {
        id: '4',
        title: 'Top Security System Providers 2024: Market Analysis',
        snippet: 'Comprehensive analysis of leading security companies, their market share, technology offerings, and competitive positioning in the evolving landscape.',
        url: 'https://marketresearch.com/security-providers-analysis',
        source: 'Market Research Inc',
        publishedDate: '2024-01-08',
        relevanceScore: 0.92,
        searchProvider: 'google' as const
      },
      {
        id: '5',
        title: 'Pricing Strategies in Security Design: Competitive Landscape',
        snippet: 'How top security firms are pricing AI-enhanced design services, subscription models vs. project-based pricing, and market positioning strategies.',
        url: 'https://securitybiz.com/pricing-analysis-2024',
        source: 'Security Business',
        publishedDate: '2024-01-05',
        relevanceScore: 0.87,
        searchProvider: 'perplexity' as const
      },
      {
        id: '6',
        title: 'Design-First vs. Product-First: Security Market Approaches',
        snippet: 'Analysis of companies leading with design expertise versus those focused on product sales. Customer preference shifting toward consultative approaches.',
        url: 'https://securityexec.com/design-vs-product-approach',
        source: 'Security Executive',
        publishedDate: '2024-01-03',
        relevanceScore: 0.84,
        searchProvider: 'tavily' as const
      }
    ],
    'technical-research': [
      {
        id: '7',
        title: 'Advanced Camera Technologies: 4K, AI, and Beyond',
        snippet: 'Technical specifications and implementation guide for next-generation security cameras. Edge computing, thermal imaging, and behavioral analytics integration.',
        url: 'https://techspecs.security/camera-tech-2024',
        source: 'Security Tech Specs',
        publishedDate: '2024-01-14',
        relevanceScore: 0.94,
        searchProvider: 'google' as const
      },
      {
        id: '8',
        title: 'Access Control Integration APIs: Technical Documentation',
        snippet: 'Comprehensive guide to integrating modern access control systems with building management, HR systems, and security orchestration platforms.',
        url: 'https://accesscontrol.dev/integration-guide',
        source: 'Access Control Developer Hub',
        publishedDate: '2024-01-11',
        relevanceScore: 0.88,
        searchProvider: 'perplexity' as const
      },
      {
        id: '9',
        title: 'Network Architecture for Distributed Security Systems',
        snippet: 'Best practices for designing robust network infrastructure supporting IoT security devices, edge computing, and cloud connectivity.',
        url: 'https://networkdesign.security/distributed-systems',
        source: 'Network Design Security',
        publishedDate: '2024-01-09',
        relevanceScore: 0.85,
        searchProvider: 'tavily' as const
      }
    ],
    'content-ideas': [
      {
        id: '10',
        title: 'Content Marketing Trends in Security Industry 2024',
        snippet: 'What content resonates with security decision-makers: case studies, ROI calculators, technical guides, and thought leadership topics.',
        url: 'https://marketingsec.com/content-trends-2024',
        source: 'Security Marketing Hub',
        publishedDate: '2024-01-13',
        relevanceScore: 0.91,
        searchProvider: 'perplexity' as const
      },
      {
        id: '11',
        title: 'Storytelling in Security: Customer Success Narratives',
        snippet: 'How leading security companies craft compelling customer stories. Focus on business outcomes, risk mitigation, and transformation journeys.',
        url: 'https://contentstrategy.security/storytelling-guide',
        source: 'Security Content Strategy',
        publishedDate: '2024-01-07',
        relevanceScore: 0.86,
        searchProvider: 'google' as const
      },
      {
        id: '12',
        title: 'Video Content Strategy for B2B Security Marketing',
        snippet: 'Best practices for creating engaging security content: installation timelapses, expert interviews, product demonstrations, and educational series.',
        url: 'https://videosec.com/b2b-strategy',
        source: 'Video Security Marketing',
        publishedDate: '2024-01-06',
        relevanceScore: 0.83,
        searchProvider: 'tavily' as const
      }
    ],
    'market-analysis': [
      {
        id: '13',
        title: 'Physical Security Market Size and Growth Projections',
        snippet: 'Global physical security market valued at $134.8B in 2023, projected to reach $198.5B by 2028. AI and IoT driving growth in enterprise segment.',
        url: 'https://marketsize.security/global-analysis-2024',
        source: 'Security Market Analysis',
        publishedDate: '2024-01-16',
        relevanceScore: 0.96,
        searchProvider: 'google' as const
      },
      {
        id: '14',
        title: 'Regional Security Spending Patterns: North America vs. EMEA',
        snippet: 'Comparative analysis of security investment priorities by region. North America leads in AI adoption, EMEA focuses on compliance-driven solutions.',
        url: 'https://regionaltrends.security/spending-analysis',
        source: 'Regional Security Trends',
        publishedDate: '2024-01-12',
        relevanceScore: 0.88,
        searchProvider: 'perplexity' as const
      },
      {
        id: '15',
        title: 'SME vs. Enterprise Security: Market Segmentation Analysis',
        snippet: 'Different needs, budgets, and decision-making processes between small-medium enterprises and large corporations in security investments.',
        url: 'https://segmentation.security/sme-vs-enterprise',
        source: 'Security Segmentation Report',
        publishedDate: '2024-01-09',
        relevanceScore: 0.84,
        searchProvider: 'tavily' as const
      }
    ]
  }

  // Return results for the specified category, or industry-trends as default
  return baseResults[category as keyof typeof baseResults] || baseResults['industry-trends']
}

const validateSearchRequest = (body: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!body.query || typeof body.query !== 'string' || body.query.trim().length === 0) {
    errors.push('Query is required and must be a non-empty string')
  }

  if (body.query && body.query.length > 500) {
    errors.push('Query must be less than 500 characters')
  }

  const validCategories = ['industry-trends', 'competitive-analysis', 'technical-research', 'content-ideas', 'market-analysis']
  if (!body.category || !validCategories.includes(body.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`)
  }

  const validProviders = ['perplexity', 'tavily', 'google', 'bing']
  if (body.providers && Array.isArray(body.providers)) {
    const invalidProviders = body.providers.filter(p => !validProviders.includes(p))
    if (invalidProviders.length > 0) {
      errors.push(`Invalid providers: ${invalidProviders.join(', ')}. Valid providers: ${validProviders.join(', ')}`)
    }
  }

  if (body.limit && (typeof body.limit !== 'number' || body.limit < 1 || body.limit > 50)) {
    errors.push('Limit must be a number between 1 and 50')
  }

  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  const requestId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  try {
    const body = await request.json()

    // Validate request
    const validation = validateSearchRequest(body)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid request parameters',
          details: validation.errors,
          requestId
        },
        { status: 400 }
      )
    }

    const {
      query,
      category,
      providers = ['perplexity', 'google', 'tavily'],
      limit = 10,
      timeRange = 'all',
      language = 'en'
    }: SearchRequest = body

    const startTime = Date.now()

    // Check cache first for performance
    const cacheKey = searchCache.generateKey(query, category, providers)
    const cachedResults = searchCache.get(cacheKey)

    if (cachedResults) {
      searchCache.recordHit()
      const response: ExternalSearchResponse = {
        ...cachedResults,
        searchTime: Date.now() - startTime,
        metadata: {
          ...cachedResults.metadata,
          cached: true,
          timestamp: new Date().toISOString(),
          requestId
        }
      }
      return NextResponse.json(response)
    }

    searchCache.recordMiss()

    // In a real implementation, this would:
    // 1. Call external APIs in parallel:
    //    - Perplexity API for real-time web search with AI summaries
    //    - Tavily API for research-focused search results
    //    - Google Custom Search API for broad web coverage
    //    - Bing Web Search API as backup
    // 2. Aggregate and deduplicate results
    // 3. Apply relevance scoring and ranking
    // 4. Handle API rate limits and fallbacks

    // For demo purposes, return enhanced mock results
    const allResults = generateMockResults(query, category)

    // Filter results based on requested providers
    const filteredResults = allResults.filter(result =>
      providers.includes(result.searchProvider)
    ).slice(0, limit)

    const searchTime = Date.now() - startTime

    const response: ExternalSearchResponse = {
      query,
      category,
      results: filteredResults,
      totalResults: filteredResults.length,
      searchTime,
      providers,
      metadata: {
        cached: false,
        timestamp: new Date().toISOString(),
        requestId
      }
    }

    // Cache the results for future requests
    searchCache.set(cacheKey, response)

    return NextResponse.json(response)

  } catch (error) {
    console.error('External search error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
          requestId
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error during search operation',
        requestId
      },
      { status: 500 }
    )
  }
}

// Health check endpoint with cache statistics
export async function GET() {
  const cacheStats = searchCache.getStats()

  return NextResponse.json({
    status: 'healthy',
    service: 'research-external-search',
    providers: ['perplexity', 'tavily', 'google', 'bing'],
    cache: {
      ...cacheStats,
      enabled: true
    },
    capabilities: [
      'multi-provider search',
      'intelligent caching',
      'request validation',
      'performance monitoring'
    ],
    timestamp: new Date().toISOString()
  })
}