const colorsJson = require('./src/theme/colors.json');
const typography = require('./src/theme/typography.json');
const radii = require('./src/theme/radii.json');

/**
 * Semantic colors resolve through CSS vars set by ThemeProvider (`--color-*`).
 * Hex light defaults in colors.json remain the TypeScript/static source of truth;
 * runtime light/dark values come from themes.ts via vars().
 */
const colors = Object.fromEntries(
  Object.keys(colorsJson).map((key) => {
    const sample = colorsJson[key];
    const isHex = typeof sample === 'string' && /^#[0-9a-fA-F]{6}$/.test(sample);
    // Hex tokens support Tailwind alpha modifiers (bg-primary/20).
    // Overlay rgba tokens use the raw CSS variable.
    return [
      key,
      isHex ? `rgb(var(--color-${key}) / <alpha-value>)` : `var(--color-${key})`,
    ];
  }),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      borderRadius: {
        sm: `${radii.sm}px`,
        md: `${radii.md}px`,
        lg: `${radii.lg}px`,
        xl: `${radii.xl}px`,
        '2xl': `${radii['2xl']}px`,
        '3xl': `${radii['3xl']}px`,
        pill: `${radii.pill}px`,
      },
      fontSize: Object.fromEntries(
        Object.entries(typography).map(([name, role]) => [
          name,
          [`${role.size}px`, { lineHeight: `${role.lineHeight}px` }],
        ]),
      ),
    },
  },
  plugins: [],
};
