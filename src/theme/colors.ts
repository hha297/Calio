import palette from './colors.json';

export const colors = palette;

export type ColorName = keyof typeof colors;
