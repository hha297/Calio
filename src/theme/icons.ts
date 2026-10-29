/** Lucide / vector icon sizes used across Calio. */
export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export type IconSize = keyof typeof iconSizes;
