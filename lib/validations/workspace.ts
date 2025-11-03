import { z } from "zod";

/**
 * Slug validation schema
 * - Lowercase letters, numbers, and hyphens only
 * - Must start and end with alphanumeric character
 * - No consecutive hyphens
 */
export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must be less than 50 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens (no consecutive hyphens)"
  );

/**
 * Create workspace schema
 */
export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name must be less than 100 characters"),
  slug: slugSchema,
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  domain: z
    .string()
    .regex(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/, "Invalid domain")
    .optional()
    .or(z.literal("")),
  settings: z.record(z.any()).optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

/**
 * Update workspace schema
 */
export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name must be less than 100 characters")
    .optional(),
  slug: slugSchema.optional(),
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  domain: z
    .string()
    .regex(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/, "Invalid domain")
    .optional()
    .or(z.literal("")),
  settings: z.record(z.any()).optional(),
});

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

/**
 * Delete workspace schema
 */
export const deleteWorkspaceSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  confirmationText: z
    .string()
    .min(1, "Please type the workspace name to confirm"),
});

export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceSchema>;

/**
 * Workspace settings schema
 */
export const workspaceSettingsSchema = z.object({
  allowMemberInvites: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(true),
  defaultMemberRole: z.enum(["member", "guest"]).default("member"),
  billingEmail: z.string().email().optional(),
  invoicePrefix: z.string().max(10).optional(),
  timezone: z.string().default("UTC"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  language: z.enum(["en", "es", "fr", "de", "it", "pt"]).default("en"),
});

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;
