import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useColorScheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceSecondary;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.text;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#ffffff';
      case 'outline':
        return colors.text;
      case 'ghost':
        return colors.primary;
      default:
        return '#ffffff';
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg };
      case 'lg':
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl };
      default:
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return FontSize.body;
      case 'lg':
        return FontSize.button;
      default:
        return FontSize.button;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyles(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.text : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor(), fontSize: getTextSize() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: FontWeight.semibold,
  },
});
