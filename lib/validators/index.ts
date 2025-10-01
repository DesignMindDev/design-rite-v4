/**
 * Validation Helper Functions
 * Centralized request validation with Zod
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { logError } from '../monitoring';

/**
 * Validate request body against Zod schema
 * Returns parsed data or error response
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      await logError(
        new Error('Request validation failed'),
        'warning',
        {
          endpoint: request.url,
          method: request.method,
          validationErrors: formattedErrors,
        }
      );

      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: formattedErrors,
          },
          { status: 400 }
        ),
      };
    }

    await logError(
      error instanceof Error ? error : new Error(String(error)),
      'error',
      { endpoint: request.url, method: request.method }
    );

    return {
      data: null,
      error: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters against Zod schema
 */
export function validateQueryParams<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { data: T; error: null } | { data: null; error: NextResponse } {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const data = schema.parse(searchParams);
    return { data, error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Query validation failed',
            details: formattedErrors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      data: null,
      error: NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) :
        typeof item === 'object' && item !== null ? sanitizeObject(item) :
        item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

// Export all validation schemas
export * from './admin';
export * from './security-estimate';
export * from './ai-assessment';
