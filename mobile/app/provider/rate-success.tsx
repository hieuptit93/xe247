import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function RateSuccessScreen() {
  const { providerName } = useLocalSearchParams<{ providerName: string }>();
  const router = useRouter();
  const { colors, isDark } = useColorScheme();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDone = () => {
    router.dismissAll();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.content}>
        {/* Success Animation */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.circle,
              { backgroundColor: colors.success + '15', transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: checkAnim }] }}>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Text */}
        <Animated.View style={[styles.textContainer, { opacity: textAnim }]}>
          <Text style={[styles.title, { color: colors.text }]}>Cảm ơn bạn!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Đánh giá của bạn đã được gửi thành công
          </Text>
          {providerName && (
            <Text style={[styles.providerName, { color: colors.textSecondary }]}>
              cho {decodeURIComponent(providerName)}
            </Text>
          )}
        </Animated.View>

        {/* Info */}
        <Animated.View
          style={[styles.infoCard, { backgroundColor: colors.surface, opacity: textAnim }]}
        >
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Đánh giá của bạn sẽ giúp những người khác tìm được dịch vụ tốt hơn
          </Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={handleDone}
        >
          <Text style={styles.doneText}>Xong</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  animationContainer: {
    marginBottom: Spacing.xl,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.button,
    textAlign: 'center',
  },
  providerName: {
    fontSize: FontSize.body,
    marginTop: Spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    maxWidth: 320,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.body,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.lg,
  },
  doneButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  doneText: {
    color: '#ffffff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
});
