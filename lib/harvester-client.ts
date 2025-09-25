/**
 * Harvester API Client for Design-Rite
 * Provides authenticated access to the harvester service
 */

import * as auth from './auth'

const HARVESTER_API_URL = process.env.NEXT_PUBLIC_HARVESTER_API_URL || 'http://localhost:8000'

export interface HarvestJob {
  job_id: string
  source: string
  manufacturer?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
  started_at?: string
  completed_at?: string
  results?: {
    output: string
    products_processed: number
    new_products: number
    updated_prices: number
    errors: number
  }
  error?: string
}

export interface HarvestRequest {
  source: 'cdw' | 'source_security' | 'security_sales'
  manufacturer?: string
  pages?: number
}

export interface LoginResponse {
  success: boolean
  token: string
  message: string
  expires_in: number
}

class HarvesterClient {
  private token: string | null = null
  private tokenExpiry: number = 0

  /**
   * Get authentication token for harvester API
   */
  private async getAuthToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token
    }

    // Get admin password from Design-Rite auth system
    const adminPassword = auth.ADMIN_PASSWORD

    try {
      const response = await fetch(`${HARVESTER_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: adminPassword
        })
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data: LoginResponse = await response.json()

      if (!data.success) {
        throw new Error(`Authentication failed: ${data.message}`)
      }

      // Store token and expiry
      this.token = data.token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - (5 * 60 * 1000) // 5 min buffer

      return this.token
    } catch (error) {
      console.error('Harvester authentication error:', error)
      throw new Error('Failed to authenticate with harvester service')
    }
  }

  /**
   * Make authenticated request to harvester API
   */
  private async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getAuthToken()

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
  }

  /**
   * Trigger a harvest operation
   */
  async triggerHarvest(request: HarvestRequest): Promise<{ job_id: string; message: string; status: string }> {
    try {
      const response = await this.authenticatedFetch(`${HARVESTER_API_URL}/api/v1/harvest/trigger`, {
        method: 'POST',
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`Harvest trigger failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Harvest trigger error:', error)
      throw error
    }
  }

  /**
   * Get harvest job status
   */
  async getJobStatus(jobId: string): Promise<HarvestJob> {
    try {
      const response = await fetch(`${HARVESTER_API_URL}/api/v1/harvest/status/${jobId}`)

      if (!response.ok) {
        throw new Error(`Failed to get job status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Get job status error:', error)
      throw error
    }
  }

  /**
   * List harvest jobs
   */
  async listJobs(): Promise<{ total_jobs: number; active_jobs: number; jobs: HarvestJob[] }> {
    try {
      const response = await fetch(`${HARVESTER_API_URL}/api/v1/harvest/jobs`)

      if (!response.ok) {
        throw new Error(`Failed to list jobs: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('List jobs error:', error)
      throw error
    }
  }

  /**
   * Cancel a harvest job
   */
  async cancelJob(jobId: string): Promise<{ message: string }> {
    try {
      const response = await this.authenticatedFetch(`${HARVESTER_API_URL}/api/v1/harvest/jobs/${jobId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to cancel job: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Cancel job error:', error)
      throw error
    }
  }

  /**
   * Trigger CDW harvest (legacy compatibility)
   */
  async triggerCDWHarvest(manufacturer?: string): Promise<{ job_id: string; message: string; status: string }> {
    return this.triggerHarvest({
      source: 'cdw',
      manufacturer,
      pages: 5
    })
  }

  /**
   * Trigger Source Security harvest
   */
  async triggerSourceSecurityHarvest(): Promise<{ job_id: string; message: string; status: string }> {
    return this.triggerHarvest({
      source: 'source_security'
    })
  }

  /**
   * Trigger Security Sales harvest
   */
  async triggerSecuritySalesHarvest(): Promise<{ job_id: string; message: string; status: string }> {
    return this.triggerHarvest({
      source: 'security_sales'
    })
  }

  /**
   * Get harvester service status
   */
  async getServiceStatus(): Promise<any> {
    try {
      const response = await fetch(`${HARVESTER_API_URL}/api/v1/auth/status`)

      if (!response.ok) {
        throw new Error(`Failed to get service status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Get service status error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const harvesterClient = new HarvesterClient()

// Export for compatibility
export default harvesterClient