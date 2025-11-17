import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ActivityListHeaderProps {
  count: number;
  activeFiltersCount?: number;
}

/**
 * ActivityListHeader component displaying activity count and metadata
 */
export const ActivityListHeader: React.FC<ActivityListHeaderProps> = ({
  count,
  activeFiltersCount = 0,
}) => {
  const activityText = count === 1 ? 'Activity' : 'Activities';
  const hasFilters = activeFiltersCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>
          {count} {activityText} Nearby
        </Text>
        {hasFilters && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  filterBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  filterBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray600,
  },
});
