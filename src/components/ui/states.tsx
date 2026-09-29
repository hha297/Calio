import { ActivityIndicator, View } from 'react-native';

import { useThemeColors } from '@/theme/theme-provider';

import { Button } from './button';
import { Text } from './text';

type Props = {
  title: string;
  body: string;
  onRetry?: () => void;
};

export function ErrorState({ title, body, onRetry }: Props) {
  return (
    <View className="items-center gap-3 px-4 py-8">
      <Text variant="headingSmall" className="text-center">
        {title}
      </Text>
      <Text variant="body" tone="secondary" className="text-center">
        {body}
      </Text>
      {onRetry ? <Button label="Retry" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const colors = useThemeColors();

  return (
    <View className="items-center justify-center gap-3 py-10">
      <ActivityIndicator color={colors.primary} />
      <Text variant="bodySmall" tone="secondary">
        {label}
      </Text>
    </View>
  );
}
