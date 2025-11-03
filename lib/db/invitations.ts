import { db } from "@/lib/db";
import { invitations } from "@/db/schema/workspaces";
import { user } from "@/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import crypto from "crypto";

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

/**
 * Generate a secure invitation token
 */
function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create an invitation
 */
export async function createInvitation(data: {
  workspaceId: string;
  email: string;
  role: "owner" | "admin" | "member" | "guest";
  invitedBy: string;
  expiresInDays?: number;
}) {
  const token = generateInvitationToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 7)); // Default 7 days

  const [invitation] = await db
    .insert(invitations)
    .values({
      id: nanoid(),
      workspaceId: data.workspaceId,
      email: data.email,
      role: data.role,
      token: token,
      status: "pending",
      invitedBy: data.invitedBy,
      expiresAt: expiresAt,
    })
    .returning();

  return invitation;
}

/**
 * Get an invitation by token
 */
export async function getInvitationByToken(token: string) {
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.token, token),
    with: {
      workspace: true,
      inviter: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return invitation;
}

/**
 * Get an invitation by ID
 */
export async function getInvitationById(id: string) {
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.id, id),
  });
  return invitation;
}

/**
 * Get all pending invitations for a workspace
 */
export async function getWorkspaceInvitations(workspaceId: string) {
  const workspaceInvitations = await db
    .select({
      id: invitations.id,
      email: invitations.email,
      role: invitations.role,
      status: invitations.status,
      createdAt: invitations.createdAt,
      expiresAt: invitations.expiresAt,
      inviterName: user.name,
      inviterEmail: user.email,
    })
    .from(invitations)
    .innerJoin(user, eq(invitations.invitedBy, user.id))
    .where(eq(invitations.workspaceId, workspaceId));

  return workspaceInvitations;
}

/**
 * Get pending invitations for an email address
 */
export async function getPendingInvitationsForEmail(email: string) {
  const userInvitations = await db.query.invitations.findMany({
    where: and(eq(invitations.email, email), eq(invitations.status, "pending")),
    with: {
      workspace: true,
    },
  });

  // Filter out expired invitations
  const now = new Date();
  return userInvitations.filter((inv) => inv.expiresAt > now);
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(token: string) {
  const [updated] = await db
    .update(invitations)
    .set({
      status: "accepted",
    })
    .where(eq(invitations.token, token))
    .returning();

  return updated;
}

/**
 * Decline an invitation
 */
export async function declineInvitation(token: string) {
  const [updated] = await db
    .update(invitations)
    .set({
      status: "declined",
    })
    .where(eq(invitations.token, token))
    .returning();

  return updated;
}

/**
 * Revoke an invitation (by workspace admin)
 */
export async function revokeInvitation(id: string) {
  await db.delete(invitations).where(eq(invitations.id, id));
}

/**
 * Check if an invitation is valid
 */
export async function isInvitationValid(token: string): Promise<{
  valid: boolean;
  reason?: string;
  invitation?: Invitation;
}> {
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.token, token),
  });

  if (!invitation) {
    return { valid: false, reason: "Invitation not found" };
  }

  if (invitation.status !== "pending") {
    return {
      valid: false,
      reason: `Invitation has already been ${invitation.status}`,
      invitation,
    };
  }

  const now = new Date();
  if (invitation.expiresAt < now) {
    // Mark as expired
    await db
      .update(invitations)
      .set({ status: "expired" })
      .where(eq(invitations.id, invitation.id));

    return { valid: false, reason: "Invitation has expired", invitation };
  }

  return { valid: true, invitation };
}

/**
 * Clean up expired invitations (can be run periodically)
 */
export async function cleanupExpiredInvitations() {
  const now = new Date();

  // Update status to expired for all pending invitations past their expiry date
  const result = await db
    .update(invitations)
    .set({ status: "expired" })
    .where(
      and(eq(invitations.status, "pending"), eq(invitations.expiresAt, now))
    );

  return result;
}

/**
 * Resend an invitation (generates new token and extends expiry)
 */
export async function resendInvitation(
  id: string,
  expiresInDays: number = 7
) {
  const newToken = generateInvitationToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const [updated] = await db
    .update(invitations)
    .set({
      token: newToken,
      status: "pending",
      expiresAt: expiresAt,
    })
    .where(eq(invitations.id, id))
    .returning();

  return updated;
}
