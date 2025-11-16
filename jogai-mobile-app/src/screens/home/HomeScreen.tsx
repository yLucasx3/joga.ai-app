/**
 * Home Screen
 * 
 * Main screen showing map with activity markers and bottom sheet with activity list
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { MapView } from '../../components/map/MapView';
import { ActivityCard } from '../../components/activity/ActivityCard';
import { DraggableBottomSheetSimple } from '../../components/common/DraggableBottomSheetSimple';
import { FilterChip } from '../../components/common/FilterChip';
import { useLocation } from '../../hooks/useLocation';
import { useNearbyActivities } from '../../hooks/useActivities';
import { Activity, ActivityType } from '../../types/activity.types';
import { SPORTS } from '../../constants/sports';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { location, loading: locationLoading } = useLocation();
  
  // Filters state
  const [selectedType, setSelectedType] = useState<ActivityType | undefined>(undefined);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  
  // Bottom sheet state
  const [sheetSnapPoint, setSheetSnapPoint] = useState<'MIN' | 'MID' | 'MAX'>('MID');

  // Build filters object
  const filters = useMemo(() => {
    const f: any = {};
    if (selectedType) f.type = selectedType;
    if (selectedSports.length > 0) f.sportKeys = selectedSports;
    f.status = 'ACTIVE'; // Only show active activities
    return f;
  }, [selectedType, selectedSports]);

  // Fetch nearby activities
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    refetch,
    isRefetching,
  } = useNearbyActivities(
    location?.latitude || 0,
    location?.longitude || 0,
    10, // 10km radius
    filters,
    undefined,
    !!location
  );

  const activities = activitiesData?.data || [];
  const isLoading = locationLoading || activitiesLoading;

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
  const handleMarkerPress = useCallback((activity: Activity) => {
    // Could scroll to the activity card or show a preview
    handleActivityPress(activity);
  }, [handleActivityPress]);

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Toggle activity type filter
   */
  const toggleTypeFilter = useCallback((type: ActivityType) => {
    setSelectedType((current) => (current === type ? undefined : type));
  }, []);

  /**
   * Toggle sport filter
   */
  const toggleSportFilter = useCallback((sportKey: string) => {
    setSelectedSports((current) => {
      if (current.includes(sportKey)) {
        return current.filter((key) => key !== sportKey);
      }
      return [...current, sportKey];
    });
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSelectedType(undefined);
    setSelectedSports([]);
  }, []);

  const hasFilters = selectedType || selectedSports.length > 0;

  /**
   * Handle bottom sheet snap point change
   */
  const handleSnapPointChange = useCallback((snapPoint: 'MIN' | 'MID' | 'MAX') => {
    setSheetSnapPoint(snapPoint);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        activities={activities}
        onMarkerPress={handleMarkerPress}
        userLocation={location}
        showUserLocation={true}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Draggable Bottom Sheet with Activities */}
      <DraggableBottomSheetSimple
        initialSnapPoint="MID"
        onSnapPointChange={handleSnapPointChange}
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {/* Type Filters */}
            <FilterChip
              label="Public"
              icon="🌍"
              selected={selectedType === 'PUBLIC'}
              onPress={() => toggleTypeFilter('PUBLIC')}
            />
            <FilterChip
              label="Private"
              icon="🔒"
              selected={selectedType === 'PRIVATE'}
              onPress={() => toggleTypeFilter('PRIVATE')}
            />

            {/* Sport Filters - Show first 5 sports */}
            {SPORTS.slice(0, 5).map((sport) => (
              <FilterChip
                key={sport.key}
                label={sport.name}
                icon={sport.icon}
                selected={selectedSports.includes(sport.key)}
                onPress={() => toggleSportFilter(sport.key)}
              />
            ))}

            {/* Clear filters */}
            {hasFilters && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Activities List */}
        <ScrollView
          style={styles.activitiesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'} Nearby
            </Text>
          </View>

          {/* Activities */}
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => handleActivityPress(activity)}
                showDistance={true}
                userLocation={location}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No activities found</Text>
              <Text style={styles.emptyStateText}>
                {hasFilters
                  ? 'Try adjusting your filters'
                  : 'Be the first to create an activity!'}
              </Text>
            </View>
          )}

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </DraggableBottomSheetSimple>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlayLight,
  },
  filtersContainer: {
    paddingVertical: spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.error,
  },
  activitiesList: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
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
  bottomPadding: {
    height: spacing.xl,
  },
});

export default HomeScreen;
