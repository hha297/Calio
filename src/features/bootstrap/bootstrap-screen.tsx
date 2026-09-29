import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { colors } from '@/theme';

type BootstrapScreenProps = {
  error?: string | null;
  onRetry?: () => void;
};

/** In-app branded wait — not the Expo Go splash. */
export function BootstrapScreen({ error, onRetry }: BootstrapScreenProps) {
  return (
    <LinearGradient
      colors={[colors.primaryBright, colors.primary, '#2A043D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-8">
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 64,
              backgroundColor: colors.secondary,
              opacity: 0.18,
              top: 80,
              right: -40,
              transform: [{ rotate: '18deg' }],
            }}
          />
          <BrandMark size="hero" />

          {error ? (
            <View className="mt-10 w-full max-w-sm items-center gap-4">
              <Text variant="headingSmall" tone="onPrimary" style={{ textAlign: 'center' }}>
                Couldn’t prepare your data
              </Text>
              <Text
                variant="bodySmall"
                style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)' }}
              >
                {error}
              </Text>
              {onRetry ? (
                <View className="w-full pt-2">
                  <Button label="Retry" variant="secondary" size="lg" onPress={onRetry} />
                </View>
              ) : null}
            </View>
          ) : (
            <View className="mt-10 items-center gap-3">
              <ActivityIndicator color={colors.secondary} size="large" />
              <Text
                variant="bodySmall"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                Getting things ready…
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
