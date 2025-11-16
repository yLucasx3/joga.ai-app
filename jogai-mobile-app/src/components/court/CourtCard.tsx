import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Court } from '../../types/activity.types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface CourtCardProps {
  court: Court;
  onPress: () => void;
  distance?: number;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onPress, distance }) => {
  const { name, imageUrl, establishment, amenities, sports } = court;

  const formatDistance = (dist: number): string => {
    if (dist < 1) {
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  };

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
          <Text style={styles.courtName} numberOfLines={1}>
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

        {amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            {amenities.slice(0, 4).map((amenity) => (
              <View key={amenity.key} style={styles.amenityChip}>
                <Text style={styles.amenityIcon}>{amenity.icon}</Text>
                <Text style={styles.amenityText} numberOfLines={1}>
                  {amenity.name}
                </Text>
              </View>
            ))}
            {amenities.length > 4 && (
              <View style={styles.amenityChip}>
                <Text style={styles.amenityText}>+{amenities.length - 4}</Text>
              </View>
            )}
          </View>
        )}

        {sports.length > 0 && (
          <View style={styles.sportsContainer}>
            {sports.slice(0, 5).map((sport) => (
              <Text key={sport.key} style={styles.sportIcon}>
                {sport.icon}
              </Text>
            ))}
            {sports.length > 5 && (
              <Text style={styles.sportMore}>+{sports.length - 5}</Text>
            )}
          </View>
        )}
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
  courtName: {
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
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  amenityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  amenityText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  sportsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sportIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  sportMore: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
