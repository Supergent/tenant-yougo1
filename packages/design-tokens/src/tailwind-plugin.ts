/**
 * Tailwind Plugin
 *
 * Exports a Tailwind CSS plugin that adds theme tokens as utilities and CSS variables.
 */

import plugin from "tailwindcss/plugin";
import { theme } from "./theme";

export const tailwindPlugin = plugin(
  function ({ addBase }) {
    // Add CSS variables to :root
    addBase({
      ":root": {
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

        // Typography
        "--font-family": theme.typography.fontFamily,
        "--font-family-headings": theme.typography.headingsFamily,
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: theme.palette.primary.base,
            foreground: theme.palette.primary.foreground,
            emphasis: theme.palette.primary.emphasis,
          },
          secondary: {
            DEFAULT: theme.palette.secondary.base,
            foreground: theme.palette.secondary.foreground,
            emphasis: theme.palette.secondary.emphasis,
          },
          accent: {
            DEFAULT: theme.palette.accent.base,
            foreground: theme.palette.accent.foreground,
            emphasis: theme.palette.accent.emphasis,
          },
          success: {
            DEFAULT: theme.palette.success.base,
            foreground: theme.palette.success.foreground,
            emphasis: theme.palette.success.emphasis,
          },
          warning: {
            DEFAULT: theme.palette.warning.base,
            foreground: theme.palette.warning.foreground,
            emphasis: theme.palette.warning.emphasis,
          },
          danger: {
            DEFAULT: theme.palette.danger.base,
            foreground: theme.palette.danger.foreground,
            emphasis: theme.palette.danger.emphasis,
          },
          background: theme.neutrals.background,
          surface: theme.neutrals.surface,
          muted: theme.neutrals.muted,
          text: {
            primary: theme.neutrals.textPrimary,
            secondary: theme.neutrals.textSecondary,
          },
        },
        borderRadius: {
          sm: `${theme.radius.sm}px`,
          DEFAULT: `${theme.radius.md}px`,
          md: `${theme.radius.md}px`,
          lg: `${theme.radius.lg}px`,
          pill: `${theme.radius.pill}px`,
        },
        spacing: {
          xs: `${theme.spacing.scale.xs}px`,
          sm: `${theme.spacing.scale.sm}px`,
          md: `${theme.spacing.scale.md}px`,
          lg: `${theme.spacing.scale.lg}px`,
          xl: `${theme.spacing.scale.xl}px`,
          "2xl": `${theme.spacing.scale["2xl"]}px`,
        },
        fontFamily: {
          sans: theme.typography.fontFamily.split(",").map((f) => f.trim()),
          headings: theme.typography.headingsFamily.split(",").map((f) => f.trim()),
        },
        fontSize: {
          xs: [`${theme.typography.scale.xs}px`, "1.5"],
          sm: [`${theme.typography.scale.sm}px`, "1.5"],
          base: [`${theme.typography.scale.base}px`, "1.5"],
          lg: [`${theme.typography.scale.lg}px`, "1.5"],
          xl: [`${theme.typography.scale.xl}px`, "1.4"],
          "2xl": [`${theme.typography.scale["2xl"]}px`, "1.3"],
        },
        fontWeight: {
          regular: theme.typography.weight.regular,
          medium: theme.typography.weight.medium,
          semibold: theme.typography.weight.semibold,
          bold: theme.typography.weight.bold,
        },
        boxShadow: {
          sm: theme.shadows.sm,
          DEFAULT: theme.shadows.md,
          md: theme.shadows.md,
          lg: theme.shadows.lg,
        },
        transitionTimingFunction: {
          DEFAULT: theme.motion.ease,
        },
        transitionDuration: {
          fast: `${theme.motion.duration.fast}ms`,
          DEFAULT: `${theme.motion.duration.base}ms`,
          base: `${theme.motion.duration.base}ms`,
          slow: `${theme.motion.duration.slow}ms`,
        },
      },
    },
  }
);
