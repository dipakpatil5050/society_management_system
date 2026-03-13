// ==========================================
// ListItem Component
// ==========================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing, borderRadius, typography } from '../theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  borderBottom?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  showChevron = false,
  onPress,
  style,
  borderBottom = true,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={[
        styles.container,
        borderBottom && { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
        style,
      ]}
    >
      {leftElement && <View style={styles.left}>{leftElement}</View>}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textTertiary}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  left: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.label,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  right: {
    marginLeft: spacing.sm,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
});
