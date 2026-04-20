import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onMapPress?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm tiệm sửa xe...',
  onFilterPress,
  onMapPress,
}: SearchBarProps) {
  const { colors } = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
      {onFilterPress && (
        <TouchableOpacity onPress={onFilterPress} style={styles.iconButton}>
          <Ionicons name="options" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
      {onMapPress && (
        <TouchableOpacity onPress={onMapPress} style={styles.iconButton}>
          <Ionicons name="map" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    paddingVertical: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
