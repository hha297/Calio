import { Image } from 'expo-image';
import { View } from 'react-native';

import { cx } from '@/utils/cx';

type BrandMarkProps = {
  /** Visual size of the transparent wordmark. */
  size?: 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
};

const sizes = {
  md: { width: 200, height: 64 },
  lg: { width: 260, height: 84 },
  xl: { width: 300, height: 96 },
  hero: { width: 340, height: 110 },
} as const;

/** Calio wordmark — uses assets/images/translogo.png. */
export function BrandMark({ size = 'lg', className }: BrandMarkProps) {
  const dims = sizes[size];

  return (
    <View accessibilityRole="header" className={cx('items-center', className)}>
      <Image
        source={require('../../assets/images/translogo.png')}
        style={{ width: dims.width, height: dims.height }}
        contentFit="contain"
        accessibilityLabel="Calio"
      />
    </View>
  );
}
