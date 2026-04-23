import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

const CONFETTI_COLORS = ['#ff385c', '#00d1b2', '#FFD700', '#428bff', '#fc642d'];

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
}

export default function ContributeSuccessScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { points = '15' } = useLocalSearchParams<{ points: string }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pointsAnim = useRef(new Animated.Value(0)).current;
  const confettiPieces = useRef<ConfettiPiece[]>([]).current;

  useEffect(() => {
    // Initialize confetti
    for (let i = 0; i < 30; i++) {
      confettiPieces.push({
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(-50),
        rotation: new Animated.Value(0),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 10 + 5,
      });
    }

    // Start animations
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(pointsAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate confetti
    confettiPieces.forEach((piece, index) => {
      const delay = index * 50;
      Animated.parallel([
        Animated.timing(piece.y, {
          toValue: 800,
          duration: 3000 + Math.random() * 2000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotation, {
          toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration: 3000,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleAddAnother = () => {
    router.replace('/contribute/camera');
  };

  const handleViewContributions = () => {
    router.replace('/contribute');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size * 2,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#00d1b2' }]}>
            <Ionicons name="checkmark" size={64} color="#fff" />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            { color: colors.text, opacity: fadeAnim },
          ]}
        >
          Cam on ban!
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary, opacity: fadeAnim },
          ]}
        >
          Dong gop cua ban se giup cong dong tim tho de hon
        </Animated.Text>

        {/* Points Earned */}
        <Animated.View
          style={[
            styles.pointsCard,
            {
              backgroundColor: '#f0fff4',
              transform: [
                {
                  scale: pointsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.pointsEmoji}>🏅</Text>
          <View>
            <Text style={styles.pointsLabel}>Ban nhan duoc</Text>
            <Text style={styles.pointsValue}>+{points} diem</Text>
          </View>
        </Animated.View>

        {/* Status Note */}
        <Animated.View
          style={[
            styles.statusNote,
            { backgroundColor: colors.surface, opacity: fadeAnim },
          ]}
        >
          <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Doi xem xet. Diem se duoc cong khi duoc duyet.
          </Text>
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleAddAnother}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Them dia diem khac</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
            onPress={handleViewContributions}
          >
            <Ionicons name="list" size={20} color={colors.text} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Dong gop cua toi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
            onPress={handleGoHome}
          >
            <Ionicons name="home" size={20} color={colors.text} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Ve trang chu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  pointsEmoji: {
    fontSize: 40,
  },
  pointsLabel: {
    fontSize: FontSize.small,
    color: '#2d7a4d',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: '#2d7a4d',
  },
  statusNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.small,
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  secondaryButtonText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
});
