import { usePathname } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Text } from '@/components/ui/text';
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  changeAppLanguage,
  useAppLanguage,
  type AppLanguage,
} from '@/i18n';
import { useThemeColors } from '@/theme/theme-provider';

const LANGUAGE_FLAGS: Record<AppLanguage, string> = {
  en: '🇬🇧',
  fi: '🇫🇮',
  sv: '🇸🇪',
  vi: '🇻🇳',
};

const MENU_MIN_WIDTH = 196;
const MENU_MAX_WIDTH = 260;
const GAP_BELOW_TRIGGER = 6;

type MenuPosition = {
  top: number;
  left: number;
  minWidth: number;
};

/** Compact language dropdown with flag + full name. */
export function LanguageDropdown() {
  const colors = useThemeColors();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<View>(null);
  const language = useAppLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setMenuPos(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  function closeMenu() {
    setOpen(false);
    setMenuPos(null);
  }

  function openMenu() {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const screenW = Dimensions.get('window').width;
      const minWidth = Math.min(MENU_MAX_WIDTH, Math.max(MENU_MIN_WIDTH, width));
      const left = Math.max(12, Math.min(x, screenW - minWidth - 12));
      setMenuPos({
        top: y + height + GAP_BELOW_TRIGGER,
        left,
        minWidth,
      });
      setOpen(true);
    });
  }

  function toggleMenu() {
    if (open) {
      closeMenu();
      return;
    }
    openMenu();
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
          style={[
            styles.trigger,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.flag}>{LANGUAGE_FLAGS[language]}</Text>
          <Text
            variant="label"
            numberOfLines={1}
            style={{ color: colors.textPrimary, maxWidth: 110 }}
          >
            {LANGUAGE_LABELS[language]}
          </Text>
          <ChevronDown
            size={14}
            color={colors.textMuted}
            style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
          />
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
                {
                  top: menuPos.top,
                  left: menuPos.left,
                  minWidth: menuPos.minWidth,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  shadowColor: '#000000',
                },
              ]}
            >
              {SUPPORTED_LANGUAGES.map((code) => {
                const selected = language === code;
                return (
                  <Pressable
                    key={code}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected }}
                    cssInterop={false}
                    onPress={() => {
                      void changeAppLanguage(code).then(closeMenu);
                    }}
                    style={[
                      styles.option,
                      selected ? { backgroundColor: colors.primaryMuted } : null,
                    ]}
                  >
                    <Text style={styles.flag}>{LANGUAGE_FLAGS[code]}</Text>
                    <Text
                      variant={selected ? 'bodyStrong' : 'body'}
                      style={{
                        color: selected ? colors.primary : colors.textPrimary,
                        flex: 1,
                      }}
                    >
                      {LANGUAGE_LABELS[code]}
                    </Text>
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
  anchor: {
    alignSelf: 'flex-start',
  },
  trigger: {
    minHeight: 36,
    maxWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  flag: {
    fontSize: 16,
    lineHeight: 20,
  },
  modalRoot: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    maxWidth: MENU_MAX_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 4,
    elevation: 8,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
  },
});
