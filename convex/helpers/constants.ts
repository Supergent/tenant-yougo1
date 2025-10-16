/**
 * Application Constants
 *
 * Shared constants used across the application.
 */

/**
 * Todo field limits
 */
export const TODO_TITLE_MAX_LENGTH = 200;
export const TODO_DESCRIPTION_MAX_LENGTH = 2000;

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = ["low", "medium", "high"] as const;

/**
 * Default values
 */
export const DEFAULT_PRIORITY = "medium" as const;
export const DEFAULT_THEME = "system" as const;
export const DEFAULT_SORT_ORDER = "created" as const;

/**
 * Rate limiting constants
 */
export const RATE_LIMIT_CREATE_TODO = 20; // 20 todos per minute
export const RATE_LIMIT_UPDATE_TODO = 50; // 50 updates per minute
export const RATE_LIMIT_DELETE_TODO = 30; // 30 deletes per minute
