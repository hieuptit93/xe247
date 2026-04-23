import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  tags: string[] | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

const REVIEW_TAGS: Record<string, string> = {
  dung_gio: 'Đúng giờ',
  than_thien: 'Thân thiện',
  gia_hop_ly: 'Giá hợp lý',
  sach_se: 'Sạch sẽ',
  chuyen_nghiep: 'Chuyên nghiệp',
  nhanh_chong: 'Nhanh chóng',
};

export default function ProviderReviewsScreen() {
  const { providerId, providerName } = useLocalSearchParams<{
    providerId: string;
    providerName: string;
  }>();
  const router = useRouter();
  const { colors, isDark } = useColorScheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] });

  const fetchReviews = useCallback(async () => {
    if (!providerId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          tags,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('provider_id', providerId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);

      // Calculate stats
      if (data && data.length > 0) {
        const distribution = [0, 0, 0, 0, 0];
        let total = 0;
        data.forEach((r: any) => {
          total += r.rating;
          distribution[r.rating - 1]++;
        });
        setStats({
          avg: total / data.length,
          count: data.length,
          distribution,
        });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  };

  const renderStars = (rating: number, size = 14) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? '#FFB800' : colors.textTertiary}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={[styles.reviewCard, { backgroundColor: colors.surface }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          {item.profiles?.avatar_url ? (
            <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="person" size={20} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.reviewUserInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.profiles?.full_name || 'Người dùng'}
            </Text>
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
        {renderStars(item.rating)}
      </View>

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {item.tags.map((tag, idx) => (
            <View key={idx} style={[styles.tag, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.tagText, { color: colors.text }]}>
                {REVIEW_TAGS[tag] || tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {item.comment && (
        <Text style={[styles.comment, { color: colors.text }]}>{item.comment}</Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsOverview}>
        <Text style={[styles.avgRating, { color: colors.text }]}>{stats.avg.toFixed(1)}</Text>
        {renderStars(Math.round(stats.avg), 20)}
        <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
          {stats.count} đánh giá
        </Text>
      </View>

      <View style={styles.distributionContainer}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.distribution[star - 1];
          const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
          return (
            <View key={star} style={styles.distributionRow}>
              <Text style={[styles.distributionStar, { color: colors.textSecondary }]}>
                {star}
              </Text>
              <Ionicons name="star" size={12} color="#FFB800" />
              <View style={[styles.distributionBar, { backgroundColor: colors.surfaceSecondary }]}>
                <View
                  style={[
                    styles.distributionFill,
                    { width: `${percentage}%`, backgroundColor: colors.primary },
                  ]}
                />
              </View>
              <Text style={[styles.distributionCount, { color: colors.textSecondary }]}>
                {count}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary }]}>
        <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có đánh giá</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Hãy là người đầu tiên đánh giá địa điểm này
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            Đánh giá
          </Text>
          {providerName && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {decodeURIComponent(providerName)}
            </Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        ListHeaderComponent={stats.count > 0 ? renderHeader : null}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={[
          styles.listContent,
          reviews.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchReviews}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  listContent: {
    padding: Spacing.lg,
  },
  emptyList: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  statsOverview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgRating: {
    fontSize: 48,
    fontWeight: FontWeight.bold,
    letterSpacing: -1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  totalReviews: {
    fontSize: FontSize.small,
    marginTop: Spacing.xs,
  },
  distributionContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distributionStar: {
    fontSize: FontSize.small,
    width: 12,
    textAlign: 'right',
  },
  distributionBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: FontSize.small,
    width: 24,
    textAlign: 'right',
  },
  reviewCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewUserInfo: {
    gap: 2,
  },
  userName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  reviewDate: {
    fontSize: FontSize.small,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: FontSize.tag,
    fontWeight: FontWeight.medium,
  },
  comment: {
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  separator: {
    height: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.cardHeading,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.body,
    textAlign: 'center',
  },
});
