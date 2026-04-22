import { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProviderCard } from '@/components/ProviderCard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { Provider } from '@/types/database';

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { session, isProvider, isGuest } = useAuthStore();
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

  if (!session || isGuest) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Đã lưu</Text>
        </View>
        <View style={styles.centered}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="heart-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {isGuest ? 'Đăng nhập để lưu yêu thích' : 'Đăng nhập để xem danh sách đã lưu'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isGuest
              ? 'Tạo tài khoản để lưu lại các tiệm bạn ưa thích'
              : 'Bạn có thể tạo danh sách yêu thích và lưu lại các tiệm hay lui tới'}
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>
              {isGuest ? 'Tạo tài khoản' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isProvider) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Đơn hàng</Text>
        </View>
        <View style={styles.centered}>
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
          </View>
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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Đã lưu</Text>
      </View>

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
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={[styles.resultCount, { color: colors.text }]}>
                {favorites.length} địa điểm đã lưu
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name="heart-outline" size={48} color={colors.textSecondary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Chưa có gì trong danh sách
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Khi bạn thấy tiệm ưng ý, nhấn vào biểu tượng trái tim để lưu vào đây
              </Text>
              <TouchableOpacity
                style={[styles.exploreButton, { borderColor: colors.text }]}
                onPress={() => router.push('/')}
              >
                <Text style={[styles.exploreButtonText, { color: colors.text }]}>
                  Bắt đầu khám phá
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: 120, // Space for floating tab bar
  },
  listHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  resultCount: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  emptyList: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.cardHeading,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },
  loginButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.sm,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSize.cardHeading,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },
  exploreButton: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  exploreButtonText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
