import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { colors, isDark } = useColorScheme();
  const { initialize, isLoading, session, hasSeenOnboarding, isGuest } = useAuthStore();

  useEffect(() => {
    initialize().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const shouldShowAuth = !hasSeenOnboarding && !session && !isGuest;

    if (shouldShowAuth && !inAuthGroup) {
      // First time user - redirect to login
      router.replace('/(auth)/login');
    }
    // Note: Don't auto-redirect from auth page - let user navigate manually
  }, [session, hasSeenOnboarding, segments, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="provider/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
