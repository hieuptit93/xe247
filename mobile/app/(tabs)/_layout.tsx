import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';

export default function TabLayout() {
  const { colors } = useColorScheme();
  const { session, isProvider } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isProvider ? 'Dashboard' : 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isProvider ? 'stats-chart' : 'search'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: isProvider ? 'Đơn hàng' : 'Yêu thích',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isProvider ? 'document-text' : 'heart'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
