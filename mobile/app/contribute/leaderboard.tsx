import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { TIER_CONFIG, ContributorTier } from '@/stores/contribute.store';
import { supabase } from '@/lib/supabase';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  total_points: number;
  tier: ContributorTier;
  locations_added: number;
  badges: string[];
  display_name?: string;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { session } = useAuthStore();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_contributor_leaderboard', { p_limit: 50 });

      if (error) throw error;

      // Find current user's rank
      if (session?.user) {
        const userEntry = data?.find((e: LeaderboardEntry) => e.user_id === session.user.id);
        if (userEntry) {
          setMyRank(userEntry);
        }
      }

      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { emoji: '🥇', color: '#FFD700' };
      case 2:
        return { emoji: '🥈', color: '#C0C0C0' };
      case 3:
        return { emoji: '🥉', color: '#CD7F32' };
      default:
        return { emoji: null, color: colors.textSecondary };
    }
  };

  const renderEntry = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rankStyle = getRankStyle(item.rank);
    const tierConfig = TIER_CONFIG[item.tier];
    const isCurrentUser = session?.user?.id === item.user_id;

    return (
      <View
        style={[
          styles.entryCard,
          { backgroundColor: isCurrentUser ? `${colors.primary}10` : colors.surface },
          isCurrentUser && { borderColor: colors.primary, borderWidth: 2 },
        ]}
      >
        {/* Rank */}
        <View style={styles.rankContainer}>
          {rankStyle.emoji ? (
            <Text style={styles.rankEmoji}>{rankStyle.emoji}</Text>
          ) : (
            <Text style={[styles.rankNumber, { color: rankStyle.color }]}>{item.rank}</Text>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.display_name || `Nguoi dung ${item.rank}`}
              {isCurrentUser && ' (Ban)'}
            </Text>
            <Text style={styles.tierEmoji}>{tierConfig.icon}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {item.locations_added} dia diem
            </Text>
            {item.badges?.length > 0 && (
              <Text style={[styles.badgeCount, { color: colors.textSecondary }]}>
                · {item.badges.length} huy hieu
              </Text>
            )}
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsContainer}>
          <Text style={[styles.points, { color: tierConfig.color }]}>{item.total_points}</Text>
          <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>diem</Text>
        </View>
      </View>
    );
  };

  const renderPodium = () => {
    const top3 = leaderboard.slice(0, 3);
    if (top3.length < 3) return null;

    const positions = [
      { entry: top3[1], height: 80, rank: 2 },
      { entry: top3[0], height: 100, rank: 1 },
      { entry: top3[2], height: 60, rank: 3 },
    ];

    return (
      <View style={styles.podiumContainer}>
        {positions.map((pos, index) => {
          const tierConfig = TIER_CONFIG[pos.entry.tier];
          const rankStyle = getRankStyle(pos.rank);

          return (
            <View key={pos.rank} style={styles.podiumItem}>
              <Text style={styles.podiumEmoji}>{rankStyle.emoji}</Text>
              <View
                style={[
                  styles.podiumAvatar,
                  { backgroundColor: tierConfig.color },
                ]}
              >
                <Text style={styles.podiumAvatarText}>
                  {(pos.entry.display_name || 'U')[0].toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                {pos.entry.display_name || `#${pos.rank}`}
              </Text>
              <Text style={[styles.podiumPoints, { color: tierConfig.color }]}>
                {pos.entry.total_points}
              </Text>
              <View
                style={[
                  styles.podiumBase,
                  { height: pos.height, backgroundColor: tierConfig.color },
                ]}
              >
                <Text style={styles.podiumRank}>{pos.rank}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bang xep hang</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={leaderboard.slice(3)}
          keyExtractor={(item) => item.user_id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchLeaderboard}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              {renderPodium()}

              {/* My Rank Card */}
              {myRank && myRank.rank > 3 && (
                <View style={[styles.myRankCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.myRankLabel, { color: colors.textSecondary }]}>
                    Thu hang cua ban
                  </Text>
                  <View style={styles.myRankRow}>
                    <Text style={[styles.myRankNumber, { color: colors.primary }]}>
                      #{myRank.rank}
                    </Text>
                    <Text style={[styles.myRankPoints, { color: colors.text }]}>
                      {myRank.total_points} diem
                    </Text>
                  </View>
                </View>
              )}

              {/* Rest of leaderboard header */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Xep hang #{4} tro xuong
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="trophy-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Chua co du lieu xep hang
              </Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.lg,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  podiumItem: {
    alignItems: 'center',
    width: 90,
  },
  podiumEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  podiumAvatarText: {
    color: '#fff',
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
  },
  podiumName: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
    marginBottom: 2,
  },
  podiumPoints: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumRank: {
    color: '#fff',
    fontSize: 24,
    fontWeight: FontWeight.bold,
  },
  myRankCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  myRankLabel: {
    fontSize: FontSize.small,
    marginBottom: Spacing.xs,
  },
  myRankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myRankNumber: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
  },
  myRankPoints: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 24,
  },
  rankNumber: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.bold,
  },
  userInfo: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  userName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  tierEmoji: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: FontSize.small,
  },
  badgeCount: {
    fontSize: FontSize.small,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.bold,
  },
  pointsLabel: {
    fontSize: FontSize.small,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.body,
    marginTop: Spacing.md,
  },
});
