import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router
 *
 * Handles HTTP requests for authentication and other endpoints.
 * Better Auth requires HTTP routes to handle auth requests (login, signup, logout, etc.)
 */
const http = httpRouter();

/**
 * Better Auth Routes - POST
 *
 * Handles authentication POST requests:
 * - /auth/sign-in - User login
 * - /auth/sign-up - User registration
 * - /auth/sign-out - User logout
 * - /auth/verify-email - Email verification
 * - And other Better Auth endpoints
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

/**
 * Better Auth Routes - GET
 *
 * Handles authentication GET requests:
 * - /auth/session - Get current session
 * - /auth/callback/* - OAuth callbacks
 * - And other Better Auth endpoints
 */
http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
