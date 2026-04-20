import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, BorderRadius } from '@/constants/theme';

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
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? colors.error + '20' : colors.surface }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.error : colors.primary} />
      </View>
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
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { session, profile, isProvider, signOut, switchRole } = useAuthStore();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notLoggedIn}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
            <Ionicons name="person" size={48} color={colors.textSecondary} />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Chào mừng đến XE 247
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            Đăng nhập để trải nghiệm đầy đủ tính năng
          </Text>
          <Button
            title="Đăng nhập / Đăng ký"
            onPress={handleLogin}
            fullWidth
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: profile?.avatar_url || 'https://via.placeholder.com/100x100?text=User',
            }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {profile?.full_name || 'Chưa cập nhật tên'}
          </Text>
          <Text style={[styles.phone, { color: colors.textSecondary }]}>
            {profile?.phone || session.user.phone}
          </Text>
          {profile?.role === 'provider' && (
            <TouchableOpacity
              style={[styles.roleBadge, { backgroundColor: colors.primary + '20' }]}
              onPress={switchRole}
            >
              <Ionicons
                name={isProvider ? 'storefront' : 'person'}
                size={14}
                color={colors.primary}
              />
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {isProvider ? 'Chế độ Thợ' : 'Chế độ Khách'}
              </Text>
              <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            TÀI KHOẢN
          </Text>
          <MenuItem
            icon="person-outline"
            title="Thông tin cá nhân"
            subtitle="Tên, số điện thoại, ảnh đại diện"
            onPress={() => {}}
          />
          <MenuItem
            icon="car-outline"
            title="Xe của tôi"
            subtitle="Quản lý thông tin xe"
            onPress={() => {}}
          />
          {profile?.role === 'provider' && (
            <MenuItem
              icon="storefront-outline"
              title="Tiệm của tôi"
              subtitle="Quản lý thông tin tiệm"
              onPress={() => {}}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            HOẠT ĐỘNG
          </Text>
          <MenuItem
            icon="time-outline"
            title="Lịch sử"
            subtitle="Các tiệm đã ghé thăm"
            onPress={() => {}}
          />
          <MenuItem
            icon="star-outline"
            title="Đánh giá của tôi"
            onPress={() => {}}
          />
          <MenuItem
            icon="notifications-outline"
            title="Thông báo"
            onPress={() => {}}
            showBadge
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            HỖ TRỢ
          </Text>
          <MenuItem
            icon="help-circle-outline"
            title="Trợ giúp"
            onPress={() => {}}
          />
          <MenuItem
            icon="chatbubble-outline"
            title="Liên hệ"
            onPress={() => {}}
          />
          <MenuItem
            icon="document-text-outline"
            title="Điều khoản sử dụng"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="log-out-outline"
            title="Đăng xuất"
            onPress={handleSignOut}
            danger
          />
        </View>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          XE 247 v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  welcomeSubtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  phone: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  roleText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    paddingVertical: Spacing.xl,
  },
});
