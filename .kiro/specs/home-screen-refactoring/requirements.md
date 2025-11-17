# Requirements Document

## Introduction

This document outlines the requirements for refactoring the Home Screen (main activity listing screen) of the Jogai mobile application. The current implementation works but has opportunities for improvement in terms of performance, code organization, user experience, and maintainability. This refactoring will enhance the screen without changing the backend API.

## Glossary

- **Home Screen**: The main screen of the application that displays a map with activity markers and a draggable bottom sheet with a list of nearby activities
- **Activity**: A sports event that users can join, with details like sport type, location, date/time, and participant information
- **Bottom Sheet**: A draggable UI component that slides up from the bottom of the screen, containing the activity list and filters
- **Filter**: User-selectable criteria to narrow down the displayed activities (type, sport, distance, date)
- **Nearby Activities API**: The backend endpoint that returns activities based on location and filters
- **Activity Card**: A component that displays summary information about a single activity
- **User Location**: The current geographic coordinates of the user
- **Refresh**: The action of reloading activity data from the server
- **Empty State**: The UI displayed when no activities match the current filters

## Requirements

### Requirement 1: Performance Optimization

**User Story:** As a user, I want the activity list to load quickly and scroll smoothly, so that I can browse activities without lag or delays.

#### Acceptance Criteria

1. WHEN THE Home_Screen loads, THE Application SHALL render the initial view within 500 milliseconds
2. WHEN THE user scrolls through the activity list, THE Application SHALL maintain 60 frames per second
3. WHEN THE user changes filters, THE Application SHALL debounce filter changes by 300 milliseconds to reduce API calls
4. WHEN THE activity list contains more than 20 items, THE Application SHALL implement virtual scrolling or pagination
5. WHEN THE user pulls to refresh, THE Application SHALL show loading state and complete within 2 seconds under normal network conditions

### Requirement 2: Code Organization and Maintainability

**User Story:** As a developer, I want the Home Screen code to be well-organized and modular, so that I can easily maintain and extend functionality.

#### Acceptance Criteria

1. THE Home_Screen SHALL extract filter logic into a custom hook named useActivityFilters
2. THE Home_Screen SHALL extract map-related logic into a custom hook named useActivityMap
3. THE Home_Screen SHALL separate filter UI components into a dedicated FilterBar component
4. THE Home_Screen SHALL limit the main component to 200 lines of code
5. THE Home_Screen SHALL use TypeScript strict mode with no type assertions or any types

### Requirement 3: Enhanced User Experience

**User Story:** As a user, I want clear visual feedback and intuitive interactions, so that I understand what's happening and can easily find activities.

#### Acceptance Criteria

1. WHEN THE user applies filters, THE Application SHALL display a filter count badge showing the number of active filters
2. WHEN THE activity list is loading, THE Application SHALL show skeleton loaders instead of a blank screen
3. WHEN THE user taps a map marker, THE Application SHALL highlight the corresponding activity card in the list
4. WHEN THE user scrolls the activity list, THE Application SHALL update map markers to show which activities are visible
5. WHEN THE user has no location permission, THE Application SHALL display a helpful message with instructions to enable location

### Requirement 4: Filter Improvements

**User Story:** As a user, I want more flexible filtering options, so that I can find exactly the activities I'm interested in.

#### Acceptance Criteria

1. THE Application SHALL persist filter selections across app sessions using AsyncStorage
2. WHEN THE user selects multiple sports, THE Application SHALL show selected sports as chips with remove buttons
3. WHEN THE user clears filters, THE Application SHALL animate the transition to show all activities
4. THE Application SHALL display the number of results for each filter option before selection
5. WHEN THE user applies filters that return no results, THE Application SHALL suggest alternative filter combinations

### Requirement 5: Accessibility and Internationalization

**User Story:** As a user with accessibility needs, I want the screen to be fully accessible, so that I can use the app effectively.

#### Acceptance Criteria

1. THE Application SHALL provide accessibility labels for all interactive elements
2. THE Application SHALL support screen reader navigation with proper focus management
3. THE Application SHALL maintain minimum touch target size of 44x44 points for all interactive elements
4. THE Application SHALL support dynamic text sizing for users with vision impairments
5. THE Application SHALL use semantic color names that work with both light and dark themes

### Requirement 6: Error Handling and Edge Cases

**User Story:** As a user, I want clear error messages and graceful handling of problems, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN THE location service fails, THE Application SHALL display an error message with retry option
2. WHEN THE API request fails, THE Application SHALL show an error banner with retry button
3. WHEN THE user has no internet connection, THE Application SHALL display cached activities with offline indicator
4. WHEN THE API returns an empty result, THE Application SHALL distinguish between "no activities" and "no activities matching filters"
5. WHEN THE user's location is outside the service area, THE Application SHALL suggest expanding the search radius

### Requirement 7: Map and List Synchronization

**User Story:** As a user, I want the map and list to stay synchronized, so that I can easily navigate between map and list views.

#### Acceptance Criteria

1. WHEN THE user taps a map marker, THE Application SHALL scroll the list to show the corresponding activity card
2. WHEN THE user taps an activity card, THE Application SHALL center the map on that activity's location
3. WHEN THE user drags the map, THE Application SHALL update the activity list to show activities in the visible map area
4. WHEN THE user expands the bottom sheet to full screen, THE Application SHALL minimize the map view
5. WHEN THE user collapses the bottom sheet, THE Application SHALL restore the map view to full size

### Requirement 8: Search and Discovery

**User Story:** As a user, I want to search for specific activities or locations, so that I can quickly find what I'm looking for.

#### Acceptance Criteria

1. THE Application SHALL provide a search input field in the filter bar
2. WHEN THE user types in the search field, THE Application SHALL filter activities by title, description, and location
3. WHEN THE user searches, THE Application SHALL highlight matching text in activity cards
4. THE Application SHALL show recent searches for quick access
5. WHEN THE search returns no results, THE Application SHALL suggest similar activities or alternative search terms
