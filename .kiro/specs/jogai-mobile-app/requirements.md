# Requirements Document - Jogai Mobile App

## Introduction

The Jogai Mobile App is a React Native application built with Expo that connects people who want to play sports. The app allows users to discover and join sports activities, create their own games, request court reservations, and manage their participation in various sports events. The application will consume the existing jogai-api backend services (api-authentication and api-app).

## Glossary

- **Mobile App**: The React Native + Expo application for iOS and Android
- **User**: A person who uses the Mobile App to participate in or organize sports activities
- **Activity**: A scheduled sports event that users can join
- **Court**: A physical sports facility (field, arena, court) where activities take place
- **Establishment**: A venue that contains one or more Courts
- **Participant**: A User who has joined an Activity
- **Organizer**: A User who created an Activity
- **Game Request**: A request to reserve a Court for a specific time
- **Reservation**: A confirmed booking of a Court
- **Backend API**: The existing jogai-api services (api-authentication and api-app)
- **Push Notification**: A mobile notification sent to the User's device
- **Share Link**: A unique URL that allows users to view and join an Activity

## Requirements

### Requirement 1: User Authentication

**User Story:** As a User, I want to register and login to the Mobile App, so that I can access personalized features and manage my activities.

#### Acceptance Criteria

1. WHEN a User opens the Mobile App for the first time, THE Mobile App SHALL display an onboarding screen with sport selection
2. WHEN a User completes onboarding, THE Mobile App SHALL navigate to the authentication screen
3. WHEN a User enters valid email and password credentials, THE Mobile App SHALL authenticate with the Backend API and store the JWT token securely
4. WHEN a User's session expires, THE Mobile App SHALL prompt for re-authentication
5. WHEN a User requests password reset, THE Mobile App SHALL send a reset request to the Backend API and display confirmation

### Requirement 2: Activity Discovery

**User Story:** As a User, I want to discover nearby sports activities on a map, so that I can find games to join in my area.

#### Acceptance Criteria

1. WHEN a User accesses the home screen, THE Mobile App SHALL display a map with activity markers within a configurable radius
2. WHEN a User taps on an activity marker, THE Mobile App SHALL display a preview card with activity details
3. WHEN a User applies filters for sport type or activity type, THE Mobile App SHALL update the map to show only matching activities
4. WHEN a User searches by location or address, THE Mobile App SHALL center the map on the searched location
5. WHEN a User pulls down on the activity list, THE Mobile App SHALL refresh the activity data from the Backend API

### Requirement 3: Activity Details

**User Story:** As a User, I want to view detailed information about an activity, so that I can decide whether to join.

#### Acceptance Criteria

1. WHEN a User selects an activity, THE Mobile App SHALL display the activity title, description, sport type, date, time, and location
2. WHEN viewing activity details, THE Mobile App SHALL display the organizer information and list of confirmed participants
3. WHEN viewing activity details, THE Mobile App SHALL show the number of available spots and a progress indicator
4. WHEN an activity has available spots, THE Mobile App SHALL display a "Join" button
5. WHEN an activity is full, THE Mobile App SHALL display "Full" status and disable the join action

### Requirement 4: Activity Participation

**User Story:** As a User, I want to join an activity, so that I can participate in the sports event.

#### Acceptance Criteria

1. WHEN a User taps the "Join" button, THE Mobile App SHALL display a confirmation form requesting full name and phone number
2. WHEN a User submits the participation form with valid data, THE Mobile App SHALL send the participation request to the Backend API
3. WHEN participation is confirmed, THE Mobile App SHALL display a success message and update the participant list
4. WHEN a User is already a participant, THE Mobile App SHALL display "Cancel Participation" option instead of "Join"
5. WHEN a User cancels participation, THE Mobile App SHALL send the cancellation request to the Backend API and update the UI

### Requirement 5: Activity Creation

**User Story:** As a User, I want to create a new sports activity, so that I can organize games and invite others to join.

#### Acceptance Criteria

1. WHEN a User taps the create button, THE Mobile App SHALL display a court selection screen with search and filter options
2. WHEN a User selects a court, THE Mobile App SHALL display a sport selection screen with available sports for that court
3. WHEN a User selects a sport, THE Mobile App SHALL display an activity creation form with title, description, type, dates, and max players fields
4. WHEN a User submits a valid activity form, THE Mobile App SHALL send the creation request to the Backend API
5. WHEN activity creation succeeds, THE Mobile App SHALL navigate to the activity details screen and display a success message

### Requirement 6: Court Selection

**User Story:** As a User, I want to browse and select courts for my activities, so that I can choose the best venue for my game.

#### Acceptance Criteria

1. WHEN a User accesses court selection, THE Mobile App SHALL display a map with court markers and a list view toggle
2. WHEN a User searches by address or area, THE Mobile App SHALL filter courts based on the search query
3. WHEN viewing court list, THE Mobile App SHALL display court name, distance, image, and amenities for each court
4. WHEN a User taps on a court, THE Mobile App SHALL display detailed court information including available sports
5. WHEN a User selects a court, THE Mobile App SHALL proceed to sport selection for that court

### Requirement 7: Sport Selection

**User Story:** As a User, I want to select my preferred sports, so that I can personalize my experience and filter relevant activities.

#### Acceptance Criteria

1. WHEN a User completes onboarding, THE Mobile App SHALL display a grid of sports with images and selection capability
2. WHEN a User taps on a sport card, THE Mobile App SHALL toggle the selection state with visual feedback
3. WHEN a User searches for a sport, THE Mobile App SHALL filter the sport grid based on the search query
4. WHEN a User confirms sport selection, THE Mobile App SHALL store the preferences and use them for activity filtering
5. WHERE sport selection is required for activity creation, THE Mobile App SHALL display only sports available for the selected court

### Requirement 8: Push Notifications

**User Story:** As a User, I want to receive notifications about my activities, so that I stay informed about participation confirmations, cancellations, and updates.

#### Acceptance Criteria

1. WHEN a User grants notification permissions, THE Mobile App SHALL register the device token with the Backend API
2. WHEN a User joins an activity, THE Mobile App SHALL receive a confirmation notification
3. WHEN an activity the User joined is cancelled, THE Mobile App SHALL receive a cancellation notification
4. WHEN a User taps on a notification, THE Mobile App SHALL navigate to the relevant activity details screen
5. WHEN a User disables notifications in settings, THE Mobile App SHALL unregister the device token from the Backend API

### Requirement 9: User Profile

**User Story:** As a User, I want to manage my profile and view my activity history, so that I can track my participation and update my information.

#### Acceptance Criteria

1. WHEN a User accesses the profile screen, THE Mobile App SHALL display user information including name, email, and profile photo
2. WHEN a User taps edit profile, THE Mobile App SHALL allow updating name, phone number, and profile photo
3. WHEN viewing profile, THE Mobile App SHALL display tabs for "Organized Activities" and "Participating Activities"
4. WHEN a User selects an activity from history, THE Mobile App SHALL navigate to the activity details screen
5. WHEN a User taps logout, THE Mobile App SHALL clear stored credentials and navigate to the authentication screen

### Requirement 10: Activity Sharing

**User Story:** As an Organizer, I want to share my activity via a unique link, so that I can invite others to join even if they don't have the app.

#### Acceptance Criteria

1. WHEN viewing an activity the User organized, THE Mobile App SHALL display a share button
2. WHEN a User taps the share button, THE Mobile App SHALL generate a unique share link and display sharing options
3. WHEN a User shares via WhatsApp, SMS, or email, THE Mobile App SHALL include the activity details and share link
4. WHEN a non-authenticated User opens a share link, THE Mobile App SHALL display a public activity view with join option
5. WHERE the share link has expired, THE Mobile App SHALL display an expiration message

### Requirement 11: Offline Support

**User Story:** As a User, I want to access basic app features when offline, so that I can view my activities even without internet connection.

#### Acceptance Criteria

1. WHEN the Mobile App loses internet connectivity, THE Mobile App SHALL display a connection status indicator
2. WHEN offline, THE Mobile App SHALL allow viewing previously loaded activity details from local cache
3. WHEN offline, THE Mobile App SHALL queue user actions and sync when connection is restored
4. WHEN connection is restored, THE Mobile App SHALL automatically sync queued actions with the Backend API
5. WHEN offline, THE Mobile App SHALL disable features that require real-time data such as map updates and activity creation

### Requirement 12: Search and Filters

**User Story:** As a User, I want to search and filter activities, so that I can quickly find games that match my preferences.

#### Acceptance Criteria

1. WHEN a User accesses the search screen, THE Mobile App SHALL display a search bar and filter options
2. WHEN a User enters a search query, THE Mobile App SHALL filter activities by title, location, or sport
3. WHEN a User applies sport filters, THE Mobile App SHALL display only activities matching the selected sports
4. WHEN a User applies activity type filters, THE Mobile App SHALL display only public or private activities as selected
5. WHEN a User applies date filters, THE Mobile App SHALL display only activities within the selected date range

### Requirement 13: Geolocation

**User Story:** As a User, I want the app to use my current location, so that I can find nearby activities without manual input.

#### Acceptance Criteria

1. WHEN a User grants location permissions, THE Mobile App SHALL access the device's current location
2. WHEN displaying the map, THE Mobile App SHALL center on the User's current location
3. WHEN calculating distances, THE Mobile App SHALL use the User's current location as the reference point
4. WHEN location permissions are denied, THE Mobile App SHALL prompt the User to enable location services
5. WHEN location is unavailable, THE Mobile App SHALL default to a predefined location and allow manual search

### Requirement 14: Activity Review

**User Story:** As an Organizer, I want to review all activity details before creation, so that I can ensure all information is correct.

#### Acceptance Criteria

1. WHEN a User completes the activity creation form, THE Mobile App SHALL display a review screen with all entered information
2. WHEN reviewing, THE Mobile App SHALL display sport, location, court, title, description, type, dates, and max players
3. WHEN reviewing, THE Mobile App SHALL provide "Edit" buttons for each section to return to the respective form
4. WHEN a User taps "Create Activity" on the review screen, THE Mobile App SHALL submit the activity to the Backend API
5. WHEN creation fails, THE Mobile App SHALL display an error message and allow the User to retry or edit

### Requirement 15: Error Handling

**User Story:** As a User, I want to see clear error messages when something goes wrong, so that I understand what happened and how to fix it.

#### Acceptance Criteria

1. WHEN the Backend API returns an error, THE Mobile App SHALL display a user-friendly error message
2. WHEN network request fails, THE Mobile App SHALL display a retry option
3. WHEN validation fails, THE Mobile App SHALL highlight the invalid fields and display specific error messages
4. WHEN an unexpected error occurs, THE Mobile App SHALL log the error and display a generic error message with support contact
5. WHEN authentication fails, THE Mobile App SHALL display the specific reason and provide options to retry or reset password
