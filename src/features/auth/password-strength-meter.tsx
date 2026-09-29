import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

import { assessPasswordStrength } from './password-strength';

type PasswordStrengthMeterProps = {
  password: string;
  /** Extra strings (e.g. email local-part) that should not appear in the password. */
  userInputs?: string[];
};

export function PasswordStrengthMeter({ password, userInputs = [] }: PasswordStrengthMeterProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const strength = assessPasswordStrength(password, userInputs);
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(strength.fill, { duration: 220 });
  }, [progress, strength.fill]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth * progress.value,
  }));

  const label =
    strength.tier === 'empty'
      ? t('auth.strengthEmpty')
      : strength.labelKey
        ? t(strength.labelKey)
        : '';

  return (
    <View style={styles.wrap} accessibilityRole="progressbar">
      <View className="flex-row items-center justify-between" style={styles.labelRow}>
        <Text variant="caption" tone="muted">
          {t('auth.passwordStrength')}
        </Text>
        <Text
          variant="caption"
          style={{
            color: strength.tier === 'empty' ? colors.textMuted : strength.color,
            minWidth: 72,
            textAlign: 'right',
          }}
        >
          {label}
        </Text>
      </View>

      <View
        style={[styles.track, { backgroundColor: colors.surfaceMuted }]}
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            {
              backgroundColor: strength.tier === 'empty' ? colors.border : strength.color,
            },
          ]}
        />
      </View>

      <View style={styles.hintSlot}>
        {strength.hintKey ? (
          <Text variant="caption" tone="muted">
            {t(strength.hintKey)}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    minHeight: 52,
  },
  labelRow: {
    minHeight: 18,
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  hintSlot: {
    minHeight: 18,
  },
});
