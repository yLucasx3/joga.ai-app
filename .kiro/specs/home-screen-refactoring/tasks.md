# Implementation Plan

- [x] 1. Create useDebouncedValue Utility Hook
  - Create `jogai-mobile-app/src/hooks/useDebouncedValue.ts`
  - Implement generic debouncing logic with configurable delay
  - Use useEffect and setTimeout for debouncing
  - Clean up timeout on unmount or value change
  - Export TypeScript interface for hook parameters
  - _Requirements: 1.3_

- [x] 2. Create useActivityFilters Hook
  - Create `jogai-mobile-app/src/hooks/useActivityFilters.ts`
  - Implement filter state management with useState
  - Add debouncing logic using custom useDebouncedValue hook (300ms delay)
  - Implement AsyncStorage persistence for filter preferences
  - Calculate activeFiltersCount based on non-default values
  - Add clearFilters and clearFilter methods
  - Export TypeScript interfaces for FilterState and UseActivityFiltersReturn
  - _Requirements: 1.3, 2.1, 4.1_

- [x] 3. Create useActivityMap Hook
  - Create `jogai-mobile-app/src/hooks/useActivityMap.ts`
  - Implement map state management (center, zoom, selectedMarkerId)
  - Add methods for setMapCenter, setMapZoom, selectMarker
  - Implement centerOnActivity method to focus map on specific activity
  - Implement centerOnUser method to focus map on user location
  - Add updateVisibleMarkers method to track markers in viewport
  - Track user interaction state (isUserInteracting)
  - _Requirements: 2.2, 7.1, 7.2, 7.3_

- [x] 4. Create useActivitySearch Hook
  - Create `jogai-mobile-app/src/hooks/useActivitySearch.ts`
  - Implement search query state with debouncing (300ms)
  - Add AsyncStorage integration for recent searches (max 10 items)
  - Implement addRecentSearch and clearRecentSearches methods
  - Add suggestions generation based on activity data
  - Track isSearching state for UI feedback
  - _Requirements: 1.3, 8.1, 8.2, 8.4_

- [x] 5. Create useActivityListSync Hook
  - Create `jogai-mobile-app/src/hooks/useActivityListSync.ts`
  - Create FlatList ref for programmatic scrolling
  - Implement scrollToActivity method with smooth animation
  - Configure viewabilityConfig for tracking visible items
  - Implement onViewableItemsChanged callback
  - Notify parent component of visible activity changes
  - _Requirements: 7.1, 7.4_

- [x] 6. Update HomeScreen to Use New Hooks
  - Import all new custom hooks
  - Replace inline filter logic with useActivityFilters
  - Replace inline map logic with useActivityMap
  - Add useActivitySearch for search functionality
  - Add useActivityListSync for list/map synchronization
  - Remove redundant state and logic from HomeScreen
  - Verify all existing functionality still works
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 7. Create FilterBar Component
  - Create `jogai-mobile-app/src/components/filters/FilterBar.tsx`
  - Define FilterBarProps interface with all required props
  - Move filter dropdowns from HomeScreen to FilterBar
  - Add horizontal ScrollView for filter controls
  - Implement filter count badge display
  - Add clear filters button with conditional rendering
  - Style component to match existing design
  - _Requirements: 2.3, 3.1, 4.2_

- [x] 8. Create SearchInput Component
  - Create `jogai-mobile-app/src/components/filters/SearchInput.tsx`
  - Implement TextInput with search icon
  - Add clear button (X) that appears when text is entered
  - Add search icon on the left side
  - Implement proper accessibility labels
  - Style component with proper spacing and colors
  - Add placeholder text
  - _Requirements: 8.1, 8.2, 5.1_

- [x] 9. Create FilterChips Component
  - Create `jogai-mobile-app/src/components/filters/FilterChips.tsx`
  - Display each active filter as a chip with label and remove button
  - Implement onRemove callback for each chip
  - Add horizontal ScrollView for multiple chips
  - Style chips with proper colors and spacing
  - Add accessibility labels for screen readers
  - Ensure minimum touch target size (44x44 points)
  - _Requirements: 4.2, 5.1, 5.3_

- [x] 10. Create ActivityList Component
  - Create `jogai-mobile-app/src/components/activity/ActivityList.tsx`
  - Define ActivityListProps interface
  - Implement FlatList with optimized configuration (windowSize, maxToRenderPerBatch)
  - Add pull-to-refresh functionality with RefreshControl
  - Implement keyExtractor for proper item identification
  - Add renderItem with ActivityCard
  - Handle empty state rendering
  - Forward ref for external scroll control
  - _Requirements: 1.2, 1.4, 2.3, 7.1_

- [x] 11. Create ActivityListHeader Component
  - Create `jogai-mobile-app/src/components/activity/ActivityListHeader.tsx`
  - Display activity count with proper pluralization
  - Add sort dropdown (by date, distance, popularity)
  - Show active filters count badge
  - Style header with proper spacing
  - Add accessibility labels
  - _Requirements: 3.1, 2.3_

- [x] 12. Create ActivityCardSkeleton Component
  - Create `jogai-mobile-app/src/components/activity/ActivityCardSkeleton.tsx`
  - Install react-native-skeleton-placeholder dependency
  - Design skeleton to match ActivityCard layout
  - Add shimmer animation effect
  - Support rendering multiple skeletons (count prop)
  - Match dimensions and spacing of actual ActivityCard
  - _Requirements: 3.2_

- [x] 13. Create MapControls Component
  - Create `jogai-mobile-app/src/components/map/MapControls.tsx`
  - Add zoom in button (+)
  - Add zoom out button (-)
  - Add center on user location button
  - Position controls in bottom-right corner of map
  - Style buttons with proper shadows and colors
  - Add accessibility labels
  - Ensure minimum touch target size (48x48 points)
  - _Requirements: 5.1, 5.3_

- [x] 14. Create ErrorBoundary Component
  - Create `jogai-mobile-app/src/components/common/ErrorBoundary.tsx`
  - Implement React error boundary lifecycle methods
  - Create fallback UI with error message and retry button
  - Add error logging for debugging
  - Support custom fallback component via props
  - Style error state with proper spacing and colors
  - _Requirements: 6.1, 6.2_

- [x] 15. Create Error UI Components
  - Create `jogai-mobile-app/src/components/common/ErrorBanner.tsx` for top banner errors
  - Create `jogai-mobile-app/src/components/common/ErrorState.tsx` for full-screen errors
  - Create `jogai-mobile-app/src/components/common/InlineError.tsx` for inline errors
  - Implement dismiss and retry functionality
  - Add proper icons and colors for different error types
  - Add accessibility labels
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 16. Refactor EmptyState Component
  - Create `jogai-mobile-app/src/components/activity/EmptyState.tsx`
  - Support different empty state types (no activities, no results, no location)
  - Add configurable icon, title, message, and action button
  - Distinguish between "no activities" and "no activities matching filters"
  - Add suggestions for alternative actions
  - Style with proper spacing and typography
  - _Requirements: 6.4, 3.5_

- [x] 17. Update HomeScreen to Use New Components
  - Import all new components
  - Replace inline filter UI with FilterBar component
  - Replace inline activity list with ActivityList component
  - Add ActivityListHeader to list
  - Add MapControls to map section
  - Wrap screen content with ErrorBoundary
  - Remove redundant JSX from HomeScreen
  - Verify component composition works correctly
  - _Requirements: 2.3, 2.4_
