/**
 * Product Intelligence API Client for Design-Rite
 * Connects to the harvester backend for real-time product data
 */

export interface ProductFilters {
  category?: string;
  manufacturer?: string;
  priceMin?: number;
  priceMax?: number;
  complianceRequired?: string[];
  ndaaCompliant?: boolean;
}

export interface SystemRequirements {
  environmentType: 'indoor' | 'outdoor' | 'harsh';
  coverageArea: number; // square feet
  resolutionRequired: '720p' | '1080p' | '4K' | '8K';
  budgetMax?: number;
  complianceRequirements?: string[];
  specialFeatures?: string[];
}

export interface ProductData {
  id: number;
  model: string;
  manufacturer: string;
  description: string;
  specifications: any;
  pricing: {
    msrp?: number;
    dealerCost?: number;
    streetPrice?: number;
  };
  sourceUrl: string;
  lastUpdated: string;
}

export interface ProductRecommendation {
  productId: number;
  model: string;
  manufacturer: string;
  confidenceScore: number;
  reasoning: string;
  pricing?: {
    msrp?: number;
    dealerCost?: number;
    streetPrice?: number;
  };
  specifications: any;
  sourceUrl: string;
}

export interface PricingData {
  productId: number;
  model: string;
  manufacturer: string;
  pricing: {
    msrp?: number;
    dealerCost?: number;
    streetPrice?: number;
  };
  lastUpdated: string;
}

export class ProductIntelligenceAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_HARVESTER_API_URL || 'http://localhost:8000';
  }

  /**
   * Search products with filters
   */
  async searchProducts(
    query: string,
    filters: ProductFilters = {},
    limit: number = 20
  ): Promise<{ total: number; products: ProductData[] }> {
    const searchParams = new URLSearchParams({
      query,
      limit: limit.toString(),
    });

    if (filters.category) searchParams.append('category', filters.category);
    if (filters.manufacturer) searchParams.append('manufacturer', filters.manufacturer);
    if (filters.priceMin) searchParams.append('price_min', filters.priceMin.toString());
    if (filters.priceMax) searchParams.append('price_max', filters.priceMax.toString());
    if (filters.ndaaCompliant !== undefined) searchParams.append('ndaa_compliant', filters.ndaaCompliant.toString());

    const response = await fetch(`/api/products/search?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Product search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get AI-powered product recommendations
   */
  async getProductRecommendations(
    requirements: SystemRequirements
  ): Promise<{
    requirements: SystemRequirements;
    totalRecommendations: number;
    recommendations: ProductRecommendation[];
  }> {
    const response = await fetch(`${this.baseURL}/api/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        environment_type: requirements.environmentType,
        coverage_area: requirements.coverageArea,
        resolution_required: requirements.resolutionRequired,
        budget_max: requirements.budgetMax,
        compliance_requirements: requirements.complianceRequirements,
        special_features: requirements.specialFeatures,
      }),
    });

    if (!response.ok) {
      throw new Error(`Recommendations failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get alternative products for a given product
   */
  async getProductAlternatives(
    productId: number,
    budgetConstraint?: number
  ): Promise<{
    originalProduct: { id: number; model: string; manufacturer: string };
    alternatives: Array<ProductData & { similarityScore: number }>;
  }> {
    const searchParams = new URLSearchParams();
    if (budgetConstraint) {
      searchParams.append('budget_constraint', budgetConstraint.toString());
    }

    const url = `${this.baseURL}/api/v1/products/${productId}/alternatives${
      searchParams.toString() ? `?${searchParams}` : ''
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Alternatives search failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get real-time pricing for a single product
   */
  async getLivePricing(productId: number): Promise<{
    productId: number;
    model: string;
    manufacturer: string;
    currentPricing: {
      msrp?: number;
      dealerCost?: number;
      streetPrice?: number;
    };
    lastUpdated: string;
    priceHistory: Array<{
      priceType: string;
      price: number;
      recordedAt: string;
    }>;
  }> {
    const response = await fetch(`${this.baseURL}/api/v1/pricing/live/${productId}`);

    if (!response.ok) {
      throw new Error(`Live pricing failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get pricing for multiple products (for proposals)
   */
  async getBatchPricing(productIds: number[]): Promise<{
    totalProducts: number;
    pricingData: PricingData[];
  }> {
    const response = await fetch(`${this.baseURL}/api/v1/pricing/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productIds),
    });

    if (!response.ok) {
      throw new Error(`Batch pricing failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Health check for the API
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseURL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Singleton instance
export const productIntelligenceAPI = new ProductIntelligenceAPI();

// React hooks for easier integration
export function useProductSearch() {
  return {
    searchProducts: productIntelligenceAPI.searchProducts.bind(productIntelligenceAPI),
  };
}

export function useProductRecommendations() {
  return {
    getRecommendations: productIntelligenceAPI.getProductRecommendations.bind(productIntelligenceAPI),
    getAlternatives: productIntelligenceAPI.getProductAlternatives.bind(productIntelligenceAPI),
  };
}

export function usePricingIntelligence() {
  return {
    getLivePricing: productIntelligenceAPI.getLivePricing.bind(productIntelligenceAPI),
    getBatchPricing: productIntelligenceAPI.getBatchPricing.bind(productIntelligenceAPI),
  };
}