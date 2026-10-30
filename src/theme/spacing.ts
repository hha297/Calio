/** 4px half-steps; Replicate-inspired 4 / 8 / 12 / 16 rhythm. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
} as const;

export const layout = {
  screenPaddingX: spacing[4],
  screenPaddingTop: spacing[2],
  screenPaddingBottom: spacing[6],
  sectionGap: spacing[4],
  cardPadding: spacing[4],
  cardPaddingDense: spacing[3],
  cardGap: spacing[3],
  fieldGap: spacing[3],
  fieldGapDense: spacing[3],
  labelGap: 6,
  iconTextGap: spacing[2],
  controlMinHeight: 48,
  inputMinHeight: 48,
  segmentMinHeight: 40,
  macroCellMinHeight: 56,
} as const;
