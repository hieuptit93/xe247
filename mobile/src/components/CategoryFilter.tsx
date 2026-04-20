import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, CategoryKey } from '@/constants/categories';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { colors } = useColorScheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: !selected ? colors.primary : colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => onSelect(null)}
      >
        <Ionicons
          name="apps"
          size={16}
          color={!selected ? '#FFFFFF' : colors.textSecondary}
        />
        <Text
          style={[
            styles.chipText,
            { color: !selected ? '#FFFFFF' : colors.text },
          ]}
        >
          Tất cả
        </Text>
      </TouchableOpacity>

      {CATEGORIES.map((category) => {
        const isSelected = selected === category.key;
        return (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? category.color : colors.surface,
                borderColor: isSelected ? category.color : colors.border,
              },
            ]}
            onPress={() => onSelect(category.key)}
          >
            <Ionicons
              name={category.icon}
              size={16}
              color={isSelected ? '#FFFFFF' : category.color}
            />
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : colors.text },
              ]}
            >
              {category.nameVi}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
    marginRight: Spacing.xs,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
