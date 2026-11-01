import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';

import { AndroidEdgeSwipeBack } from '@/features/workout/android-edge-swipe-back';
import { useThemeColors } from '@/theme/theme-provider';

function paramId(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : Array.isArray(value) ? value[0] : '';
}

export default function WorkoutLayout() {
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          // iOS: native interactive pop. Android: iOS-like push (previous scene
          // stays in-frame). Swipe-back on Android is handled by AndroidEdgeSwipeBack
          // — Expo Router forces native gestureEnabled off on Android.
          animation: Platform.OS === 'ios' ? 'default' : 'ios_from_right',
          gestureEnabled: true,
          animationMatchesGesture: true,
          contentStyle: { backgroundColor: colors.background },
          freezeOnBlur: false,
        }}
      >
        {/*
          Same `library` route with different top/sub params must be distinct stack
          entries — otherwise Expo reuses the screen, and back plays the forward slide.
        */}
        <Stack.Screen
          name="library"
          getId={({ params }) => {
            const top = paramId(params?.top);
            const sub = paramId(params?.sub);
            return sub ? `library:${top}:${sub}` : `library:${top || 'root'}`;
          }}
        />
        <Stack.Screen
          name="exercise/[id]"
          getId={({ params }) => {
            const id = paramId(params?.id);
            return id ? `exercise:${id}` : undefined;
          }}
        />
        <Stack.Screen
          name="templates/[id]"
          getId={({ params }) => {
            const id = paramId(params?.id);
            return id ? `template:${id}` : undefined;
          }}
        />
        <Stack.Screen
          name="[id]"
          getId={({ params }) => {
            const id = paramId(params?.id);
            return id ? `session:${id}` : undefined;
          }}
        />
      </Stack>
      <AndroidEdgeSwipeBack />
    </View>
  );
}
