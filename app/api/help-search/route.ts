import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProductSearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  manufacturer: string;
}

interface HelpSearchResult {
  type: 'help' | 'product' | 'action';
  id: string;
  title: string;
  description: string;
  category: string;
  relevance: number;
  url?: string;
  action?: string;
  metadata?: any;
}

export async function POST(request: NextRequest) {
  try {
    const { query, context, limit = 10 } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], suggestions: [] });
    }

    const searchQuery = query.toLowerCase().trim();
    const results: HelpSearchResult[] = [];

    // Search help articles
    const helpResults = await searchHelpArticles(searchQuery);
    results.push(...helpResults);

    // Search products if query seems product-related
    const productKeywords = ['camera', 'access', 'door', 'sensor', 'alarm', 'nvr', 'dvr', 'panel', 'detector'];
    const isProductQuery = productKeywords.some(keyword => searchQuery.includes(keyword));

    if (isProductQuery) {
      const productResults = await searchProducts(searchQuery);
      results.push(...productResults);
    }

    // Add context-based suggestions
    const suggestions = generateContextSuggestions(context, searchQuery);

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({
      results: results.slice(0, limit),
      suggestions,
      query: searchQuery,
      context
    });

  } catch (error) {
    console.error('Help search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function searchHelpArticles(query: string): Promise<HelpSearchResult[]> {
  const helpArticles = [
    {
      id: 'estimate-guide',
      title: 'Creating Security Estimates',
      description: 'Complete guide to generating accurate pricing estimates for security systems',
      category: 'Estimation',
      tags: ['estimate', 'pricing', 'security', 'guide'],
      url: '/help/estimation-guide'
    },
    {
      id: 'ai-assessment',
      title: 'AI Discovery Assistant',
      description: 'How to use the AI assistant for comprehensive security assessments',
      category: 'Assessment',
      tags: ['ai', 'assessment', 'discovery', 'assistant'],
      url: '/help/ai-assessment'
    },
    {
      id: 'compliance-guide',
      title: 'Compliance Requirements',
      description: 'FERPA, HIPAA, CJIS compliance for security installations',
      category: 'Compliance',
      tags: ['ferpa', 'hipaa', 'cjis', 'compliance', 'regulations'],
      url: '/help/compliance'
    },
    {
      id: 'creative-studio',
      title: 'Creative Studio Guide',
      description: 'Generate marketing content with AI assistance',
      category: 'Content',
      tags: ['creative', 'content', 'marketing', 'writing'],
      url: '/help/creative-studio'
    },
    {
      id: 'product-search',
      title: 'Product Database Search',
      description: 'Find the right security products from our database of 3,000+ items',
      category: 'Products',
      tags: ['products', 'search', 'database', 'catalog'],
      url: '/help/product-search'
    },
    {
      id: 'facility-types',
      title: 'Security by Facility Type',
      description: 'Best practices for different building types and environments',
      category: 'Installation',
      tags: ['facility', 'office', 'warehouse', 'retail', 'education'],
      url: '/help/facility-types'
    }
  ];

  return helpArticles
    .filter(article => {
      const searchFields = [
        article.title.toLowerCase(),
        article.description.toLowerCase(),
        article.category.toLowerCase(),
        ...article.tags
      ];
      return searchFields.some(field => field.includes(query));
    })
    .map(article => {
      // Calculate relevance based on matches
      let relevance = 0;
      if (article.title.toLowerCase().includes(query)) relevance += 10;
      if (article.description.toLowerCase().includes(query)) relevance += 5;
      if (article.category.toLowerCase().includes(query)) relevance += 3;
      article.tags.forEach(tag => {
        if (tag.includes(query)) relevance += 2;
      });

      return {
        type: 'help' as const,
        id: article.id,
        title: article.title,
        description: article.description,
        category: article.category,
        relevance,
        url: article.url,
        metadata: { tags: article.tags }
      };
    });
}

async function searchProducts(query: string): Promise<HelpSearchResult[]> {
  try {
    const { data: products, error } = await supabase
      .from('security_products')
      .select('id, name, description, category, price, manufacturer')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(5);

    if (error) {
      console.error('Product search error:', error);
      return [];
    }

    return (products || []).map((product: ProductSearchResult) => ({
      type: 'product' as const,
      id: `product-${product.id}`,
      title: product.name,
      description: `${product.manufacturer} - $${product.price} | ${product.description}`,
      category: product.category,
      relevance: 5, // Products get medium relevance
      metadata: {
        price: product.price,
        manufacturer: product.manufacturer,
        productId: product.id
      }
    }));
  } catch (error) {
    console.error('Product search failed:', error);
    return [];
  }
}

function generateContextSuggestions(context: string, query: string): HelpSearchResult[] {
  const suggestions: HelpSearchResult[] = [];

  // Context-based suggestions
  if (context?.includes('estimate')) {
    suggestions.push({
      type: 'action',
      id: 'upgrade-assessment',
      title: 'Upgrade to AI Assessment',
      description: 'Get more detailed analysis and recommendations',
      category: 'Quick Action',
      relevance: 8,
      action: 'navigate:/ai-assessment'
    });
  }

  if (context?.includes('assessment')) {
    suggestions.push({
      type: 'action',
      id: 'check-compliance',
      title: 'Check Compliance Requirements',
      description: 'Ensure your design meets regulatory standards',
      category: 'Quick Action',
      relevance: 8,
      action: 'search:compliance'
    });
  }

  if (context?.includes('creative')) {
    suggestions.push({
      type: 'action',
      id: 'brand-voice',
      title: 'Apply Brand Voice',
      description: 'Use Tuesday Morning Storm messaging framework',
      category: 'Quick Action',
      relevance: 8,
      action: 'search:brand voice'
    });
  }

  // General quick actions
  if (!context || context === 'home') {
    suggestions.push(
      {
        type: 'action',
        id: 'quick-start',
        title: 'Quick Start Guide',
        description: 'Get your first estimate in 5 minutes',
        category: 'Getting Started',
        relevance: 9,
        action: 'navigate:/estimate-options'
      },
      {
        type: 'action',
        id: 'find-products',
        title: 'Search Products',
        description: 'Browse our security product database',
        category: 'Products',
        relevance: 7,
        action: 'search:products'
      }
    );
  }

  return suggestions;
}

export async function GET(request: NextRequest) {
  // Handle GET requests for health check or documentation
  return NextResponse.json({
    message: 'Help Search API',
    endpoints: {
      'POST /api/help-search': 'Search help articles, products, and actions',
    },
    version: '1.0.0'
  });
}
