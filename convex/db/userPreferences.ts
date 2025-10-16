/**
 * Database Layer: User Preferences
 *
 * This is the ONLY file that directly accesses the userPreferences table using ctx.db.
 * All user preferences-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * CREATE - Create user preferences (with defaults)
 */
export async function createUserPreferences(
  ctx: MutationCtx,
  args: {
    userId: string;
    theme?: "light" | "dark" | "system";
    defaultPriority?: "low" | "medium" | "high";
    sortOrder?: "created" | "updated" | "priority";
  }
) {
  const now = Date.now();
  return await ctx.db.insert("userPreferences", {
    userId: args.userId,
    theme: args.theme ?? "system",
    defaultPriority: args.defaultPriority ?? "medium",
    sortOrder: args.sortOrder ?? "created",
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * READ - Get user preferences by userId
 */
export async function getUserPreferences(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

/**
 * READ - Get user preferences by ID
 */
export async function getUserPreferencesById(
  ctx: QueryCtx,
  id: Id<"userPreferences">
) {
  return await ctx.db.get(id);
}

/**
 * UPDATE - Update user preferences
 */
export async function updateUserPreferences(
  ctx: MutationCtx,
  id: Id<"userPreferences">,
  args: {
    theme?: "light" | "dark" | "system";
    defaultPriority?: "low" | "medium" | "high";
    sortOrder?: "created" | "updated" | "priority";
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

/**
 * DELETE - Delete user preferences
 */
export async function deleteUserPreferences(
  ctx: MutationCtx,
  id: Id<"userPreferences">
) {
  return await ctx.db.delete(id);
}
