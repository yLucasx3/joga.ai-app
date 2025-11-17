import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Dropdown, DropdownOption } from '../common/Dropdown';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { FilterState } from '../../hooks/useActivityFilters';

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  activityTypeOptions: DropdownOption[];
  sportOptions: DropdownOption[];
  distanceOptions: DropdownOption[];
  dateOptions: DropdownOption[];
}

/**
 * FilterBar component for displaying and managing activity filters
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  activityTypeOptions,
  sportOptions,
  distanceOptions,
  dateOptions,
}) => {
  const hasFilters = activeFiltersCount > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Activity Type Dropdown */}
        <Dropdown
          label="Activity Type"
          placeholder="All"
          options={activityTypeOptions}
          value={filters.type}
          onChange={(value) => onFilterChange('type', value as string)}
          icon="🎯"
        />

        {/* Sports Dropdown */}
        <Dropdown
          label="Sports"
          placeholder="All Sports"
          options={sportOptions}
          value={filters.sports}
          multiple
          onChange={(value) => onFilterChange('sports', value as string[])}
          icon="⚽"
        />

        {/* Distance Dropdown */}
        <Dropdown
          label="Distance"
          placeholder="10 km"
          options={distanceOptions}
          value={filters.distance}
          onChange={(value) => onFilterChange('distance', value as string)}
          icon="📍"
        />

        {/* Date Dropdown */}
        <Dropdown
          label="When"
          placeholder="All"
          options={dateOptions}
          value={filters.date}
          onChange={(value) => onFilterChange('date', value as string)}
          icon="📅"
        />

        {/* Clear filters button */}
        {hasFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  filterBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  filterBadgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
});
