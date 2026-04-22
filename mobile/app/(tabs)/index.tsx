import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProviderCard } from '@/components/ProviderCard';
import { ProvincePickerModal } from '@/components/ProvincePickerModal';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import { useProviderStore } from '@/stores/provider.store';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { Province, getProvinceByCode } from '@/constants/provinces';
import { Provider } from '@/types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_PROVINCE = getProvinceByCode('hcm')!;

type ViewMode = 'list' | 'map';

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
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
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedMarker, setSelectedMarker] = useState<Provider | null>(null);
  const [showProvincePicker, setShowProvincePicker] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({
    lat: DEFAULT_PROVINCE.lat,
    lng: DEFAULT_PROVINCE.lng,
  });

  const loadProviders = useCallback(async (province?: Province) => {
    let searchLocation = location ? { lat: location.latitude, lng: location.longitude } : null;
    let fallbackProvince: Province | null = null;

    // If province is specified, use it
    if (province) {
      searchLocation = { lat: province.lat, lng: province.lng };
      fallbackProvince = province;
    }
    // Check if location is outside Vietnam (roughly lat 8-24, lng 102-110)
    else if (searchLocation) {
      const isInVietnam =
        searchLocation.lat >= 8 && searchLocation.lat <= 24 &&
        searchLocation.lng >= 102 && searchLocation.lng <= 110;

      if (!isInVietnam) {
        console.log('Location outside Vietnam, using HCM as fallback');
        searchLocation = { lat: DEFAULT_PROVINCE.lat, lng: DEFAULT_PROVINCE.lng };
        fallbackProvince = DEFAULT_PROVINCE;
      }
    }

    if (fallbackProvince) {
      setSelectedProvince(fallbackProvince);
    }

    if (searchLocation) {
      console.log('Searching near:', searchLocation);
      setCurrentLocation(searchLocation);
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

  const handleProvinceSelect = (province: Province) => {
    setShowProvincePicker(false);
    setSelectedProvince(province);
    loadProviders(province);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleProviderPress = (provider: Provider) => {
    router.push(`/provider/${provider.id}`);
  };

  const handleMarkerPress = (provider: Provider) => {
    setSelectedMarker(provider);
  };

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.category !== 'ev_charging' // EV charging has its own tab
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

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredProviders.map((provider) => {
          if (!provider.lat || !provider.lng) return null;
          return (
            <Marker
              key={provider.id}
              coordinate={{
                latitude: provider.lat,
                longitude: provider.lng,
              }}
              title={provider.name}
              description={provider.address || ''}
              onPress={() => handleMarkerPress(provider)}
            >
              <View style={[styles.markerContainer, { backgroundColor: colors.primary }]}>
                <Ionicons name="car" size={16} color="#fff" />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Selected Provider Card */}
      {selectedMarker && (
        <View style={styles.selectedCardContainer}>
          <TouchableOpacity
            style={styles.closeMarkerButton}
            onPress={() => setSelectedMarker(null)}
          >
            <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <ProviderCard
            provider={selectedMarker}
            onPress={() => handleProviderPress(selectedMarker)}
          />
        </View>
      )}

      {/* Provider Count */}
      <View style={[styles.mapCountBadge, { backgroundColor: colors.surface }]}>
        <Text style={[styles.mapCountText, { color: colors.text }]}>
          {filteredProviders.length} địa điểm
        </Text>
      </View>
    </View>
  );

  const renderListView = () => (
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
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>XE 247</Text>
            {selectedProvince ? (
              <View style={styles.locationRow}>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Đang xem tại{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowProvincePicker(true)}
                >
                  <Text style={[styles.locationLink, { color: colors.primary }]}>
                    {selectedProvince.name} ▾
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Tìm dịch vụ xe gần bạn
              </Text>
            )}
          </View>

          {/* View Mode Toggle */}
          <View style={[styles.viewToggle, { backgroundColor: colors.surfaceSecondary }]}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'list' && { backgroundColor: colors.surface },
              ]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list"
                size={18}
                color={viewMode === 'list' ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === 'map' && { backgroundColor: colors.surface },
              ]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons
                name="map"
                size={18}
                color={viewMode === 'map' ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
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
      ) : locationError && !selectedProvince ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>📍</Text>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Không thể lấy vị trí
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Chọn tỉnh/thành phố để xem dịch vụ
          </Text>
          <TouchableOpacity
            style={[styles.fallbackButton, { backgroundColor: colors.primary, marginTop: Spacing.xl }]}
            onPress={() => setShowProvincePicker(true)}
          >
            <Text style={styles.fallbackButtonText}>Chọn tỉnh/thành phố</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshLocation}
          >
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Thử lại lấy vị trí
            </Text>
          </TouchableOpacity>
        </View>
      ) : viewMode === 'map' ? (
        renderMapView()
      ) : (
        renderListView()
      )}

      {/* Province Picker Modal */}
      <ProvincePickerModal
        visible={showProvincePicker}
        selectedCode={selectedProvince?.code ?? null}
        onSelect={handleProvinceSelect}
        onClose={() => setShowProvincePicker(false)}
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
    paddingBottom: Spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  viewToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  viewToggleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: 120, // Space for floating tab bar
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
  // Map styles
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedCardContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
  },
  closeMarkerButton: {
    position: 'absolute',
    top: -12,
    right: Spacing.lg + 8,
    zIndex: 10,
  },
  mapCountBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapCountText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semibold,
  },
});
