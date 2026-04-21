// XE 247 Design System - Inspired by Airbnb
// Based on DESIGN.md specifications

export const Colors = {
  light: {
    // Primary Brand
    primary: '#ff385c', // Rausch Red
    primaryDark: '#e00b41', // Deep Rausch

    // Text Scale
    text: '#222222', // Near Black (warm, not cold)
    textSecondary: '#6a6a6a', // Secondary Gray
    textTertiary: '#717171', // Tertiary
    textDisabled: 'rgba(0,0,0,0.24)', // Disabled

    // Surfaces
    background: '#ffffff', // Pure White
    surface: '#f7f7f7', // Light Surface
    surfaceSecondary: '#f2f2f2', // Circular nav buttons

    // Interactive
    border: '#dddddd', // Border Gray
    borderLight: '#ebebeb', // Light border

    // Feedback
    success: '#008a05', // Green
    warning: '#c13515', // Warning/Error
    error: '#c13515', // Error Red
    star: '#ff385c', // Rating star (brand color)

    // Premium tiers
    luxe: '#460479', // Luxe Purple
    plus: '#92174d', // Plus Magenta
  },
  dark: {
    primary: '#ff385c',
    primaryDark: '#e00b41',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#717171',
    textDisabled: 'rgba(255,255,255,0.24)',
    background: '#000000',
    surface: '#1a1a1a',
    surfaceSecondary: '#262626',
    border: '#333333',
    borderLight: '#2a2a2a',
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
    star: '#ff385c',
    luxe: '#460479',
    plus: '#92174d',
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const FontSize = {
  micro: 8, // Micro uppercase
  badge: 11, // Badge
  tag: 12, // Tags, prices
  small: 13, // Small descriptions
  body: 14, // Body/Link
  button: 16, // Button, UI
  feature: 18, // Feature titles
  cardHeading: 20, // Card headings
  subheading: 22, // Sub-headings
  heading: 28, // Section headings
  display: 32, // Display
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BorderRadius = {
  xs: 4, // Small links
  sm: 8, // Buttons, tabs
  md: 12, // Medium elements
  lg: 14, // Badges
  xl: 16, // Cards
  xxl: 20, // Feature cards
  xxxl: 32, // Large containers
  full: 9999, // Circle/Pill
};

// Airbnb's three-layer shadow system
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};

// Category icons and colors
export const CategoryConfig = {
  repair: {
    icon: 'construct',
    label: 'Sửa chữa',
    color: '#ff385c',
  },
  car_wash: {
    icon: 'car-sport',
    label: 'Rửa xe',
    color: '#00a699',
  },
  car_parts: {
    icon: 'cog',
    label: 'Phụ tùng',
    color: '#fc642d',
  },
  ev_charging: {
    icon: 'flash',
    label: 'Sạc EV',
    color: '#00d1b2',
  },
  gas_station: {
    icon: 'flame',
    label: 'Trạm xăng',
    color: '#767676',
  },
};
