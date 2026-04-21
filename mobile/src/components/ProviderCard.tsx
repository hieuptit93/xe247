import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from '@/types/database';
import { getCategoryByKey } from '@/constants/categories';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useAuthStore } from '@/stores/auth.store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = Spacing.lg;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.65; // 16:10 ratio

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  distance?: number;
}

// Placeholder images for providers without photos
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80', // Mechanic
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Car shop
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80', // Auto repair
  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80', // Workshop
];

const getPlaceholderImage = (id: string) => {
  const index = id.charCodeAt(0) % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[index];
};

export function ProviderCard({ provider, onPress, distance }: ProviderCardProps) {
  const { colors } = useColorScheme();
  const { session } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const category = getCategoryByKey(provider.category);
  const isFav = isFavorite(provider.id);
  const [imageError, setImageError] = useState(false);

  const handleFavorite = async () => {
    if (!session) return;
    await toggleFavorite(session.user.id, provider.id);
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return null;
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const getRegionName = () => {
    const metadata = provider.metadata as any;
    if (metadata?.region_code) {
      const regionNames: Record<string, string> = {
        hanoi: 'Hà Nội',
        hcm: 'TP.HCM',
        danang: 'Đà Nẵng',
        haiphong: 'Hải Phòng',
        cantho: 'Cần Thơ',
        binhduong: 'Bình Dương',
        dongnai: 'Đồng Nai',
        khanhhoa: 'Nha Trang',
        lamdong: 'Đà Lạt',
        daklak: 'Đắk Lắk',
      };
      return regionNames[metadata.region_code] || metadata.region_code;
    }
    return null;
  };

  const imageUri = imageError || !provider.photos?.[0]
    ? getPlaceholderImage(provider.id)
    : provider.photos[0];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />

        {/* Heart button overlay */}
        {session && (
          <TouchableOpacity
            style={styles.heartButton}
            onPress={handleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? colors.primary : '#ffffff'}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        )}

        {/* Category badge */}
        {category && (
          <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
            <Ionicons name={category.icon} size={12} color="#ffffff" />
            <Text style={styles.categoryText}>{category.nameVi}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Header row: Name and Rating */}
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {provider.name}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {provider.rating_avg?.toFixed(1) || 'Mới'}
            </Text>
          </View>
        </View>

        {/* Location info */}
        <View style={styles.locationRow}>
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
            {provider.address || getRegionName() || 'Chưa có địa chỉ'}
          </Text>
          {distance && (
            <Text style={[styles.distance, { color: colors.textSecondary }]}>
              {formatDistance(distance)}
            </Text>
          )}
        </View>

        {/* Status row */}
        <View style={styles.statusRow}>
          {provider.status === 'active' && (
            <View style={styles.openStatus}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.statusText, { color: colors.success }]}>Đang mở</Text>
            </View>
          )}
          {provider.rating_count > 0 && (
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              {provider.rating_count} đánh giá
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: CARD_MARGIN,
    marginBottom: Spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#f0f0f0',
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  heartIcon: {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: FontSize.tag,
    fontWeight: FontWeight.semibold,
  },
  content: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    marginRight: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  address: {
    flex: 1,
    fontSize: FontSize.body,
    marginRight: Spacing.sm,
  },
  distance: {
    fontSize: FontSize.body,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  openStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  reviewCount: {
    fontSize: FontSize.small,
  },
});
