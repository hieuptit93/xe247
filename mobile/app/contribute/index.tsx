import { useEffect } from 'react';
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
import { useContributeStore, TIER_CONFIG, getNextTier, Contribution } from '@/stores/contribute.store';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const STATUS_CONFIG = {
  pending: { label: 'Cho duyet', color: '#ff9500', icon: 'time' as const },
  approved: { label: 'Da duyet', color: '#00d1b2', icon: 'checkmark-circle' as const },
  rejected: { label: 'Tu choi', color: '#ff3b30', icon: 'close-circle' as const },
  merged: { label: 'Da gop', color: '#428bff', icon: 'git-merge' as const },
};

const TYPE_LABELS = {
  new_location: 'Dia diem moi',
  update_info: 'Cap nhat thong tin',
  add_photo: 'Them anh',
  report_closed: 'Bao cao dong cua',
};

export default function MyContributionsScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { session, isGuest } = useAuthStore();
  const { profile, contributions, isLoading, fetchProfile, fetchContributions } = useContributeStore();

  useEffect(() => {
    if (session && !isGuest) {
      fetchProfile();
      fetchContributions();
    }
  }, [session, isGuest]);

  const handleRefresh = () => {
    fetchProfile();
    fetchContributions();
  };

  const nextTier = profile ? getNextTier(profile.total_points) : null;
  const currentTierConfig = profile ? TIER_CONFIG[profile.tier] : TIER_CONFIG.bronze;
  const progressPercent = nextTier
    ? ((profile?.total_points || 0) - currentTierConfig.min) /
      (nextTier.pointsNeeded + (profile?.total_points || 0) - currentTierConfig.min) * 100
    : 100;

  const renderContribution = ({ item }: { item: Contribution }) => {
    const status = STATUS_CONFIG[item.status];
    const typeLabel = TYPE_LABELS[item.type];
    const date = new Date(item.created_at).toLocaleDateString('vi-VN');

    return (
      <View style={[styles.contributionCard, { backgroundColor: colors.surface }]}>
        <View style={styles.contributionHeader}>
          <View style={styles.contributionType}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={[styles.typeName, { color: colors.text }]}>
              {item.name || typeLabel}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
            <Ionicons name={status.icon} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <Text style={[styles.contributionMeta, { color: colors.textSecondary }]}>
          {typeLabel} · {date}
        </Text>

        <View style={styles.contributionFooter}>
          <View style={styles.pointsEarned}>
            <Text style={styles.pointsIcon}>🏅</Text>
            <Text style={[styles.pointsText, { color: item.status === 'approved' ? '#2d7a4d' : colors.textTertiary }]}>
              {item.status === 'approved' ? `+${item.points_earned}` : item.points_earned} diem
            </Text>
          </View>
          {item.images && item.images.length > 0 && (
            <View style={styles.hasPhoto}>
              <Ionicons name="camera" size={14} color={colors.textSecondary} />
              <Text style={[styles.photoText, { color: colors.textSecondary }]}>
                {item.images.length} anh
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!session || isGuest) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dong gop cua toi</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Dang nhap de xem</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Ban can dang nhap de xem lich su dong gop
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Dang nhap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dong gop cua toi</Text>
        <TouchableOpacity onPress={() => router.push('/contribute/leaderboard')}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contributions}
        keyExtractor={(item) => item.id}
        renderItem={renderContribution}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          profile ? (
            <View style={styles.profileSection}>
              {/* Tier Card */}
              <View style={[styles.tierCard, { backgroundColor: colors.surface }]}>
                <View style={styles.tierHeader}>
                  <Text style={styles.tierIcon}>{currentTierConfig.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tierLabel, { color: colors.textSecondary }]}>
                      Cap bac hien tai
                    </Text>
                    <Text style={[styles.tierName, { color: currentTierConfig.color }]}>
                      {currentTierConfig.label}
                    </Text>
                  </View>
                  <View style={styles.pointsDisplay}>
                    <Text style={[styles.totalPoints, { color: colors.text }]}>
                      {profile.total_points}
                    </Text>
                    <Text style={[styles.pointsUnit, { color: colors.textSecondary }]}>diem</Text>
                  </View>
                </View>

                {/* Progress to next tier */}
                {nextTier && (
                  <View style={styles.progressSection}>
                    <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
                      <View
                        style={[
                          styles.progressFill,
                          { backgroundColor: currentTierConfig.color, width: `${progressPercent}%` },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                      Con {nextTier.pointsNeeded} diem de len {TIER_CONFIG[nextTier.tier].label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <Text style={styles.statIcon}>📍</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {profile.locations_added}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Dia diem
                  </Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <Text style={styles.statIcon}>📸</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {profile.photos_uploaded}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Anh
                  </Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <Text style={styles.statIcon}>✏️</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {profile.locations_updated}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Cap nhat
                  </Text>
                </View>
              </View>

              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Lich su dong gop</Text>
                <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
                  {contributions.length} muc
                </Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyList}>
              <Ionicons name="add-circle-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyListTitle, { color: colors.text }]}>
                Chua co dong gop nao
              </Text>
              <Text style={[styles.emptyListText, { color: colors.textSecondary }]}>
                Bat dau them dia diem de nhan diem thuong!
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/contribute/camera')}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Them dia diem</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/contribute/camera')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  profileSection: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tierCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.card,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tierIcon: {
    fontSize: 40,
  },
  tierLabel: {
    fontSize: FontSize.small,
  },
  tierName: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
  },
  pointsDisplay: {
    alignItems: 'flex-end',
  },
  totalPoints: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
  },
  pointsUnit: {
    fontSize: FontSize.small,
  },
  progressSection: {
    marginTop: Spacing.md,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FontSize.small,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.card,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
  },
  statLabel: {
    fontSize: FontSize.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  sectionCount: {
    fontSize: FontSize.small,
  },
  contributionCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  contributionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  typeName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  contributionMeta: {
    fontSize: FontSize.small,
    marginBottom: Spacing.sm,
  },
  contributionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pointsIcon: {
    fontSize: 14,
  },
  pointsText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  hasPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoText: {
    fontSize: FontSize.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  loginButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyListTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyListText: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  addButtonText: {
    color: '#fff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.card,
  },
});
