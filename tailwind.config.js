const colors = require('./src/theme/colors.json');
const typography = require('./src/theme/typography.json');
const radii = require('./src/theme/radii.json');

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
