"use client";

import * as React from "react";
import { ToastProvider } from "./toast";

/**
 * Theme Provider
 *
 * Wrapper for theme context (light/dark mode, etc.)
 * Currently a pass-through, but can be extended with theme logic.
 */
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

/**
 * App Providers
 *
 * Root providers for the application.
 * Note: Convex + Better Auth providers should be set up in the Next.js app
 * This is just for toast notifications and theme.
 */
export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
