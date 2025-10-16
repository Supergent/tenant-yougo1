/**
 * Design Tokens Package
 *
 * Exports theme configuration, CSS variables, and Tailwind plugin.
 */

export { theme, type Theme } from "./theme";
export { cssVariables, generateCSSVariables, rootCSS } from "./css-variables";
export { tailwindPlugin } from "./tailwind-plugin";

// Re-export for convenience
export default {
  theme,
  cssVariables,
  tailwindPlugin,
};
