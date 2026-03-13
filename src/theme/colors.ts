// ==========================================
// Color System — Light & Dark Themes
// ==========================================

export const lightColors = {
  // Primary palette
  primary: '#4F46E5',        // Indigo-600
  primaryLight: '#818CF8',   // Indigo-400
  primaryDark: '#3730A3',    // Indigo-800
  primaryBg: '#EEF2FF',      // Indigo-50

  // Accent
  accent: '#F59E0B',         // Amber-500
  accentLight: '#FCD34D',    // Amber-300
  accentDark: '#D97706',     // Amber-600

  // Semantic
  success: '#10B981',        // Emerald-500
  successLight: '#D1FAE5',   // Emerald-100
  warning: '#F59E0B',        // Amber-500
  warningLight: '#FEF3C7',   // Amber-100
  error: '#EF4444',          // Red-500
  errorLight: '#FEE2E2',     // Red-100
  info: '#3B82F6',           // Blue-500
  infoLight: '#DBEAFE',      // Blue-100

  // Background
  background: '#F8FAFC',     // Slate-50
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9', // Slate-100

  // Text
  textPrimary: '#0F172A',    // Slate-900
  textSecondary: '#475569',  // Slate-600
  textTertiary: '#94A3B8',   // Slate-400
  textInverse: '#FFFFFF',

  // Border
  border: '#E2E8F0',         // Slate-200
  borderLight: '#F1F5F9',    // Slate-100
  divider: '#E2E8F0',

  // Misc
  overlay: 'rgba(15, 23, 42, 0.5)',
  shadow: 'rgba(15, 23, 42, 0.08)',
  cardShadow: 'rgba(15, 23, 42, 0.06)',
  tabBarBg: '#FFFFFF',
  statusBar: 'dark-content',
};

export const darkColors = {
  // Primary palette
  primary: '#818CF8',        // Indigo-400
  primaryLight: '#A5B4FC',   // Indigo-300
  primaryDark: '#4F46E5',    // Indigo-600
  primaryBg: '#1E1B4B',      // Indigo-950

  // Accent
  accent: '#FBBF24',         // Amber-400
  accentLight: '#FDE68A',    // Amber-200
  accentDark: '#F59E0B',     // Amber-500

  // Semantic
  success: '#34D399',        // Emerald-400
  successLight: '#064E3B',   // Emerald-900
  warning: '#FBBF24',        // Amber-400
  warningLight: '#78350F',   // Amber-900
  error: '#F87171',          // Red-400
  errorLight: '#7F1D1D',     // Red-900
  info: '#60A5FA',           // Blue-400
  infoLight: '#1E3A5F',      // Blue-900

  // Background
  background: '#0F172A',     // Slate-900
  surface: '#1E293B',        // Slate-800
  surfaceVariant: '#334155', // Slate-700

  // Text
  textPrimary: '#F1F5F9',    // Slate-100
  textSecondary: '#94A3B8',  // Slate-400
  textTertiary: '#64748B',   // Slate-500
  textInverse: '#0F172A',    // Slate-900

  // Border
  border: '#334155',         // Slate-700
  borderLight: '#1E293B',    // Slate-800
  divider: '#334155',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  cardShadow: 'rgba(0, 0, 0, 0.25)',
  tabBarBg: '#1E293B',
  statusBar: 'light-content',
};

export type ThemeColors = typeof lightColors;
