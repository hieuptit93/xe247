import { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProviderCard } from '@/components/ProviderCard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRecentStore } from '@/stores/recent.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { Provider } from '@/types/database';

export default function RecentScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { recentItems, clearRecent } = useRecentStore();

  const handleProviderPress = useCallback(
    (provider: Provider) => {
      router.push(`/provider/${provider.id}`);
    },
    [router]
  );

  const handleClearAll = () => {
    clearRecent();
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xem';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Đã xem gần đây</Text>
        {recentItems.length > 0 ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={[styles.clearText, { color: colors.primary }]}>Xóa</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>

      <FlatList
        data={recentItems}
        keyExtractor={(item) => item.provider.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              {formatTime(item.viewedAt)}
            </Text>
            <ProviderCard
              provider={item.provider}
              onPress={() => handleProviderPress(item.provider)}
            />
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          recentItems.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="time-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Chưa có lịch sử xem
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Các địa điểm bạn xem sẽ xuất hiện ở đây để tiện theo dõi
            </Text>
            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
        }
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  clearButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  clearText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: Spacing.sm,
  },
  timeLabel: {
    fontSize: FontSize.small,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  exploreButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
