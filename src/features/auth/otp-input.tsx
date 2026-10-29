import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { FieldPlaceholder } from '@/components/ui/field-placeholder';
import { fieldShell, getFieldCursorProps, getFieldTypography } from '@/components/ui/field-styles';
import { Text } from '@/components/ui/text';
import { EMAIL_OTP_LENGTH } from '@/features/auth/recovery-constants';
import { layout, radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type OtpInputProps = {
  value: string;
  onChange: (next: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Digit count — defaults to shared recovery constant. */
  length?: number;
};

function onlyDigits(text: string) {
  return text.replace(/\D/g, '');
}

/**
 * Single OTP field sized for small Android screens.
 * Value stays a string so leading zeros are preserved.
 */
export function OtpInput({
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = true,
  length = EMAIL_OTP_LENGTH,
}: OtpInputProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const showPlaceholder = value.length === 0;
  const placeholder = t('auth.otpPlaceholder', { count: length });
  const borderColor = error ? colors.error : focused ? colors.borderFocus : colors.border;

  useEffect(() => {
    if (autoFocus && !disabled) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  return (
    <View className="gap-1.5">
      <View
        style={{
          minHeight: layout.inputMinHeight,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: radii.pill,
          borderWidth: 1,
          paddingHorizontal: spacing[3],
          backgroundColor: colors.surfaceMuted,
          borderColor,
        }}
      >
        <View style={fieldShell.wrap}>
          {showPlaceholder ? <FieldPlaceholder label={placeholder} /> : null}
          <TextInput
            ref={inputRef}
            {...getFieldCursorProps(colors)}
            value={value}
            onChangeText={(text) => {
              onChange(onlyDigits(text).slice(0, length));
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            editable={!disabled}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            importantForAutofill="yes"
            maxLength={length}
            placeholder=""
            accessibilityLabel={t('auth.verificationCode')}
            style={{
              ...getFieldTypography(colors),
              paddingVertical: spacing[2],
              letterSpacing: value.length > 0 ? 4 : 0,
              textAlign: 'center',
            }}
          />
        </View>
      </View>
      <Text variant="caption" tone={error ? 'error' : 'muted'}>
        {error ?? t('auth.otpHelper', { count: length, filled: value.length })}
      </Text>
    </View>
  );
}
