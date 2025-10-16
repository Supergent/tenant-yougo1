import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate Limiter - Prevent abuse on todo operations
app.use(rateLimiter);

// Agent - AI agent orchestration (if needed for future enhancements)
app.use(agent);

export default app;
