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
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/lib/supabase';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { Provider } from '@/types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// EV Brand Color
const EV_GREEN = '#00d1b2';
const EV_GREEN_DARK = '#00a896';

// Default locations for fallback
const DEFAULT_LOCATIONS = {
  hcm: { lat: 10.7769, lng: 106.7009, name: 'TP. Hồ Chí Minh' },
  hanoi: { lat: 21.0285, lng: 105.8542, name: 'Hà Nội' },
};

type ViewMode = 'list' | 'map';

export default function ChargingScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { colors, isDark } = useColorScheme();
  const { location, isLoading: locationLoading, error: locationError, refreshLocation } = useLocation();

  const [stations, setStations] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map'); // Default to map for charging
  const [selectedMarker, setSelectedMarker] = useState<Provider | null>(null);

  const [currentLocation, setCurrentLocation] = useState({
    lat: DEFAULT_LOCATIONS.hcm.lat,
    lng: DEFAULT_LOCATIONS.hcm.lng,
  });

  const loadStations = useCallback(async (fallbackCity?: string) => {
    let searchLocation = location ? { lat: location.latitude, lng: location.longitude } : null;
    let fallbackName: string | null = null;

    if (fallbackCity && DEFAULT_LOCATIONS[fallbackCity as keyof typeof DEFAULT_LOCATIONS]) {
      const fallback = DEFAULT_LOCATIONS[fallbackCity as keyof typeof DEFAULT_LOCATIONS];
      searchLocation = { lat: fallback.lat, lng: fallback.lng };
      fallbackName = fallback.name;
    } else if (searchLocation) {
      const isInVietnam =
        searchLocation.lat >= 8 && searchLocation.lat <= 24 &&
        searchLocation.lng >= 102 && searchLocation.lng <= 110;

      if (!isInVietnam) {
        const fallback = DEFAULT_LOCATIONS.hcm;
        searchLocation = { lat: fallback.lat, lng: fallback.lng };
        fallbackName = fallback.name;
      }
    }

    if (fallbackName) {
      setUsingFallback(fallbackName);
    }

    if (searchLocation) {
      setCurrentLocation(searchLocation);
      setIsLoading(true);

      try {
        const { data, error } = await supabase.rpc('search_nearby_providers', {
          p_lat: searchLocation.lat,
          p_lng: searchLocation.lng,
          radius_km: 50,
          category_filter: 'ev_charging',
        } as any);

        if (error) throw error;
        setStations(data || []);
      } catch (error) {
        console.error('Search EV stations error:', error);
        setStations([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [location]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStations();
    setRefreshing(false);
  };

  const handleStationPress = (station: Provider) => {
    router.push(`/station/${station.id}`);
  };

  const handleMarkerPress = (station: Provider) => {
    setSelectedMarker(station);
  };

  const filteredStations = stations.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStationCard = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={[styles.stationCard, { backgroundColor: colors.surface }]}
      onPress={() => handleStationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.stationCardContent}>
        {/* Icon */}
        <View style={[styles.stationIcon, { backgroundColor: `${EV_GREEN}15` }]}>
          <Ionicons name="flash" size={24} color={EV_GREEN} />
        </View>

        {/* Info */}
        <View style={styles.stationInfo}>
          <Text style={[styles.stationName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.stationAddress, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.address || 'Chưa có địa chỉ'}
          </Text>
          {(item as any).distance_km && (
            <View style={styles.distanceRow}>
              <Ionicons name="navigate" size={12} color={EV_GREEN} />
              <Text style={[styles.distanceText, { color: EV_GREEN }]}>
                {((item as any).distance_km as number).toFixed(1)} km
              </Text>
            </View>
          )}
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: `${EV_GREEN}15` }]}>
        <View style={[styles.statusDot, { backgroundColor: EV_GREEN }]} />
        <Text style={[styles.statusText, { color: EV_GREEN }]}>Đang hoạt động</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredStations.map((station) => {
          if (!station.lat || !station.lng) return null;
          return (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.lat,
                longitude: station.lng,
              }}
              title={station.name}
              description={station.address || ''}
              onPress={() => handleMarkerPress(station)}
            >
              <View style={styles.evMarker}>
                <Ionicons name="flash" size={18} color="#fff" />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Selected Station Card */}
      {selectedMarker && (
        <View style={styles.selectedCardContainer}>
          <TouchableOpacity
            style={styles.closeMarkerButton}
            onPress={() => setSelectedMarker(null)}
          >
            <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          {renderStationCard({ item: selectedMarker })}
        </View>
      )}

      {/* Station Count */}
      <View style={[styles.mapCountBadge, { backgroundColor: colors.surface }]}>
        <Ionicons name="flash" size={14} color={EV_GREEN} />
        <Text style={[styles.mapCountText, { color: colors.text }]}>
          {filteredStations.length} trạm sạc
        </Text>
      </View>
    </View>
  );

  const renderListView = () => (
    <FlatList
      data={filteredStations}
      keyExtractor={(item) => item.id}
      renderItem={renderStationCard}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={EV_GREEN}
        />
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={[styles.resultCount, { color: colors.text }]}>
            {filteredStations.length} trạm sạc
          </Text>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            gần bạn
          </Text>
        </View>
      }
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIconContainer, { backgroundColor: `${EV_GREEN}15` }]}>
              <Ionicons name="flash-off" size={48} color={EV_GREEN} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Không tìm thấy trạm sạc
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Thử mở rộng phạm vi tìm kiếm hoặc chọn thành phố khác
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
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Ionicons name="flash" size={24} color={EV_GREEN} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>Trạm sạc EV</Text>
            </View>
            {usingFallback ? (
              <View style={styles.locationRow}>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Đang xem tại{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => loadStations(usingFallback === 'TP. Hồ Chí Minh' ? 'hanoi' : 'hcm')}
                >
                  <Text style={[styles.locationLink, { color: EV_GREEN }]}>
                    {usingFallback} ▾
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Tìm trạm sạc gần bạn
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
                color={viewMode === 'list' ? EV_GREEN : colors.textSecondary}
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
                color={viewMode === 'map' ? EV_GREEN : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <View style={styles.searchInputWrapper}>
            <Text style={[styles.searchPlaceholder, { color: searchQuery ? colors.text : colors.textTertiary }]}>
              {searchQuery || 'Tìm trạm sạc...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.quickFilters}>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: `${EV_GREEN}15`, borderColor: EV_GREEN }]}>
          <Ionicons name="flash" size={14} color={EV_GREEN} />
          <Text style={[styles.filterChipText, { color: EV_GREEN }]}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="car" size={14} color={colors.textSecondary} />
          <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>VinFast</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="speedometer" size={14} color={colors.textSecondary} />
          <Text style={[styles.filterChipText, { color: colors.textSecondary }]}>Sạc nhanh</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {locationLoading || isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={EV_GREEN} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Đang tìm trạm sạc...
          </Text>
        </View>
      ) : locationError && !usingFallback ? (
        <View style={styles.centered}>
          <View style={[styles.emptyIconContainer, { backgroundColor: `${EV_GREEN}15` }]}>
            <Ionicons name="location" size={48} color={EV_GREEN} />
          </View>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Không thể lấy vị trí
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Chọn thành phố để xem trạm sạc
          </Text>
          <View style={styles.fallbackButtons}>
            <TouchableOpacity
              style={[styles.fallbackButton, { backgroundColor: EV_GREEN }]}
              onPress={() => loadStations('hcm')}
            >
              <Text style={styles.fallbackButtonText}>TP. Hồ Chí Minh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fallbackButton, { backgroundColor: colors.text }]}
              onPress={() => loadStations('hanoi')}
            >
              <Text style={styles.fallbackButtonText}>Hà Nội</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : viewMode === 'map' ? (
        renderMapView()
      ) : (
        renderListView()
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
    paddingBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.body,
    marginTop: 4,
    marginLeft: 32, // Align with title text
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 32,
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: FontSize.body,
  },
  quickFilters: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  filterChipText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: 120, // Space for floating tab bar
    paddingHorizontal: Spacing.lg,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  stationCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  stationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  stationName: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: FontSize.small,
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    marginLeft: 60, // Align with station name
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSize.tag,
    fontWeight: FontWeight.medium,
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
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
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
  empty: {
    padding: Spacing.xxxl,
    alignItems: 'center',
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
  // Map styles
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  evMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: EV_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
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
    left: Spacing.lg,
    right: Spacing.lg,
  },
  closeMarkerButton: {
    position: 'absolute',
    top: -12,
    right: 8,
    zIndex: 10,
  },
  mapCountBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
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
