import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
