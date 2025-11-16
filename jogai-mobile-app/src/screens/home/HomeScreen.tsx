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
import { Dropdown, DropdownOption } from '../../components/common/Dropdown';
import { useLocation } from '../../hooks/useLocation';
import { useNearbyActivities } from '../../hooks/useActivities';
import { Activity } from '../../types/activity.types';
import { SPORTS } from '../../constants/sports';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { location, loading: locationLoading } = useLocation();
  
  // Filters state
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string>('10');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  


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

  // Build filters object
  const filters = useMemo(() => {
    const f: any = {};
    if (selectedType && selectedType !== 'ALL') f.type = selectedType;
    if (selectedSports.length > 0) f.sportKeys = selectedSports;
    
    // Date filter
    if (selectedDate !== 'ALL') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (selectedDate) {
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
  }, [selectedType, selectedSports, selectedDate]);

  // Fetch nearby activities
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    refetch,
    isRefetching,
  } = useNearbyActivities(
    location?.latitude || 0,
    location?.longitude || 0,
    parseInt(selectedDistance, 10), // Use selected distance
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
   * Handle activity type change
   */
  const handleTypeChange = useCallback((value: string | string[]) => {
    setSelectedType(value as string);
  }, []);

  /**
   * Handle sports change
   */
  const handleSportsChange = useCallback((value: string | string[]) => {
    setSelectedSports(value as string[]);
  }, []);

  /**
   * Handle distance change
   */
  const handleDistanceChange = useCallback((value: string | string[]) => {
    setSelectedDistance(value as string);
  }, []);

  /**
   * Handle date change
   */
  const handleDateChange = useCallback((value: string | string[]) => {
    setSelectedDate(value as string);
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSelectedType('ALL');
    setSelectedSports([]);
    setSelectedDistance('10');
    setSelectedDate('ALL');
  }, []);

  const hasFilters = 
    selectedType !== 'ALL' || 
    selectedSports.length > 0 || 
    selectedDistance !== '10' ||
    selectedDate !== 'ALL';

  /**
   * Handle bottom sheet snap point change
   */
  const handleSnapPointChange = useCallback((_snapPoint: 'MIN' | 'MID' | 'MAX') => {
    // Could be used to adjust map zoom or other UI elements
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
            {/* Activity Type Dropdown */}
            <Dropdown
              label="Activity Type"
              placeholder="All"
              options={activityTypeOptions}
              value={selectedType}
              onChange={handleTypeChange}
              icon="🎯"
            />

            {/* Sports Dropdown */}
            <Dropdown
              label="Sports"
              placeholder="All Sports"
              options={sportOptions}
              value={selectedSports}
              multiple
              onChange={handleSportsChange}
              icon="⚽"
            />

            {/* Distance Dropdown */}
            <Dropdown
              label="Distance"
              placeholder="10 km"
              options={distanceOptions}
              value={selectedDistance}
              onChange={handleDistanceChange}
              icon="📍"
            />

            {/* Date Dropdown */}
            <Dropdown
              label="When"
              placeholder="All"
              options={dateOptions}
              value={selectedDate}
              onChange={handleDateChange}
              icon="📅"
            />

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
    backgroundColor: colors.gray100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray600,
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
