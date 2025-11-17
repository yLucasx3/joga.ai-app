import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Field } from '../../types/activity.types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface FieldCardProps {
  field: Field;
  onPress: () => void;
  distance?: number;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onPress, distance }) => {
  const { name, establishment, amenities } = field;

  const formatDistance = (dist: number): string => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  };

  // Get establishment image or use placeholder
  const imageUrl = (establishment as any)?.imageUrl;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>🏟️</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.fieldName} numberOfLines={1}>
            {name}
          </Text>
          {distance !== undefined && (
            <Text style={styles.distance}>{formatDistance(distance)}</Text>
          )}
        </View>

        <Text style={styles.establishmentName} numberOfLines={1}>
          {establishment.name}
        </Text>

        <Text style={styles.address} numberOfLines={1}>
          {establishment.address.neighborhood}, {establishment.address.city}
        </Text>

        <View style={styles.footer}>
          <View style={styles.capacityBadge}>
            <Text style={styles.capacityIcon}>👥</Text>
            <Text style={styles.capacityText}>{field.capacity} players</Text>
          </View>

          {amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              {amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityDot} />
              ))}
              {amenities.length > 3 && (
                <Text style={styles.amenityMore}>+{amenities.length - 3}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray200,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  fieldName: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  distance: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  establishmentName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  capacityIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  capacityText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  amenityMore: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
  },
});
