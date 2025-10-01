/**
 * Error Monitoring and Logging System
 * Centralized error tracking with Supabase integration
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorContext {
  userId?: string;
  endpoint?: string;
  method?: string;
  body?: any;
  query?: any;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

/**
 * Log an error to Supabase and console
 */
export async function logError(
  error: Error,
  severity: ErrorSeverity = 'error',
  context?: ErrorContext
): Promise<void> {
  const errorLog = {
    error_message: error.message,
    stack_trace: error.stack || '',
    severity,
    context: context || {},
    timestamp: new Date().toISOString(),
  };

  // Log to console with appropriate level
  const consoleMethod = severity === 'critical' || severity === 'error'
    ? console.error
    : severity === 'warning'
    ? console.warn
    : console.log;

  consoleMethod(`[${severity.toUpperCase()}]`, error.message, context);

  // Log to Supabase
  try {
    await supabase.from('error_logs').insert(errorLog);
  } catch (dbError) {
    console.error('Failed to log error to database:', dbError);
  }

  // If critical, could send alert (email, Slack, etc.)
  if (severity === 'critical' && process.env.SLACK_WEBHOOK_URL) {
    await sendSlackAlert(error, context);
  }
}

/**
 * Log activity to activity_logs table
 */
export async function logActivity(
  userId: string,
  action: string,
  details?: any,
  success: boolean = true
): Promise<void> {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      success,
      details: details || {},
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

/**
 * Send Slack alert for critical errors
 */
async function sendSlackAlert(error: Error, context?: ErrorContext): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const message = {
    text: `🚨 Critical Error in Design-Rite`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Critical Error Alert',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Error:*\n${error.message}`,
          },
          {
            type: 'mrkdwn',
            text: `*Endpoint:*\n${context?.endpoint || 'Unknown'}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Stack Trace:*\n\`\`\`${error.stack?.slice(0, 500)}...\`\`\``,
        },
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  } catch (slackError) {
    console.error('Failed to send Slack alert:', slackError);
  }
}

/**
 * Wrapper for API route error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  endpoint: string
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      await logError(err, 'error', {
        endpoint,
        method: args[0]?.method,
      });

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }) as T;
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private startTime: number;
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.startTime = Date.now();
  }

  async end(context?: any): Promise<void> {
    const duration = Date.now() - this.startTime;

    // Log if slow (>2 seconds)
    if (duration > 2000) {
      await logError(
        new Error(`Slow endpoint: ${this.endpoint} took ${duration}ms`),
        'warning',
        { ...context, duration }
      );
    }

    // Could log to performance_logs table
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${this.endpoint}: ${duration}ms`);
    }
  }
}
