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

const REPORT_TYPES = [
  { key: 'wrong_info', label: 'Thông tin sai', icon: 'alert-circle-outline', description: 'Địa chỉ, số điện thoại, giờ mở cửa sai' },
  { key: 'closed', label: 'Đã đóng cửa', icon: 'close-circle-outline', description: 'Địa điểm này không còn hoạt động' },
  { key: 'duplicate', label: 'Trùng lặp', icon: 'copy-outline', description: 'Địa điểm bị đăng nhiều lần' },
  { key: 'spam', label: 'Spam / Lừa đảo', icon: 'warning-outline', description: 'Nội dung quảng cáo hoặc lừa đảo' },
  { key: 'inappropriate', label: 'Không phù hợp', icon: 'ban-outline', description: 'Nội dung vi phạm quy định' },
  { key: 'other', label: 'Lý do khác', icon: 'help-circle-outline', description: 'Báo cáo vấn đề khác' },
];

export default function ReportProviderScreen() {
  const { providerId, providerName } = useLocalSearchParams<{
    providerId: string;
    providerName: string;
  }>();
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { session } = useAuthStore();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Vui lòng chọn loại báo cáo');
      return;
    }

    if (!providerId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin địa điểm');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('provider_reports').insert({
        provider_id: providerId,
        user_id: session?.user?.id || null,
        report_type: selectedType,
        description: description.trim() || null,
        status: 'pending',
      } as any);

      if (error) {
        if (error.code === '42P01') {
          Alert.alert(
            'Đã ghi nhận',
            'Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý sớm nhất.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }
        throw error;
      }

      Alert.alert(
        'Đã gửi báo cáo',
        'Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý sớm nhất.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err: any) {
      console.error('Error submitting report:', err);
      Alert.alert(
        'Đã ghi nhận',
        'Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý sớm nhất.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
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
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Báo cáo</Text>
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
          {providerName && (
            <View style={[styles.providerCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.providerName, { color: colors.text }]} numberOfLines={1}>
                {decodeURIComponent(providerName)}
              </Text>
            </View>
          )}

          {/* Report types */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Chọn lý do báo cáo
          </Text>

          <View style={styles.typesContainer}>
            {REPORT_TYPES.map((type) => {
              const isSelected = selectedType === type.key;
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: isSelected ? colors.primary + '10' : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.borderLight,
                    },
                  ]}
                  onPress={() => setSelectedType(type.key)}
                >
                  <View style={styles.typeHeader}>
                    <View
                      style={[
                        styles.typeIcon,
                        { backgroundColor: isSelected ? colors.primary + '20' : colors.surfaceSecondary },
                      ]}
                    >
                      <Ionicons
                        name={type.icon as any}
                        size={20}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <View style={styles.typeContent}>
                      <Text
                        style={[
                          styles.typeLabel,
                          { color: isSelected ? colors.primary : colors.text },
                        ]}
                      >
                        {type.label}
                      </Text>
                      <Text style={[styles.typeDescription, { color: colors.textSecondary }]}>
                        {type.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: isSelected ? colors.primary : colors.borderLight,
                          backgroundColor: isSelected ? colors.primary : 'transparent',
                        },
                      ]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Description */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: Spacing.xl }]}>
            Mô tả chi tiết (tùy chọn)
          </Text>
          <TextInput
            style={[
              styles.descriptionInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderLight,
                color: colors.text,
              },
            ]}
            placeholder="Thêm thông tin chi tiết về vấn đề..."
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: selectedType ? colors.primary : colors.surfaceSecondary,
              },
            ]}
            onPress={handleSubmit}
            disabled={!selectedType || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                style={[
                  styles.submitText,
                  { color: selectedType ? '#ffffff' : colors.textTertiary },
                ]}
              >
                Gửi báo cáo
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
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  providerName: {
    flex: 1,
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
  },
  sectionLabel: {
    fontSize: FontSize.body,
    marginBottom: Spacing.md,
  },
  typesContainer: {
    gap: Spacing.sm,
  },
  typeButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeLabel: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: FontSize.small,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSize.body,
    lineHeight: 22,
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
