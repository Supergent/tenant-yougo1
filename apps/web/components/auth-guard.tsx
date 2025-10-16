/**
 * Auth Guard Component
 *
 * Protects routes and shows login form if user is not authenticated.
 */

"use client";

import { useSession } from "@/lib/auth-client";
import { LoginForm } from "./login-form";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
