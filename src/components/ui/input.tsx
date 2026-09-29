import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { useThemeColors } from '@/theme/theme-provider';

import { FieldPlaceholder } from './field-placeholder';
import { fieldShell, getFieldCursorProps, getFieldTypography } from './field-styles';
import { Text } from './text';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  passwordToggle?: boolean;
};

export function Input({
  label,
  error,
  passwordToggle = false,
  secureTextEntry,
  onFocus,
  onBlur,
  onChangeText,
  style,
  placeholder,
  value,
  defaultValue,
  ...props
}: InputProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const isPassword = Boolean(passwordToggle || secureTextEntry);
  const obscure = isPassword ? (passwordToggle ? hidden : Boolean(secureTextEntry)) : false;

  const resolvedValue = value !== undefined ? value : innerValue;
  const showPlaceholder = Boolean(placeholder) && String(resolvedValue ?? '').length === 0;
  const borderColor = error ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View className="gap-1.5">
      <Text variant="label" tone="secondary">
        {label}
      </Text>
      <View
        className="min-h-[52px] flex-row items-center rounded-2xl border px-3.5"
        style={{ backgroundColor: colors.surface, borderColor }}
      >
        <View style={fieldShell.wrap}>
          {showPlaceholder && placeholder ? <FieldPlaceholder label={placeholder} /> : null}
          <TextInput
            {...props}
            {...getFieldCursorProps(colors)}
            value={value}
            defaultValue={defaultValue}
            accessibilityLabel={label}
            placeholder=""
            secureTextEntry={obscure}
            style={[{ ...getFieldTypography(colors), paddingVertical: 12 }, style]}
            onChangeText={(text) => {
              if (value === undefined) {
                setInnerValue(text);
              }
              onChangeText?.(text);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
          />
        </View>
        {passwordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={8}
            onPress={() => setHidden((next) => !next)}
            className="pl-2"
          >
            {hidden ? (
              <Eye size={20} color={colors.textMuted} />
            ) : (
              <EyeOff size={20} color={colors.textMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" tone="error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
