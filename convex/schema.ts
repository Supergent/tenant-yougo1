import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Minimal Todo List Application
 *
 * Architecture: Four-layer Convex pattern
 * - User-scoped: All tables include userId for data isolation
 * - Single-tenant: No organizationId needed (each user has private list)
 * - Status-based: Todos track completion state
 * - Timestamped: All tables include createdAt and updatedAt
 */

export default defineSchema({
  /**
   * Todos Table
   *
   * Core entity for the todo list application.
   * Each todo item belongs to a single user and tracks completion status.
   */
  todos: defineTable({
    // User ownership
    userId: v.string(),

    // Todo content
    title: v.string(),
    description: v.optional(v.string()),

    // Status tracking
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),

    // Priority (optional enhancement)
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    // Primary index: Get all todos for a user
    .index("by_user", ["userId"])
    // Secondary index: Get todos by user and completion status
    .index("by_user_and_completion", ["userId", "isCompleted"])
    // Tertiary index: Sort by creation time for a user
    .index("by_user_and_created", ["userId", "createdAt"]),

  /**
   * User Preferences Table (Optional)
   *
   * Stores user-specific settings for the todo app.
   * Examples: theme preference, default priority, sort order
   */
  userPreferences: defineTable({
    // User ownership
    userId: v.string(),

    // UI preferences
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    defaultPriority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    sortOrder: v.optional(v.union(v.literal("created"), v.literal("updated"), v.literal("priority"))),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
