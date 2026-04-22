import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import { PROVINCES, MAJOR_CITIES, Province, REGIONS } from '@/constants/provinces';

interface ProvincePickerModalProps {
  visible: boolean;
  selectedCode: string | null;
  onSelect: (province: Province) => void;
  onClose: () => void;
}

export function ProvincePickerModal({
  visible,
  selectedCode,
  onSelect,
  onClose,
}: ProvincePickerModalProps) {
  const { colors, isDark } = useColorScheme();
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (query) {
      // When searching, show flat list of matching provinces
      return PROVINCES.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // No search: group by region, with major cities pinned on top
    const majorCities = MAJOR_CITIES
      .map((code) => PROVINCES.find((p) => p.code === code)!)
      .filter(Boolean);

    return majorCities;
  }, [search]);

  const groupedByRegion = useMemo(() => {
    if (search.trim()) return null;

    const groups: { region: string; provinces: Province[] }[] = [];
    for (const region of REGIONS) {
      const provinces = PROVINCES.filter(
        (p) => p.region === region && !MAJOR_CITIES.includes(p.code)
      );
      if (provinces.length > 0) {
        groups.push({ region, provinces });
      }
    }
    return groups;
  }, [search]);

  const handleSelect = (province: Province) => {
    setSearch('');
    onSelect(province);
  };

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const renderProvince = (province: Province, showRegion = false) => {
    const isSelected = province.code === selectedCode;
    return (
      <TouchableOpacity
        key={province.code}
        style={[
          styles.item,
          {
            backgroundColor: isSelected
              ? isDark ? 'rgba(255,56,92,0.15)' : 'rgba(255,56,92,0.08)'
              : 'transparent',
          },
        ]}
        onPress={() => handleSelect(province)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <Text
            style={[
              styles.itemName,
              { color: isSelected ? colors.primary : colors.text },
              isSelected && styles.itemNameSelected,
            ]}
          >
            {province.name}
          </Text>
          {showRegion && (
            <Text style={[styles.itemRegion, { color: colors.textSecondary }]}>
              {province.region}
            </Text>
          )}
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (search.trim()) {
      // Search results - flat list
      if (filteredData.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Không tìm thấy tỉnh/thành phố
            </Text>
          </View>
        );
      }
      return (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => renderProvince(item, true)}
          keyboardShouldPersistTaps="handled"
        />
      );
    }

    // Default view: major cities + grouped by region
    const sections: React.ReactNode[] = [];

    // Major cities section
    sections.push(
      <View key="major">
        <Text style={[styles.sectionHeader, { color: colors.textSecondary, borderBottomColor: colors.borderLight }]}>
          Thành phố lớn
        </Text>
        {filteredData.map((p) => renderProvince(p))}
      </View>
    );

    // Region sections
    if (groupedByRegion) {
      for (const group of groupedByRegion) {
        sections.push(
          <View key={group.region}>
            <Text style={[styles.sectionHeader, { color: colors.textSecondary, borderBottomColor: colors.borderLight }]}>
              {group.region}
            </Text>
            {group.provinces.map((p) => renderProvince(p))}
          </View>
        );
      }
    }

    return (
      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={(item) => item.key}
        renderItem={() => <>{sections}</>}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Chọn tỉnh/thành phố
          </Text>
          <View style={styles.closeButton} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm tỉnh/thành phố..."
              placeholderTextColor={colors.textSecondary}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        {/* Province List */}
        {renderContent()}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.semibold,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body,
    paddingVertical: Spacing.xs,
  },
  sectionHeader: {
    fontSize: FontSize.small,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSize.button,
    fontWeight: FontWeight.regular,
  },
  itemNameSelected: {
    fontWeight: FontWeight.semibold,
  },
  itemRegion: {
    fontSize: FontSize.small,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyText: {
    fontSize: FontSize.body,
  },
});
