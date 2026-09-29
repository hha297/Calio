import { ChevronDown } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';
import { cx } from '@/utils/cx';

import { FieldPlaceholder } from './field-placeholder';
import { fieldShell, fieldTypography } from './field-styles';
import { Text } from './text';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string = string> = {
  label: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export function Select<T extends string = string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  error,
  disabled = false,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );
  const showPlaceholder = !selected;

  return (
    <View className="gap-1.5">
      <Text variant="label" tone="secondary">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={cx(
          'min-h-[52px] flex-row items-center rounded-2xl border bg-surface px-3.5',
          error ? 'border-error' : open ? 'border-primary' : 'border-border',
          disabled && 'opacity-50',
        )}
      >
        <View style={fieldShell.wrap}>
          {showPlaceholder ? <FieldPlaceholder label={placeholder} /> : null}
          {selected ? (
            <Text variant="body" style={{ ...fieldTypography, paddingVertical: 12 }}>
              {selected.label}
            </Text>
          ) : (
            // Reserve height so the control doesn’t collapse when empty.
            <View style={{ height: 46 }} />
          )}
        </View>
        <ChevronDown size={20} color={colors.textMuted} />
      </Pressable>
      {error ? (
        <Text variant="caption" tone="error">
          {error}
        </Text>
      ) : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(33,27,36,0.45)', justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}
        >
          <Pressable onPress={(event) => event.stopPropagation()}>
            <SafeAreaView
              edges={['bottom']}
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '70%',
              }}
            >
              <View className="items-center px-4 pb-2 pt-3">
                <View
                  className="mb-3 h-1.5 w-12 rounded-full"
                  style={{ backgroundColor: colors.borderStrong }}
                />
                <Text variant="headingSmall" className="mb-1 self-start">
                  {label}
                </Text>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                {options.map((option) => {
                  const isActive = option.value === value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className="flex-row items-center justify-between border-b border-border px-4 py-3.5"
                      style={isActive ? { backgroundColor: colors.primaryMuted } : undefined}
                    >
                      <Text
                        variant={isActive ? 'bodyStrong' : 'body'}
                        style={{ fontFamily: isActive ? undefined : fieldTypography.fontFamily }}
                      >
                        {option.label}
                      </Text>
                      {isActive ? (
                        <Text variant="caption" tone="brand">
                          Selected
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
