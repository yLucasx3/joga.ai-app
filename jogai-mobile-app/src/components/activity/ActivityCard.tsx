import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Activity, ActivityStatus } from '../../types/activity.types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Badge, BadgeVariant } from '../common/Badge';
import { getSportByKey } from '../../constants/sports';
import { formatDateTime } from '../../utils/date.utils';
import { locationService } from '../../services/location.service';

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  showDistance?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
}

/**
 * Activity card component for displaying activity information
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  showDistance = true,
  userLocation,
}) => {
  const sport = getSportByKey(activity.sportKey);
  const availableSpots = activity.maxPlayers - activity.currentPlayers;
  const isFull = availableSpots <= 0;

  /**
   * Get status badge configuration
   */
  const getStatusBadge = (): { label: string; variant: BadgeVariant } => {
    switch (activity.status) {
      case 'ACTIVE':
        if (isFull) {
          return { label: 'Full', variant: 'error' };
        }
        return { label: 'Open', variant: 'success' };
      case 'FULL':
        return { label: 'Full', variant: 'error' };
      case 'CANCELLED':
        return { label: 'Cancelled', variant: 'default' };
      case 'COMPLETED':
        return { label: 'Completed', variant: 'info' };
      default:
        return { label: 'Unknown', variant: 'default' };
    }
  };

  /**
   * Calculate distance from user location
   */
  const getDistance = (): string | null => {
    if (!showDistance || !userLocation) return null;

    const distance = locationService.calculateDistance(userLocation, activity.location);
    return locationService.formatDistance(distance);
  };

  const statusBadge = getStatusBadge();
  const distance = getDistance();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image */}
      {activity.field.imageUrl ? (
        <Image
          source={{ uri: activity.field.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>{sport?.icon || '⚽'}</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.sportIcon}>{sport?.icon || '⚽'}</Text>
            <Text style={styles.sportName}>{sport?.name || 'Sport'}</Text>
          </View>
          <Badge label={statusBadge.label} variant={statusBadge.variant} />
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {activity.title}
        </Text>

        {/* Location */}
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText} numberOfLines={1}>
            {activity.field.establishment.name}
          </Text>
          {distance && (
            <Text style={styles.distance}>• {distance}</Text>
          )}
        </View>

        {/* Date and Time */}
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🕐</Text>
          <Text style={styles.infoText}>
            {formatDateTime(activity.startDate)}
          </Text>
        </View>

        {/* Players */}
        <View style={styles.footer}>
          <View style={styles.playersInfo}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={styles.playersText}>
              {activity.currentPlayers}/{activity.maxPlayers} players
            </Text>
          </View>
          {!isFull && activity.status === 'ACTIVE' && (
            <Text style={styles.spotsAvailable}>
              {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} left
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  imagePlaceholder: {
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sportIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  sportName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  distance: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  playersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playersText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  spotsAvailable: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.success,
  },
});
