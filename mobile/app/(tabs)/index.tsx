import { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProviderCard } from '@/components/ProviderCard';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import { useProviderStore } from '@/stores/provider.store';
import { useAuthStore } from '@/stores/auth.store';
import { CategoryKey } from '@/constants/categories';
import { Spacing, FontSize } from '@/constants/theme';
import { Provider } from '@/types/database';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { location, isLoading: locationLoading, error: locationError } = useLocation();
  const { isProvider } = useAuthStore();
  const {
    providers,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    searchNearby,
  } = useProviderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadProviders = useCallback(async () => {
    if (location) {
      await searchNearby({ lat: location.latitude, lng: location.longitude });
    }
  }, [location, searchNearby]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders, selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProviders();
    setRefreshing(false);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleProviderPress = (provider: Provider) => {
    router.push(`/provider/${provider.id}`);
  };

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isProvider) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <RoleSwitcher />
        <View style={styles.providerDashboard}>
          <Text style={[styles.dashboardTitle, { color: colors.text }]}>
            Dashboard Thợ
          </Text>
          <Text style={[styles.dashboardSubtitle, { color: colors.textSecondary }]}>
            Tính năng đang phát triển...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <RoleSwitcher />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onMapPress={() => {}}
        onFilterPress={() => {}}
      />
      <CategoryFilter selected={selectedCategory} onSelect={handleCategorySelect} />

      {locationLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Đang lấy vị trí...
          </Text>
        </View>
      ) : locationError ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {locationError}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProviderCard
              provider={item}
              onPress={() => handleProviderPress(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Không tìm thấy tiệm nào gần bạn
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
  },
  errorText: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  empty: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  providerDashboard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  dashboardTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  dashboardSubtitle: {
    fontSize: FontSize.md,
  },
});
