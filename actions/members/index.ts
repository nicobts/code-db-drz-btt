"use server";

import { auth } from "@/lib/auth";
import {
  getWorkspaceMembers,
  updateMemberRole as dbUpdateMemberRole,
  removeMember as dbRemoveMember,
  canManageMembers,
  isWorkspaceOwner,
  transferOwnership as dbTransferOwnership,
  addWorkspaceMember,
} from "@/lib/db/members";
import {
  createInvitation,
  revokeInvitation as dbRevokeInvitation,
  getWorkspaceInvitations,
  acceptInvitation as dbAcceptInvitation,
  declineInvitation as dbDeclineInvitation,
  isInvitationValid,
  getInvitationByToken,
} from "@/lib/db/invitations";
import { isWorkspaceMember } from "@/lib/db/workspaces";
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
  transferOwnershipSchema,
  acceptInvitationSchema,
  declineInvitationSchema,
  revokeInvitationSchema,
} from "@/lib/validations/member";
import { revalidatePath } from "next/cache";

type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get workspace members
 */
export async function getMembers(workspaceId: string): Promise<
  ActionResponse<Awaited<ReturnType<typeof getWorkspaceMembers>>>
> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is a member
    const isMember = await isWorkspaceMember(workspaceId, session.user.id);
    if (!isMember) {
      return { success: false, error: "Access denied" };
    }

    const members = await getWorkspaceMembers(workspaceId);
    return { success: true, data: members };
  } catch (error) {
    console.error("Failed to get members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get members",
    };
  }
}

/**
 * Invite a member to workspace
 */
export async function inviteMember(
  data: unknown
): Promise<ActionResponse<Awaited<ReturnType<typeof createInvitation>>>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = inviteMemberSchema.parse(data);

    // Check if user can manage members
    const canManage = await canManageMembers(
      validatedData.workspaceId,
      session.user.id
    );
    if (!canManage) {
      return { success: false, error: "You don't have permission to invite members" };
    }

    // Create invitation
    const invitation = await createInvitation({
      workspaceId: validatedData.workspaceId,
      email: validatedData.email,
      role: validatedData.role,
      invitedBy: session.user.id,
    });

    // TODO: Send invitation email

    revalidatePath(`/dashboard/workspaces/${validatedData.workspaceId}/team`);
    return { success: true, data: invitation };
  } catch (error) {
    console.error("Failed to invite member:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to invite member",
    };
  }
}

/**
 * Update member role
 */
export async function updateMemberRole(data: unknown): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = updateMemberRoleSchema.parse(data);

    // Check if user can manage members
    const canManage = await canManageMembers(
      validatedData.workspaceId,
      session.user.id
    );
    if (!canManage) {
      return { success: false, error: "You don't have permission to manage members" };
    }

    // Cannot change owner role
    const isOwner = await isWorkspaceOwner(
      validatedData.workspaceId,
      validatedData.userId
    );
    if (isOwner) {
      return {
        success: false,
        error: "Cannot change owner role. Use transfer ownership instead.",
      };
    }

    // Update role
    await dbUpdateMemberRole(
      validatedData.workspaceId,
      validatedData.userId,
      validatedData.newRole
    );

    revalidatePath(`/dashboard/workspaces/${validatedData.workspaceId}/team`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update member role:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update member role",
    };
  }
}

/**
 * Remove member from workspace
 */
export async function removeMember(data: unknown): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = removeMemberSchema.parse(data);

    // Check if user can manage members
    const canManage = await canManageMembers(
      validatedData.workspaceId,
      session.user.id
    );
    if (!canManage) {
      return { success: false, error: "You don't have permission to remove members" };
    }

    // Cannot remove owner
    const isOwner = await isWorkspaceOwner(
      validatedData.workspaceId,
      validatedData.userId
    );
    if (isOwner) {
      return { success: false, error: "Cannot remove workspace owner" };
    }

    // Remove member
    await dbRemoveMember(validatedData.workspaceId, validatedData.userId);

    revalidatePath(`/dashboard/workspaces/${validatedData.workspaceId}/team`);
    return { success: true };
  } catch (error) {
    console.error("Failed to remove member:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}

/**
 * Transfer workspace ownership
 */
export async function transferOwnership(data: unknown): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = transferOwnershipSchema.parse(data);

    // Transfer ownership
    await dbTransferOwnership(
      validatedData.workspaceId,
      session.user.id,
      validatedData.newOwnerId
    );

    revalidatePath(`/dashboard/workspaces/${validatedData.workspaceId}/team`);
    revalidatePath(`/dashboard/workspaces/${validatedData.workspaceId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to transfer ownership:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to transfer ownership",
    };
  }
}

/**
 * Get workspace invitations
 */
export async function getInvitations(workspaceId: string): Promise<
  ActionResponse<Awaited<ReturnType<typeof getWorkspaceInvitations>>>
> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user can manage members
    const canManage = await canManageMembers(workspaceId, session.user.id);
    if (!canManage) {
      return { success: false, error: "Access denied" };
    }

    const invitations = await getWorkspaceInvitations(workspaceId);
    return { success: true, data: invitations };
  } catch (error) {
    console.error("Failed to get invitations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get invitations",
    };
  }
}

/**
 * Accept invitation
 */
export async function acceptInvitation(data: unknown): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = acceptInvitationSchema.parse(data);

    // Check if invitation is valid
    const validation = await isInvitationValid(validatedData.token);
    if (!validation.valid) {
      return { success: false, error: validation.reason || "Invalid invitation" };
    }

    const invitation = validation.invitation!;

    // Verify email matches
    if (invitation.email !== session.user.email) {
      return { success: false, error: "This invitation was sent to a different email address" };
    }

    // Accept invitation
    await dbAcceptInvitation(validatedData.token);

    // Add user to workspace
    await addWorkspaceMember({
      workspaceId: invitation.workspaceId,
      userId: session.user.id,
      role: invitation.role,
      invitedBy: invitation.invitedBy,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to accept invitation",
    };
  }
}

/**
 * Decline invitation
 */
export async function declineInvitation(data: unknown): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = declineInvitationSchema.parse(data);

    // Get invitation
    const invitation = await getInvitationByToken(validatedData.token);
    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    // Verify email matches
    if (invitation.email !== session.user.email) {
      return { success: false, error: "This invitation was sent to a different email address" };
    }

    // Decline invitation
    await dbDeclineInvitation(validatedData.token);

    return { success: true };
  } catch (error) {
    console.error("Failed to decline invitation:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to decline invitation",
    };
  }
}

/**
 * Revoke invitation
 */
export async function revokeInvitation(data: unknown): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = revokeInvitationSchema.parse(data);

    // Check if user can manage members
    const canManage = await canManageMembers(
      validatedData.workspaceId,
      session.user.id
    );
    if (!canManage) {
      return { success: false, error: "You don't have permission to revoke invitations" };
    }

    // Revoke invitation
    await dbRevokeInvitation(validatedData.invitationId);

    revalidatePath(`/dashboard/workspaces/${validatedData.workspaceId}/team`);
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke invitation:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to revoke invitation",
    };
  }
}
