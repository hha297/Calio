import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { cx } from '@/utils/cx';

import { FieldPlaceholder } from './field-placeholder';
import { fieldCompactTypography, fieldCursorProps, fieldShell } from './field-styles';

type CompactInputProps = Omit<TextInputProps, 'placeholder'> & {
  placeholder?: string;
};

/** Compact single-line field (workout sets, inline editors) with DM Sans placeholder. */
export function CompactInput({
  placeholder,
  value,
  defaultValue,
  onChangeText,
  style,
  onFocus,
  onBlur,
  ...props
}: CompactInputProps) {
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState(defaultValue ?? '');
  const resolvedValue = value !== undefined ? value : innerValue;
  const showPlaceholder = Boolean(placeholder) && String(resolvedValue ?? '').length === 0;

  return (
    <View
      className={cx(
        'h-11 flex-1 justify-center rounded-md border bg-surface px-3',
        focused ? 'border-primary' : 'border-border',
      )}
    >
      <View style={fieldShell.wrap}>
        {showPlaceholder && placeholder ? (
          <FieldPlaceholder label={placeholder} compact />
        ) : null}
        <TextInput
          {...props}
          {...fieldCursorProps}
          value={value}
          defaultValue={defaultValue}
          placeholder=""
          style={[{ ...fieldCompactTypography, paddingVertical: 8 }, style]}
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
    </View>
  );
}
