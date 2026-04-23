import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { supabase } from '@/lib/supabase';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { Provider } from '@/types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.6;
const EV_GREEN = '#00d1b2';

interface ChargingPort {
  id: number;
  type: string;
  power: string;
  status: 'available' | 'charging' | 'maintenance';
  price: string;
}

const PLACEHOLDER_EV_IMAGES = [
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
];

const MOCK_PORTS: ChargingPort[] = [
  { id: 1, type: 'CCS2', power: '60kW DC', status: 'available', price: '3,500đ/kWh' },
  { id: 2, type: 'CCS2', power: '60kW DC', status: 'charging', price: '3,500đ/kWh' },
  { id: 3, type: 'Type 2', power: '22kW AC', status: 'available', price: '2,800đ/kWh' },
  { id: 4, type: 'Type 2', power: '22kW AC', status: 'maintenance', price: '2,800đ/kWh' },
];

const AMENITIES = [
  { key: 'parking', icon: 'car', label: 'Bãi đỗ xe' },
  { key: 'cafe', icon: 'cafe', label: 'Cafe' },
  { key: 'restaurant', icon: 'restaurant', label: 'Nhà hàng' },
  { key: 'wc', icon: 'body', label: 'WC' },
  { key: 'wifi', icon: 'wifi', label: 'WiFi' },
  { key: 'shopping', icon: 'bag-handle', label: 'Mua sắm' },
];

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useColorScheme();
  const { session } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const [station, setStation] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    loadStation();
  }, [id]);

  const loadStation = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setStation(data);
    } catch (err) {
      console.error('Error loading station:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (station?.phone) {
      Linking.openURL(`tel:${station.phone}`);
    }
  };

  const handleDirections = () => {
    if (station?.lat && station?.lng) {
      const url = Platform.select({
        ios: `maps:?daddr=${station.lat},${station.lng}`,
        android: `google.navigation:q=${station.lat},${station.lng}`,
      });
      if (url) Linking.openURL(url);
    }
  };

  const handleToggleFavorite = async () => {
    if (!session || !station) return;
    await toggleFavorite(session.user.id, station.id);
  };

  const handleReport = () => {
    if (!station) return;
    router.push({
      pathname: '/provider/report',
      params: { providerId: station.id, providerName: station.name },
    });
  };

  const isFav = station ? isFavorite(station.id) : false;

  const getPhotos = () => {
    if (station?.photos?.length) return station.photos;
    return PLACEHOLDER_EV_IMAGES;
  };

  const photos = getPhotos();

  const getPortStatusColor = (status: ChargingPort['status']) => {
    switch (status) {
      case 'available':
        return colors.success;
      case 'charging':
        return '#FFB800';
      case 'maintenance':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getPortStatusText = (status: ChargingPort['status']) => {
    switch (status) {
      case 'available':
        return 'Rảnh';
      case 'charging':
        return 'Đang sạc';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={EV_GREEN} />
        </View>
      </View>
    );
  }

  if (!station) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loading}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Không tìm thấy trạm sạc
          </Text>
          <TouchableOpacity
            style={[styles.backButtonLarge, { backgroundColor: EV_GREEN }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const availablePorts = MOCK_PORTS.filter((p) => p.status === 'available').length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(index);
            }}
          >
            {photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Top overlay buttons */}
          <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.background }]}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.topBarRight}>
              {session && (
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: colors.background }]}
                  onPress={handleToggleFavorite}
                >
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={22}
                    color={isFav ? EV_GREEN : colors.text}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Image pagination */}
          {photos.length > 1 && (
            <View style={styles.pagination}>
              <View style={styles.paginationBg}>
                <Text style={styles.paginationText}>
                  {activeImageIndex + 1} / {photos.length}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.stationBadge}>
              <Ionicons name="flash" size={16} color={EV_GREEN} />
              <Text style={[styles.stationBadgeText, { color: EV_GREEN }]}>Trạm sạc EV</Text>
            </View>
            <Text style={[styles.name, { color: colors.text }]}>{station.name}</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.statText, { color: colors.text }]}>
                  {availablePorts}/{MOCK_PORTS.length} cổng rảnh
                </Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={[styles.statText, { color: colors.text }]}>
                  {station.rating_avg && station.rating_avg > 0 ? station.rating_avg.toFixed(1) : 'Mới'}
                </Text>
                {station.rating_count > 0 && (
                  <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
                    ({station.rating_count})
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Charging Ports */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cổng sạc</Text>
            <View style={styles.portsContainer}>
              {MOCK_PORTS.map((port) => (
                <View
                  key={port.id}
                  style={[styles.portCard, { backgroundColor: colors.surface }]}
                >
                  <View style={styles.portHeader}>
                    <View style={styles.portInfo}>
                      <Text style={[styles.portNumber, { color: colors.textSecondary }]}>
                        #{port.id}
                      </Text>
                      <Text style={[styles.portType, { color: colors.text }]}>{port.type}</Text>
                      <Text style={[styles.portPower, { color: colors.textSecondary }]}>
                        {port.power}
                      </Text>
                    </View>
                    <View style={styles.portStatus}>
                      <View
                        style={[
                          styles.portStatusDot,
                          { backgroundColor: getPortStatusColor(port.status) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.portStatusText,
                          { color: getPortStatusColor(port.status) },
                        ]}
                      >
                        {getPortStatusText(port.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.portPrice, { color: colors.text }]}>{port.price}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Info Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin</Text>
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="location-outline" size={20} color={colors.text} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Địa chỉ</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {station.address || 'Chưa cập nhật'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="time-outline" size={20} color={colors.text} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Giờ hoạt động</Text>
                  <Text style={[styles.infoValue, { color: colors.success }]}>24/7</Text>
                </View>
              </View>

              {station.phone && (
                <View style={styles.infoRow}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.surfaceSecondary }]}>
                    <Ionicons name="call-outline" size={20} color={colors.text} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Liên hệ</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{station.phone}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tiện ích</Text>
            <View style={styles.amenitiesGrid}>
              {AMENITIES.slice(0, 4).map((amenity) => (
                <View key={amenity.key} style={styles.amenityItem}>
                  <View style={[styles.amenityIcon, { backgroundColor: colors.surfaceSecondary }]}>
                    <Ionicons name={amenity.icon as any} size={20} color={EV_GREEN} />
                  </View>
                  <Text style={[styles.amenityLabel, { color: colors.textSecondary }]}>
                    {amenity.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Map Section */}
          {station.lat && station.lng && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Vị trí</Text>
                <TouchableOpacity
                  onPress={handleDirections}
                  activeOpacity={0.95}
                  style={styles.mapContainer}
                >
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: station.lat,
                      longitude: station.lng,
                      latitudeDelta: 0.008,
                      longitudeDelta: 0.008,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker
                      coordinate={{ latitude: station.lat, longitude: station.lng }}
                      title={station.name}
                    >
                      <View style={[styles.marker, { backgroundColor: EV_GREEN }]}>
                        <Ionicons name="flash" size={20} color="#ffffff" />
                      </View>
                    </Marker>
                  </MapView>
                  <View style={styles.mapOverlay}>
                    <View style={[styles.directionsButton, { backgroundColor: colors.background }]}>
                      <Ionicons name="navigate" size={18} color={EV_GREEN} />
                      <Text style={[styles.directionsText, { color: EV_GREEN }]}>Chỉ đường</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Report */}
          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Ionicons name="flag-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.reportText, { color: colors.textSecondary }]}>
              Báo cáo sai thông tin
            </Text>
          </TouchableOpacity>

          {/* Spacer for footer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.borderLight,
            paddingBottom: insets.bottom || Spacing.lg,
          },
        ]}
      >
        {station.phone && (
          <TouchableOpacity
            style={[styles.callButton, { borderColor: colors.border }]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navigateButton, { backgroundColor: EV_GREEN }]}
          onPress={handleDirections}
        >
          <Ionicons name="navigate" size={20} color="#ffffff" />
          <Text style={styles.navigateText}>Chỉ đường đến trạm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  errorText: {
    fontSize: FontSize.button,
  },
  backButtonLarge: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#1a1a1a',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  pagination: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
  },
  paginationBg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  paginationText: {
    color: '#ffffff',
    fontSize: FontSize.tag,
    fontWeight: FontWeight.medium,
  },
  content: {
    paddingTop: Spacing.lg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
  },
  stationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  stationBadgeText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semibold,
  },
  name: {
    fontSize: FontSize.subheading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  statSubtext: {
    fontSize: FontSize.body,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
    marginHorizontal: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  portsContainer: {
    gap: Spacing.sm,
  },
  portCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  portHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  portInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  portNumber: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  portType: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  portPower: {
    fontSize: FontSize.small,
  },
  portStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  portStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  portStatusText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semibold,
  },
  portPrice: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  infoList: {
    gap: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.small,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  amenityItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md * 3) / 4,
  },
  amenityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  amenityLabel: {
    fontSize: FontSize.tag,
    textAlign: 'center',
  },
  mapContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    height: 180,
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
    ...Shadow.card,
  },
  directionsText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
  },
  reportText: {
    fontSize: FontSize.body,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  callButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  navigateText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
