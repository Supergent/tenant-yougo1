/**
 * Endpoint Layer: User Preferences
 *
 * Business logic for managing user preferences.
 * Composes database operations from the db layer.
 * Handles authentication and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as UserPreferences from "../db/userPreferences";

/**
 * Get user preferences (or create default if not exists)
 */
export const get = query({
  handler: async (ctx) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get preferences
    let preferences = await UserPreferences.getUserPreferences(ctx, user._id);

    // Return preferences or defaults
    return preferences || {
      userId: user._id,
      theme: "system" as const,
      defaultPriority: "medium" as const,
      sortOrder: "created" as const,
    };
  },
});

/**
 * Initialize user preferences with defaults
 */
export const initialize = mutation({
  handler: async (ctx) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check if preferences already exist
    const existing = await UserPreferences.getUserPreferences(ctx, user._id);
    if (existing) {
      return existing;
    }

    // Create default preferences
    return await UserPreferences.createUserPreferences(ctx, {
      userId: user._id,
      theme: "system",
      defaultPriority: "medium",
      sortOrder: "created",
    });
  },
});

/**
 * Update user preferences
 */
export const update = mutation({
  args: {
    theme: v.optional(v.union(
      v.literal("light"),
      v.literal("dark"),
      v.literal("system")
    )),
    defaultPriority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
    sortOrder: v.optional(v.union(
      v.literal("created"),
      v.literal("updated"),
      v.literal("priority")
    )),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updatePreferences", { key: user._id });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Get existing preferences
    let preferences = await UserPreferences.getUserPreferences(ctx, user._id);

    // Create preferences if they don't exist
    if (!preferences) {
      return await UserPreferences.createUserPreferences(ctx, {
        userId: user._id,
        theme: args.theme ?? "system",
        defaultPriority: args.defaultPriority ?? "medium",
        sortOrder: args.sortOrder ?? "created",
      });
    }

    // Update existing preferences
    return await UserPreferences.updateUserPreferences(ctx, preferences._id, args);
  },
});
