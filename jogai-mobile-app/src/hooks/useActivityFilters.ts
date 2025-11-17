import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDebouncedValue } from './useDebouncedValue';
import { ActivityType } from '../types/activity.types';

const FILTER_STORAGE_KEY = '@jogai:activity_filters';

export type SortOption = 'date-asc' | 'date-desc' | 'distance-asc' | 'popularity-desc';

export interface FilterState {
  type: string;
  sports: string[];
  distance: string;
  date: string;
  search: string;
  sortBy: SortOption;
}

export interface UseActivityFiltersReturn {
  filters: FilterState;
  activeFiltersCount: number;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof FilterState) => void;
  isDefaultFilters: boolean;
  debouncedFilters: FilterState;
}

const DEFAULT_FILTERS: FilterState = {
  type: 'ALL',
  sports: [],
  distance: '10',
  date: 'ALL',
  search: '',
  sortBy: 'date-asc',
};

/**
 * Custom hook to manage activity filter state with persistence and debouncing
 * 
 * @param initialFilters - Optional initial filter values
 * @returns Filter state and methods to manipulate filters
 * 
 * @example
 * const { filters, setFilter, clearFilters, activeFiltersCount } = useActivityFilters();
 */
export function useActivityFilters(
  initialFilters?: Partial<FilterState>
): UseActivityFiltersReturn {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounce filters for API calls (300ms delay)
  const debouncedFilters = useDebouncedValue(filters, 300);

  /**
   * Load saved filters from AsyncStorage on mount
   */
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters) as FilterState;
          // Reset location-based filters on app restart
          setFilters({
            ...parsed,
            distance: DEFAULT_FILTERS.distance,
          });
        }
      } catch (error) {
        console.error('Error loading filters from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFilters();
  }, []);

  /**
   * Save filters to AsyncStorage when they change
   * Debounced to avoid excessive I/O
   */
  useEffect(() => {
    if (!isLoaded) return;

    const saveFilters = async () => {
      try {
        await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
      } catch (error) {
        console.error('Error saving filters to storage:', error);
      }
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveFilters, 500);
    return () => clearTimeout(timeoutId);
  }, [filters, isLoaded]);

  /**
   * Set a single filter value
   */
  const setFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Clear all filters to default values
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /**
   * Clear a specific filter to its default value
   */
  const clearFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: DEFAULT_FILTERS[key],
    }));
  }, []);

  /**
   * Calculate the number of active (non-default) filters
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    if (filters.type !== DEFAULT_FILTERS.type) count++;
    if (filters.sports.length > 0) count++;
    if (filters.distance !== DEFAULT_FILTERS.distance) count++;
    if (filters.date !== DEFAULT_FILTERS.date) count++;
    if (filters.search.trim() !== '') count++;
    if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count++;
    
    return count;
  }, [filters]);

  /**
   * Check if all filters are at default values
   */
  const isDefaultFilters = useMemo(() => {
    return activeFiltersCount === 0;
  }, [activeFiltersCount]);

  return {
    filters,
    activeFiltersCount,
    setFilter,
    clearFilters,
    clearFilter,
    isDefaultFilters,
    debouncedFilters,
  };
}
