import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/theme/theme-provider';

type AuthTextLinkProps = {
  href?: Href;
  label: string;
  /** Leading back arrow vs trailing forward arrow. */
  direction?: 'back' | 'forward';
  onPress?: () => void;
};

/** Footer / navigation link with a directional arrow. */
export function AuthTextLink({
  href,
  label,
  direction = 'forward',
  onPress,
}: AuthTextLinkProps) {
  const colors = useThemeColors();

  const content = (
    <View style={styles.row}>
      {direction === 'back' ? (
        <ArrowLeft size={16} color={colors.primary} strokeWidth={2.5} />
      ) : null}
      <Text variant="bodyStrong" style={{ color: colors.primary }}>
        {label}
      </Text>
      {direction === 'forward' ? (
        <ArrowRight size={16} color={colors.primary} strokeWidth={2.5} />
      ) : null}
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable accessibilityRole="link" hitSlop={8}>
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
