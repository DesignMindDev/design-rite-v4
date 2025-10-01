/**
 * AI Assessment Validation Schemas
 * Zod schemas for AI discovery endpoints
 */

import { z } from 'zod';

// AI provider types
export const AIProviderSchema = z.enum([
  'openai',
  'anthropic',
  'google',
  'custom'
]);

// AI session schema
export const AISessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID').optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  message: z.string().min(1, 'Message cannot be empty').max(10000, 'Message too long'),
  context: z.record(z.any()).optional(),
  scenario: z.string().optional(),
});

// AI chat message schema
export const AIChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(100000),
  timestamp: z.string().datetime().optional(),
});

// Scenario selection schema
export const ScenarioSchema = z.object({
  industryVertical: z.string().min(1),
  segment: z.string().optional(),
  deploymentTier: z.enum(['entry', 'professional', 'enterprise', 'cloud_first']),
  assumptions: z.record(z.any()).optional(),
});

// Assessment completion schema
export const AssessmentCompletionSchema = z.object({
  sessionId: z.string().uuid(),
  projectDetails: z.object({
    name: z.string().min(1).max(200),
    industry: z.string(),
    squareFootage: z.number().int().min(0),
    numCameras: z.number().int().min(0),
  }),
  requirements: z.record(z.any()),
  generateQuote: z.boolean().default(true),
});

// Provider failover log schema
export const ProviderFailoverSchema = z.object({
  primaryProvider: AIProviderSchema,
  failedProviders: z.array(AIProviderSchema),
  successfulProvider: AIProviderSchema,
  sessionId: z.string().uuid(),
  errorMessages: z.array(z.string()).optional(),
});

export type AISessionInput = z.infer<typeof AISessionSchema>;
export type AIChatMessage = z.infer<typeof AIChatMessageSchema>;
export type ScenarioInput = z.infer<typeof ScenarioSchema>;
export type AssessmentCompletionInput = z.infer<typeof AssessmentCompletionSchema>;
export type ProviderFailoverLog = z.infer<typeof ProviderFailoverSchema>;
