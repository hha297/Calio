import { Tabs } from 'expo-router';
import {
  ChartColumnIncreasing,
  CircleUser,
  Dumbbell,
  NotebookPen,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { FloatingTabBar } from '@/components/navigation/floating-tab-bar';
import { useThemeColors } from '@/theme/theme-provider';

export default function TabLayout() {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        // Overlay the floating dock — no reserved white/black slab under the scene.
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.diary'),
          tabBarIcon: ({ color, size }) => (
            <NotebookPen color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: t('tabs.workout'),
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('tabs.scan'),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('tabs.progress'),
          tabBarIcon: ({ color, size }) => (
            <ChartColumnIncreasing color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account'),
          tabBarIcon: ({ color, size }) => <CircleUser color={color} size={size} strokeWidth={2} />,
        }}
      />
      {/* Keep Help route reachable from Account; hide from the tab bar. */}
      <Tabs.Screen
        name="help"
        options={{
          href: null,
          title: t('tabs.help'),
        }}
      />
    </Tabs>
  );
}
