import { db } from "@/lib/db";
import { workspaceMembers } from "@/db/schema/workspaces";
import { user } from "@/db/schema/auth";
import { profiles } from "@/db/schema/profiles";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

/**
 * Get all members of a workspace with their user and profile information
 */
export async function getWorkspaceMembers(workspaceId: string) {
  const members = await db
    .select({
      id: workspaceMembers.id,
      role: workspaceMembers.role,
      joinedAt: workspaceMembers.joinedAt,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userImage: user.image,
      profileFullName: profiles.fullName,
      profileAvatarUrl: profiles.avatarUrl,
    })
    .from(workspaceMembers)
    .innerJoin(user, eq(workspaceMembers.userId, user.id))
    .leftJoin(profiles, eq(user.id, profiles.userId))
    .where(eq(workspaceMembers.workspaceId, workspaceId))
    .orderBy(desc(workspaceMembers.joinedAt));

  return members;
}

/**
 * Get a specific workspace member
 */
export async function getWorkspaceMember(workspaceId: string, userId: string) {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  });
  return member;
}

/**
 * Add a member to a workspace
 */
export async function addWorkspaceMember(data: {
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "guest";
  invitedBy?: string;
}) {
  const [member] = await db
    .insert(workspaceMembers)
    .values({
      id: nanoid(),
      workspaceId: data.workspaceId,
      userId: data.userId,
      role: data.role,
      invitedBy: data.invitedBy,
    })
    .returning();

  return member;
}

/**
 * Update a workspace member's role
 */
export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  newRole: "owner" | "admin" | "member" | "guest"
) {
  const [updated] = await db
    .update(workspaceMembers)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    )
    .returning();

  return updated;
}

/**
 * Remove a member from a workspace
 */
export async function removeMember(workspaceId: string, userId: string) {
  await db
    .delete(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    );
}

/**
 * Check if a user can manage members (owner or admin)
 */
export async function canManageMembers(workspaceId: string, userId: string) {
  const member = await getWorkspaceMember(workspaceId, userId);
  return member && (member.role === "owner" || member.role === "admin");
}

/**
 * Check if a user is the workspace owner
 */
export async function isWorkspaceOwner(workspaceId: string, userId: string) {
  const member = await getWorkspaceMember(workspaceId, userId);
  return member && member.role === "owner";
}

/**
 * Get member count by role
 */
export async function getMemberCountByRole(workspaceId: string) {
  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
  });

  return {
    total: members.length,
    owners: members.filter((m) => m.role === "owner").length,
    admins: members.filter((m) => m.role === "admin").length,
    members: members.filter((m) => m.role === "member").length,
    guests: members.filter((m) => m.role === "guest").length,
  };
}

/**
 * Transfer workspace ownership
 */
export async function transferOwnership(
  workspaceId: string,
  currentOwnerId: string,
  newOwnerId: string
) {
  // Verify current user is owner
  const isOwner = await isWorkspaceOwner(workspaceId, currentOwnerId);
  if (!isOwner) {
    throw new Error("Only the workspace owner can transfer ownership");
  }

  // Verify new owner is a member
  const newOwnerMember = await getWorkspaceMember(workspaceId, newOwnerId);
  if (!newOwnerMember) {
    throw new Error("New owner must be a workspace member");
  }

  // Update roles in transaction
  await db.transaction(async (tx) => {
    // Demote current owner to admin
    await tx
      .update(workspaceMembers)
      .set({ role: "admin", updatedAt: new Date() })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, currentOwnerId)
        )
      );

    // Promote new owner
    await tx
      .update(workspaceMembers)
      .set({ role: "owner", updatedAt: new Date() })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, newOwnerId)
        )
      );
  });
}
