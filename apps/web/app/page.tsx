/**
 * Home Page
 *
 * Main todo list page with authentication guard.
 */

"use client";

import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/app-header";
import { TodoList } from "@/components/todo-list";

export default function Page() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <TodoList />
        </main>
        <footer className="py-6 text-center text-sm text-text-secondary border-t border-muted">
          <p>Built with Next.js, Convex, and Better Auth</p>
        </footer>
      </div>
    </AuthGuard>
  );
}
