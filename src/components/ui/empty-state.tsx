import { View } from 'react-native';

import { Text } from './text';

type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <View className="items-center gap-2 px-2 py-6">
      <Text variant="headingSmall" className="text-center">
        {title}
      </Text>
      <Text variant="body" tone="secondary" className="text-center">
        {body}
      </Text>
    </View>
  );
}
