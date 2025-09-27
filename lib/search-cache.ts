// Simple in-memory cache for search results
// In production, this would use Redis or similar distributed cache

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

class SearchCache {
  private cache = new Map<string, CacheEntry>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  generateKey(query: string, category: string, providers: string[]): string {
    const normalizedQuery = query.toLowerCase().trim()
    const sortedProviders = providers.sort().join(',')
    return `${normalizedQuery}:${category}:${sortedProviders}`
  }

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): number {
    let deletedCount = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        deletedCount++
      }
    }

    return deletedCount
  }

  // Get cache statistics
  getStats(): {
    size: number
    hitRate: number
    memoryUsage: string
  } {
    const entries = Array.from(this.cache.values())
    const totalRequests = this.hitCount + this.missCount
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0

    // Rough memory usage estimation
    const memoryUsage = (JSON.stringify(Array.from(this.cache.entries())).length / 1024).toFixed(2) + ' KB'

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage
    }
  }

  private hitCount = 0
  private missCount = 0

  recordHit(): void {
    this.hitCount++
  }

  recordMiss(): void {
    this.missCount++
  }
}

// Export singleton instance
export const searchCache = new SearchCache()

// Schedule periodic cleanup every 10 minutes
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    const deletedCount = searchCache.cleanup()
    if (deletedCount > 0) {
      console.log(`Search cache cleanup: removed ${deletedCount} expired entries`)
    }
  }, 10 * 60 * 1000)
}