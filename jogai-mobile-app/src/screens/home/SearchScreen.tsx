/**
 * Search Screen
 * 
 * Screen for searching and filtering activities
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Input } from '../../components/common/Input';
import { FilterChip } from '../../components/common/FilterChip';
import { ActivityCard } from '../../components/activity/ActivityCard';
import { useSearchActivities } from '../../hooks/useActivities';
import { useLocation } from '../../hooks/useLocation';
import { Activity, ActivityType } from '../../types/activity.types';
import { SPORTS } from '../../constants/sports';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { location } = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Filters state
  const [selectedType, setSelectedType] = useState<ActivityType | undefined>(undefined);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [showAllSports, setShowAllSports] = useState(false);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters = useMemo(() => {
    const f: any = {};
    if (selectedType) f.type = selectedType;
    if (selectedSports.length > 0) f.sportKeys = selectedSports;
    f.status = 'ACTIVE'; // Only show active activities
    return f;
  }, [selectedType, selectedSports]);

  // Search activities
  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchActivities(
    debouncedQuery,
    filters,
    undefined,
    debouncedQuery.length >= 2
  );

  const activities = searchData?.data || [];
  const showResults = debouncedQuery.length >= 2;

  /**
   * Handle activity press
   */
  const handleActivityPress = useCallback(
    (activity: Activity) => {
      // @ts-ignore - Navigation typing issue with nested navigators
      navigation.navigate('ActivityDetails', { activityId: activity.id });
    },
    [navigation]
  );

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

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const hasFilters = selectedType || selectedSports.length > 0;
  const sportsToShow = showAllSports ? SPORTS : SPORTS.slice(0, 8);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search activities, locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
          rightIcon={
            searchQuery.length > 0 ? (
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            ) : undefined
          }
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterTitle}>Filters</Text>

        {/* Type Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Activity Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChips}
          >
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
          </ScrollView>
        </View>

        {/* Sport Filters */}
        <View style={styles.filterGroup}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterLabel}>Sports</Text>
            <TouchableOpacity onPress={() => setShowAllSports(!showAllSports)}>
              <Text style={styles.showMoreText}>
                {showAllSports ? 'Show Less' : 'Show All'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChips}
          >
            {sportsToShow.map((sport) => (
              <FilterChip
                key={sport.key}
                label={sport.name}
                icon={sport.icon}
                selected={selectedSports.includes(sport.key)}
                onPress={() => toggleSportFilter(sport.key)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Clear Filters */}
        {hasFilters && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {!showResults ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>Search for activities</Text>
            <Text style={styles.emptyStateText}>
              Enter at least 2 characters to search
            </Text>
          </View>
        ) : isLoading || isFetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : activities.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {activities.length} {activities.length === 1 ? 'Result' : 'Results'}
              </Text>
            </View>
            <FlatList
              data={activities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ActivityCard
                  activity={item}
                  onPress={() => handleActivityPress(item)}
                  showDistance={true}
                  userLocation={location}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>😕</Text>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchIcon: {
    fontSize: 20,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  filtersSection: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filterGroup: {
    marginBottom: spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  showMoreText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  filterChips: {
    paddingHorizontal: spacing.md,
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  clearFiltersText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  resultsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default SearchScreen;
