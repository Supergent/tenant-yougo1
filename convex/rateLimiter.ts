/**
 * Rate Limiter Configuration
 *
 * Configures rate limiting for todo operations to prevent abuse.
 * Uses token bucket algorithm for flexible rate limiting with burst capacity.
 */

import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Todo creation: 20 per minute with burst capacity of 5
  // Allows users to quickly add multiple todos, then throttles
  createTodo: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5,
  },

  // Todo updates: 50 per minute (checking off todos is frequent)
  // Higher limit for better UX when marking todos complete
  updateTodo: {
    kind: "token bucket",
    rate: 50,
    period: MINUTE,
    capacity: 10,
  },

  // Todo deletion: 30 per minute
  deleteTodo: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 5,
  },

  // Preferences updates: 10 per minute (less frequent)
  updatePreferences: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 3,
  },
});
