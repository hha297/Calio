import { Platform, type ViewStyle } from 'react-native';

/**
 * Soft elevation for setup selection / summary cards.
 * Flip to `false` if shadows feel too heavy — shell & SelectionCard read this flag.
 */
export const SETUP_CARD_SHADOWS_ENABLED = true;

export function setupCardShadow(shadowColor: string): ViewStyle {
  if (!SETUP_CARD_SHADOWS_ENABLED) {
    return {};
  }

  return {
    shadowColor,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  };
}
