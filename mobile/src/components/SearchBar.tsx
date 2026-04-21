import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onMapPress?: () => void;
  onPress?: () => void;
  editable?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm tiệm sửa xe, rửa xe...',
  onFilterPress,
  onMapPress,
  onPress,
  editable = true,
}: SearchBarProps) {
  const { colors } = useColorScheme();

  const content = (
    <View style={[styles.container, { backgroundColor: colors.background }, Shadow.card]}>
      <View style={styles.searchSection}>
        <Ionicons name="search" size={18} color={colors.text} />
        {editable ? (
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
          />
        ) : (
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            {placeholder}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {onFilterPress && (
          <TouchableOpacity
            onPress={onFilterPress}
            style={[styles.filterButton, { borderColor: colors.border }]}
          >
            <Ionicons name="options-outline" size={16} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (onPress && !editable) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xxxl,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    paddingVertical: Spacing.xs,
  },
  placeholderText: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
