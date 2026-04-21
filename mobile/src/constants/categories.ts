import { Ionicons } from '@expo/vector-icons';

export type CategoryKey =
  | 'repair'
  | 'car_wash'
  | 'car_parts'
  | 'ev_charging';

export interface Category {
  key: CategoryKey;
  name: string;
  nameVi: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

// Categories matching Supabase data
export const CATEGORIES: Category[] = [
  {
    key: 'repair',
    name: 'Repair',
    nameVi: 'Sửa chữa',
    icon: 'construct',
    color: '#ff385c', // Rausch Red
  },
  {
    key: 'car_wash',
    name: 'Car Wash',
    nameVi: 'Rửa xe',
    icon: 'water',
    color: '#00a699',
  },
  {
    key: 'car_parts',
    name: 'Parts',
    nameVi: 'Phụ tùng',
    icon: 'cog',
    color: '#fc642d',
  },
  {
    key: 'ev_charging',
    name: 'EV Charging',
    nameVi: 'Sạc EV',
    icon: 'flash',
    color: '#00d1b2',
  },
];

export const getCategoryByKey = (key: string): Category | undefined => {
  return CATEGORIES.find((c) => c.key === key);
};

export const getCategoryColor = (key: string): string => {
  return getCategoryByKey(key)?.color || '#767676';
};

export const getCategoryIcon = (key: string): keyof typeof Ionicons.glyphMap => {
  return getCategoryByKey(key)?.icon || 'help-circle';
};

export const getCategoryName = (key: string): string => {
  return getCategoryByKey(key)?.nameVi || key;
};
