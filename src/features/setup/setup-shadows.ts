import type { ViewStyle } from 'react-native';

import { elevation } from '@/theme/elevation';

/**
 * Soft elevation for setup selection / summary cards.
 * Flip to `false` if shadows feel too heavy — shell & SelectionCard read this flag.
 */
export const SETUP_CARD_SHADOWS_ENABLED = true;

export function setupCardShadow(shadowColor: string): ViewStyle {
  if (!SETUP_CARD_SHADOWS_ENABLED) {
    return {};
  }

  return elevation.raised(shadowColor);
}
