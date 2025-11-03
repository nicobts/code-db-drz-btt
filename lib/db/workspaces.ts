import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/db/schema/workspaces";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

/**
 * Get a workspace by ID
 */
export async function getWorkspaceById(id: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, id),
  });
  return workspace;
}

/**
 * Get a workspace by slug
 */
export async function getWorkspaceBySlug(slug: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  });
  return workspace;
}

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(userId: string) {
  const userWorkspaces = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.userId, userId),
    with: {
      workspace: true,
    },
    orderBy: [desc(workspaceMembers.joinedAt)],
  });

  return userWorkspaces.map((wm) => ({
    ...wm.workspace,
    role: wm.role,
    joinedAt: wm.joinedAt,
  }));
}

/**
 * Create a new workspace
 */
export async function createWorkspace(data: {
  name: string;
  slug: string;
  createdBy: string;
  logoUrl?: string;
  domain?: string;
  settings?: Record<string, any>;
}) {
  const workspaceId = nanoid();

  // Create workspace and add creator as owner in a transaction
  const [workspace] = await db.transaction(async (tx) => {
    // Create workspace
    const [newWorkspace] = await tx
      .insert(workspaces)
      .values({
        id: workspaceId,
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl,
        domain: data.domain,
        settings: data.settings || {},
        createdBy: data.createdBy,
      })
      .returning();

    // Add creator as owner
    await tx.insert(workspaceMembers).values({
      id: nanoid(),
      workspaceId: workspaceId,
      userId: data.createdBy,
      role: "owner",
    });

    return [newWorkspace];
  });

  return workspace;
}

/**
 * Update a workspace
 */
export async function updateWorkspace(
  id: string,
  data: {
    name?: string;
    slug?: string;
    logoUrl?: string;
    domain?: string;
    settings?: Record<string, any>;
  }
) {
  const [updated] = await db
    .update(workspaces)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workspaces.id, id))
    .returning();

  return updated;
}

/**
 * Delete a workspace
 */
export async function deleteWorkspace(id: string) {
  await db.delete(workspaces).where(eq(workspaces.id, id));
}

/**
 * Check if a user is a member of a workspace
 */
export async function isWorkspaceMember(workspaceId: string, userId: string) {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  });
  return !!member;
}

/**
 * Check if a user has a specific role in a workspace
 */
export async function hasWorkspaceRole(
  workspaceId: string,
  userId: string,
  requiredRole: "owner" | "admin" | "member" | "guest"
) {
  const member = await db.query.workspaceMembers.findFirst({
    where: and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, userId)
    ),
  });

  if (!member) return false;

  // Role hierarchy: owner > admin > member > guest
  const roleHierarchy = { owner: 4, admin: 3, member: 2, guest: 1 };
  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
}

/**
 * Get workspace member count
 */
export async function getWorkspaceMemberCount(workspaceId: string) {
  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
  });
  return members.length;
}
