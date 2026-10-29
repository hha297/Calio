import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';

/**
 * IBM Plex Sans for UI + body (temporary).
 * DM Sans lacked reliable Vietnamese diacritics; keep `dm*` token names so
 * existing call sites keep working while pointing at IBM Plex.
 */
export const fonts = {
  ibmRegular: 'IBMPlexSans_400Regular',
  ibmMedium: 'IBMPlexSans_500Medium',
  ibmSemiBold: 'IBMPlexSans_600SemiBold',
  ibmBold: 'IBMPlexSans_700Bold',
  dmRegular: 'IBMPlexSans_400Regular',
  dmMedium: 'IBMPlexSans_500Medium',
  dmSemiBold: 'IBMPlexSans_600SemiBold',
  dmBold: 'IBMPlexSans_700Bold',
} as const;

const fontMap = {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
  ...MaterialCommunityIcons.font,
};

/** IBM Plex Sans = display + body (Vietnamese-capable). */
export function useAppFonts(): boolean {
  const [loaded] = useFonts(fontMap);
  return loaded;
}
