// ==========================================
// Avatar Component
// ==========================================

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getInitials } from '../utils/helpers';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  style?: ViewStyle;
}

const avatarColors = [
  '#4F46E5', '#7C3AED', '#EC4899', '#F59E0B',
  '#10B981', '#3B82F6', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316',
];

const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 44,
  style,
}) => {
  const { colors } = useTheme();
  const bgColor = getColorFromName(name);
  const fontSize = size * 0.38;

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          } as ImageStyle,
          style as ImageStyle,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize, lineHeight: fontSize * 1.3 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
