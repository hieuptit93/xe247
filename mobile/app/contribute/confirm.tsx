import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContributeStore } from '@/stores/contribute.store';
import { CATEGORIES, CategoryKey, getCategoryColor } from '@/constants/categories';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

export default function ContributeConfirmScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { draft, updateDraft, submitContribution, checkDuplicate, isLoading } = useContributeStore();

  const [name, setName] = useState(draft.name);
  const [phone, setPhone] = useState(draft.phone);
  const [address, setAddress] = useState(draft.address);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    draft.categoryId as CategoryKey | null
  );
  const [duplicateWarning, setDuplicateWarning] = useState<any[]>([]);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Check for duplicates when name changes
  useEffect(() => {
    const checkForDuplicate = async () => {
      if (name.length < 3 || !draft.latitude || !draft.longitude) return;

      setCheckingDuplicate(true);
      const duplicates = await checkDuplicate(name, draft.latitude, draft.longitude);
      setDuplicateWarning(duplicates);
      setCheckingDuplicate(false);
    };

    const timer = setTimeout(checkForDuplicate, 500);
    return () => clearTimeout(timer);
  }, [name, draft.latitude, draft.longitude]);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Thieu thong tin', 'Vui long nhap ten tiem');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Thieu thong tin', 'Vui long chon loai dich vu');
      return;
    }

    if (!draft.latitude || !draft.longitude) {
      Alert.alert('Loi', 'Khong the xac dinh vi tri. Vui long thu lai.');
      return;
    }

    // Submit
    const result = await submitContribution('new_location', {
      name: name.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      latitude: draft.latitude,
      longitude: draft.longitude,
      categoryId: selectedCategory,
      images: draft.images,
      userLatitude: draft.latitude,
      userLongitude: draft.longitude,
    });

    if (result.success) {
      router.replace({
        pathname: '/contribute/success',
        params: { points: result.points?.toString() || '15' },
      });
    } else {
      Alert.alert('Loi', result.error || 'Khong the gui. Vui long thu lai.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Xac nhan thong tin</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image preview */}
          {draft.images.length > 0 && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: draft.images[0] }} style={styles.previewImage} />
              <View style={styles.imageBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#00d1b2" />
                <Text style={styles.imageBadgeText}>Da chup anh</Text>
              </View>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Ten tiem <Text style={{ color: colors.primary }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="VD: Rua Xe Hoang Anh"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
              {checkingDuplicate && (
                <View style={styles.checkingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.checkingText, { color: colors.textSecondary }]}>
                    Dang kiem tra trung lap...
                  </Text>
                </View>
              )}
              {duplicateWarning.length > 0 && (
                <View style={[styles.warningBox, { backgroundColor: '#fff3cd' }]}>
                  <Ionicons name="warning" size={16} color="#856404" />
                  <Text style={styles.warningText}>
                    Co {duplicateWarning.length} dia diem tuong tu gan day. Vui long kiem tra truoc
                    khi them moi.
                  </Text>
                </View>
              )}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>So dien thoai</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="VD: 0909 123 456"
                placeholderTextColor={colors.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Dia chi</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="VD: 123 Nguyen Van A, Quan 1"
                placeholderTextColor={colors.textTertiary}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Location indicator */}
            {draft.latitude && draft.longitude && (
              <View style={[styles.locationBox, { backgroundColor: colors.surface }]}>
                <Ionicons name="location" size={20} color="#00d1b2" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.locationLabel, { color: colors.text }]}>Vi tri GPS</Text>
                  <Text style={[styles.locationCoords, { color: colors.textSecondary }]}>
                    {draft.latitude.toFixed(6)}, {draft.longitude.toFixed(6)}
                  </Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color="#00d1b2" />
              </View>
            )}

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Loai dich vu <Text style={{ color: colors.primary }}>*</Text>
              </Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryItem,
                      {
                        backgroundColor:
                          selectedCategory === cat.key ? getCategoryColor(cat.key) : colors.surface,
                        borderColor:
                          selectedCategory === cat.key ? getCategoryColor(cat.key) : colors.border,
                      },
                    ]}
                    onPress={() => setSelectedCategory(cat.key)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={20}
                      color={selectedCategory === cat.key ? '#fff' : getCategoryColor(cat.key)}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        { color: selectedCategory === cat.key ? '#fff' : colors.text },
                      ]}
                    >
                      {cat.nameVi}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Points indicator */}
            <View style={[styles.pointsBox, { backgroundColor: '#f0fff4' }]}>
              <View style={styles.pointsIcon}>
                <Text style={styles.pointsEmoji}>🏅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pointsTitle}>Ban se nhan duoc</Text>
                <Text style={styles.pointsValue}>
                  +{draft.images.length > 0 ? '15' : '5'} diem
                  {draft.images.length > 0 && (
                    <Text style={styles.pointsBonus}> (co anh +10)</Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Submit button */}
        <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Them dia diem</Text>
                <Ionicons name="add-circle" size={20} color="#fff" />
              </>
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
  content: {
    flex: 1,
  },
  imagePreview: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  previewImage: {
    width: '100%',
    height: 160,
  },
  imageBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: FontSize.small,
  },
  form: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.body,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  checkingText: {
    fontSize: FontSize.small,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  warningText: {
    flex: 1,
    fontSize: FontSize.small,
    color: '#856404',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  locationLabel: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  locationCoords: {
    fontSize: FontSize.small,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.medium,
  },
  pointsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  pointsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsEmoji: {
    fontSize: 24,
  },
  pointsTitle: {
    fontSize: FontSize.small,
    color: '#2d7a4d',
  },
  pointsValue: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.bold,
    color: '#2d7a4d',
  },
  pointsBonus: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.regular,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
