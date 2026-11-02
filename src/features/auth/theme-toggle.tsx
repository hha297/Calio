import { Moon, Sun } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { iconSizes, radii } from '@/theme';
import { useTheme } from '@/theme/theme-provider';

/** Icon-only light/dark control (no switch track). */
export function ThemeToggle() {
  const { scheme, colors, toggleLightDark } = useTheme();
  const isDark = scheme === 'dark';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={isDark ? 'Dark mode' : 'Light mode'}
      hitSlop={6}
      onPress={toggleLightDark}
      cssInterop={false}
      style={({ pressed }) => [styles.hit, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.chip,
          { backgroundColor: isDark ? colors.primary : '#FFFFFF' },
        ]}
      >
        {isDark ? (
          <Moon size={iconSizes.md} color="#FFFFFF" strokeWidth={2.2} />
        ) : (
          <Sun size={iconSizes.md} color={colors.primary} strokeWidth={2.2} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
