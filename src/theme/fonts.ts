import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import { useFonts } from 'expo-font';

export const fonts = {
  ibmMedium: 'IBMPlexSans_500Medium',
  ibmSemiBold: 'IBMPlexSans_600SemiBold',
  ibmBold: 'IBMPlexSans_700Bold',
  dmRegular: 'DMSans_400Regular',
  dmMedium: 'DMSans_500Medium',
  dmSemiBold: 'DMSans_600SemiBold',
  dmBold: 'DMSans_700Bold',
} as const;

const fontMap = {
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
};

/** IBM Plex Sans = display/UI. DM Sans = body copy. */
export function useAppFonts(): boolean {
  const [loaded] = useFonts(fontMap);
  return loaded;
}
