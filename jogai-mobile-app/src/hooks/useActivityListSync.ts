import { useRef, useCallback, useMemo } from 'react';
import { FlatList, ViewabilityConfig, ViewToken } from 'react-native';
import { Activity } from '../types/activity.types';

export interface UseActivityListSyncReturn {
  scrollToActivity: (activityId: string) => void;
  onViewableItemsChanged: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void;
  viewabilityConfig: ViewabilityConfig;
  listRef: React.RefObject<FlatList<Activity>>;
}

/**
 * Custom hook to synchronize activity list scroll position with map viewport
 * 
 * @param activities - List of activities
 * @param onVisibleActivitiesChange - Callback when visible activities change
 * @returns List sync utilities and refs
 * 
 * @example
 * const { listRef, scrollToActivity, onViewableItemsChanged } = useActivityListSync(
 *   activities,
 *   (ids) => updateMapMarkers(ids)
 * );
 */
export function useActivityListSync(
  activities: Activity[],
  onVisibleActivitiesChange: (activityIds: string[]) => void
): UseActivityListSyncReturn {
  const listRef = useRef<FlatList<Activity>>(null);

  /**
   * Scroll to a specific activity in the list
   */
  const scrollToActivity = useCallback(
    (activityId: string) => {
      const index = activities.findIndex((activity) => activity.id === activityId);
      
      if (index !== -1 && listRef.current) {
        listRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, // Center the item in the viewport
        });
      }
    },
    [activities]
  );

  /**
   * Handle viewable items changed event
   */
  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const visibleActivityIds = info.viewableItems
        .map((item) => (item.item as Activity)?.id)
        .filter(Boolean);
      
      onVisibleActivitiesChange(visibleActivityIds);
    },
    [onVisibleActivitiesChange]
  );

  /**
   * Viewability configuration for FlatList
   * An item is considered viewable when at least 50% of it is visible
   */
  const viewabilityConfig = useMemo<ViewabilityConfig>(
    () => ({
      itemVisiblePercentThreshold: 50,
      minimumViewTime: 100, // ms
      waitForInteraction: false,
    }),
    []
  );

  return {
    scrollToActivity,
    onViewableItemsChanged,
    viewabilityConfig,
    listRef,
  };
}
