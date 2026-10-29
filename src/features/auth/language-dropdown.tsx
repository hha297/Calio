import { usePathname } from 'expo-router';
import { Check, ChevronDown } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View, type ViewInstance } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import {
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  changeAppLanguage,
  useAppLanguage
} from '@/i18n';
import { elevation, iconSizes, motion, radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

const MENU_MIN_WIDTH = 220;
const MENU_MAX_WIDTH = 272;
const GAP_BELOW_TRIGGER = 8;

type MenuPosition = {
  top: number;
  left: number;
  minWidth: number;
};

/** Animated language selector shared by the auth screens. */
export function LanguageDropdown() {
  const colors = useThemeColors();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<ViewInstance>(null);
  const language = useAppLanguage();
  const openProgress = useSharedValue(0);

  useEffect(() => {
    openProgress.value = withTiming(open ? 1 : 0, { duration: motion.fast + 30 });
  }, [open, openProgress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setMenuPos(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${openProgress.value * 180}deg` }],
  }));

  function closeMenu() {
    setOpen(false);
    setMenuPos(null);
  }

  function openMenu() {
    triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      const screenWidth = Dimensions.get('window').width;
      const minWidth = Math.min(MENU_MAX_WIDTH, Math.max(MENU_MIN_WIDTH, width));
      const left = Math.max(12, Math.min(x, screenWidth - minWidth - 12));
      setMenuPos({ top: y + height + GAP_BELOW_TRIGGER, left, minWidth });
      setOpen(true);
    });
  }

  function toggleMenu() {
    if (open) closeMenu();
    else openMenu();
  }

  return (
    <>
      <View ref={triggerRef} collapsable={false} style={styles.anchor}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={LANGUAGE_LABELS[language]}
          accessibilityState={{ expanded: open }}
          hitSlop={6}
          onPress={toggleMenu}
          cssInterop={false}
          style={({ pressed }) => [
            styles.trigger,
            {
              backgroundColor: open ? colors.primaryMuted : colors.surface,
              borderColor: open ? colors.primary : colors.border,
            },
            pressed && styles.pressed,
          ]}
        >
          <View style={[styles.triggerFlagWrap, { backgroundColor: colors.surfaceMuted }]}>
            <Text style={styles.flag}>{LANGUAGE_FLAGS[language]}</Text>
          </View>
          <View style={styles.triggerCopy}>
            <Text
              variant="bodyStrong"
              numberOfLines={1}
              style={[styles.triggerLabel, { color: colors.textPrimary }]}
            >
              {LANGUAGE_LABELS[language]}
            </Text>
          </View>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={iconSizes.sm} color={colors.textMuted} strokeWidth={2.2} />
          </Animated.View>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
        statusBarTranslucent
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            onPress={closeMenu}
          />
          {menuPos ? (
            <View
              pointerEvents="box-none"
              style={[
                styles.menu,
                elevation.dropdown('#000000'),
                {
                  top: menuPos.top,
                  left: menuPos.left,
                  minWidth: menuPos.minWidth,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              {SUPPORTED_LANGUAGES.map((code) => {
                const selected = language === code;
                return (
                  <Pressable
                    key={code}
                    accessibilityRole="menuitem"
                    accessibilityLabel={LANGUAGE_LABELS[code]}
                    accessibilityState={{ selected }}
                    cssInterop={false}
                    onPress={() => void changeAppLanguage(code).then(closeMenu)}
                    style={({ pressed }) => [
                      styles.option,
                      selected ? { backgroundColor: colors.primaryMuted } : null,
                      pressed && !selected ? { backgroundColor: colors.surfaceMuted } : null,
                    ]}
                  >
                    <View style={[styles.optionFlagWrap, { backgroundColor: colors.surfaceMuted }]}>
                      <Text style={styles.optionFlag}>{LANGUAGE_FLAGS[code]}</Text>
                    </View>
                    <View style={styles.optionCopy}>
                      <Text
                        variant={selected ? 'bodyStrong' : 'body'}
                        style={{ color: selected ? colors.primary : colors.textPrimary }}
                      >
                        {LANGUAGE_LABELS[code]}
                      </Text>
                    </View>
                    {selected ? (
                      <View style={[styles.check, { backgroundColor: colors.primary }]}>
                        <Check size={iconSizes.xs + 1} color={colors.textOnPrimary} strokeWidth={2.8} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  anchor: { alignSelf: 'flex-start' },
  trigger: {
    minHeight: 50,
    width: 158,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2] + 1,
    paddingHorizontal: spacing[2] + 1,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  pressed: { opacity: 0.84, transform: [{ scale: 0.98 }] },
  triggerFlagWrap: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerCopy: {
    flex: 1,
    minWidth: 0,
    height: 34,
    justifyContent: 'center',
  },
  triggerLabel: {
    fontSize: 16,
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  flag: { fontSize: 16, lineHeight: 20 },
  modalRoot: { flex: 1 },
  menu: {
    position: 'absolute',
    maxWidth: MENU_MAX_WIDTH,
    borderRadius: radii.md,
    borderWidth: 0,
    padding: spacing[2],
  },
  option: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2] + 2,
    paddingHorizontal: spacing[2],
    borderRadius: radii.lg,
  },
  optionFlagWrap: {
    width: 38,
    height: 38,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionFlag: { fontSize: 19, lineHeight: 23 },
  optionCopy: { flex: 1 },
  check: {
    width: spacing[6],
    height: spacing[6],
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
