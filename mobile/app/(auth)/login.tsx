import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useColorScheme();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, continueAsGuest, hasSeenOnboarding } = useAuthStore();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    setError('');

    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    const { error } = mode === 'login'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);

    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login')) {
        setError('Email hoặc mật khẩu không đúng');
      } else if (error.message.includes('already registered')) {
        setError('Email đã được đăng ký');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Vui lòng xác nhận email trước khi đăng nhập');
      } else {
        setError(error.message);
      }
    } else {
      router.replace('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    const { error } = await signInWithGoogle();

    setGoogleLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.replace('/');
    }
  };

  const handleGuestMode = async () => {
    await continueAsGuest();
    router.replace('/');
  };

  const handleClose = () => {
    router.back();
  };

  const isButtonDisabled = !validateEmail(email) || password.length < 6 ||
    (mode === 'register' && password !== confirmPassword);

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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.googleButton, { borderColor: colors.border }]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={[styles.googleText, { color: colors.text }]}>
                  Tiếp tục với Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>hoặc</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: error && !validateEmail(email) ? colors.error : colors.border },
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="email@example.com"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Mật khẩu</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderColor: error && password.length < 6 ? colors.error : colors.border },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Xác nhận mật khẩu</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { borderColor: error && password !== confirmPassword ? colors.error : colors.border },
                  ]}
                >
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                  />
                </View>
              </View>
            )}

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: isButtonDisabled || loading ? colors.surfaceSecondary : colors.primary },
              ]}
              onPress={handleSubmit}
              disabled={loading || isButtonDisabled}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.textSecondary} />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    { color: isButtonDisabled ? colors.textSecondary : '#ffffff' },
                  ]}
                >
                  {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Mode */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setConfirmPassword('');
              }}
            >
              <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
                {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                <Text style={{ color: colors.primary, fontWeight: FontWeight.semibold }}>
                  {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Mode - only show on first launch */}
          {!showCloseButton && (
            <>
              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>

              <TouchableOpacity
                style={[styles.guestButton, { borderColor: colors.border }]}
                onPress={handleGuestMode}
              >
                <Ionicons name="person-outline" size={20} color={colors.text} />
                <Text style={[styles.guestText, { color: colors.text }]}>
                  Tiếp tục với tư cách khách
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              Bằng việc tiếp tục, bạn đồng ý với{' '}
              <Text style={{ color: colors.textSecondary }}>Điều khoản dịch vụ</Text>
              {' '}và{' '}
              <Text style={{ color: colors.textSecondary }}>Chính sách bảo mật</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 28,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  googleText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
    gap: Spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: FontSize.small,
  },
  form: {
    gap: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    height: 52,
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.button,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.small,
  },
  submitButton: {
    height: 52,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  submitText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  toggleText: {
    fontSize: FontSize.body,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  guestText: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
  },
  footer: {
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  footerText: {
    fontSize: FontSize.small,
    lineHeight: 18,
    textAlign: 'center',
  },
});
