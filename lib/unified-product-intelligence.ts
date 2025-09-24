// File: lib/unified-product-intelligence.ts
// Purpose: Bridge between harvester data and frontend Discovery Assistant

interface ProductData {
  id: string;
  manufacturer: string;
  model: string;
  name: string;
  category?: string;
  msrp?: number;
  dealer_cost?: number;
  street_price?: number;  // Real CDW pricing
  source_url: string;
  specs?: any;
  price_updated_at?: string;
}

interface PricingIntelligence {
  product: ProductData;
  pricing_analysis: {
    market_position: 'budget' | 'mid-range' | 'premium';
    price_trend: 'stable' | 'increasing' | 'decreasing';
    margin_opportunity: number;
    last_updated: string;
  };
}

export class UnifiedProductIntelligence {
  private harvesterApiUrl: string;

  constructor() {
    // Connect to your working harvester API (port 8002)
    this.harvesterApiUrl = process.env.NEXT_PUBLIC_HARVESTER_API_URL || 'http://localhost:8002';
  }

  // Get products with real CDW pricing data
  async searchProducts(query: string, category?: string): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({
        query: query,
        limit: '20'
      });

      if (category) params.append('category', category);

      const response = await fetch(`${this.harvesterApiUrl}/api/v1/products/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Harvester API error: ${response.status}`);
        return []; // Graceful fallback
      }

      const data = await response.json();
      console.log(`Found ${data.products?.length || 0} real products for query: ${query}`);

      // Transform API response to match our interface
      return (data.products || []).map((p: any) => ({
        id: p.id?.toString() || '',
        manufacturer: p.manufacturer || '',
        model: p.model || '',
        name: p.description || `${p.manufacturer} ${p.model}`,
        category: p.category || 'Security Equipment',
        msrp: p.pricing?.msrp || null,
        dealer_cost: p.pricing?.dealer_cost || null,
        street_price: p.pricing?.street_price || null,
        source_url: p.source_url || '',
        specs: p.specifications || {},
        price_updated_at: p.last_updated || null
      }));
    } catch (error) {
      console.error('Product search error:', error);
      // Don't break user experience - return empty array
      return [];
    }
  }

  // Enhanced product recommendations for Discovery Assistant
  async getSmartRecommendations(requirements: {
    facilityType: string;
    squareFootage?: number;
    budget?: string;
    securityLevel: string;
  }): Promise<ProductData[]> {
    try {
      console.log('Getting smart recommendations for:', requirements);

      // Build search terms based on facility requirements
      const searchTerms = this.buildSearchTerms(requirements);
      const allProducts: ProductData[] = [];

      // Search for each category with real products
      for (const term of searchTerms) {
        const products = await this.searchProducts(term);
        allProducts.push(...products);
      }

      // Remove duplicates and rank by relevance + pricing
      const recommendations = this.rankAndFilterProducts(allProducts, requirements);

      console.log(`Generated ${recommendations.length} smart recommendations`);
      return recommendations;

    } catch (error) {
      console.error('Smart recommendations error:', error);
      return [];
    }
  }

  private buildSearchTerms(requirements: any): string[] {
    const terms = ['camera', 'access control'];

    // Add specific terms based on facility type
    const facilityLower = requirements.facilityType?.toLowerCase() || '';

    if (facilityLower.includes('warehouse') || facilityLower.includes('industrial')) {
      terms.push('analytics', 'perimeter', 'thermal');
    }
    if (facilityLower.includes('office') || facilityLower.includes('corporate')) {
      terms.push('indoor', 'visitor management', 'facial recognition');
    }
    if (facilityLower.includes('retail') || facilityLower.includes('store')) {
      terms.push('people counting', 'loss prevention', 'POS integration');
    }

    return terms;
  }

  private rankAndFilterProducts(products: ProductData[], requirements: any): ProductData[] {
    // Remove duplicates by model number
    const uniqueProducts = products.filter((product, index, self) =>
      index === self.findIndex(p => p.model === product.model)
    );

    // Sort by relevance and price point
    return uniqueProducts
      .sort((a, b) => {
        // Prioritize products with pricing data (real CDW pricing)
        const aHasPrice = (a.street_price || 0) > 0;
        const bHasPrice = (b.street_price || 0) > 0;

        if (aHasPrice && !bHasPrice) return -1;
        if (!aHasPrice && bHasPrice) return 1;

        // Then sort by price (ascending for better user experience)
        return (a.street_price || 0) - (b.street_price || 0);
      })
      .slice(0, 12); // Return top 12 recommendations
  }

  // Analyze pricing data from CDW
  analyzePricing(product: ProductData) {
    const streetPrice = product.street_price || 0;
    const msrp = product.msrp || streetPrice * 1.3; // Estimate if not available

    // Determine market position based on your actual price ranges
    let market_position: 'budget' | 'mid-range' | 'premium' = 'mid-range';

    if (streetPrice > 0) {
      if (streetPrice < 500) market_position = 'budget';
      else if (streetPrice > 2000) market_position = 'premium';
    }

    // Calculate margin opportunity
    const margin_opportunity = msrp > streetPrice ? ((msrp - streetPrice) / msrp) * 100 : 25; // Default 25%

    return {
      market_position,
      price_trend: 'stable' as const,
      margin_opportunity: Math.round(margin_opportunity),
      last_updated: product.price_updated_at || new Date().toISOString()
    };
  }

  // Health check for harvester connection
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.harvesterApiUrl}/`);
      const result = response.ok;
      console.log(`Harvester health check: ${result ? 'CONNECTED' : 'FAILED'}`);
      return result;
    } catch (error) {
      console.error('Harvester health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const productIntelligence = new UnifiedProductIntelligence();

// Helper function for Discovery Assistant integration
export async function getEnhancedRecommendations(userRequirements: any) {
  console.log('Getting enhanced recommendations with real pricing data...');

  const products = await productIntelligence.getSmartRecommendations(userRequirements);

  // Format for Discovery Assistant display with REAL pricing
  return products.map(product => {
    const pricing = productIntelligence.analyzePricing(product);

    return {
      name: product.name || `${product.manufacturer} ${product.model}`,
      manufacturer: product.manufacturer,
      model: product.model,
      price: product.street_price ? `$${product.street_price.toLocaleString()}` : 'Quote Required',
      priceNumeric: product.street_price || 0,
      category: product.category,
      specifications: product.specs || {},
      marketPosition: pricing.market_position,
      marginOpportunity: pricing.margin_opportunity,
      source: 'Live CDW Data', // Indicates real data, not generic
      sourceUrl: product.source_url,
      lastUpdated: product.price_updated_at,
      isRealData: true // Flag to distinguish from generic recommendations
    };
  });
}

// Utility function to format pricing display
export function formatPricing(product: any) {
  if (!product.priceNumeric || product.priceNumeric === 0) {
    return 'Contact for Pricing';
  }

  return `$${product.priceNumeric.toLocaleString()} ${product.source ? '(Live Price)' : ''}`;
}