import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProviderGalleryScreen() {
  const { photos, initialIndex = '0' } = useLocalSearchParams<{
    photos: string;
    initialIndex: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const photoArray = photos ? JSON.parse(photos) : [];
  const [currentIndex, setCurrentIndex] = useState(parseInt(initialIndex, 10));
  const [showControls, setShowControls] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const handleClose = () => {
    router.back();
  };

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={toggleControls}
      style={styles.imageWrapper}
    >
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </TouchableOpacity>
  );

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < photoArray.length) {
      setCurrentIndex(newIndex);
    }
  };

  if (photoArray.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không có ảnh</Text>
          <TouchableOpacity style={styles.closeButtonLarge} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        ref={flatListRef}
        data={photoArray}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderImage}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={handleScroll}
        initialScrollIndex={parseInt(initialIndex, 10)}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Controls overlay */}
      {showControls && (
        <>
          {/* Top bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.counter}>
              {currentIndex + 1} / {photoArray.length}
            </Text>
            <View style={styles.iconButton} />
          </View>

          {/* Thumbnail strip */}
          {photoArray.length > 1 && (
            <View style={[styles.thumbnailStrip, { paddingBottom: insets.bottom + 16 }]}>
              <FlatList
                horizontal
                data={photoArray}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `thumb-${index}`}
                contentContainerStyle={styles.thumbnailContent}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      flatListRef.current?.scrollToIndex({ index, animated: true });
                      setCurrentIndex(index);
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={[
                        styles.thumbnail,
                        index === currentIndex && styles.thumbnailActive,
                      ]}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  thumbnailStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    opacity: 0.5,
  },
  thumbnailActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
  },
  closeButtonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
