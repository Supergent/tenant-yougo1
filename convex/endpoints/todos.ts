/**
 * Endpoint Layer: Todos
 *
 * Business logic for todo list operations.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Todos from "../db/todos";
import {
  isValidTodoTitle,
  isValidTodoDescription,
  getTodoTitleValidationError,
  getTodoDescriptionValidationError,
} from "../helpers/validation";

/**
 * List all todos for the authenticated user
 */
export const list = query({
  handler: async (ctx) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get all todos for user (db layer handles sorting)
    return await Todos.getTodosByUser(ctx, user._id);
  },
});

/**
 * List todos filtered by completion status
 */
export const listByCompletion = query({
  args: {
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get filtered todos
    return await Todos.getTodosByUserAndCompletion(
      ctx,
      user._id,
      args.isCompleted
    );
  },
});

/**
 * Get a specific todo by ID
 */
export const get = query({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get todo
    const todo = await Todos.getTodoById(ctx, args.id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    // Authorization - verify ownership
    if (todo.userId !== user._id) {
      throw new Error("Not authorized to view this todo");
    }

    return todo;
  },
});

/**
 * Create a new todo
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "createTodo", { key: user._id });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Validation
    if (!isValidTodoTitle(args.title)) {
      const error = getTodoTitleValidationError(args.title);
      throw new Error(error || "Invalid todo title");
    }

    if (!isValidTodoDescription(args.description)) {
      const error = getTodoDescriptionValidationError(args.description);
      throw new Error(error || "Invalid todo description");
    }

    // Create todo
    return await Todos.createTodo(ctx, {
      userId: user._id,
      title: args.title.trim(),
      description: args.description?.trim(),
      priority: args.priority,
    });
  },
});

/**
 * Update a todo's content
 */
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", { key: user._id });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== user._id) {
      throw new Error("Not authorized to update this todo");
    }

    // Validation
    if (args.title !== undefined && !isValidTodoTitle(args.title)) {
      const error = getTodoTitleValidationError(args.title);
      throw new Error(error || "Invalid todo title");
    }

    if (args.description !== undefined && !isValidTodoDescription(args.description)) {
      const error = getTodoDescriptionValidationError(args.description);
      throw new Error(error || "Invalid todo description");
    }

    // Update todo
    const { id, ...updateArgs } = args;
    return await Todos.updateTodo(ctx, id, {
      ...updateArgs,
      title: updateArgs.title?.trim(),
      description: updateArgs.description?.trim(),
    });
  },
});

/**
 * Toggle a todo's completion status
 */
export const toggleCompletion = mutation({
  args: {
    id: v.id("todos"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Rate limiting (uses updateTodo limit)
    const status = await rateLimiter.limit(ctx, "updateTodo", { key: user._id });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== user._id) {
      throw new Error("Not authorized to update this todo");
    }

    // Toggle completion
    return await Todos.toggleTodoCompletion(ctx, args.id, args.isCompleted);
  },
});

/**
 * Delete a todo
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", { key: user._id });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== user._id) {
      throw new Error("Not authorized to delete this todo");
    }

    // Delete todo
    return await Todos.deleteTodo(ctx, args.id);
  },
});

/**
 * Delete all completed todos for the user
 */
export const clearCompleted = mutation({
  handler: async (ctx) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Rate limiting (uses deleteTodo limit)
    const status = await rateLimiter.limit(ctx, "deleteTodo", { key: user._id });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Delete all completed todos
    const deletedCount = await Todos.deleteCompletedTodos(ctx, user._id);

    return { deletedCount };
  },
});

/**
 * Get todo statistics for the user
 */
export const getStats = query({
  handler: async (ctx) => {
    // Authentication
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get counts
    const totalCount = await Todos.countTodosByUser(ctx, user._id);
    const completedCount = await Todos.countCompletedTodosByUser(ctx, user._id);
    const activeCount = totalCount - completedCount;

    return {
      total: totalCount,
      completed: completedCount,
      active: activeCount,
      completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
    };
  },
});
