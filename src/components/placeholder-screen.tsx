import { View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

type PlaceholderScreenProps = {
  title: string;
  emptyTitle: string;
  body: string;
};

export function PlaceholderScreen({ title, emptyTitle, body }: PlaceholderScreenProps) {
  return (
    <Screen>
      <View className="flex-1">
        <Text variant="headingLarge">{title}</Text>
        <View className="flex-1 justify-center">
          <EmptyState title={emptyTitle} body={body} />
        </View>
      </View>
    </Screen>
  );
}
