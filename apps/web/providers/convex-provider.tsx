/**
 * Convex Provider
 *
 * Sets up Convex with Better Auth for the application.
 */

"use client";

import { ConvexProviderWithAuth } from "@convex-dev/better-auth/react";
import { convex } from "@/lib/convex";
import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} authClient={authClient}>
      {children}
    </ConvexProviderWithAuth>
  );
}
