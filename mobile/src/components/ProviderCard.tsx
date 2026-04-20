import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from '@/types/database';
import { getCategoryByKey } from '@/constants/categories';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useAuthStore } from '@/stores/auth.store';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  distance?: number;
}

export function ProviderCard({ provider, onPress, distance }: ProviderCardProps) {
  const { colors } = useColorScheme();
  const { session } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const category = getCategoryByKey(provider.category);
  const isFav = isFavorite(provider.id);

  const handleFavorite = async () => {
    if (!session) return;
    await toggleFavorite(session.user.id, provider.id);
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return null;
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }, Shadow.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: provider.photos?.[0] || 'https://via.placeholder.com/100x100?text=XE247',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {provider.name}
          </Text>
          {session && (
            <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={22}
                color={isFav ? colors.error : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categoryRow}>
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Ionicons name={category.icon} size={12} color={category.color} />
              <Text style={[styles.categoryText, { color: category.color }]}>
                {category.nameVi}
              </Text>
            </View>
          )}
          {distance && (
            <Text style={[styles.distance, { color: colors.textSecondary }]}>
              <Ionicons name="location" size={12} /> {formatDistance(distance)}
            </Text>
          )}
        </View>

        <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
          {provider.address || 'Chưa có địa chỉ'}
        </Text>

        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.star} />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {provider.rating_avg?.toFixed(1) || '0.0'}
            </Text>
            <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>
              ({provider.rating_count || 0})
            </Text>
          </View>
          {provider.status === 'active' && (
            <View style={styles.openBadge}>
              <View style={[styles.dot, { backgroundColor: colors.success }]} />
              <Text style={[styles.openText, { color: colors.success }]}>Đang mở</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  distance: {
    fontSize: FontSize.xs,
  },
  address: {
    fontSize: FontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: FontSize.xs,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  openText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
});
