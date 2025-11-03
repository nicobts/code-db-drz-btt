import { db } from "@/lib/db";
import { profiles } from "@/db/schema/profiles";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

/**
 * Get a profile by user ID
 */
export async function getProfileByUserId(userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });
  return profile;
}

/**
 * Get a profile by ID
 */
export async function getProfileById(id: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
  });
  return profile;
}

/**
 * Create a new profile
 */
export async function createProfile(data: {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  timezone?: string;
  language?: string;
}) {
  const [profile] = await db
    .insert(profiles)
    .values({
      id: nanoid(),
      userId: data.userId,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      timezone: data.timezone || "UTC",
      language: data.language || "en",
    })
    .returning();

  return profile;
}

/**
 * Update a profile
 */
export async function updateProfile(
  userId: string,
  data: {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    timezone?: string;
    language?: string;
  }
) {
  const [updated] = await db
    .update(profiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId))
    .returning();

  return updated;
}

/**
 * Delete a profile
 */
export async function deleteProfile(userId: string) {
  await db.delete(profiles).where(eq(profiles.userId, userId));
}

/**
 * Get or create profile (useful for first-time login)
 */
export async function getOrCreateProfile(
  userId: string,
  defaults?: {
    fullName?: string;
    avatarUrl?: string;
    timezone?: string;
    language?: string;
  }
) {
  let profile = await getProfileByUserId(userId);

  if (!profile) {
    profile = await createProfile({
      userId,
      fullName: defaults?.fullName,
      avatarUrl: defaults?.avatarUrl,
      timezone: defaults?.timezone,
      language: defaults?.language,
    });
  }

  return profile;
}
