import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  imageUri?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getSizeValue = (size: AvatarSize): number => {
  switch (size) {
    case 'small':
      return 32;
    case 'medium':
      return 40;
    case 'large':
      return 56;
    case 'xlarge':
      return 80;
    default:
      return 40;
  }
};

const getFontSize = (size: AvatarSize): number => {
  switch (size) {
    case 'small':
      return typography.fontSize.xs;
    case 'medium':
      return typography.fontSize.sm;
    case 'large':
      return typography.fontSize.lg;
    case 'xlarge':
      return typography.fontSize['2xl'];
    default:
      return typography.fontSize.sm;
  }
};

export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  name = '',
  size = 'medium',
  style,
}) => {
  const sizeValue = getSizeValue(size);
  const fontSize = getFontSize(size);

  const containerStyles = [
    styles.container,
    {
      width: sizeValue,
      height: sizeValue,
      borderRadius: sizeValue / 2,
    },
    style,
  ];

  if (imageUri) {
    return (
      <View style={containerStyles}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyles}>
      <Text style={[styles.initials, { fontSize }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.white,
    fontWeight: typography.fontWeight.semiBold,
  },
});
