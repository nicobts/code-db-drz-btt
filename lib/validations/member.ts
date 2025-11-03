import { z } from "zod";
import { emailSchema } from "./auth";

/**
 * Workspace role enum
 */
export const workspaceRoleSchema = z.enum(["owner", "admin", "member", "guest"]);

export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

/**
 * Invite member schema
 */
export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: workspaceRoleSchema.default("member"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

/**
 * Invite multiple members schema
 */
export const inviteMultipleMembersSchema = z.object({
  emails: z
    .array(emailSchema)
    .min(1, "At least one email is required")
    .max(50, "Cannot invite more than 50 members at once"),
  role: workspaceRoleSchema.default("member"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type InviteMultipleMembersInput = z.infer<
  typeof inviteMultipleMembersSchema
>;

/**
 * Update member role schema
 */
export const updateMemberRoleSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  userId: z.string().min(1, "User ID is required"),
  newRole: workspaceRoleSchema,
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

/**
 * Remove member schema
 */
export const removeMemberSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;

/**
 * Accept invitation schema
 */
export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;

/**
 * Decline invitation schema
 */
export const declineInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
});

export type DeclineInvitationInput = z.infer<typeof declineInvitationSchema>;

/**
 * Revoke invitation schema
 */
export const revokeInvitationSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  invitationId: z.string().min(1, "Invitation ID is required"),
});

export type RevokeInvitationInput = z.infer<typeof revokeInvitationSchema>;

/**
 * Transfer ownership schema
 */
export const transferOwnershipSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  newOwnerId: z.string().min(1, "New owner ID is required"),
  confirmationText: z
    .string()
    .min(1, "Please type 'TRANSFER' to confirm")
    .refine((val) => val === "TRANSFER", {
      message: "Please type exactly 'TRANSFER' to confirm",
    }),
});

export type TransferOwnershipInput = z.infer<typeof transferOwnershipSchema>;
