/**
 * Security Estimate Validation Schemas
 * Zod schemas for quote generation endpoints
 */

import { z } from 'zod';

// Industry types
export const IndustrySchema = z.enum([
  'office',
  'retail',
  'hospitality',
  'education',
  'healthcare',
  'industrial',
  'government',
  'residential',
  'other'
]);

// Deployment tier
export const DeploymentTierSchema = z.enum([
  'entry',
  'professional',
  'enterprise',
  'cloud_first'
]);

// Security estimate request schema
export const SecurityEstimateSchema = z.object({
  // Project details
  projectName: z.string().min(1, 'Project name is required').max(200),
  industry: IndustrySchema,
  facilityType: z.string().max(100).optional(),

  // Site information
  squareFootage: z.number()
    .int('Square footage must be a whole number')
    .min(100, 'Minimum 100 sq ft')
    .max(10000000, 'Maximum 10M sq ft'),

  numFloors: z.number()
    .int('Number of floors must be a whole number')
    .min(1, 'Minimum 1 floor')
    .max(200, 'Maximum 200 floors')
    .default(1),

  // Camera requirements
  numCameras: z.number()
    .int('Camera count must be a whole number')
    .min(1, 'Minimum 1 camera')
    .max(10000, 'Maximum 10,000 cameras'),

  indoorCameras: z.number().int().min(0).optional(),
  outdoorCameras: z.number().int().min(0).optional(),

  // System requirements
  storageRetention: z.number()
    .int('Retention days must be a whole number')
    .min(7, 'Minimum 7 days')
    .max(365, 'Maximum 365 days')
    .default(30),

  recordingQuality: z.enum(['1080p', '4K', '4MP', '5MP', '8MP']).default('1080p'),

  // Access control
  accessControlEnabled: z.boolean().default(false),
  numDoors: z.number().int().min(0).max(1000).optional(),
  numCardReaders: z.number().int().min(0).max(5000).optional(),

  // Compliance
  complianceRequired: z.array(z.enum(['FERPA', 'HIPAA', 'CJIS', 'PCI-DSS', 'SOC2'])).default([]),

  // Additional features
  analytics: z.boolean().default(false),
  licenseRecognition: z.boolean().default(false),
  faceRecognition: z.boolean().default(false),

  // Contact info (optional)
  contactName: z.string().max(100).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().regex(/^\+?[\d\s\-()]+$/).optional(),

  // Deployment preferences
  deploymentTier: DeploymentTierSchema.optional(),
  cloudPreferred: z.boolean().default(false),

  // Budget
  budget: z.number().min(0).max(10000000).optional(),
});

// Quote generation schema
export const QuoteGenerationSchema = z.object({
  estimateId: z.string().uuid().optional(),
  assessmentData: z.record(z.any()).optional(),
  customizations: z.object({
    laborRate: z.number().min(0).max(500).optional(),
    markupPercentage: z.number().min(0).max(100).optional(),
    discountPercentage: z.number().min(0).max(100).optional(),
  }).optional(),
});

export type SecurityEstimateInput = z.infer<typeof SecurityEstimateSchema>;
export type QuoteGenerationInput = z.infer<typeof QuoteGenerationSchema>;
