import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const { colors } = useColorScheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : Spacing.lg,
              paddingRight: rightIcon ? 0 : Spacing.lg,
            },
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.textSecondary}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: FontSize.button,
    fontWeight: FontWeight.medium,
    height: '100%',
  },
  leftIcon: {
    marginLeft: Spacing.lg,
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginRight: Spacing.lg,
    marginLeft: Spacing.sm,
  },
  error: {
    fontSize: FontSize.small,
    marginTop: Spacing.xs,
  },
});
