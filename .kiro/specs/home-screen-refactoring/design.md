# Design Document

## Overview

This document describes the technical design for refactoring the Home Screen of the Jogai mobile application. The refactoring focuses on improving performance, code organization, user experience, and maintainability while keeping the existing backend API unchanged.

The Home Screen is the main entry point of the application, displaying a map with activity markers and a draggable bottom sheet containing a filterable list of nearby activities. The refactoring will decompose the monolithic component into smaller, reusable pieces with clear responsibilities.

## Architecture

### High-Level Component Structure

```
HomeScreen (Container)
├── MapSection
│   ├── MapView (existing)
│   └── MapControls (new)
│       ├── ZoomControls
│       └── CenterOnUserButton
├── BottomSheet (existing - DraggableBottomSheetSimple)
│   ├── FilterBar (new)
│   │   ├── SearchInput (new)
│   │   ├── FilterChips (new)
│   │   └── FilterDropdowns (refactored)
│   └── ActivityList (new)
│       ├── ActivityListHeader (new)
│       ├── ActivityCardSkeleton (new)
│       ├── ActivityCard (existing)
│       └── EmptyState (refactored)
└── ErrorBoundary (new)
```

### Custom Hooks Architecture

```
useActivityFilters
├── Filter state management
├── Filter persistence (AsyncStorage)
├── Filter validation
└── Filter change debouncing

useActivityMap
├── Map state (center, zoom, selected marker)
├── Map/List synchronization
└── Marker clustering logic

useActivitySearch
├── Search query state
├── Search debouncing
├── Recent searches (AsyncStorage)
└── Search suggestions

useActivityListSync
├── Scroll position tracking
├── Visible items calculation
└── Map viewport updates
```

## Components and Interfaces

### 1. HomeScreen (Container Component)

**Responsibility:** Orchestrate all child components and manage global state.

**Props:** None (root screen component)

**State:**
```typescript
interface HomeScreenState {
  selectedActivityId: string | null;
  bottomSheetSnapPoint: 'MIN' | 'MID' | 'MAX';
  isMapInteracting: boolean;
}
```

**Key Methods:**
- `handleActivitySelect(activityId: string): void`
- `handleMarkerPress(activityId: string): void`
- `handleBottomSheetChange(snapPoint: string): void`

### 2. FilterBar Component

**Responsibility:** Display and manage all filter controls.

**Props:**
```typescript
interface FilterBarProps {
  filters: ActivityFilters;
  onFiltersChange: (filters: ActivityFilters) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  resultCount: number;
  isLoading: boolean;
}
```

**Sub-components:**
- `SearchInput`: Text input with debouncing and clear button
- `FilterChips`: Display active filters as removable chips
- `FilterDropdowns`: Existing dropdown components for type, sport, distance, date

### 3. ActivityList Component

**Responsibility:** Render the list of activities with virtualization.

**Props:**
```typescript
interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onActivityPress: (activity: Activity) => void;
  selectedActivityId: string | null;
  userLocation: Coordinate | null;
  emptyStateConfig: EmptyStateConfig;
}
```

**Features:**
- Virtual scrolling using `FlashList` or `FlatList` with `windowSize` optimization
- Skeleton loaders during initial load
- Pull-to-refresh functionality
- Scroll-to-item when activity is selected from map

### 4. ActivityListHeader Component

**Responsibility:** Display list metadata and sorting options.

**Props:**
```typescript
interface ActivityListHeaderProps {
  count: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFiltersCount: number;
}
```

### 5. ActivityCardSkeleton Component

**Responsibility:** Show loading placeholder for activity cards.

**Props:**
```typescript
interface ActivityCardSkeletonProps {
  count?: number; // Number of skeletons to show
}
```

**Implementation:** Use `react-native-skeleton-placeholder` or custom shimmer effect.

### 6. MapControls Component

**Responsibility:** Provide map interaction controls.

**Props:**
```typescript
interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterOnUser: () => void;
  userLocation: Coordinate | null;
}
```

### 7. ErrorBoundary Component

**Responsibility:** Catch and display errors gracefully.

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}
```

## Data Models

### ActivityFilters (Enhanced)

```typescript
interface ActivityFilters {
  // Existing fields
  sportKeys?: string[];
  type?: ActivityType;
  status?: ActivityStatus;
  startDate?: string;
  endDate?: string;
  
  // New fields
  search?: string;
  sortBy?: 'date' | 'distance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}
```

### FilterState (New)

```typescript
interface FilterState {
  type: string;
  sports: string[];
  distance: string;
  date: string;
  search: string;
  sortBy: SortOption;
}

type SortOption = 'date-asc' | 'date-desc' | 'distance-asc' | 'popularity-desc';
```

### MapState (New)

```typescript
interface MapState {
  center: Coordinate;
  zoom: number;
  selectedMarkerId: string | null;
  visibleMarkerIds: string[];
  isUserInteracting: boolean;
}
```

### SearchState (New)

```typescript
interface SearchState {
  query: string;
  recentSearches: string[];
  suggestions: string[];
  isSearching: boolean;
}
```

## Custom Hooks Design

### useActivityFilters

**Purpose:** Manage all filter-related state and logic.

**Interface:**
```typescript
interface UseActivityFiltersReturn {
  filters: FilterState;
  activeFiltersCount: number;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof FilterState) => void;
  isDefaultFilters: boolean;
  debouncedFilters: FilterState; // Debounced version for API calls
}

function useActivityFilters(
  initialFilters?: Partial<FilterState>
): UseActivityFiltersReturn;
```

**Implementation Details:**
- Use `useState` for immediate filter state
- Use `useDebouncedValue` (300ms) for API call optimization
- Use `useEffect` with `AsyncStorage` for persistence
- Calculate `activeFiltersCount` based on non-default values
- Memoize filter transformations with `useMemo`

### useActivityMap

**Purpose:** Manage map state and synchronization with activity list.

**Interface:**
```typescript
interface UseActivityMapReturn {
  mapState: MapState;
  setMapCenter: (center: Coordinate) => void;
  setMapZoom: (zoom: number) => void;
  selectMarker: (activityId: string | null) => void;
  updateVisibleMarkers: (activityIds: string[]) => void;
  centerOnActivity: (activity: Activity) => void;
  centerOnUser: () => void;
  setUserInteracting: (interacting: boolean) => void;
}

function useActivityMap(
  activities: Activity[],
  userLocation: Coordinate | null
): UseActivityMapReturn;
```

**Implementation Details:**
- Track map center, zoom, and selected marker
- Provide methods to update map state
- Calculate visible markers based on map bounds
- Handle centering on activities or user location

### useActivitySearch

**Purpose:** Manage search functionality with debouncing and history.

**Interface:**
```typescript
interface UseActivitySearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  suggestions: string[];
  isSearching: boolean;
}

function useActivitySearch(): UseActivitySearchReturn;
```

**Implementation Details:**
- Debounce search input (300ms)
- Store recent searches in AsyncStorage (max 10)
- Generate suggestions based on activity titles and locations
- Track searching state for UI feedback

### useActivityListSync

**Purpose:** Synchronize activity list scroll with map viewport.

**Interface:**
```typescript
interface UseActivityListSyncReturn {
  scrollToActivity: (activityId: string) => void;
  onViewableItemsChanged: (info: ViewableItemsChangedInfo) => void;
  viewabilityConfig: ViewabilityConfig;
  listRef: RefObject<FlatList>;
}

function useActivityListSync(
  activities: Activity[],
  onVisibleActivitiesChange: (activityIds: string[]) => void
): UseActivityListSyncReturn;
```

**Implementation Details:**
- Use `FlatList` ref for programmatic scrolling
- Track viewable items with `onViewableItemsChanged`
- Notify parent of visible activities for map updates
- Smooth scroll to activity when selected from map

## Error Handling

### Error Types

```typescript
enum ErrorType {
  LOCATION_PERMISSION_DENIED = 'LOCATION_PERMISSION_DENIED',
  LOCATION_SERVICE_UNAVAILABLE = 'LOCATION_SERVICE_UNAVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

interface AppError {
  type: ErrorType;
  message: string;
  retryable: boolean;
  action?: () => void;
}
```

### Error Handling Strategy

1. **Location Errors:**
   - Show inline message in map area
   - Provide "Enable Location" button that opens settings
   - Fall back to default location (São Paulo center)

2. **Network Errors:**
   - Show error banner at top of screen
   - Provide retry button
   - Cache last successful response for offline viewing

3. **API Errors:**
   - Parse error response from backend
   - Show user-friendly message
   - Log technical details for debugging

4. **Component Errors:**
   - Use ErrorBoundary to catch rendering errors
   - Show fallback UI with reload option
   - Report to error tracking service (if configured)

### Error UI Components

```typescript
// ErrorBanner - Top banner for temporary errors
interface ErrorBannerProps {
  error: AppError;
  onDismiss: () => void;
  onRetry?: () => void;
}

// ErrorState - Full-screen error state
interface ErrorStateProps {
  error: AppError;
  onRetry?: () => void;
}

// InlineError - Small inline error message
interface InlineErrorProps {
  message: string;
  action?: { label: string; onPress: () => void };
}
```

## Performance Optimizations

### 1. List Virtualization

**Strategy:** Use `FlatList` with optimized configuration.

```typescript
const LIST_CONFIG = {
  windowSize: 10, // Number of screens to render
  maxToRenderPerBatch: 10, // Items per render batch
  updateCellsBatchingPeriod: 50, // Batch update interval (ms)
  initialNumToRender: 10, // Initial items to render
  removeClippedSubviews: true, // Remove off-screen views (Android)
};
```

### 2. Memoization

**Components to memoize:**
- `ActivityCard` - Memoize with `React.memo` and custom comparison
- `FilterBar` - Memoize to prevent re-renders on map interactions
- `MapView` - Memoize to prevent re-renders on list scrolls

**Values to memoize:**
- Filter transformations (`useMemo`)
- Sorted/filtered activity lists (`useMemo`)
- Map marker data (`useMemo`)

### 3. Debouncing

**Debounced operations:**
- Filter changes: 300ms
- Search input: 300ms
- Map drag events: 500ms

**Implementation:**
```typescript
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const debouncedFilters = useDebouncedValue(filters, 300);
```

### 4. Image Optimization

**Strategy:**
- Use `react-native-fast-image` for activity card images
- Implement progressive loading (blur-up technique)
- Cache images aggressively
- Use appropriate image sizes (thumbnails for cards)

### 5. Query Optimization

**React Query configuration:**
```typescript
const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 2,
};
```

## Accessibility

### Screen Reader Support

**Labels and hints:**
```typescript
// Activity Card
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`${activity.title} activity`}
  accessibilityHint="Double tap to view activity details"
  accessibilityRole="button"
>
```

**Focus management:**
- Set focus to first activity card when list loads
- Announce filter changes to screen readers
- Provide skip links for long lists

### Touch Targets

**Minimum sizes:**
- All interactive elements: 44x44 points
- Filter chips: 48x32 points (wider for text)
- Map markers: 48x48 points

### Dynamic Text

**Support for text scaling:**
```typescript
import { useWindowDimensions, PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();
const adjustedFontSize = baseFontSize * Math.min(fontScale, 1.3);
```

### Color Contrast

**WCAG AA compliance:**
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

## Testing Strategy

### Unit Tests

**Components to test:**
- `useActivityFilters` hook
- `useActivityMap` hook
- `useActivitySearch` hook
- `FilterBar` component
- `ActivityList` component

**Test cases:**
- Filter state management
- Debouncing behavior
- Persistence (AsyncStorage)
- Error handling
- Edge cases (empty lists, no location, etc.)

### Integration Tests

**Scenarios:**
- Complete filter flow (select → apply → clear)
- Map/List synchronization
- Search functionality
- Pull-to-refresh
- Error recovery

### Performance Tests

**Metrics to measure:**
- Initial render time
- Scroll performance (FPS)
- Memory usage with large lists
- API call frequency

## Migration Strategy

### Phase 1: Extract Hooks (Low Risk)

1. Create `useActivityFilters` hook
2. Create `useActivityMap` hook
3. Create `useActivitySearch` hook
4. Update HomeScreen to use new hooks
5. Test thoroughly

### Phase 2: Extract Components (Medium Risk)

1. Create `FilterBar` component
2. Create `ActivityList` component
3. Create `ActivityListHeader` component
4. Create `MapControls` component
5. Update HomeScreen to use new components
6. Test thoroughly

### Phase 3: Add New Features (Medium Risk)

1. Implement search functionality
2. Add skeleton loaders
3. Implement filter persistence
4. Add error handling improvements
5. Test thoroughly

### Phase 4: Performance Optimizations (Low Risk)

1. Add memoization
2. Optimize list rendering
3. Implement image caching
4. Add debouncing
5. Measure and validate improvements

### Phase 5: Accessibility (Low Risk)

1. Add accessibility labels
2. Implement focus management
3. Test with screen readers
4. Validate touch target sizes
5. Test with dynamic text

## Dependencies

### New Dependencies

```json
{
  "react-native-fast-image": "^8.6.3",
  "react-native-skeleton-placeholder": "^5.2.4",
  "@react-native-async-storage/async-storage": "^1.19.3"
}
```

### Existing Dependencies (Verify Versions)

- `@tanstack/react-query`: For data fetching
- `@react-navigation/native`: For navigation
- `expo-location`: For location services
- `react-native-maps`: For map display

## Diagrams

### Component Hierarchy

```
┌─────────────────────────────────────────┐
│           HomeScreen                     │
│  ┌─────────────────────────────────┐   │
│  │         MapSection               │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │       MapView            │   │   │
│  │  └──────────────────────────┘   │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │     MapControls          │   │   │
│  │  └──────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      BottomSheet                 │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │      FilterBar           │   │   │
│  │  │  ┌────────────────────┐  │   │   │
│  │  │  │   SearchInput      │  │   │   │
│  │  │  └────────────────────┘  │   │   │
│  │  │  ┌────────────────────┐  │   │   │
│  │  │  │   FilterChips      │  │   │   │
│  │  │  └────────────────────┘  │   │   │
│  │  └──────────────────────────┘   │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │     ActivityList         │   │   │
│  │  │  ┌────────────────────┐  │   │   │
│  │  │  │ ActivityCard (x N) │  │   │   │
│  │  │  └────────────────────┘  │   │   │
│  │  └──────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Action
    ↓
HomeScreen (Container)
    ↓
useActivityFilters Hook
    ↓
Debounced Filters
    ↓
useNearbyActivities Hook (React Query)
    ↓
API Call
    ↓
Activity Data
    ↓
ActivityList Component
    ↓
ActivityCard Components
    ↓
User sees results
```

### Map/List Synchronization Flow

```
User taps map marker
    ↓
HomeScreen.handleMarkerPress()
    ↓
useActivityListSync.scrollToActivity()
    ↓
FlatList scrolls to item
    ↓
Activity card highlighted

User taps activity card
    ↓
HomeScreen.handleActivityPress()
    ↓
useActivityMap.centerOnActivity()
    ↓
Map centers on location
    ↓
Marker highlighted
```

## Open Questions

1. **Pagination Strategy:** Should we implement cursor-based or offset-based pagination? The API supports both.
   - **Recommendation:** Cursor-based for better performance with large datasets

2. **Offline Support:** How much data should we cache for offline viewing?
   - **Recommendation:** Cache last 50 activities and user's recent searches

3. **Map Clustering:** Should we cluster markers when zoomed out?
   - **Recommendation:** Yes, implement clustering for > 20 markers in viewport

4. **Filter Persistence:** Should filters persist across app restarts?
   - **Recommendation:** Yes, but reset location-based filters (distance, map position)

5. **Search Scope:** Should search include activity descriptions and participant names?
   - **Recommendation:** Start with title and location, expand based on user feedback

## Future Enhancements

1. **Saved Searches:** Allow users to save filter combinations
2. **Activity Recommendations:** ML-based suggestions based on user history
3. **Social Features:** Show activities friends are attending
4. **Calendar Integration:** Add activities to device calendar
5. **Notifications:** Alert users when new activities match their filters
6. **Advanced Filters:** Price range, skill level, age group
7. **Map Layers:** Show traffic, weather, nearby amenities
8. **AR View:** Augmented reality view of nearby activities
