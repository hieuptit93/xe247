import { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProviderCard } from '@/components/ProviderCard';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { Spacing, FontSize } from '@/constants/theme';
import { Provider } from '@/types/database';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { session, isProvider } = useAuthStore();
  const { favorites, isLoading, fetchFavorites } = useFavoritesStore();

  const loadFavorites = useCallback(async () => {
    if (session) {
      await fetchFavorites(session.user.id);
    }
  }, [session, fetchFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleProviderPress = (provider: Provider) => {
    router.push(`/provider/${provider.id}`);
  };

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Đăng nhập để lưu yêu thích
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Lưu lại các tiệm bạn thường lui tới
          </Text>
          <Button
            title="Đăng nhập"
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isProvider) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.providerView}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Quản lý đơn hàng
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tính năng đang phát triển...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => handleProviderPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadFavorites}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Chưa có tiệm yêu thích
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Nhấn vào icon trái tim để lưu
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  emptyList: {
    flex: 1,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  providerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
});
