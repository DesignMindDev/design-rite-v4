/**
 * Rate Limiting System
 * In-memory rate limiter with Supabase persistence for production
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { logError } from './monitoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * In-memory rate limit store (for development/small deployments)
 * For production scale, use Redis or Supabase rate_limits table
 */
class RateLimitStore {
  private store = new Map<string, { count: number; resetAt: number }>();

  get(key: string): { count: number; resetAt: number } | undefined {
    const entry = this.store.get(key);
    if (entry && entry.resetAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry;
  }

  increment(key: string, windowMs: number): number {
    const now = Date.now();
    const entry = this.get(key);

    if (entry) {
      entry.count++;
      return entry.count;
    }

    this.store.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetAt < now) {
        this.store.delete(key);
      }
    }
  }
}

const rateLimitStore = new RateLimitStore();

// Cleanup expired entries every 10 minutes
if (typeof window === 'undefined') {
  setInterval(() => rateLimitStore.cleanup(), 10 * 60 * 1000);
}

/**
 * Rate limit configuration per endpoint
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Only count failed requests
  keyGenerator?: (request: NextRequest) => string; // Custom key function
}

/**
 * Default rate limits by endpoint pattern
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // AI endpoints - expensive, limit strictly
  '/api/ai-assessment': {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 5,
    message: 'Too many AI assessments. Please wait 10 minutes.',
  },
  '/api/discovery-assistant': {
    windowMs: 10 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many AI discovery sessions. Please wait 10 minutes.',
  },

  // Quick estimate - moderate limit
  '/api/security-estimate': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many estimates. Please wait an hour.',
  },

  // Webhooks - high limit but still protected
  '/api/webhooks/*': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'Webhook rate limit exceeded.',
  },

  // Authentication - strict to prevent brute force
  '/api/auth/callback/credentials': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many login attempts. Please wait 15 minutes.',
  },

  // Contact/leads - moderate
  '/api/contact': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many contact form submissions.',
  },

  // Public APIs - generous but protected
  '/api/scenarios': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  },
  '/api/products/search': {
    windowMs: 60 * 1000,
    maxRequests: 60,
  },
};

/**
 * Get client identifier (IP or user ID)
 */
function getClientIdentifier(request: NextRequest): string {
  // Prefer user ID if authenticated
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Extract user ID from JWT if possible
    // For now, use IP
  }

  // Get IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

  return ip;
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  request: NextRequest,
  config?: RateLimitConfig
): Promise<{ allowed: boolean; limit: number; remaining: number; resetAt: number }> {
  const endpoint = request.nextUrl.pathname;

  // Find matching rate limit config
  const rateLimitConfig = config || Object.entries(DEFAULT_RATE_LIMITS).find(([pattern]) => {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
      return regex.test(endpoint);
    }
    return endpoint.startsWith(pattern);
  })?.[1];

  // No rate limit configured
  if (!rateLimitConfig) {
    return { allowed: true, limit: 0, remaining: 0, resetAt: 0 };
  }

  const { windowMs, maxRequests, keyGenerator } = rateLimitConfig;

  // Generate rate limit key
  const clientId = keyGenerator ? keyGenerator(request) : getClientIdentifier(request);
  const key = `ratelimit:${endpoint}:${clientId}`;

  // Check current count
  const current = rateLimitStore.get(key);
  const count = current ? current.count : 0;

  // Increment counter
  const newCount = rateLimitStore.increment(key, windowMs);

  const allowed = newCount <= maxRequests;
  const remaining = Math.max(0, maxRequests - newCount);
  const resetAt = current?.resetAt || Date.now() + windowMs;

  // Log rate limit violations
  if (!allowed) {
    await logError(
      new Error('Rate limit exceeded'),
      'warning',
      {
        endpoint,
        clientId,
        limit: maxRequests,
        current: newCount,
      }
    );
  }

  return { allowed, limit: maxRequests, remaining, resetAt };
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    const { allowed, limit, remaining, resetAt } = await checkRateLimit(request, config);

    if (!allowed) {
      const message = config?.message || 'Too many requests. Please try again later.';

      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(resetAt),
            'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(resetAt));

    return response;
  };
}

/**
 * Check user-specific rate limits from database
 */
export async function checkUserRateLimit(
  userId: string,
  feature: string,
  dailyLimit: number,
  monthlyLimit?: number
): Promise<{ allowed: boolean; dailyUsage: number; monthlyUsage?: number }> {
  try {
    // Get usage count from Supabase
    const { data: usage, error } = await supabase
      .rpc('get_usage_count', { p_user_id: userId, p_feature: feature });

    if (error) {
      console.error('Error checking usage:', error);
      // Allow on error (fail open)
      return { allowed: true, dailyUsage: 0 };
    }

    const dailyUsage = usage?.daily_count || 0;
    const monthlyUsage = usage?.monthly_count || 0;

    const allowed =
      dailyUsage < dailyLimit &&
      (!monthlyLimit || monthlyUsage < monthlyLimit);

    return { allowed, dailyUsage, monthlyUsage };
  } catch (error) {
    await logError(
      error instanceof Error ? error : new Error(String(error)),
      'error',
      { feature, userId }
    );

    // Fail open on errors
    return { allowed: true, dailyUsage: 0 };
  }
}
