/**
 * Auth Client
 *
 * Client-side Better Auth configuration for the browser.
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [convexClient()],
});

// Export hooks for convenience
export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;
