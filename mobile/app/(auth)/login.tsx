import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { signInWithGoogle, continueAsGuest, hasSeenOnboarding } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const { error } = await signInWithGoogle();

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      if (router.canDismiss()) {
        router.dismiss();
      } else {
        router.replace('/');
      }
    }
  };

  const handleGuestMode = async () => {
    await continueAsGuest();
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.replace('/');
    }
  };

  const handleClose = () => {
    router.back();
  };

  const showCloseButton = hasSeenOnboarding;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Close button */}
      {showCloseButton && (
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>XE</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>XE 247</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Tìm dịch vụ xe nhanh chóng
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}

          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={[styles.googleText, { color: colors.text }]}>
                  Đăng nhập với Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Guest Mode - only show on first launch */}
          {!showCloseButton && (
            <TouchableOpacity
              style={[styles.guestButton, { borderColor: colors.border }]}
              onPress={handleGuestMode}
            >
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.guestText, { color: colors.textSecondary }]}>
                Tiếp tục với tư cách khách
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Text style={{ color: colors.textSecondary }}>Điều khoản dịch vụ</Text>
            {' '}và{' '}
            <Text style={{ color: colors.textSecondary }}>Chính sách bảo mật</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: FontWeight.bold,
  },
  appName: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.body,
    marginTop: Spacing.xs,
  },
  buttonSection: {
    gap: Spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.small,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  googleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
  googleText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  guestText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.small,
    lineHeight: 18,
    textAlign: 'center',
  },
});
