/**
 * App Header Component
 *
 * Header with app title and user info/logout button.
 */

"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { CheckSquare, LogOut } from "lucide-react";

export function AppHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-surface border-b border-muted sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Minimal Todo
              </h1>
              <p className="text-xs text-text-secondary">
                Stay organized, get things done
              </p>
            </div>
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-text-primary">
                  {session.user?.name || "User"}
                </div>
                <div className="text-xs text-text-secondary">
                  {session.user?.email}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
