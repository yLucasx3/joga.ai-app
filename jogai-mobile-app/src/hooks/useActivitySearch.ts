import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDebouncedValue } from './useDebouncedValue';
import { Activity } from '../types/activity.types';

const RECENT_SEARCHES_KEY = '@jogai:recent_searches';
const MAX_RECENT_SEARCHES = 10;

export interface UseActivitySearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  suggestions: string[];
  isSearching: boolean;
}

/**
 * Custom hook to manage search functionality with debouncing and history
 * 
 * @param activities - Optional list of activities for generating suggestions
 * @returns Search state and methods
 * 
 * @example
 * const { searchQuery, setSearchQuery, recentSearches } = useActivitySearch(activities);
 */
export function useActivitySearch(activities?: Activity[]): UseActivitySearchReturn {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounce search query for API calls (300ms delay)
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  // Track if search is in progress (query changed but not yet debounced)
  const isSearching = useMemo(() => {
    return searchQuery !== debouncedSearchQuery && searchQuery.trim() !== '';
  }, [searchQuery, debouncedSearchQuery]);

  /**
   * Load recent searches from AsyncStorage on mount
   */
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as string[];
          setRecentSearches(parsed);
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadRecentSearches();
  }, []);

  /**
   * Save recent searches to AsyncStorage when they change
   */
  useEffect(() => {
    if (!isLoaded) return;

    const saveRecentSearches = async () => {
      try {
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }
    };

    saveRecentSearches();
  }, [recentSearches, isLoaded]);

  /**
   * Add a search query to recent searches
   */
  const addRecentSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setRecentSearches((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmedQuery.toLowerCase());
      
      // Add to beginning and limit to MAX_RECENT_SEARCHES
      return [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  }, []);

  /**
   * Clear all recent searches
   */
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  /**
   * Generate search suggestions based on activities
   */
  const suggestions = useMemo(() => {
    if (!activities || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestionSet = new Set<string>();

    activities.forEach((activity) => {
      // Add activity title if it matches
      if (activity.title.toLowerCase().includes(query)) {
        suggestionSet.add(activity.title);
      }

      // Add establishment name if it matches
      if (activity.field.establishment.name.toLowerCase().includes(query)) {
        suggestionSet.add(activity.field.establishment.name);
      }

      // Add location address if it matches
      if (activity.location.address.toLowerCase().includes(query)) {
        suggestionSet.add(activity.location.address);
      }
    });

    // Convert to array and limit to 5 suggestions
    return Array.from(suggestionSet).slice(0, 5);
  }, [activities, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    suggestions,
    isSearching,
  };
}
