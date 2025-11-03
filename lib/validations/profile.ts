import { z } from "zod";

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  timezone: z.string().optional(),
  language: z.enum(["en", "es", "fr", "de", "it", "pt"]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Upload avatar schema
 */
export const uploadAvatarSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "File must be a JPEG, PNG, or WebP image",
      }
    ),
});

export type UploadAvatarInput = z.infer<typeof uploadAvatarSchema>;

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

/**
 * Account settings schema
 */
export const accountSettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.number().min(15).max(1440).default(60), // minutes
  loginNotifications: z.boolean().default(true),
});

export type AccountSettings = z.infer<typeof accountSettingsSchema>;
