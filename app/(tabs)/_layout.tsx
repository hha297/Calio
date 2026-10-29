import { Tabs } from 'expo-router';
import { ChartColumn, CircleQuestionMark, CircleUser, NotebookPen } from 'lucide-react-native';

import { FloatingTabBar } from '@/components/navigation/floating-tab-bar';
import { useThemeColors } from '@/theme/theme-provider';

export default function TabLayout() {
  const colors = useThemeColors();

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
          title: 'Diary',
          tabBarIcon: ({ color, size }) => (
            <NotebookPen color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <ChartColumn color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color, size }) => (
            <CircleQuestionMark color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <CircleUser color={color} size={size} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
