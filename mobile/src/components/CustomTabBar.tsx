import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';

const TAB_BAR_MARGIN = 20;
const TAB_BAR_HEIGHT = 60;
const EV_GREEN = '#00d1b2';

const TAB_CONFIG: Record<string, {
  label: string;
  icon: string;
  iconFocused: string;
  customColor?: string;
}> = {
  index: { label: 'Khám phá', icon: 'search-outline', iconFocused: 'search' },
  charging: { label: 'Sạc EV', icon: 'flash-outline', iconFocused: 'flash', customColor: EV_GREEN },
  favorites: { label: 'Đã lưu', icon: 'heart-outline', iconFocused: 'heart' },
  profile: { label: 'Tài khoản', icon: 'person-outline', iconFocused: 'person' },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useColorScheme();
  const insets = useSafeAreaInsets();

  const bottomPosition = Math.max(insets.bottom, 16);

  return (
    <View style={[
      styles.container,
      {
        bottom: bottomPosition,
        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name] || {
          label: route.name,
          icon: 'help-circle-outline',
          iconFocused: 'help-circle'
        };

        const activeColor = config.customColor || colors.primary;
        const color = isFocused ? activeColor : colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(isFocused ? config.iconFocused : config.icon) as any}
              size={22}
              color={color}
            />
            <Text style={[styles.label, { color }]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: TAB_BAR_MARGIN,
    right: TAB_BAR_MARGIN,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    borderRadius: TAB_BAR_HEIGHT / 2,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
});
