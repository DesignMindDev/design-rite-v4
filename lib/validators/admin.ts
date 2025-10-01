/**
 * Admin API Validation Schemas
 * Zod schemas for user management endpoints
 */

import { z } from 'zod';

// User roles enum
export const UserRoleSchema = z.enum(['super_admin', 'admin', 'manager', 'user', 'guest']);

// User status enum
export const UserStatusSchema = z.enum(['active', 'suspended', 'pending', 'deleted']);

// Module permissions schema
export const ModulePermissionsSchema = z.object({
  operations_dashboard: z.boolean().default(false),
  ai_management: z.boolean().default(false),
  data_harvesting: z.boolean().default(false),
  marketing_content: z.boolean().default(false),
  about_us: z.boolean().default(false),
  team_management: z.boolean().default(false),
  logo_management: z.boolean().default(false),
  video_management: z.boolean().default(false),
  blog_management: z.boolean().default(false),
});

// Admin permissions schema
export const AdminPermissionsSchema = z.object({
  can_manage_team: z.boolean().default(false),
  can_manage_blog: z.boolean().default(false),
  can_manage_videos: z.boolean().default(false),
  can_manage_settings: z.boolean().default(false),
  can_create_users: z.boolean().default(false),
  can_edit_users: z.boolean().default(false),
  can_delete_users: z.boolean().default(false),
  can_assign_permissions: z.boolean().default(false),
  can_view_activity: z.boolean().default(false),
  can_export_data: z.boolean().default(false),
  can_view_analytics: z.boolean().default(false),
  can_access_admin_panel: z.boolean().default(false),
  can_manage_integrations: z.boolean().default(false),
});

// Create user schema
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: UserRoleSchema,
  company: z.string().max(200).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone format').optional(),
  access_code: z.string().optional(),
  notes: z.string().max(1000).optional(),
  module_permissions: ModulePermissionsSchema.optional(),
});

// Update user schema (all fields optional except id)
export const UpdateUserSchema = z.object({
  user: z.object({
    id: z.string().uuid('Invalid user ID'),
    email: z.string().email().optional(),
    full_name: z.string().min(2).max(100).optional(),
    role: UserRoleSchema.optional(),
    status: UserStatusSchema.optional(),
    company: z.string().max(200).optional(),
    phone: z.string().regex(/^\+?[\d\s\-()]+$/).optional(),
    access_code: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
  permissions: AdminPermissionsSchema.partial().optional(),
  modulePermissions: ModulePermissionsSchema.partial().optional(),
});

// Get user schema
export const GetUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

// Suspend/Delete user schema
export const UserActionSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string().max(500).optional(),
});

// Activity logs query schema
export const ActivityLogsQuerySchema = z.object({
  limit: z.number().int().min(1).max(1000).default(100),
  offset: z.number().int().min(0).default(0),
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type GetUserInput = z.infer<typeof GetUserSchema>;
export type UserActionInput = z.infer<typeof UserActionSchema>;
export type ActivityLogsQueryInput = z.infer<typeof ActivityLogsQuerySchema>;
