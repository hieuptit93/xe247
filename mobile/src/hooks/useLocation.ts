import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationState | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Vui lòng cấp quyền truy cập vị trí để tìm tiệm gần bạn');
        return false;
      }
      return true;
    } catch (err) {
      setError('Không thể yêu cầu quyền truy cập vị trí');
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      setError('Không thể lấy vị trí hiện tại');
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    location,
    error,
    isLoading,
    requestPermission,
    refreshLocation,
  };
}
