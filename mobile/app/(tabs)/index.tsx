import { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProviderCard } from '@/components/ProviderCard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import { useProviderStore } from '@/stores/provider.store';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { Provider } from '@/types/database';

// Default locations for fallback
const DEFAULT_LOCATIONS = {
  hcm: { lat: 10.7769, lng: 106.7009, name: 'TP. Hồ Chí Minh' },
  hanoi: { lat: 21.0285, lng: 105.8542, name: 'Hà Nội' },
};

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { location, isLoading: locationLoading, error: locationError, refreshLocation } = useLocation();
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
  const [usingFallback, setUsingFallback] = useState<string | null>(null);

  const loadProviders = useCallback(async (fallbackCity?: string) => {
    let searchLocation = location ? { lat: location.latitude, lng: location.longitude } : null;
    let fallbackName: string | null = null;

    // If fallback city is specified, use it
    if (fallbackCity && DEFAULT_LOCATIONS[fallbackCity as keyof typeof DEFAULT_LOCATIONS]) {
      const fallback = DEFAULT_LOCATIONS[fallbackCity as keyof typeof DEFAULT_LOCATIONS];
      searchLocation = { lat: fallback.lat, lng: fallback.lng };
      fallbackName = fallback.name;
    }
    // Check if location is outside Vietnam (roughly lat 8-24, lng 102-110)
    else if (searchLocation) {
      const isInVietnam =
        searchLocation.lat >= 8 && searchLocation.lat <= 24 &&
        searchLocation.lng >= 102 && searchLocation.lng <= 110;

      if (!isInVietnam) {
        console.log('Location outside Vietnam, using HCM as fallback');
        const fallback = DEFAULT_LOCATIONS.hcm;
        searchLocation = { lat: fallback.lat, lng: fallback.lng };
        fallbackName = fallback.name;
      }
    }

    if (fallbackName) {
      setUsingFallback(fallbackName);
    }

    if (searchLocation) {
      console.log('Searching near:', searchLocation);
      await searchNearby(searchLocation);
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

  // Provider dashboard view
  if (isProvider) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.providerDashboard}>
          <View style={[styles.dashboardCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.dashboardIcon]}>🏪</Text>
            <Text style={[styles.dashboardTitle, { color: colors.text }]}>
              Dashboard Chủ tiệm
            </Text>
            <Text style={[styles.dashboardSubtitle, { color: colors.textSecondary }]}>
              Tính năng đang phát triển...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>XE 247</Text>
        {usingFallback ? (
          <View style={styles.locationRow}>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Đang xem tại{' '}
            </Text>
            <TouchableOpacity
              onPress={() => loadProviders(usingFallback === 'TP. Hồ Chí Minh' ? 'hanoi' : 'hcm')}
            >
              <Text style={[styles.locationLink, { color: colors.primary }]}>
                {usingFallback} ▾
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Tìm dịch vụ xe gần bạn
          </Text>
        )}
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => {}}
      />

      {/* Category Filter */}
      <CategoryFilter selected={selectedCategory} onSelect={handleCategorySelect} />

      {/* Content */}
      {locationLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Đang lấy vị trí của bạn...
          </Text>
        </View>
      ) : locationError && !usingFallback ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>📍</Text>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Không thể lấy vị trí
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Chọn thành phố để xem dịch vụ
          </Text>
          <View style={styles.fallbackButtons}>
            <TouchableOpacity
              style={[styles.fallbackButton, { backgroundColor: colors.primary }]}
              onPress={() => loadProviders('hcm')}
            >
              <Text style={styles.fallbackButtonText}>TP. Hồ Chí Minh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fallbackButton, { backgroundColor: colors.text }]}
              onPress={() => loadProviders('hanoi')}
            >
              <Text style={styles.fallbackButtonText}>Hà Nội</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshLocation}
          >
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Thử lại lấy vị trí
            </Text>
          </TouchableOpacity>
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
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={[styles.resultCount, { color: colors.text }]}>
                {filteredProviders.length} địa điểm
              </Text>
              {selectedCategory && (
                <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                  trong danh mục đã chọn
                </Text>
              )}
            </View>
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  Không tìm thấy kết quả
                </Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Thử mở rộng phạm vi tìm kiếm hoặc chọn danh mục khác
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.body,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationLink: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  resultCount: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  filterLabel: {
    fontSize: FontSize.body,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: FontSize.button,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  fallbackButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  fallbackButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  fallbackButtonText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  retryText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  empty: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  providerDashboard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  dashboardCard: {
    padding: Spacing.xxxl,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  dashboardIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  dashboardTitle: {
    fontSize: FontSize.cardHeading,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  dashboardSubtitle: {
    fontSize: FontSize.button,
    textAlign: 'center',
  },
});
