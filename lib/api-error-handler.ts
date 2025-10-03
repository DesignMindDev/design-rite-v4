import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Centralized error handler for API routes
 * Logs errors and returns consistent error responses
 */
export function handleAPIError(error: unknown, context?: string): NextResponse {
  console.error(`[API Error${context ? ` - ${context}` : ''}]:`, error);

  // Handle known API errors
  if (error instanceof APIError) {
    return NextResponse.json<ErrorResponse>(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string; details?: string };

    // Map common Supabase errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      '23505': 'This record already exists',
      '23503': 'Related record not found',
      'PGRST116': 'No rows found',
      '42501': 'Permission denied',
      '08006': 'Database connection failed'
    };

    const statusCodes: Record<string, number> = {
      '23505': 409, // Conflict
      '23503': 404, // Not found
      'PGRST116': 404,
      '42501': 403, // Forbidden
      '08006': 503  // Service unavailable
    };

    return NextResponse.json<ErrorResponse>(
      {
        error: errorMessages[supabaseError.code] || supabaseError.message || 'Database error occurred',
        code: supabaseError.code,
        details: supabaseError.details,
        timestamp: new Date().toISOString()
      },
      { status: statusCodes[supabaseError.code] || 500 }
    );
  }

  // Handle Stripe errors
  if (error && typeof error === 'object' && 'type' in error) {
    const stripeError = error as { type: string; message?: string; code?: string };

    const statusCodes: Record<string, number> = {
      'StripeCardError': 402,
      'StripeRateLimitError': 429,
      'StripeInvalidRequestError': 400,
      'StripeAPIError': 500,
      'StripeConnectionError': 503,
      'StripeAuthenticationError': 401
    };

    return NextResponse.json<ErrorResponse>(
      {
        error: stripeError.message || 'Payment processing error',
        code: stripeError.code || stripeError.type,
        timestamp: new Date().toISOString()
      },
      { status: statusCodes[stripeError.type] || 500 }
    );
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return NextResponse.json<ErrorResponse>(
      {
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json<ErrorResponse>(
    {
      error: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
}

/**
 * Async wrapper that catches errors and uses handleAPIError
 * Use this to wrap API route handlers
 */
export function withErrorHandling<T>(
  handler: () => Promise<NextResponse>,
  context?: string
): Promise<NextResponse> {
  return handler().catch((error) => handleAPIError(error, context));
}

/**
 * Common validation errors
 */
export const ValidationErrors = {
  MISSING_REQUIRED_FIELD: (field: string) =>
    new APIError(400, `Missing required field: ${field}`, 'VALIDATION_ERROR'),

  INVALID_FORMAT: (field: string, expected?: string) =>
    new APIError(
      400,
      `Invalid format for ${field}${expected ? `. Expected: ${expected}` : ''}`,
      'VALIDATION_ERROR'
    ),

  OUT_OF_RANGE: (field: string, min?: number, max?: number) =>
    new APIError(
      400,
      `Value for ${field} out of range${min !== undefined ? `. Min: ${min}` : ''}${max !== undefined ? `, Max: ${max}` : ''}`,
      'VALIDATION_ERROR'
    ),
};

/**
 * Common authentication errors
 */
export const AuthErrors = {
  UNAUTHORIZED: new APIError(401, 'Authentication required', 'UNAUTHORIZED'),
  FORBIDDEN: new APIError(403, 'You do not have permission to perform this action', 'FORBIDDEN'),
  INVALID_TOKEN: new APIError(401, 'Invalid or expired token', 'INVALID_TOKEN'),
  SESSION_EXPIRED: new APIError(401, 'Your session has expired. Please log in again', 'SESSION_EXPIRED'),
};

/**
 * Common resource errors
 */
export const ResourceErrors = {
  NOT_FOUND: (resource: string) =>
    new APIError(404, `${resource} not found`, 'NOT_FOUND'),

  ALREADY_EXISTS: (resource: string) =>
    new APIError(409, `${resource} already exists`, 'ALREADY_EXISTS'),

  CONFLICT: (message: string) =>
    new APIError(409, message, 'CONFLICT'),
};

/**
 * Rate limiting error
 */
export const RateLimitError = new APIError(
  429,
  'Too many requests. Please try again later',
  'RATE_LIMIT_EXCEEDED'
);
