import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';

/**
 * Replicate-inspired type stack (DESIGN.MD):
 * - Display: Bricolage Grotesque (open substitute for proprietary rb-freigeist-neue)
 * - Body/UI: Geist (open substitute for proprietary basier-square)
 * - Mono: JetBrains Mono (matches Replicate reference)
 *
 * `dm*` / `ibm*` aliases kept so existing call sites keep resolving.
 */
export const fonts = {
  displayMedium: 'BricolageGrotesque_500Medium',
  displaySemiBold: 'BricolageGrotesque_600SemiBold',
  displayBold: 'BricolageGrotesque_700Bold',
  displayExtraBold: 'BricolageGrotesque_800ExtraBold',
  bodyRegular: 'Geist_400Regular',
  bodyMedium: 'Geist_500Medium',
  bodySemiBold: 'Geist_600SemiBold',
  bodyBold: 'Geist_700Bold',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemiBold: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
  /** @deprecated Prefer display* / body* — aliases for older call sites. */
  ibmRegular: 'Geist_400Regular',
  ibmMedium: 'Geist_500Medium',
  ibmSemiBold: 'BricolageGrotesque_600SemiBold',
  ibmBold: 'BricolageGrotesque_700Bold',
  dmRegular: 'Geist_400Regular',
  dmMedium: 'Geist_500Medium',
  dmSemiBold: 'Geist_600SemiBold',
  dmBold: 'Geist_700Bold',
} as const;

const fontMap = {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
  ...MaterialCommunityIcons.font,
};

export function useAppFonts(): boolean {
  const [loaded] = useFonts(fontMap);
  return loaded;
}
