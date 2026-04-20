import { Ionicons } from '@expo/vector-icons';

export type CategoryKey =
  | 'repair'
  | 'maintenance'
  | 'car_wash'
  | 'tire'
  | 'battery'
  | 'ev_charging'
  | 'parts'
  | 'towing'
  | 'insurance';

export interface Category {
  key: CategoryKey;
  name: string;
  nameVi: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    key: 'repair',
    name: 'Repair',
    nameVi: 'Sửa chữa',
    icon: 'build',
    color: '#FF6B35',
  },
  {
    key: 'maintenance',
    name: 'Maintenance',
    nameVi: 'Bảo dưỡng',
    icon: 'settings',
    color: '#4CAF50',
  },
  {
    key: 'car_wash',
    name: 'Car Wash',
    nameVi: 'Rửa xe',
    icon: 'water',
    color: '#2196F3',
  },
  {
    key: 'tire',
    name: 'Tire',
    nameVi: 'Lốp xe',
    icon: 'ellipse-outline',
    color: '#607D8B',
  },
  {
    key: 'battery',
    name: 'Battery',
    nameVi: 'Ắc quy',
    icon: 'battery-charging',
    color: '#FFC107',
  },
  {
    key: 'ev_charging',
    name: 'EV Charging',
    nameVi: 'Sạc điện',
    icon: 'flash',
    color: '#00BCD4',
  },
  {
    key: 'parts',
    name: 'Parts',
    nameVi: 'Phụ tùng',
    icon: 'cube',
    color: '#9C27B0',
  },
  {
    key: 'towing',
    name: 'Towing',
    nameVi: 'Cứu hộ',
    icon: 'car-sport',
    color: '#F44336',
  },
  {
    key: 'insurance',
    name: 'Insurance',
    nameVi: 'Bảo hiểm',
    icon: 'shield-checkmark',
    color: '#3F51B5',
  },
];

export const getCategoryByKey = (key: string): Category | undefined => {
  return CATEGORIES.find((c) => c.key === key);
};
