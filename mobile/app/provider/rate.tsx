import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

const QUICK_TAGS = [
  { key: 'dung_gio', label: 'Đúng giờ', icon: 'time-outline' },
  { key: 'than_thien', label: 'Thân thiện', icon: 'happy-outline' },
  { key: 'gia_hop_ly', label: 'Giá hợp lý', icon: 'cash-outline' },
  { key: 'sach_se', label: 'Sạch sẽ', icon: 'sparkles-outline' },
  { key: 'chuyen_nghiep', label: 'Chuyên nghiệp', icon: 'ribbon-outline' },
  { key: 'nhanh_chong', label: 'Nhanh chóng', icon: 'flash-outline' },
];

const RATING_LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

export default function RateProviderScreen() {
  const { providerId, providerName } = useLocalSearchParams<{
    providerId: string;
    providerName: string;
  }>();
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { session } = useAuthStore();

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (key: string) => {
    setSelectedTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Vui lòng chọn số sao', 'Bạn cần đánh giá ít nhất 1 sao');
      return;
    }

    if (!session || !providerId) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        provider_id: providerId,
        user_id: session.user.id,
        rating,
        tags: selectedTags.length > 0 ? selectedTags : null,
        comment: comment.trim() || null,
        is_visible: true,
      } as any);

      if (error) throw error;

      router.replace({
        pathname: '/provider/rate-success',
        params: { providerName },
      });
    } catch (err: any) {
      console.error('Error submitting review:', err);
      Alert.alert('Lỗi', err.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Đánh giá</Text>
        <View style={styles.closeButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Provider name */}
          <Text style={[styles.providerName, { color: colors.text }]} numberOfLines={2}>
            {providerName ? decodeURIComponent(providerName) : 'Địa điểm'}
          </Text>

          {/* Star Rating */}
          <View style={styles.ratingSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Bạn đánh giá thế nào?
            </Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={44}
                    color={star <= rating ? '#FFB800' : colors.borderLight}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={[styles.ratingLabel, { color: colors.primary }]}>
                {RATING_LABELS[rating]}
              </Text>
            )}
          </View>

          {/* Quick Tags */}
          <View style={styles.tagsSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Điều gì bạn thích? (tùy chọn)
            </Text>
            <View style={styles.tagsGrid}>
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.key);
                return (
                  <TouchableOpacity
                    key={tag.key}
                    style={[
                      styles.tagButton,
                      {
                        backgroundColor: isSelected ? colors.primary + '15' : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.borderLight,
                      },
                    ]}
                    onPress={() => toggleTag(tag.key)}
                  >
                    <Ionicons
                      name={tag.icon as any}
                      size={18}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tagLabel,
                        { color: isSelected ? colors.primary : colors.text },
                      ]}
                    >
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Comment */}
          <View style={styles.commentSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Chia sẻ trải nghiệm (tùy chọn)
            </Text>
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight,
                  color: colors.text,
                },
              ]}
              placeholder="Viết đánh giá của bạn..."
              placeholderTextColor={colors.textTertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>
              {comment.length}/500
            </Text>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: rating > 0 ? colors.primary : colors.surfaceSecondary,
              },
            ]}
            onPress={handleSubmit}
            disabled={rating === 0 || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                style={[
                  styles.submitText,
                  { color: rating > 0 ? '#ffffff' : colors.textTertiary },
                ]}
              >
                Gửi đánh giá
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  providerName: {
    fontSize: FontSize.subheading,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    letterSpacing: -0.3,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.body,
    marginBottom: Spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  starButton: {
    padding: Spacing.xs,
  },
  ratingLabel: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.md,
  },
  tagsSection: {
    marginBottom: Spacing.xl,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  tagLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  commentSection: {
    marginBottom: Spacing.lg,
  },
  commentInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSize.body,
    lineHeight: 22,
  },
  charCount: {
    fontSize: FontSize.small,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  submitButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  submitText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
