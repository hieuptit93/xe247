import { Ionicons } from '@expo/vector-icons';

export type CategoryKey =
  | 'repair'
  | 'service'
  | 'tuning'
  | 'car_wash'
  | 'rescue'
  | 'ev_charging';

export interface Category {
  key: CategoryKey;
  name: string;
  nameVi: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

// Categories for home screen (excluding EV charging which has its own tab)
export const CATEGORIES: Category[] = [
  {
    key: 'repair',
    name: 'Repair',
    nameVi: 'Sửa chữa',
    icon: 'construct',
    color: '#ff385c', // Rausch Red
  },
  {
    key: 'service',
    name: 'Service',
    nameVi: 'Xưởng dịch vụ',
    icon: 'car-sport',
    color: '#00a699',
  },
  {
    key: 'tuning',
    name: 'Tuning',
    nameVi: 'Độ xe',
    icon: 'speedometer',
    color: '#fc642d',
  },
  {
    key: 'car_wash',
    name: 'Car Wash',
    nameVi: 'Rửa xe',
    icon: 'water',
    color: '#428bff',
  },
  {
    key: 'rescue',
    name: 'Rescue',
    nameVi: 'Cứu hộ',
    icon: 'warning',
    color: '#e00b41',
  },
];

// EV Charging (separate tab)
export const EV_CHARGING_CATEGORY: Category = {
  key: 'ev_charging',
  name: 'EV Charging',
  nameVi: 'Sạc EV',
  icon: 'flash',
  color: '#00d1b2',
};

// All categories including EV
export const ALL_CATEGORIES: Category[] = [...CATEGORIES, EV_CHARGING_CATEGORY];

export const getCategoryByKey = (key: string): Category | undefined => {
  return ALL_CATEGORIES.find((c) => c.key === key);
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
