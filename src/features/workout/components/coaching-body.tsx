import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type CoachingBodyProps = {
  text: string;
};

/**
 * Renders coaching copy with preserved line breaks.
 * Lines starting with digits/`-`/`•` get a slight indent for scanability.
 */
export function CoachingBody({ text }: CoachingBodyProps) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line, index, all) => line.trim().length > 0 || (index > 0 && index < all.length - 1));

  if (lines.length <= 1) {
    return <Text variant="body">{text.trim()}</Text>;
  }

  return (
    <View className="gap-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <View key={`blank-${index}`} style={{ height: 4 }} />;
        const isStep = /^(\d+[\).\]]|-|•|\*)\s+/.test(trimmed);
        return (
          <Text
            key={`${index}-${trimmed.slice(0, 24)}`}
            variant="body"
            style={isStep ? { paddingLeft: 2 } : undefined}
          >
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
}
