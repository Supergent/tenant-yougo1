/**
 * CSS Variables Generator
 *
 * Converts theme tokens to CSS custom properties.
 * These variables can be used in CSS/Tailwind or imported directly.
 */

import { theme } from "./theme";

export const cssVariables = {
  // Colors - Palette
  "--color-primary": theme.palette.primary.base,
  "--color-primary-foreground": theme.palette.primary.foreground,
  "--color-primary-emphasis": theme.palette.primary.emphasis,

  "--color-secondary": theme.palette.secondary.base,
  "--color-secondary-foreground": theme.palette.secondary.foreground,
  "--color-secondary-emphasis": theme.palette.secondary.emphasis,

  "--color-accent": theme.palette.accent.base,
  "--color-accent-foreground": theme.palette.accent.foreground,
  "--color-accent-emphasis": theme.palette.accent.emphasis,

  "--color-success": theme.palette.success.base,
  "--color-success-foreground": theme.palette.success.foreground,
  "--color-success-emphasis": theme.palette.success.emphasis,

  "--color-warning": theme.palette.warning.base,
  "--color-warning-foreground": theme.palette.warning.foreground,
  "--color-warning-emphasis": theme.palette.warning.emphasis,

  "--color-danger": theme.palette.danger.base,
  "--color-danger-foreground": theme.palette.danger.foreground,
  "--color-danger-emphasis": theme.palette.danger.emphasis,

  // Colors - Neutrals
  "--color-background": theme.neutrals.background,
  "--color-surface": theme.neutrals.surface,
  "--color-muted": theme.neutrals.muted,
  "--color-text-primary": theme.neutrals.textPrimary,
  "--color-text-secondary": theme.neutrals.textSecondary,

  // Radius
  "--radius-sm": `${theme.radius.sm}px`,
  "--radius-md": `${theme.radius.md}px`,
  "--radius-lg": `${theme.radius.lg}px`,
  "--radius-pill": `${theme.radius.pill}px`,

  // Spacing
  "--spacing-xs": `${theme.spacing.scale.xs}px`,
  "--spacing-sm": `${theme.spacing.scale.sm}px`,
  "--spacing-md": `${theme.spacing.scale.md}px`,
  "--spacing-lg": `${theme.spacing.scale.lg}px`,
  "--spacing-xl": `${theme.spacing.scale.xl}px`,
  "--spacing-2xl": `${theme.spacing.scale["2xl"]}px`,

  // Component spacing
  "--spacing-padding-y": `${theme.spacing.components.paddingY}px`,
  "--spacing-padding-x": `${theme.spacing.components.paddingX}px`,
  "--spacing-gap": `${theme.spacing.components.gap}px`,

  // Typography
  "--font-family": theme.typography.fontFamily,
  "--font-family-headings": theme.typography.headingsFamily,

  "--font-size-xs": `${theme.typography.scale.xs}px`,
  "--font-size-sm": `${theme.typography.scale.sm}px`,
  "--font-size-base": `${theme.typography.scale.base}px`,
  "--font-size-lg": `${theme.typography.scale.lg}px`,
  "--font-size-xl": `${theme.typography.scale.xl}px`,
  "--font-size-2xl": `${theme.typography.scale["2xl"]}px`,

  "--font-weight-regular": theme.typography.weight.regular.toString(),
  "--font-weight-medium": theme.typography.weight.medium.toString(),
  "--font-weight-semibold": theme.typography.weight.semibold.toString(),
  "--font-weight-bold": theme.typography.weight.bold.toString(),

  // Shadows
  "--shadow-sm": theme.shadows.sm,
  "--shadow-md": theme.shadows.md,
  "--shadow-lg": theme.shadows.lg,

  // Motion
  "--motion-ease": theme.motion.ease,
  "--motion-duration-fast": `${theme.motion.duration.fast}ms`,
  "--motion-duration-base": `${theme.motion.duration.base}ms`,
  "--motion-duration-slow": `${theme.motion.duration.slow}ms`,
} as const;

/**
 * Generate CSS string with all variables
 */
export function generateCSSVariables(): string {
  const entries = Object.entries(cssVariables);
  return entries.map(([key, value]) => `  ${key}: ${value};`).join("\n");
}

/**
 * CSS string for :root selector
 */
export const rootCSS = `:root {\n${generateCSSVariables()}\n}`;
