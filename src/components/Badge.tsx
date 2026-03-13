// ==========================================
// Badge Component
// ==========================================

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { borderRadius, spacing } from '../theme';

interface BadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  backgroundColor,
  size = 'small',
  style,
}) => {
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color,
            fontSize: isSmall ? 11 : 12,
            fontWeight: '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
