# Implementation Plan - Jogai Mobile App

## Task List

- [x] 1. Project Setup and Configuration
  - Initialize Expo project with TypeScript template
  - Configure project structure (folders: src, components, screens, etc.)
  - Install and configure core dependencies (React Navigation, React Query, Axios)
  - Set up environment configuration (API URLs, keys)
  - Configure TypeScript strict mode and path aliases
  - Set up ESLint and Prettier
  - _Requirements: All_

- [x] 2. Design System and Theme
  - [x] 2.1 Create theme configuration
    - Define color palette (primary orange, secondary, status colors)
    - Define typography scale (font sizes, weights, line heights)
    - Define spacing scale (margins, paddings)
    - Define border radius values
    - _Requirements: All_
  
  - [x] 2.2 Create base UI components
    - Implement Button component with variants (primary, secondary, outline)
    - Implement Input component with validation states
    - Implement Card component with shadow and border radius
    - Implement Badge component for status indicators
    - Implement Avatar component with fallback
    - _Requirements: 1, 3, 4, 5, 9_
  
  - [x] 2.3 Create layout components
    - Implement Screen wrapper component with safe area
    - Implement Header component with back button and title
    - Implement BottomSheet component for activity preview
    - Implement Loading component (spinner, skeleton)
    - Implement EmptyState component with illustrations
    - _Requirements: 2, 3, 11_

- [x] 3. API Client and Services
  - [x] 3.1 Set up API client
    - Create Axios instance with base configuration
    - Implement request interceptor for authentication token
    - Implement response interceptor for error handling
    - Create token refresh mechanism
    - _Requirements: 1, 15_
  
  - [x] 3.2 Implement authentication service
    - Create auth.service.ts with login, register, logout methods
    - Implement storage.service.ts for secure token storage
    - Create auth.api.ts with API endpoints
    - Implement token validation and refresh logic
    - _Requirements: 1_
  
  - [x] 3.3 Implement activity service
    - Create activity.api.ts with CRUD endpoints
    - Implement activity.service.ts with business logic
    - Create participation endpoints (join, cancel)
    - Implement activity filtering and search
    - _Requirements: 2, 3, 4, 5, 12_
  
  - [x] 3.4 Implement court service
    - Create court.api.ts with court endpoints
    - Implement court search and filtering
    - Create establishment endpoints
    - _Requirements: 6_
  
  - [x] 3.5 Implement user service
    - Create user.api.ts with profile endpoints
    - Implement profile update functionality
    - Create user preferences endpoints
    - _Requirements: 9_

- [x] 4. Authentication and Onboarding
  - [x] 4.1 Create authentication context
    - Implement AuthContext with login, logout, register methods
    - Create useAuth hook for consuming auth context
    - Implement authentication state persistence
    - Handle token expiration and refresh
    - _Requirements: 1_
  
  - [x] 4.2 Build login screen
    - Create LoginScreen with email and password inputs
    - Implement form validation with React Hook Form and Zod
    - Add "Forgot Password" link
    - Add "Register" navigation link
    - Handle login errors and display messages
    - _Requirements: 1_
  
  - [x] 4.3 Build registration screen
    - Create RegisterScreen with name, email, password, phone inputs
    - Implement password confirmation validation
    - Add terms of service checkbox
    - Handle registration errors
    - Navigate to onboarding after successful registration
    - _Requirements: 1_
  
  - [x] 4.4 Build forgot password screen
    - Create ForgotPasswordScreen with email input
    - Implement password reset request
    - Display confirmation message
    - _Requirements: 1_
  
  - [x] 4.5 Build sport selection onboarding
    - Create SportSelectionScreen with sport grid
    - Implement multi-select functionality with visual feedback
    - Add search bar for filtering sports
    - Save selected sports to user preferences
    - Navigate to home after completion
    - _Requirements: 7_

- [ ] 5. Navigation Structure
  - [ ] 5.1 Set up navigation configuration
    - Install and configure React Navigation dependencies
    - Create navigation types (RootStackParamList, etc.)
    - Set up navigation theme matching app theme
    - _Requirements: All_
  
  - [ ] 5.2 Create root navigator
    - Implement RootNavigator with conditional rendering (Auth/Main)
    - Add onboarding flow check
    - Handle deep linking configuration
    - _Requirements: 1, 10_
  
  - [ ] 5.3 Create auth navigator
    - Implement AuthNavigator with stack navigation
    - Add Login, Register, ForgotPassword screens
    - Configure screen options and transitions
    - _Requirements: 1_
  
  - [ ] 5.4 Create main tab navigator
    - Implement MainTabNavigator with bottom tabs
    - Add Home, Search, Create, Notifications, Profile tabs
    - Create custom tab bar with icons and labels
    - Add FAB (Floating Action Button) for Create tab
    - _Requirements: 2, 3, 4, 5, 8, 9, 12_
  
  - [ ] 5.5 Create nested stack navigators
    - Implement HomeStack for home flow
    - Implement CreateStack for activity creation flow
    - Implement ProfileStack for profile management
    - Configure screen options for each stack
    - _Requirements: 2, 3, 4, 5, 6, 9_

- [ ] 6. Home and Activity Discovery
  - [ ] 6.1 Implement location service
    - Create location.service.ts for geolocation
    - Request location permissions with explanation
    - Get current user location
    - Calculate distances between coordinates
    - Handle location errors and fallbacks
    - _Requirements: 13_
  
  - [ ] 6.2 Create map view component
    - Implement MapView component with react-native-maps
    - Add activity markers with custom icons
    - Implement marker clustering for performance
    - Add user location marker
    - Handle map region changes
    - _Requirements: 2, 13_
  
  - [ ] 6.3 Build home screen
    - Create HomeScreen with map and bottom sheet
    - Implement activity fetching with React Query
    - Add pull-to-refresh functionality
    - Display activity cards in bottom sheet
    - Implement filter chips (Public, Sport types)
    - _Requirements: 2, 12, 13_
  
  - [ ] 6.4 Create activity card component
    - Implement ActivityCard with image, title, sport, location
    - Display date, time, and available spots
    - Add status badge (Open, Full, Cancelled)
    - Show distance from user location
    - Handle card press to navigate to details
    - _Requirements: 2, 3_
  
  - [ ] 6.5 Build search screen
    - Create SearchScreen with search bar and filters
    - Implement location/address search
    - Add sport filter chips
    - Add activity type filter (Public/Private)
    - Add date range filter
    - Display filtered results in list
    - _Requirements: 12_

- [ ] 7. Activity Details and Participation
  - [ ] 7.1 Build activity details screen
    - Create ActivityDetailsScreen with header image
    - Display activity title, description, and status badge
    - Show sport icon and name
    - Display date, time, and duration
    - Show location with address and embedded map
    - Display organizer information
    - _Requirements: 3_
  
  - [ ] 7.2 Create participant list component
    - Implement ParticipantList with avatar group
    - Display participant names and status
    - Show available spots counter
    - Add progress bar for capacity visualization
    - Handle "+X" indicator for overflow participants
    - _Requirements: 3, 4_
  
  - [ ] 7.3 Implement join functionality
    - Add "Join" button with conditional rendering
    - Navigate to confirmation screen on press
    - Disable button when activity is full
    - Show "Cancel Participation" for existing participants
    - _Requirements: 4_
  
  - [ ] 7.4 Build participation confirmation screen
    - Create ConfirmParticipationScreen with activity summary
    - Add form with Full Name and Phone Number inputs
    - Display spots left indicator
    - Implement form validation
    - Submit participation request to API
    - Show success message and navigate back
    - _Requirements: 4_
  
  - [ ] 7.5 Implement share functionality
    - Add share button to activity details
    - Generate share link with activity details
    - Implement native share sheet
    - Support WhatsApp, SMS, Email sharing
    - _Requirements: 10_

- [ ] 8. Activity Creation Flow
  - [ ] 8.1 Build court selection screen
    - Create SelectCourtScreen with map and list toggle
    - Implement court search by address/area
    - Display court cards with image, name, distance
    - Show court amenities (Indoor, Lights, etc.)
    - Handle court selection and navigate to sport selection
    - _Requirements: 6_
  
  - [ ] 8.2 Create court card component
    - Implement CourtCard with image and information
    - Display court name and distance
    - Show amenity icons with labels
    - Add press handler for selection
    - _Requirements: 6_
  
  - [ ] 8.3 Build sport selection for creation
    - Create sport selection screen for chosen court
    - Display only sports available for selected court
    - Add search functionality
    - Show establishment type toggle (Public/Private)
    - Navigate to activity form on selection
    - _Requirements: 5, 7_
  
  - [ ] 8.4 Build activity creation form
    - Create CreateActivityScreen with form fields
    - Add Title input (required)
    - Add Description textarea (optional)
    - Add Activity Type toggle (Public/Private)
    - Add Share Link Expiration date picker
    - Add Start and End time pickers
    - Add Max Players slider with counter
    - Implement form validation
    - _Requirements: 5_
  
  - [ ] 8.5 Create date and time pickers
    - Implement DatePicker component with modal
    - Implement TimePicker component with modal
    - Format selected dates/times for display
    - Validate date/time ranges
    - _Requirements: 5, 14_
  
  - [ ] 8.6 Create slider component
    - Implement custom Slider for max players
    - Add increment/decrement buttons
    - Display current value
    - Set min/max constraints
    - _Requirements: 5_
  
  - [ ] 8.7 Build activity review screen
    - Create ReviewActivityScreen with summary sections
    - Display Sport and Location section with edit button
    - Display Activity Details section with edit button
    - Display Date, Time, and Spots section with edit button
    - Calculate and show duration
    - Add "Create Activity" button
    - Handle creation submission
    - _Requirements: 14_
  
  - [ ] 8.8 Implement activity creation logic
    - Submit activity data to API
    - Handle validation errors
    - Show loading state during creation
    - Navigate to activity details on success
    - Display error messages on failure
    - _Requirements: 5, 14, 15_

- [ ] 9. User Profile and Settings
  - [ ] 9.1 Build profile screen
    - Create ProfileScreen with user information
    - Display avatar, name, email, phone
    - Add edit profile button
    - Implement tabs for "Organized" and "Participating" activities
    - Display activity history in tabs
    - Add logout button
    - _Requirements: 9_
  
  - [ ] 9.2 Build edit profile screen
    - Create EditProfileScreen with form
    - Add avatar picker with image upload
    - Add name, phone number inputs
    - Implement form validation
    - Submit profile updates to API
    - Handle update errors
    - _Requirements: 9_
  
  - [ ] 9.3 Implement logout functionality
    - Clear stored tokens from SecureStore
    - Clear cached data
    - Reset navigation to auth screen
    - Unregister push notification token
    - _Requirements: 9_

- [ ] 10. Push Notifications
  - [ ] 10.1 Set up notification service
    - Create notification.service.ts
    - Request notification permissions
    - Register device token with backend
    - Handle permission denial gracefully
    - _Requirements: 8_
  
  - [ ] 10.2 Implement notification handling
    - Handle foreground notifications
    - Handle background notifications
    - Handle notification taps (deep linking)
    - Update badge count
    - _Requirements: 8_
  
  - [ ] 10.3 Build notifications screen
    - Create NotificationsScreen with list
    - Display notification cards grouped by date
    - Show notification type icons
    - Mark notifications as read on tap
    - Navigate to relevant screen on notification tap
    - _Requirements: 8_
  
  - [ ] 10.4 Implement notification preferences
    - Add notification settings to profile
    - Create toggle switches for notification types
    - Save preferences to backend
    - Update local notification registration
    - _Requirements: 8_

- [ ] 11. Offline Support and Caching
  - [ ] 11.1 Implement caching strategy
    - Configure React Query cache settings
    - Set up AsyncStorage for persistent cache
    - Define cache invalidation rules
    - Implement stale-while-revalidate pattern
    - _Requirements: 11_
  
  - [ ] 11.2 Implement offline detection
    - Create network status hook
    - Display connection status indicator
    - Disable network-dependent features when offline
    - _Requirements: 11_
  
  - [ ] 11.3 Implement action queue
    - Create queue for offline actions
    - Store queued actions in AsyncStorage
    - Sync queued actions on connection restore
    - Handle sync conflicts
    - _Requirements: 11_

- [ ] 12. Error Handling and Validation
  - [ ] 12.1 Create error handling utilities
    - Implement error parser for API responses
    - Create error message mapper
    - Define error types and codes
    - _Requirements: 15_
  
  - [ ] 12.2 Implement global error boundary
    - Create ErrorBoundary component
    - Display fallback UI for crashes
    - Log errors to monitoring service
    - Provide retry/reset options
    - _Requirements: 15_
  
  - [ ] 12.3 Create validation schemas
    - Define Zod schemas for all forms
    - Create reusable validation rules
    - Implement custom validators (phone, date ranges)
    - _Requirements: 1, 4, 5, 9, 15_
  
  - [ ] 12.4 Implement error display components
    - Create ErrorMessage component for inline errors
    - Create ErrorModal for critical errors
    - Create Toast component for success/error messages
    - _Requirements: 15_

- [ ] 13. Testing and Quality Assurance
  - [ ]* 13.1 Write unit tests
    - Test utility functions (date, validation, format)
    - Test custom hooks (useAuth, useActivities, useLocation)
    - Test service layer (auth, storage, notification)
    - _Requirements: All_
  
  - [ ]* 13.2 Write component tests
    - Test Button component interactions
    - Test Input component validation
    - Test Card component rendering
    - Test form components
    - _Requirements: All_
  
  - [ ]* 13.3 Write integration tests
    - Test API client with mocked responses
    - Test navigation flows
    - Test form submissions
    - Test authentication flow
    - _Requirements: 1, 4, 5_
  
  - [ ]* 13.4 Set up E2E testing
    - Configure Detox for E2E tests
    - Write tests for critical user flows
    - Test registration to home flow
    - Test activity creation flow
    - Test activity participation flow
    - _Requirements: 1, 2, 3, 4, 5_

- [ ] 14. Performance Optimization
  - [ ] 14.1 Optimize images
    - Implement image caching with Expo Image
    - Add lazy loading for list images
    - Compress uploaded images before sending
    - _Requirements: 2, 3, 6_
  
  - [ ] 14.2 Optimize lists
    - Use FlatList with proper keyExtractor
    - Implement getItemLayout for fixed-height items
    - Memoize list item components
    - Add pagination for long lists
    - _Requirements: 2, 6, 9, 12_
  
  - [ ] 14.3 Optimize map performance
    - Implement marker clustering
    - Limit visible markers to viewport
    - Debounce region change events
    - Cache map tiles
    - _Requirements: 2, 13_
  
  - [ ] 14.4 Optimize API calls
    - Implement request debouncing for search
    - Use React Query caching effectively
    - Implement pagination for lists
    - Reduce unnecessary re-renders
    - _Requirements: 2, 12_

- [ ] 15. Accessibility and Localization
  - [ ] 15.1 Implement accessibility features
    - Add accessibilityLabel to all interactive elements
    - Add accessibilityHint for complex interactions
    - Set accessibilityRole for all components
    - Ensure minimum touch target sizes (44x44)
    - Test with screen readers (VoiceOver, TalkBack)
    - _Requirements: All_
  
  - [ ] 15.2 Set up localization
    - Install and configure react-i18next
    - Create translation files (pt-BR, en)
    - Externalize all UI strings
    - Implement language switching
    - Format dates/times according to locale
    - _Requirements: All_

- [ ] 16. Build Configuration and Deployment
  - [ ] 16.1 Configure build settings
    - Set up app.json with proper configuration
    - Configure app icons and splash screen
    - Set up environment-specific configs (dev, staging, prod)
    - Configure app permissions in manifests
    - _Requirements: All_
  
  - [ ] 16.2 Set up error tracking
    - Install and configure Sentry
    - Set up error reporting
    - Configure source maps for stack traces
    - Test error reporting
    - _Requirements: 15_
  
  - [ ] 16.3 Prepare for app store submission
    - Create app store assets (screenshots, descriptions)
    - Configure app signing
    - Build production bundles (iOS, Android)
    - Test production builds
    - _Requirements: All_
  
  - [ ] 16.4 Create deployment documentation
    - Document build process
    - Document environment setup
    - Create release checklist
    - Document troubleshooting steps
    - _Requirements: All_

- [ ] 17. Final Integration and Polish
  - [ ] 17.1 Integrate all features
    - Test complete user flows end-to-end
    - Verify all API integrations
    - Test offline functionality
    - Verify push notifications
    - _Requirements: All_
  
  - [ ] 17.2 UI/UX polish
    - Add loading states to all async operations
    - Add smooth transitions between screens
    - Implement haptic feedback for interactions
    - Add empty states for all lists
    - Refine animations and micro-interactions
    - _Requirements: All_
  
  - [ ] 17.3 Performance testing
    - Test app performance on low-end devices
    - Measure and optimize bundle size
    - Test memory usage
    - Optimize startup time
    - _Requirements: All_
  
  - [ ] 17.4 Security audit
    - Review token storage implementation
    - Verify API communication security
    - Test permission handling
    - Review error messages for data leakage
    - _Requirements: 1, 8, 15_
