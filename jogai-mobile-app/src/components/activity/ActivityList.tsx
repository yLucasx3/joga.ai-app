import React, { forwardRef } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  Text,
} from 'react-native';
import { ActivityCard } from './ActivityCard';
import { Activity } from '../../types/activity.types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onActivityPress: (activity: Activity) => void;
  selectedActivityId: string | null;
  userLocation: { latitude: number; longitude: number } | null;
  onViewableItemsChanged?: (info: { viewableItems: any[]; changed: any[] }) => void;
  viewabilityConfig?: any;
}

/**
 * ActivityList component with optimized FlatList rendering
 */
export const ActivityList = forwardRef<FlatList<Activity>, ActivityListProps>(
  (
    {
      activities,
      isLoading,
      isRefreshing,
      onRefresh,
      onActivityPress,
      selectedActivityId,
      userLocation,
      onViewableItemsChanged,
      viewabilityConfig,
    },
    ref
  ) => {
    /**
     * Render activity card item
     */
    const renderItem = ({ item }: { item: Activity }) => (
      <ActivityCard
        activity={item}
        onPress={() => onActivityPress(item)}
        showDistance={true}
        userLocation={userLocation}
        isSelected={item.id === selectedActivityId}
      />
    );

    /**
     * Key extractor for FlatList
     */
    const keyExtractor = (item: Activity) => item.id;

    /**
     * Empty state component
     */
    const renderEmptyComponent = () => {
      if (isLoading) return null;

      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No activities found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your filters or check back later
          </Text>
        </View>
      );
    };

    /**
     * Footer component for bottom padding
     */
    const renderFooterComponent = () => <View style={styles.footer} />;

    return (
      <FlatList
        ref={ref}
        data={activities}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooterComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        // Performance optimizations
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        removeClippedSubviews={true}
        // Viewability tracking
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    );
  }
);

ActivityList.displayName = 'ActivityList';

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    height: spacing.xl,
  },
});
