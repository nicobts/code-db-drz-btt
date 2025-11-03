"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { updateProfile as updateProfileDb } from "@/lib/db/profiles";
import { updateProfileSchema } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

/**
 * Update user profile
 */
export async function updateProfile(data: unknown): Promise<ActionResponse> {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to update your profile",
      };
    }

    // Validate input
    const validatedData = updateProfileSchema.parse(data);

    // Update profile in database
    const profile = await updateProfileDb(session.user.id, validatedData);

    // Revalidate relevant paths
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: profile,
    };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}
