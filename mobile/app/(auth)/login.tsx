import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize } from '@/constants/theme';

type Step = 'phone' | 'otp';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { signInWithOtp, verifyOtp } = useAuthStore();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '+84' + cleaned.slice(1);
    }
    if (cleaned.startsWith('84')) {
      return '+' + cleaned;
    }
    return cleaned;
  };

  const handleSendOtp = async () => {
    if (phone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    const formattedPhone = formatPhone(phone);
    const { error } = await signInWithOtp(formattedPhone);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setLoading(true);
    setError('');

    const formattedPhone = formatPhone(phone);
    const { error } = await verifyOtp(formattedPhone, otp);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
      setError('');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {step === 'phone' ? 'Đăng nhập' : 'Xác thực OTP'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {step === 'phone'
              ? 'Nhập số điện thoại để tiếp tục'
              : `Nhập mã OTP đã gửi đến ${phone}`}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 'phone' ? (
            <Input
              label="Số điện thoại"
              placeholder="0909 123 456"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError('');
              }}
              leftIcon="call-outline"
              error={error}
              autoFocus
            />
          ) : (
            <Input
              label="Mã OTP"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                setError('');
              }}
              leftIcon="keypad-outline"
              error={error}
              autoFocus
            />
          )}

          <Button
            title={step === 'phone' ? 'Tiếp tục' : 'Xác nhận'}
            onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            loading={loading}
            fullWidth
          />

          {step === 'otp' && (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={[styles.resendText, { color: colors.primary }]}>
                Gửi lại mã OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Bằng việc tiếp tục, bạn đồng ý với
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Điều khoản sử dụng
            </Text>
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
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
  },
  form: {
    gap: Spacing.md,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  resendText: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.sm,
  },
  linkText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginTop: Spacing.xs,
  },
});
