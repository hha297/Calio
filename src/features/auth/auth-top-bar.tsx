import { StyleSheet, View } from 'react-native';

import { LanguageDropdown } from '@/features/auth/language-dropdown';
import { ThemeToggle } from '@/features/auth/theme-toggle';

/**
 * Shared auth header controls: language dropdown + animated theme toggle
 * on one horizontal row. No “Language” / “Theme” text labels.
 */
export function AuthTopBar() {
  return (
    <View style={styles.row}>
      <LanguageDropdown />
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 44,
  },
});
