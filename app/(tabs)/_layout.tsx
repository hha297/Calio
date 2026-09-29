import { Tabs } from 'expo-router';
import {
  ChartColumn,
  CircleQuestionMark,
  CircleUser,
  NotebookPen,
  ScanLine,
} from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { borders, typography } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: borders.hairline,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: styles.label,
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
      {/* Center slot so a later milestone can emphasize Scan without moving the other tabs. */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <ScanLine color={color} size={size} strokeWidth={2} />,
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
          tabBarIcon: ({ color, size }) => (
            <CircleUser color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.caption.size,
    fontWeight: '600',
  },
});
