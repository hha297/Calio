import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { elevation, iconSizes, radii, withAlpha } from '@/theme';
import { fonts } from '@/theme/fonts';
import { useThemeColors } from '@/theme/theme-provider';

import { scanImageSource, useScanImages } from './scan-image';

const DOCK_HEIGHT = 68;
const DOCK_HEIGHT_COMPACT = 62;
const SCAN_SIZE = 62;
const SCAN_SIZE_COMPACT = 58;

/** Extra scroll padding so the last diary row clears the floating dock + Scan FAB. */
export function useFloatingTabBarClearance(): number {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compact = width <= 360 || height <= 500;
  const dockHeight = compact ? DOCK_HEIGHT_COMPACT : DOCK_HEIGHT;
  const bottomGap = Math.max(8, insets.bottom);
  return dockHeight + bottomGap + 28;
}

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
  /** Dock sits just above the home indicator — no empty white strip under it. */
  const bottomGap = Math.max(8, insets.bottom);
  const horizontalGap = landscape ? 24 : compact ? 10 : 16;
  const dockWidth = Math.min(width - horizontalGap * 2, 620);

  if (scanFocused) return null;

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      {/* System home-indicator only — matches screen bg, no tall black slab. */}
      {insets.bottom > 0 ? (
        <View
          pointerEvents="none"
          style={[
            styles.homeIndicatorFill,
            { height: insets.bottom, backgroundColor: colors.background },
          ]}
        />
      ) : null}

      <View
        style={[
          styles.dock,
          elevation.tabBar('#000000'),
          {
            bottom: bottomGap,
            width: dockWidth,
            height: dockHeight,
            backgroundColor: colors.surface,
            borderColor: withAlpha(colors.primary, 0.55),
            borderRadius: radii.pill,
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
                    elevation.floatingControl('#000000'),
                    {
                      width: scanSize,
                      height: scanSize,
                      borderRadius: scanSize / 2,
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Image
                    source={(focused ? scanImages.active : scanImages.inactive) ?? scanImageSource}
                    style={{ width: scanSize - 14, height: scanSize - 14 }}
                    contentFit="contain"
                    cachePolicy="memory"
                    autoplay
                    tintColor={
                      scanImages.active || scanImages.inactive
                        ? undefined
                        : colors.textOnPrimary
                    }
                    accessible={false}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.25}
                  style={[styles.scanLabel, { color: focused ? colors.primary : colors.textMuted }]}
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
                {options.tabBarIcon?.({
                  focused,
                  color,
                  size: compact ? iconSizes.md + 1 : iconSizes.lg - 1,
                })}
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
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  homeIndicatorFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dock: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    overflow: 'visible',
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
    borderRadius: radii.md,
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
    overflow: 'visible',
    zIndex: 2,
  },
  scanButton: {
    position: 'absolute',
    top: -26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    fontFamily: fonts.dmSemiBold,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});
