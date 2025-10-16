/**
 * Database Layer: Todos
 *
 * This is the ONLY file that directly accesses the todos table using ctx.db.
 * All todos-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * CREATE - Create a new todo item
 */
export async function createTodo(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  }
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    userId: args.userId,
    title: args.title,
    description: args.description,
    priority: args.priority,
    isCompleted: false,
    completedAt: undefined,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * READ - Get todo by ID
 */
export async function getTodoById(
  ctx: QueryCtx,
  id: Id<"todos">
) {
  return await ctx.db.get(id);
}

/**
 * READ - Get all todos for a user (ordered by creation date, newest first)
 */
export async function getTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * READ - Get todos by user and completion status
 */
export async function getTodosByUserAndCompletion(
  ctx: QueryCtx,
  userId: string,
  isCompleted: boolean
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_completion", (q) =>
      q.eq("userId", userId).eq("isCompleted", isCompleted)
    )
    .order("desc")
    .collect();
}

/**
 * READ - Count total todos for a user
 */
export async function countTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  const todos = await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return todos.length;
}

/**
 * READ - Count completed todos for a user
 */
export async function countCompletedTodosByUser(
  ctx: QueryCtx,
  userId: string
) {
  const completedTodos = await ctx.db
    .query("todos")
    .withIndex("by_user_and_completion", (q) =>
      q.eq("userId", userId).eq("isCompleted", true)
    )
    .collect();

  return completedTodos.length;
}

/**
 * UPDATE - Update todo fields
 */
export async function updateTodo(
  ctx: MutationCtx,
  id: Id<"todos">,
  args: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

/**
 * UPDATE - Toggle todo completion status
 */
export async function toggleTodoCompletion(
  ctx: MutationCtx,
  id: Id<"todos">,
  isCompleted: boolean
) {
  const now = Date.now();
  return await ctx.db.patch(id, {
    isCompleted,
    completedAt: isCompleted ? now : undefined,
    updatedAt: now,
  });
}

/**
 * DELETE - Delete a todo
 */
export async function deleteTodo(
  ctx: MutationCtx,
  id: Id<"todos">
) {
  return await ctx.db.delete(id);
}

/**
 * DELETE - Delete all completed todos for a user
 */
export async function deleteCompletedTodos(
  ctx: MutationCtx,
  userId: string
) {
  const completedTodos = await ctx.db
    .query("todos")
    .withIndex("by_user_and_completion", (q) =>
      q.eq("userId", userId).eq("isCompleted", true)
    )
    .collect();

  await Promise.all(
    completedTodos.map(todo => ctx.db.delete(todo._id))
  );

  return completedTodos.length;
}
