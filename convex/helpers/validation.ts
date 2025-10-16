/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate todo title
 * - Must be non-empty
 * - Max 200 characters
 */
export function isValidTodoTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate todo description
 * - Optional field
 * - Max 2000 characters if provided
 */
export function isValidTodoDescription(description: string | undefined): boolean {
  if (!description) return true;
  return description.length <= 2000;
}

/**
 * Validate priority value
 */
export function isValidPriority(priority: string): priority is "low" | "medium" | "high" {
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validate theme value
 */
export function isValidTheme(theme: string): theme is "light" | "dark" | "system" {
  return ["light", "dark", "system"].includes(theme);
}

/**
 * Validate sort order value
 */
export function isValidSortOrder(sortOrder: string): sortOrder is "created" | "updated" | "priority" {
  return ["created", "updated", "priority"].includes(sortOrder);
}

/**
 * Get validation error message for todo title
 */
export function getTodoTitleValidationError(title: string): string | null {
  if (title.trim().length === 0) {
    return "Title cannot be empty";
  }
  if (title.length > 200) {
    return "Title must be 200 characters or less";
  }
  return null;
}

/**
 * Get validation error message for todo description
 */
export function getTodoDescriptionValidationError(description: string | undefined): string | null {
  if (!description) return null;

  if (description.length > 2000) {
    return "Description must be 2000 characters or less";
  }
  return null;
}
