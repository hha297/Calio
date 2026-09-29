import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { cx } from '@/utils/cx';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  edges?: Edge[];
  className?: string;
};

export function Screen({
  children,
  scroll = false,
  keyboard = false,
  edges = ['top', 'left', 'right'],
  className,
}: ScreenProps) {
  const colors = useThemeColors();

  const content = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[6],
      }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={cx('flex-1 px-4 pb-4 pt-2', className)}>{children}</View>
  );

  const body = keyboard ? (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={edges}>
      {body}
    </SafeAreaView>
  );
}
