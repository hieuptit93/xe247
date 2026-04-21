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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useProviderStore } from '@/stores/provider.store';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { getCategoryByKey } from '@/constants/categories';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { Provider } from '@/types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80',
];

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useColorScheme();
  const { session } = useAuthStore();
  const { getProviderById } = useProviderStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getProviderById(id);
    setProvider(data);
    setLoading(false);
  };

  const handleCall = () => {
    if (provider?.phone) {
      Linking.openURL(`tel:${provider.phone}`);
    }
  };

  const handleZalo = () => {
    if (provider?.phone) {
      const cleanPhone = provider.phone.replace(/\D/g, '');
      Linking.openURL(`https://zalo.me/${cleanPhone}`);
    }
  };

  const handleDirections = () => {
    if (provider?.lat && provider?.lng) {
      const url = Platform.select({
        ios: `maps:?daddr=${provider.lat},${provider.lng}`,
        android: `google.navigation:q=${provider.lat},${provider.lng}`,
      });
      if (url) Linking.openURL(url);
    }
  };

  const handleShare = () => {
    // Share functionality
  };

  const handleToggleFavorite = async () => {
    if (!session || !provider) return;
    await toggleFavorite(session.user.id, provider.id);
  };

  const category = provider ? getCategoryByKey(provider.category) : null;
  const isFav = provider ? isFavorite(provider.id) : false;

  const getPhotos = () => {
    if (provider?.photos?.length) return provider.photos;
    const index = (provider?.id?.charCodeAt(0) || 0) % PLACEHOLDER_IMAGES.length;
    return [PLACEHOLDER_IMAGES[index]];
  };

  const photos = getPhotos();

  const getRegionName = () => {
    const metadata = provider?.metadata as any;
    if (metadata?.region_code) {
      const regionNames: Record<string, string> = {
        hanoi: 'Hà Nội',
        hcm: 'TP. Hồ Chí Minh',
        danang: 'Đà Nẵng',
        haiphong: 'Hải Phòng',
        cantho: 'Cần Thơ',
        binhduong: 'Bình Dương',
        dongnai: 'Đồng Nai',
        khanhhoa: 'Nha Trang',
        lamdong: 'Đà Lạt',
      };
      return regionNames[metadata.region_code];
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!provider) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loading}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Không tìm thấy địa điểm
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.background }]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={22} color={colors.text} />
              </TouchableOpacity>
              {session && (
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: colors.background }]}
                  onPress={handleToggleFavorite}
                >
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={22}
                    color={isFav ? colors.primary : colors.text}
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
            <Text style={[styles.name, { color: colors.text }]}>{provider.name}</Text>

            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color={colors.primary} />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {provider.rating_avg?.toFixed(1) || 'Mới'}
                </Text>
                {provider.rating_count > 0 && (
                  <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                    ({provider.rating_count} đánh giá)
                  </Text>
                )}
              </View>
              {category && (
                <View style={[styles.categoryPill, { backgroundColor: category.color + '15' }]}>
                  <Ionicons name={category.icon} size={14} color={category.color} />
                  <Text style={[styles.categoryText, { color: category.color }]}>
                    {category.nameVi}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name="location-outline" size={20} color={colors.text} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Địa chỉ</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {provider.address || getRegionName() || 'Chưa cập nhật'}
                </Text>
              </View>
            </View>

            {provider.phone && (
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: colors.surfaceSecondary }]}>
                  <Ionicons name="call-outline" size={20} color={colors.text} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Điện thoại</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {provider.phone}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name="time-outline" size={20} color={colors.text} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Trạng thái</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                  <Text style={[styles.statusText, { color: colors.success }]}>Đang mở cửa</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Map Section */}
          {provider.lat && provider.lng && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

              <View style={styles.mapSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Vị trí</Text>
                <TouchableOpacity
                  onPress={handleDirections}
                  activeOpacity={0.95}
                  style={styles.mapContainer}
                >
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: provider.lat,
                      longitude: provider.lng,
                      latitudeDelta: 0.008,
                      longitudeDelta: 0.008,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker
                      coordinate={{ latitude: provider.lat, longitude: provider.lng }}
                      title={provider.name}
                    >
                      <View style={[styles.marker, { backgroundColor: colors.primary }]}>
                        <Ionicons name="location" size={20} color="#ffffff" />
                      </View>
                    </Marker>
                  </MapView>
                  <View style={styles.mapOverlay}>
                    <View style={[styles.directionsButton, { backgroundColor: colors.background }]}>
                      <Ionicons name="navigate" size={18} color={colors.primary} />
                      <Text style={[styles.directionsText, { color: colors.primary }]}>
                        Chỉ đường
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Services */}
          {provider.services && provider.services.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

              <View style={styles.servicesSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Dịch vụ</Text>
                <View style={styles.servicesList}>
                  {provider.services.map((service, index) => (
                    <View
                      key={index}
                      style={[styles.serviceChip, { backgroundColor: colors.surfaceSecondary }]}
                    >
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      <Text style={[styles.serviceText, { color: colors.text }]}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

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
        <TouchableOpacity
          style={[styles.zaloButton, { borderColor: colors.border }]}
          onPress={handleZalo}
        >
          <Ionicons name="chatbubble-ellipses" size={22} color={colors.text} />
          <Text style={[styles.zaloText, { color: colors.text }]}>Zalo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: colors.primary }]}
          onPress={handleCall}
        >
          <Ionicons name="call" size={20} color="#ffffff" />
          <Text style={styles.callText}>Gọi ngay</Text>
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
  backButton: {
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
  name: {
    fontSize: FontSize.subheading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  reviewCount: {
    fontSize: FontSize.body,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semibold,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
    marginHorizontal: Spacing.lg,
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
  },
  mapSection: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
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
  servicesSection: {
    paddingHorizontal: Spacing.lg,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  serviceText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
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
  zaloButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  zaloText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  callButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  callText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
