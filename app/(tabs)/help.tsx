import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

const topics = [
  {
    title: 'Logging food',
    body: 'From Diary, tap Add food. Search your foods, use recent items, create a manual food, or open Scan.',
  },
  {
    title: 'Barcode scanning',
    body: 'Scan uses the camera and Open Food Facts. Incomplete labels are normal — confirm the serving before saving.',
  },
  {
    title: 'Calorie estimates',
    body: 'Food labels and exercise burn are estimates. Calio helps you notice patterns, not medical precision.',
  },
  {
    title: 'Workouts',
    body: 'Start a workout, add exercises from the catalog, log sets, then finish. Volume uses weight × reps for strength sets.',
  },
  {
    title: 'Goals & measurements',
    body: 'Set a daily calorie target in Account → Goal. Log weight over time under Measurements.',
  },
];

export default function HelpScreen() {
  return (
    <Screen scroll>
      <View className="gap-4">
        <Text variant="headingLarge">Help</Text>
        {topics.map((topic) => (
          <Card key={topic.title} className="gap-2">
            <Text variant="headingSmall">{topic.title}</Text>
            <Text variant="body" tone="secondary">
              {topic.body}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
