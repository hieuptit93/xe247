import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { FontSize, FontWeight } from '@/constants/theme';

export default function TabLayout() {
  const { colors } = useColorScheme();
  const { isProvider } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.tag,
          fontWeight: FontWeight.medium,
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isProvider ? 'Dashboard' : 'Khám phá',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={isProvider ? 'stats-chart' : focused ? 'search' : 'search-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: isProvider ? 'Đơn hàng' : 'Đã lưu',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={isProvider ? 'document-text' : focused ? 'heart' : 'heart-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
