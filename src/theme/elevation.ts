import { Platform, type ViewStyle } from 'react-native';

/**
 * Spotify-inspired elevation (DESIGN.MD): heavier shadows on dark.
 * Pass shadowColor — typically `#000000`.
 */
export const elevation = {
  none: {} satisfies ViewStyle,

  /** Subtle card lift — medium Spotify shadow. */
  card: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  }),

  raised: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  }),

  /** Floating tab dock / FABs */
  floating: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  }),

  /** Bottom nav dock — restrained lift (avoids a heavy black haze). */
  tabBar: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: Platform.OS === 'ios' ? 0.22 : 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  }),

  floatingControl: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: Platform.OS === 'ios' ? 0.28 : 0.32,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  }),

  /** Dialogs / menus — heavy Spotify shadow */
  dropdown: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  }),

  thumb: (shadowColor: string = '#000000'): ViewStyle => ({
    shadowColor,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  }),
} as const;
