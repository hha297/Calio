import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/brand-mark';
import { LanguageDropdown } from '@/features/auth/language-dropdown';
import { ThemeToggle } from '@/features/auth/theme-toggle';

/** Auth header: brand lockup left; theme + language icon controls right. */
export function AuthTopBar() {
  return (
    <View style={styles.row}>
      <BrandMark size="md" />
      <View style={styles.actions}>
        <ThemeToggle variant="icon" />
        <LanguageDropdown />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 48,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

