import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  fullName: varchar("fullName", { length: 255 }),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  timezone: varchar("timezone", { length: 100 }).default("UTC"),
  language: varchar("language", { length: 10 }).default("en"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
