import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/theme/fonts';
import { useThemeColors } from '@/theme/theme-provider';
import { brand } from '@/theme/themes';

import { scanImageSource, useScanImages } from './scan-image';

const DOCK_HEIGHT = 68;
const DOCK_HEIGHT_COMPACT = 62;
const SCAN_SIZE = 62;
const SCAN_SIZE_COMPACT = 58;

type FloatingTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const colors = useThemeColors();
  const scanImages = useScanImages();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compact = width <= 360 || height <= 500;
  const landscape = width > height;
  const dockHeight = compact ? DOCK_HEIGHT_COMPACT : DOCK_HEIGHT;
  const scanSize = compact ? SCAN_SIZE_COMPACT : SCAN_SIZE;
  const scanFocused = state.routes[state.index]?.name === 'scan';
  const bottomGap = Math.max(14, insets.bottom + (landscape ? 0 : 2));
  const horizontalGap = landscape ? 24 : compact ? 8 : 16;
  const dockWidth = Math.min(width - horizontalGap * 2, 620);

  if (scanFocused) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabBarRoot,
        { height: dockHeight + bottomGap, backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          styles.dock,
          {
            bottom: bottomGap,
            width: dockWidth,
            height: dockHeight,
            backgroundColor: colors.surface,
            borderColor: `${colors.primary}55`,
            shadowColor: colors.primary,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const isScan = route.name === 'scan';
          const color = focused ? colors.primary : colors.textMuted;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(
                route.name,
                isScan ? { source: 'navbar', nonce: Date.now().toString() } : route.params,
              );
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          if (isScan) {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                accessibilityState={focused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.scanSlot}
              >
                <View
                  style={[
                    styles.scanButton,
                    {
                      width: scanSize,
                      height: scanSize,
                      borderRadius: scanSize / 2,
                      backgroundColor: focused ? colors.primary : colors.surface,
                      borderColor: `${colors.primary}55`,
                      shadowColor: brand.darkBackground,
                    },
                  ]}
                >
                  <Image
                    source={(focused ? scanImages.active : scanImages.inactive) ?? scanImageSource}
                    style={{ width: scanSize - 12, height: scanSize - 12 }}
                    contentFit="contain"
                    cachePolicy="memory"
                    autoplay
                    tintColor={
                      focused
                        ? scanImages.active
                          ? undefined
                          : colors.textOnPrimary
                        : scanImages.inactive
                          ? undefined
                          : colors.textMuted
                    }
                    accessible={false}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.25}
                  style={[styles.scanLabel, { color }]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <View style={styles.iconWrap}>
                {options.tabBarIcon?.({ focused, color, size: compact ? 21 : 23 })}
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                maxFontSizeMultiplier={1.25}
                style={[styles.label, { color }]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarRoot: {
    alignItems: 'center',
  },
  dock: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 6,
    overflow: 'visible',
    elevation: 9,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  tab: {
    flex: 1,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 2,
  },
  iconWrap: {
    minWidth: 40,
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.dmMedium,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    width: '100%',
  },
  scanSlot: {
    flex: 1,
    minWidth: 58,
    minHeight: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 2,
  },
  scanButton: {
    position: 'absolute',
    top: -26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    elevation: 4,
    shadowOpacity: Platform.OS === 'ios' ? 0.14 : 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  scanLabel: {
    fontFamily: fonts.dmSemiBold,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});
