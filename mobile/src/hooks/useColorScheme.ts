import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export function useColorScheme() {
  const colorScheme = useRNColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    colors,
    isDark,
  };
}
