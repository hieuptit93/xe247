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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useProviderStore } from '@/stores/provider.store';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { getCategoryByKey } from '@/constants/categories';
import { Spacing, FontSize, BorderRadius, Shadow } from '@/constants/theme';
import { Provider } from '@/types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useColorScheme();
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
      const url = `https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`;
      Linking.openURL(url);
    }
  };

  const handleToggleFavorite = async () => {
    if (!session || !provider) return;
    await toggleFavorite(session.user.id, provider.id);
  };

  const category = provider ? getCategoryByKey(provider.category) : null;
  const isFav = provider ? isFavorite(provider.id) : false;
  const photos = provider?.photos?.length ? provider.photos : ['https://via.placeholder.com/400x300?text=XE247'];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!provider) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <Text style={{ color: colors.text }}>Không tìm thấy tiệm</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              />
            ))}
          </ScrollView>
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: colors.background }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            {session && (
              <TouchableOpacity
                style={[styles.favoriteBtn, { backgroundColor: colors.background }]}
                onPress={handleToggleFavorite}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFav ? colors.error : colors.text}
                />
              </TouchableOpacity>
            )}
          </View>
          {photos.length > 1 && (
            <View style={styles.pagination}>
              {photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor: index === activeImageIndex ? colors.primary : 'rgba(255,255,255,0.5)',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>{provider.name}</Text>
            {category && (
              <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
                <Ionicons name={category.icon} size={14} color={category.color} />
                <Text style={[styles.categoryText, { color: category.color }]}>
                  {category.nameVi}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={18} color={colors.star} />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {provider.rating_avg?.toFixed(1) || '0.0'}
              </Text>
              <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>
                ({provider.rating_count || 0} đánh giá)
              </Text>
            </View>
            {provider.status === 'active' && (
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.statusText, { color: colors.success }]}>Đang mở</Text>
              </View>
            )}
          </View>

          <View style={[styles.infoSection, { borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {provider.address || 'Chưa có địa chỉ'}
              </Text>
            </View>
            {provider.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {provider.phone}
                </Text>
              </View>
            )}
          </View>

          {provider.services && provider.services.length > 0 && (
            <View style={styles.servicesSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Dịch vụ</Text>
              <View style={styles.servicesList}>
                {provider.services.map((service, index) => (
                  <View
                    key={index}
                    style={[styles.serviceChip, { backgroundColor: colors.surface }]}
                  >
                    <Text style={[styles.serviceText, { color: colors.text }]}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {provider.lat && provider.lng && (
            <View style={styles.mapSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Vị trí</Text>
              <TouchableOpacity onPress={handleDirections} activeOpacity={0.9}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: provider.lat,
                    longitude: provider.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{ latitude: provider.lat, longitude: provider.lng }}
                    title={provider.name}
                  />
                </MapView>
                <View style={[styles.mapOverlay, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons name="navigate" size={16} color={colors.primary} />
                  <Text style={[styles.mapOverlayText, { color: colors.primary }]}>
                    Chỉ đường
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: colors.surface }]}
          onPress={handleZalo}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
          <Text style={[styles.contactBtnText, { color: colors.primary }]}>Zalo</Text>
        </TouchableOpacity>
        <Button
          title="Gọi ngay"
          onPress={handleCall}
          style={{ flex: 2 }}
          size="lg"
        />
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
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: '#E0E0E0',
  },
  imageOverlay: {
    position: 'absolute',
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  favoriteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  pagination: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: Spacing.md,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -Spacing.lg,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  categoryText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: FontSize.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  infoSection: {
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.md,
  },
  servicesSection: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  serviceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  serviceText: {
    fontSize: FontSize.sm,
  },
  mapSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  map: {
    height: 150,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  mapOverlayText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  contactBtnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
