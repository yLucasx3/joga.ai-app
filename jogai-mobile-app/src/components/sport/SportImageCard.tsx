import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface SportImageCardProps {
  sport: {
    key: string;
    name: string;
    icon: string;
    imageUrl?: string;
  };
  isSelected: boolean;
  onPress: () => void;
}

export const SportImageCard: React.FC<SportImageCardProps> = ({
  sport,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {sport.imageUrl ? (
        <Image source={{ uri: sport.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderIcon}>{sport.icon}</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <View style={styles.overlay} />

      {/* Sport Name */}
      <View style={styles.content}>
        <Text style={styles.sportName}>{sport.name}</Text>
      </View>

      {/* Selection Indicator */}
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 180,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray300,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray200,
  },
  placeholderIcon: {
    fontSize: 64,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  sportName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  checkmarkIcon: {
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});
