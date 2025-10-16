import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth Client
 *
 * Provides type-safe access to Better Auth component methods.
 * Use this client to:
 * - Get authenticated user: authComponent.getAuthUser(ctx)
 * - Validate sessions
 * - Check permissions
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth Instance
 *
 * Configures Better Auth with:
 * - Email/password authentication
 * - Convex database adapter
 * - JWT tokens with 30-day expiration
 * - No email verification (for simplicity)
 *
 * @param ctx - Convex context (query, mutation, or action context)
 * @param options - Configuration options
 * @returns Configured Better Auth instance
 *
 * @example
 * // In an HTTP handler
 * const auth = createAuth(ctx);
 * return await auth.handler(request);
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // Base URL for authentication endpoints
    baseURL: process.env.SITE_URL!,

    // Use Convex as the database backend
    database: authComponent.adapter(ctx),

    // Email and password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Disabled for simplicity
    },

    // Plugins
    plugins: [
      // Convex plugin - generates JWT tokens for Convex authentication
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),

      // Note: organization() plugin NOT included
      // This is a single-tenant app - each user has their own private todo list
      // Add organization() plugin if you need team/workspace features
    ],
  });
};
