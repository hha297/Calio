import { Image } from 'expo-image';
import { Text as RNText, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { useThemeColors } from '@/theme/theme-provider';
import { cx } from '@/utils/cx';

type BrandMarkProps = {
  /** Visual size of the logo + wordmark lockup. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
};

const sizes = {
  sm: { logo: 28, fontSize: 20, gap: 6, letterSpacing: -0.4 },
  md: { logo: 40, fontSize: 28, gap: 8, letterSpacing: -0.8 },
  lg: { logo: 52, fontSize: 36, gap: 10, letterSpacing: -1 },
  xl: { logo: 60, fontSize: 42, gap: 12, letterSpacing: -1.2 },
  hero: { logo: 72, fontSize: 48, gap: 14, letterSpacing: -1.4 },
} as const;

/** Trackwise lockup — mark + “Track” + primary “wise”. */
export function BrandMark({ size = 'lg', className }: BrandMarkProps) {
  const colors = useThemeColors();
  const dims = sizes[size];

  return (
    <View
      accessibilityRole="header"
      accessibilityLabel="Trackwise"
      className={cx('flex-row items-center', className)}
      style={{ gap: dims.gap }}
    >
      <Image
        source={require('../../assets/images/branding/translogo.png')}
        style={{ width: dims.logo, height: dims.logo }}
        contentFit="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <RNText
        style={{
          fontFamily: fonts.displayExtraBold,
          fontSize: dims.fontSize,
          lineHeight: dims.fontSize * 1.05,
          letterSpacing: dims.letterSpacing,
          color: colors.textPrimary,
        }}
      >
        Track
        <RNText style={{ color: colors.primary }}>wise</RNText>
      </RNText>
    </View>
  );
}
