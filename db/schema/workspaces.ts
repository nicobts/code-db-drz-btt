import { pgTable, text, timestamp, varchar, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Enum for workspace member roles
export const workspaceRoleEnum = pgEnum("workspace_role", [
  "owner",
  "admin",
  "member",
  "guest",
]);

// Enum for invitation status
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
]);

// Workspaces table
export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: text("logoUrl"),
  domain: varchar("domain", { length: 255 }),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  createdBy: text("createdBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// Workspace members table (junction table for users and workspaces)
export const workspaceMembers = pgTable("workspace_members", {
  id: text("id").primaryKey().notNull(),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: workspaceRoleEnum("role").notNull().default("member"),
  invitedBy: text("invitedBy").references(() => user.id),
  joinedAt: timestamp("joinedAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Invitations table
export const invitations = pgTable("invitations", {
  id: text("id").primaryKey().notNull(),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  role: workspaceRoleEnum("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  status: invitationStatusEnum("status").notNull().default("pending"),
  invitedBy: text("invitedBy")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  expiresAt: timestamp("expiresAt").notNull(),
});

// Audit logs table for tracking workspace activities
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey().notNull(),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("userId").references(() => user.id, { onDelete: "set null" }),
  action: varchar("action", { length: 255 }).notNull(),
  resource: varchar("resource", { length: 255 }).notNull(),
  resourceId: text("resourceId"),
  metadata: jsonb("metadata").default({}),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
