import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  danger?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, showBadge, danger }: MenuItemProps) {
  const { colors } = useColorScheme();

  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.borderLight }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={24}
        color={danger ? colors.error : colors.text}
        style={styles.menuIcon}
      />
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: danger ? colors.error : colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.menuRight}>
        {showBadge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { session, profile, isProvider, isGuest, signOut, switchRole } = useAuthStore();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignOut = async () => {
    if (isGuest) {
      Alert.alert(
        'Đăng xuất',
        'Bạn đang dùng chế độ khách. Đăng xuất sẽ quay về màn hình đăng nhập.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng xuất', style: 'destructive', onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          }},
        ]
      );
    } else {
      await signOut();
    }
  };

  if (!session && !isGuest) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Hồ sơ</Text>
        </View>

        <View style={styles.notLoggedIn}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
            <Ionicons name="person" size={48} color={colors.textSecondary} />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Đăng nhập để bắt đầu
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Quản lý đơn hàng, lưu yêu thích, và nhiều hơn nữa
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Hồ sơ</Text>
        </View>

        {/* Guest Mode Banner */}
        {isGuest && (
          <TouchableOpacity
            style={[styles.guestBanner, { backgroundColor: colors.primary + '10' }]}
            onPress={handleLogin}
          >
            <View style={[styles.guestIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="person-add" size={20} color="#ffffff" />
            </View>
            <View style={styles.guestContent}>
              <Text style={[styles.guestTitle, { color: colors.text }]}>
                Tạo tài khoản
              </Text>
              <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
                Lưu yêu thích và đánh giá tiệm
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* Profile Card */}
        {!isGuest && session && (
          <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: colors.background }, Shadow.card]}
            activeOpacity={0.9}
          >
            <Image
              source={{
                uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>
                {profile?.full_name || 'Chưa cập nhật tên'}
              </Text>
              <Text style={[styles.phone, { color: colors.textSecondary }]}>
                {session.user.email || 'Thêm email'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Role Switcher */}
        {!isGuest && profile?.role === 'provider' && (
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: colors.surfaceSecondary }]}
            onPress={switchRole}
            activeOpacity={0.8}
          >
            <View style={[styles.roleIcon, { backgroundColor: colors.primary }]}>
              <Ionicons
                name={isProvider ? 'storefront' : 'person'}
                size={20}
                color="#ffffff"
              />
            </View>
            <View style={styles.roleContent}>
              <Text style={[styles.roleTitle, { color: colors.text }]}>
                {isProvider ? 'Chế độ Thợ' : 'Chế độ Khách'}
              </Text>
              <Text style={[styles.roleSubtitle, { color: colors.textSecondary }]}>
                Nhấn để chuyển đổi
              </Text>
            </View>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* Activity Section - for all users */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Hoạt động
          </Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.background }]}>
            <MenuItem
              icon="time-outline"
              title="Đã xem gần đây"
              onPress={() => router.push('/recent')}
            />
          </View>
        </View>

        {/* Menu Sections - Only show for logged in users */}
        {!isGuest && session && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Cài đặt
            </Text>
            <View style={[styles.menuGroup, { backgroundColor: colors.background }]}>
              <MenuItem
                icon="person-outline"
                title="Thông tin cá nhân"
                onPress={() => {}}
              />
              <MenuItem
                icon="car-outline"
                title="Xe của tôi"
                onPress={() => {}}
              />
              {profile?.role === 'provider' && (
                <MenuItem
                  icon="storefront-outline"
                  title="Quản lý tiệm"
                  onPress={() => {}}
                />
              )}
              <MenuItem
                icon="notifications-outline"
                title="Thông báo"
                onPress={() => {}}
                showBadge
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Hỗ trợ
          </Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.background }]}>
            <MenuItem
              icon="help-circle-outline"
              title="Trung tâm trợ giúp"
              onPress={() => {}}
            />
            <MenuItem
              icon="chatbubble-outline"
              title="Liên hệ chúng tôi"
              onPress={() => {}}
            />
            <MenuItem
              icon="star-outline"
              title="Đánh giá ứng dụng"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Pháp lý
          </Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.background }]}>
            <MenuItem
              icon="document-text-outline"
              title="Điều khoản dịch vụ"
              onPress={() => {}}
            />
            <MenuItem
              icon="shield-outline"
              title="Chính sách bảo mật"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: Spacing.xl }]}>
          <View style={[styles.menuGroup, { backgroundColor: colors.background }]}>
            <MenuItem
              icon="log-out-outline"
              title="Đăng xuất"
              onPress={handleSignOut}
              danger
            />
          </View>
        </View>

        <Text style={[styles.version, { color: colors.textTertiary }]}>
          XE 247 phiên bản 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: FontSize.cardHeading,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  registerButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: Spacing.md,
    borderWidth: 1,
  },
  registerButtonText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  guestIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  guestTitle: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  guestSubtitle: {
    fontSize: FontSize.small,
    marginTop: 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  name: {
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  phone: {
    fontSize: FontSize.body,
    marginTop: 2,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  roleTitle: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  roleSubtitle: {
    fontSize: FontSize.small,
    marginTop: 2,
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.tag,
    fontWeight: FontWeight.semibold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuGroup: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    marginRight: Spacing.lg,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
  },
  menuSubtitle: {
    fontSize: FontSize.small,
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: FontSize.badge,
    fontWeight: FontWeight.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: FontSize.small,
    paddingVertical: Spacing.xxxl,
  },
});
