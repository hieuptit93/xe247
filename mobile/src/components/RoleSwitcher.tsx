import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/auth.store';

export function RoleSwitcher() {
  const { colors } = useColorScheme();
  const { isProvider, switchRole, profile } = useAuthStore();

  if (!profile || profile.role !== 'provider') {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={switchRole}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons
          name={isProvider ? 'storefront' : 'person'}
          size={20}
          color={colors.primary}
        />
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Đang xem:
        </Text>
        <Text style={[styles.mode, { color: colors.text }]}>
          {isProvider ? 'Chế độ Thợ' : 'Chế độ Khách'}
        </Text>
      </View>
      <Ionicons name="swap-horizontal" size={18} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
  },
  mode: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
