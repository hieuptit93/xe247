import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContributeStore } from '@/stores/contribute.store';
import { useAuthStore } from '@/stores/auth.store';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function ContributeCameraScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { session, isGuest } = useAuthStore();
  const { updateDraft, clearDraft } = useContributeStore();
  const insets = useSafeAreaInsets();

  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    clearDraft();
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');

    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    if (!session && !isGuest) {
      Alert.alert('Đăng nhập', 'Bạn cần đăng nhập để đóng góp địa điểm', [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => router.push('/(auth)/login') },
      ]);
      return;
    }

    if (!currentLocation) {
      Alert.alert('Cần vị trí', 'Vui lòng bật GPS để thêm địa điểm');
      return;
    }

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo?.uri) {
        setCapturedImage(photo.uri);

        updateDraft({
          images: [photo.uri],
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push('/contribute/confirm');
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            Cần quyền Camera
          </Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            Để chụp ảnh biển hiệu, vui lòng cho phép truy cập camera
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Cho phép</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (locationPermission === false) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.permissionContainer}>
          <Ionicons name="location-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.permissionTitle, { color: colors.text }]}>Cần quyền Vị trí</Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            Để xác minh địa điểm, bạn cần bật vị trí (GPS)
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={checkLocationPermission}
          >
            <Text style={styles.permissionButtonText}>Bật vị trí</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} resizeMode="cover" />
          <View style={[styles.previewOverlay, { paddingTop: insets.top }]}>
            <View style={styles.previewHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={[styles.previewActions, { paddingBottom: insets.bottom + Spacing.lg }]}>
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <Ionicons name="refresh" size={24} color="#fff" />
                <Text style={styles.retakeText}>Chụp lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.useButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/contribute/confirm')}
              >
                <Text style={styles.useButtonText}>Sử dụng ảnh này</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={[styles.cameraOverlay, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Chụp biển hiệu</Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Guide frame */}
            <View style={styles.guideContainer}>
              <View style={styles.guideFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.guideText}>Đặt biển hiệu trong khung</Text>
            </View>

            {/* Location indicator */}
            <View style={styles.locationBadge}>
              <Ionicons
                name={currentLocation ? 'location' : 'location-outline'}
                size={16}
                color={currentLocation ? '#00d1b2' : '#ff9500'}
              />
              <Text style={styles.locationText}>
                {currentLocation ? 'GPS đã sẵn sàng' : 'Đang lấy vị trí...'}
              </Text>
            </View>

            {/* Capture button */}
            <View style={[styles.captureContainer, { paddingBottom: insets.bottom + Spacing.xl }]}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
                disabled={isProcessing || !currentLocation}
              >
                {isProcessing ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <View style={styles.captureInner} />
                )}
              </TouchableOpacity>
              <Text style={styles.captureHint}>Nhấn để chụp</Text>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  headerTitle: {
    color: '#fff',
    fontSize: FontSize.feature,
    fontWeight: FontWeight.semibold,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  guideContainer: {
    alignItems: 'center',
  },
  guideFrame: {
    width: 280,
    height: 160,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: BorderRadius.md,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#fff',
    borderWidth: 3,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: BorderRadius.sm,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: BorderRadius.sm,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: BorderRadius.sm,
  },
  guideText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.body,
    marginTop: Spacing.md,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  locationText: {
    color: '#fff',
    fontSize: FontSize.small,
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  captureHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.small,
    marginTop: Spacing.sm,
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  previewHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.full,
  },
  retakeText: {
    color: '#fff',
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  useButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  useButtonText: {
    color: '#fff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  backButton: {
    marginTop: Spacing.lg,
  },
  backButtonText: {
    fontSize: FontSize.body,
  },
});
