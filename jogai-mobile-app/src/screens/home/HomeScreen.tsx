/**
 * Home Screen
 * 
 * Main screen showing map with activity markers and bottom sheet with activity list
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { MapView } from '../../components/map/MapView';
import { MapControls } from '../../components/map/MapControls';
import { DraggableBottomSheetSimple } from '../../components/common/DraggableBottomSheetSimple';
import { DropdownOption } from '../../components/common/Dropdown';
import { FilterBar } from '../../components/filters/FilterBar';
import { SearchInput } from '../../components/filters/SearchInput';
import { FilterChips, FilterChip } from '../../components/filters/FilterChips';
import { ActivityList } from '../../components/activity/ActivityList';
import { ActivityListHeader } from '../../components/activity/ActivityListHeader';
import { ActivityCardSkeleton } from '../../components/activity/ActivityCardSkeleton';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { useLocation } from '../../hooks/useLocation';
import { useNearbyActivities } from '../../hooks/useActivities';
import { useActivityFilters } from '../../hooks/useActivityFilters';
import { useActivityMap } from '../../hooks/useActivityMap';
import { useActivitySearch } from '../../hooks/useActivitySearch';
import { useActivityListSync } from '../../hooks/useActivityListSync';
import { Activity } from '../../types/activity.types';
import { SPORTS } from '../../constants/sports';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { location, loading: locationLoading } = useLocation();
  
  // Use custom hooks for state management
  const {
    filters,
    activeFiltersCount,
    setFilter,
    clearFilters: clearAllFilters,
    debouncedFilters,
  } = useActivityFilters();
  


  // Activity type options
  const activityTypeOptions: DropdownOption[] = [
    { label: 'All', value: 'ALL', icon: '🌐' },
    { label: 'Public', value: 'PUBLIC', icon: '🌍' },
    { label: 'Private', value: 'PRIVATE', icon: '🔒' },
  ];

  // Sport options
  const sportOptions: DropdownOption[] = SPORTS.map((sport) => ({
    label: sport.name,
    value: sport.key,
    icon: sport.icon,
  }));

  // Distance options
  const distanceOptions: DropdownOption[] = [
    { label: '1 km', value: '1', icon: '📍' },
    { label: '5 km', value: '5', icon: '📍' },
    { label: '10 km', value: '10', icon: '📍' },
    { label: '25 km', value: '25', icon: '📍' },
    { label: '50 km', value: '50', icon: '📍' },
  ];

  // Date options
  const dateOptions: DropdownOption[] = [
    { label: 'All', value: 'ALL', icon: '📅' },
    { label: 'Today', value: 'TODAY', icon: '📅' },
    { label: 'Tomorrow', value: 'TOMORROW', icon: '📅' },
    { label: 'This Week', value: 'WEEK', icon: '📅' },
    { label: 'This Month', value: 'MONTH', icon: '📅' },
  ];

  // Build API filters object from filter state
  const apiFilters = useMemo(() => {
    const f: any = {};
    if (debouncedFilters.type && debouncedFilters.type !== 'ALL') {
      f.type = debouncedFilters.type;
    }
    if (debouncedFilters.sports.length > 0) {
      f.sportKeys = debouncedFilters.sports;
    }
    
    // Date filter
    if (debouncedFilters.date !== 'ALL') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (debouncedFilters.date) {
        case 'TODAY':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'TOMORROW':
          startDate = new Date(now.setDate(now.getDate() + 1));
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'WEEK':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setDate(now.getDate() + 7));
          break;
        case 'MONTH':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setMonth(now.getMonth() + 1));
          break;
        default:
          startDate = now;
          endDate = now;
      }

      f.startDate = startDate.toISOString();
      f.endDate = endDate.toISOString();
    }
    
    f.status = 'ACTIVE'; // Only show active activities
    return f;
  }, [debouncedFilters]);

  // Fetch nearby activities
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    refetch,
    isRefetching,
  } = useNearbyActivities(
    location?.latitude || 0,
    location?.longitude || 0,
    parseInt(debouncedFilters.distance, 10),
    apiFilters,
    undefined,
    !!location
  );

  const activities = activitiesData?.activities || [];
  const isLoading = locationLoading || activitiesLoading;

  // Use map hook for map state management
  const {
    mapState,
    centerOnActivity,
    centerOnUser,
    selectMarker,
    setMapZoom,
    updateVisibleMarkers,
  } = useActivityMap(activities, location);

  // Use search hook
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    addRecentSearch,
  } = useActivitySearch(activities);

  // Track selected activity for highlighting
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Use list sync hook for map/list synchronization
  const { listRef, scrollToActivity, onViewableItemsChanged, viewabilityConfig } =
    useActivityListSync(activities, updateVisibleMarkers);

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return activities;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return activities.filter(
      (activity) =>
        activity.title.toLowerCase().includes(query) ||
        activity.field.establishment.name.toLowerCase().includes(query) ||
        activity.field.establishment.address.street.toLowerCase().includes(query)
    );
  }, [activities, debouncedSearchQuery]);

  /**
   * Handle activity card press
   */
  const handleActivityPress = useCallback((activity: Activity) => {
    // @ts-ignore - Navigation typing issue with nested navigators
    navigation.navigate('ActivityDetails', { activityId: activity.id });
  }, [navigation]);

  /**
   * Handle marker press
   */
  const handleMarkerPress = useCallback(
    (activity: Activity) => {
      // Select marker and center on activity
      selectMarker(activity.id);
      centerOnActivity(activity);
      setSelectedActivityId(activity.id);

      // Scroll list to show the activity
      scrollToActivity(activity.id);

      // Clear selection after 3 seconds
      setTimeout(() => {
        setSelectedActivityId(null);
      }, 3000);
    },
    [selectMarker, centerOnActivity, scrollToActivity]
  );

  /**
   * Handle activity card press - also centers map
   */
  const handleActivityCardPress = useCallback(
    (activity: Activity) => {
      // Center map on activity
      centerOnActivity(activity);
      selectMarker(activity.id);

      // Navigate to details
      handleActivityPress(activity);
    },
    [centerOnActivity, selectMarker, handleActivityPress]
  );

  /**
   * Handle search submit
   */
  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
    }
  }, [searchQuery, addRecentSearch]);

  /**
   * Handle zoom in
   */
  const handleZoomIn = useCallback(() => {
    setMapZoom(mapState.zoom + 1);
  }, [mapState.zoom, setMapZoom]);

  /**
   * Handle zoom out
   */
  const handleZoomOut = useCallback(() => {
    setMapZoom(mapState.zoom - 1);
  }, [mapState.zoom, setMapZoom]);

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback(
    <K extends keyof typeof filters>(key: K, value: typeof filters[K]) => {
      setFilter(key, value);
    },
    [setFilter]
  );

  /**
   * Generate filter chips from active filters
   */
  const filterChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    // Type filter
    if (filters.type !== 'ALL') {
      const option = activityTypeOptions.find((opt) => opt.value === filters.type);
      if (option) {
        chips.push({
          key: 'type',
          label: option.label,
          value: filters.type,
        });
      }
    }

    // Sports filters
    filters.sports.forEach((sportKey) => {
      const sport = SPORTS.find((s) => s.key === sportKey);
      if (sport) {
        chips.push({
          key: 'sports',
          label: sport.name,
          value: sportKey,
        });
      }
    });

    // Distance filter
    if (filters.distance !== '10') {
      const option = distanceOptions.find((opt) => opt.value === filters.distance);
      if (option) {
        chips.push({
          key: 'distance',
          label: option.label,
          value: filters.distance,
        });
      }
    }

    // Date filter
    if (filters.date !== 'ALL') {
      const option = dateOptions.find((opt) => opt.value === filters.date);
      if (option) {
        chips.push({
          key: 'date',
          label: option.label,
          value: filters.date,
        });
      }
    }

    return chips;
  }, [filters, activityTypeOptions, distanceOptions, dateOptions]);

  /**
   * Handle filter chip removal
   */
  const handleRemoveFilterChip = useCallback(
    (chipKey: string, chipValue: string) => {
      if (chipKey === 'sports') {
        // Remove specific sport from array
        const newSports = filters.sports.filter((s) => s !== chipValue);
        setFilter('sports', newSports);
      } else if (chipKey === 'type') {
        setFilter('type', 'ALL');
      } else if (chipKey === 'distance') {
        setFilter('distance', '10');
      } else if (chipKey === 'date') {
        setFilter('date', 'ALL');
      }
    },
    [filters.sports, setFilter]
  );

  /**
   * Handle bottom sheet snap point change
   */
  const handleSnapPointChange = useCallback((_snapPoint: 'MIN' | 'MID' | 'MAX') => {
    // Could be used to adjust map zoom or other UI elements
  }, []);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* Map */}
        <MapView
          activities={filteredActivities}
          onMarkerPress={handleMarkerPress}
          userLocation={location}
          showUserLocation={true}
        />

        {/* Map Controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenterOnUser={centerOnUser}
          userLocation={location}
        />

        {/* Draggable Bottom Sheet with Activities */}
        <DraggableBottomSheetSimple
          initialSnapPoint="MID"
          onSnapPointChange={handleSnapPointChange}
        >
          {/* Search Input */}
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search activities..."
            onBlur={handleSearchSubmit}
          />

          {/* Filter Chips */}
          <FilterChips chips={filterChips} onRemove={handleRemoveFilterChip} />

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearAllFilters}
            activeFiltersCount={activeFiltersCount}
            activityTypeOptions={activityTypeOptions}
            sportOptions={sportOptions}
            distanceOptions={distanceOptions}
            dateOptions={dateOptions}
          />

          {/* Activity List Header */}
          <ActivityListHeader
            count={filteredActivities.length}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Loading Skeletons */}
          {isLoading && <ActivityCardSkeleton count={5} />}

          {/* Activities List */}
          {!isLoading && (
            <ActivityList
              ref={listRef}
              activities={filteredActivities}
              isLoading={isLoading}
              isRefreshing={isRefetching}
              onRefresh={handleRefresh}
              onActivityPress={handleActivityCardPress}
              selectedActivityId={selectedActivityId}
              userLocation={location}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
            />
          )}
        </DraggableBottomSheetSimple>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default HomeScreen;
