// ==========================================
// Theme Hook — useTheme
// ==========================================

import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { lightColors, darkColors, ThemeColors } from '../theme';

export interface ThemeContextValue {
  colors: ThemeColors;
  isDarkMode: boolean;
}

export const useTheme = (): ThemeContextValue => {
  const isDarkMode = useAppSelector((state) => state.ui.isDarkMode);

  const colors = useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode]);

  return { colors, isDarkMode };
};
