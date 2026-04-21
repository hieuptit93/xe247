import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '@/constants/categories';
import { Spacing, BorderRadius, FontSize, FontWeight } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { colors } = useColorScheme();

  return (
    <View style={[styles.wrapper, { borderBottomColor: colors.borderLight }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* All category */}
        <TouchableOpacity
          style={styles.category}
          onPress={() => onSelect(null)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: !selected ? colors.text : colors.surfaceSecondary },
            ]}
          >
            <Ionicons
              name="grid"
              size={20}
              color={!selected ? '#ffffff' : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.label,
              {
                color: !selected ? colors.text : colors.textSecondary,
                fontWeight: !selected ? FontWeight.semibold : FontWeight.medium,
              },
            ]}
          >
            Tất cả
          </Text>
          {!selected && <View style={[styles.indicator, { backgroundColor: colors.text }]} />}
        </TouchableOpacity>

        {CATEGORIES.map((category) => {
          const isSelected = selected === category.key;
          return (
            <TouchableOpacity
              key={category.key}
              style={styles.category}
              onPress={() => onSelect(category.key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: isSelected ? category.color : colors.surfaceSecondary },
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={isSelected ? '#ffffff' : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected ? colors.text : colors.textSecondary,
                    fontWeight: isSelected ? FontWeight.semibold : FontWeight.medium,
                  },
                ]}
              >
                {category.nameVi}
              </Text>
              {isSelected && <View style={[styles.indicator, { backgroundColor: colors.text }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xl,
  },
  category: {
    alignItems: 'center',
    position: 'relative',
    paddingBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.tag,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    borderRadius: 1,
  },
});
