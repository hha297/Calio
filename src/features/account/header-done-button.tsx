import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/text';
import { fonts } from '@/theme/fonts';
import { spacing } from '@/theme';

type HeaderDoneButtonProps = {
  onPress?: () => void;
};

/** Compact header action — larger than body text for readable "Done". */
export function HeaderDoneButton({ onPress }: HeaderDoneButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('account.done')}
      hitSlop={10}
      onPress={onPress ?? (() => router.back())}
      cssInterop={false}
      style={({ pressed }) => [styles.hit, pressed ? { opacity: 0.7 } : null]}
    >
      <Text tone="brand" style={styles.label}>
        {t('account.done')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    lineHeight: 22,
  },
});
