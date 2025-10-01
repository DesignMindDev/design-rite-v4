/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * Patent Pending - API security and rate limiting systems.
 *
 * Last Modified: October 01, 2025
 */

import { LRUCache } from 'lru-cache';

/**
 * Rate Limiter Configuration
 * Protects proprietary APIs from abuse and excessive exposure
 */
interface RateLimitOptions {
  interval: number;      // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique IPs to track
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  error?: string;
}

/**
 * Create a rate limiter instance
 * Uses LRU cache to track request counts per IP address
 */
export function rateLimit(options?: Partial<RateLimitOptions>) {
  const interval = options?.interval || 60 * 1000; // Default: 1 minute
  const uniqueTokenPerInterval = options?.uniqueTokenPerInterval || 500;

  const tokenCache = new LRUCache<string, number[]>({
    max: uniqueTokenPerInterval,
    ttl: interval,
  });

  return {
    check: (limit: number, token: string): RateLimitResult => {
      const now = Date.now();
      const tokenCount = tokenCache.get(token) || [0, now];

      // Filter out timestamps outside the current interval
      const validTimestamps = tokenCount.filter(
        (timestamp) => timestamp > now - interval
      );

      if (validTimestamps.length >= limit) {
        const oldestTimestamp = validTimestamps[0];
        const resetTime = oldestTimestamp + interval;

        return {
          success: false,
          limit,
          remaining: 0,
          reset: resetTime,
          error: `Rate limit exceeded. Please try again in ${Math.ceil((resetTime - now) / 1000)} seconds.`
        };
      }

      // Add current timestamp
      validTimestamps.push(now);
      tokenCache.set(token, validTimestamps);

      return {
        success: true,
        limit,
        remaining: limit - validTimestamps.length,
        reset: now + interval,
      };
    },
  };
}

/**
 * Get client IP address from request
 * Handles proxies and load balancers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Create rate limit response with proper headers
 */
export function createRateLimitResponse(result: RateLimitResult, status: number = 429) {
  const headers = new Headers({
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
  });

  return new Response(
    JSON.stringify({
      error: result.error || 'Rate limit exceeded',
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }),
    {
      status,
      headers: {
        ...Object.fromEntries(headers.entries()),
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Pre-configured rate limiters for different API types
 */

// Proprietary Business Logic APIs (strict limits)
export const proprietaryApiLimiter = rateLimit({
  interval: 60 * 1000,          // 1 minute
  uniqueTokenPerInterval: 500,  // Track 500 unique IPs
});

// Quote Generation API (medium limits - computationally expensive)
export const quoteGenerationLimiter = rateLimit({
  interval: 60 * 1000,          // 1 minute
  uniqueTokenPerInterval: 500,
});

// Scenario Browsing API (more permissive - read-only)
export const scenarioApiLimiter = rateLimit({
  interval: 60 * 1000,          // 1 minute
  uniqueTokenPerInterval: 1000,
});

// System Surveyor Import (strict - expensive operations)
export const systemSurveyorLimiter = rateLimit({
  interval: 5 * 60 * 1000,      // 5 minutes
  uniqueTokenPerInterval: 200,
});
