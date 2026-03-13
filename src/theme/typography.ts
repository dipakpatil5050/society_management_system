// ==========================================
// Typography System
// ==========================================

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Display
  h1: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  // Body
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },

  // Labels
  label: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },

  // Button
  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },

  // Caption
  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14,
  },

  // Overline  
  overline: {
    fontFamily,
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
};
