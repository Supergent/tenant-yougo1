import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { ConvexClientProvider } from "@/providers/convex-provider";

export const metadata: Metadata = {
  title: "Minimal Todo App",
  description: "A minimal, user-friendly todo list application built with Next.js and Convex",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary font-sans antialiased">
        <ConvexClientProvider>
          <AppProviders>{children}</AppProviders>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
