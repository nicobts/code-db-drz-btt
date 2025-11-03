"use server";

import { auth } from "@/lib/auth";
import {
  createWorkspace as dbCreateWorkspace,
  updateWorkspace as dbUpdateWorkspace,
  deleteWorkspace as dbDeleteWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  isWorkspaceMember,
} from "@/lib/db/workspaces";
import { isWorkspaceOwner } from "@/lib/db/members";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  deleteWorkspaceSchema,
} from "@/lib/validations/workspace";
import { revalidatePath } from "next/cache";

type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get current user's workspaces
 */
export async function getMyWorkspaces(): Promise<
  ActionResponse<Awaited<ReturnType<typeof getUserWorkspaces>>>
> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const workspaces = await getUserWorkspaces(session.user.id);
    return { success: true, data: workspaces };
  } catch (error) {
    console.error("Failed to get workspaces:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get workspaces",
    };
  }
}

/**
 * Get a specific workspace
 */
export async function getWorkspace(
  workspaceId: string
): Promise<ActionResponse<Awaited<ReturnType<typeof getWorkspaceById>>>> {
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

    const workspace = await getWorkspaceById(workspaceId);
    if (!workspace) {
      return { success: false, error: "Workspace not found" };
    }

    return { success: true, data: workspace };
  } catch (error) {
    console.error("Failed to get workspace:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get workspace",
    };
  }
}

/**
 * Create a new workspace
 */
export async function createWorkspace(
  data: unknown
): Promise<ActionResponse<Awaited<ReturnType<typeof dbCreateWorkspace>>>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = createWorkspaceSchema.parse(data);

    // Create workspace
    const workspace = await dbCreateWorkspace({
      ...validatedData,
      createdBy: session.user.id,
    });

    revalidatePath("/dashboard");
    return { success: true, data: workspace };
  } catch (error) {
    console.error("Failed to create workspace:", error);
    if (error instanceof Error && "issues" in error) {
      // Zod validation error
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create workspace",
    };
  }
}

/**
 * Update a workspace
 */
export async function updateWorkspace(
  workspaceId: string,
  data: unknown
): Promise<ActionResponse<Awaited<ReturnType<typeof dbUpdateWorkspace>>>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user is owner (only owners can update workspace settings)
    const isOwner = await isWorkspaceOwner(workspaceId, session.user.id);
    if (!isOwner) {
      return { success: false, error: "Only workspace owners can update settings" };
    }

    // Validate input
    const validatedData = updateWorkspaceSchema.parse(data);

    // Update workspace
    const workspace = await dbUpdateWorkspace(workspaceId, validatedData);

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    return { success: true, data: workspace };
  } catch (error) {
    console.error("Failed to update workspace:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update workspace",
    };
  }
}

/**
 * Delete a workspace
 */
export async function deleteWorkspace(
  data: unknown
): Promise<ActionResponse<void>> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validatedData = deleteWorkspaceSchema.parse(data);

    // Check if user is owner
    const isOwner = await isWorkspaceOwner(
      validatedData.workspaceId,
      session.user.id
    );
    if (!isOwner) {
      return { success: false, error: "Only workspace owners can delete workspaces" };
    }

    // Verify confirmation text matches workspace name
    const workspace = await getWorkspaceById(validatedData.workspaceId);
    if (!workspace) {
      return { success: false, error: "Workspace not found" };
    }

    if (workspace.name !== validatedData.confirmationText) {
      return { success: false, error: "Confirmation text does not match workspace name" };
    }

    // Delete workspace
    await dbDeleteWorkspace(validatedData.workspaceId);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete workspace:", error);
    if (error instanceof Error && "issues" in error) {
      return {
        success: false,
        error: "Validation failed. Please check your input.",
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete workspace",
    };
  }
}
