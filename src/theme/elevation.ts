import { Platform, type ViewStyle } from 'react-native';

/** Replicate-inspired: minimal shadow; prefer hairline contrast. */
export const elevation = {
  none: {} satisfies ViewStyle,

  card: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  }),

  raised: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  }),

  floating: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  }),

  tabBar: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  }),

  floatingControl: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  }),

  dropdown: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  }),

  thumb: (shadowColor: string = '#202020'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  }),
} as const;
