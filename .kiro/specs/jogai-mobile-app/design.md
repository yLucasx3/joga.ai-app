# Design Document - Jogai Mobile App

## Overview

The Jogai Mobile App is a cross-platform mobile application built with React Native and Expo that enables users to discover, create, and participate in sports activities. The app follows a modern, sports-focused design with an orange primary color scheme and emphasizes visual content through maps, images, and intuitive navigation patterns.

## Architecture

### Technology Stack

- **Framework**: React Native with Expo SDK 51+
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **State Management**: React Context API + React Query (TanStack Query)
- **API Client**: Axios with interceptors
- **Maps**: react-native-maps (Google Maps for Android, Apple Maps for iOS)
- **Forms**: React Hook Form + Zod validation
- **Storage**: Expo SecureStore (tokens) + AsyncStorage (cache)
- **Push Notifications**: Expo Notifications
- **Image Handling**: Expo Image Picker + Expo Image
- **Date/Time**: date-fns
- **UI Components**: Custom components + React Native Paper (base)
- **Icons**: @expo/vector-icons (MaterialCommunityIcons, Ionicons)

### Project Structure

```
jogai-mobile-app/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.ts          # Axios instance with interceptors
│   │   ├── auth.api.ts        # Authentication endpoints
│   │   ├── activity.api.ts    # Activity endpoints
│   │   ├── court.api.ts       # Court endpoints
│   │   └── user.api.ts        # User endpoints
│   ├── components/            # Reusable components
│   │   ├── common/           # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Avatar.tsx
│   │   ├── activity/         # Activity-specific components
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ActivityDetails.tsx
│   │   │   ├── ParticipantList.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── court/            # Court-specific components
│   │   │   ├── CourtCard.tsx
│   │   │   └── CourtAmenities.tsx
│   │   ├── sport/            # Sport-specific components
│   │   │   ├── SportGrid.tsx
│   │   │   └── SportCard.tsx
│   │   ├── map/              # Map components
│   │   │   ├── MapView.tsx
│   │   │   └── ActivityMarker.tsx
│   │   └── forms/            # Form components
│   │       ├── DatePicker.tsx
│   │       ├── TimePicker.tsx
│   │       └── Slider.tsx
│   ├── screens/              # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── onboarding/
│   │   │   └── SportSelectionScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── SearchScreen.tsx
│   │   ├── activity/
│   │   │   ├── ActivityDetailsScreen.tsx
│   │   │   ├── CreateActivityScreen.tsx
│   │   │   ├── ReviewActivityScreen.tsx
│   │   │   └── ConfirmParticipationScreen.tsx
│   │   ├── court/
│   │   │   └── SelectCourtScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── EditProfileScreen.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   ├── navigation/           # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useActivities.ts
│   │   ├── useLocation.ts
│   │   └── useNotifications.ts
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts
│   │   ├── storage.service.ts
│   │   ├── notification.service.ts
│   │   └── location.service.ts
│   ├── types/               # TypeScript types
│   │   ├── api.types.ts
│   │   ├── activity.types.ts
│   │   ├── user.types.ts
│   │   └── navigation.types.ts
│   ├── utils/               # Utility functions
│   │   ├── date.utils.ts
│   │   ├── validation.utils.ts
│   │   └── format.utils.ts
│   ├── constants/           # Constants
│   │   ├── colors.ts
│   │   ├── sports.ts
│   │   └── config.ts
│   └── theme/              # Theme configuration
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── assets/                 # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── app.json               # Expo configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Components and Interfaces

### Core Components

#### 1. Button Component
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}
```

#### 2. ActivityCard Component
```typescript
interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  showDistance?: boolean;
}

interface Activity {
  id: string;
  title: string;
  sport: Sport;
  location: Location;
  startDate: Date;
  endDate: Date;
  currentPlayers: number;
  maxPlayers: number;
  status: ActivityStatus;
  imageUrl?: string;
  distance?: number;
}
```

#### 3. CourtCard Component
```typescript
interface CourtCardProps {
  court: Court;
  onPress: () => void;
}

interface Court {
  id: string;
  name: string;
  establishment: Establishment;
  distance: number;
  imageUrl?: string;
  amenities: Amenity[];
  sports: Sport[];
}
```

#### 4. SportGrid Component
```typescript
interface SportGridProps {
  sports: Sport[];
  selectedSports: string[];
  onSelectSport: (sportKey: string) => void;
  multiSelect?: boolean;
}

interface Sport {
  key: string;
  name: string;
  icon: string;
  imageUrl?: string;
}
```

#### 5. MapView Component
```typescript
interface MapViewProps {
  activities: Activity[];
  onMarkerPress: (activity: Activity) => void;
  onRegionChange: (region: Region) => void;
  userLocation?: Coordinate;
  showUserLocation?: boolean;
}
```

### Navigation Structure

```typescript
// Root Navigator
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

// Auth Navigator
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Navigator (Bottom Tabs)
type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// Home Stack
type HomeStackParamList = {
  HomeMap: undefined;
  ActivityDetails: { activityId: string };
  ConfirmParticipation: { activityId: string };
};

// Create Stack
type CreateStackParamList = {
  SelectCourt: undefined;
  SelectSport: { courtId: string };
  CreateActivity: { courtId: string; sportKey: string };
  ReviewActivity: { activityData: CreateActivityData };
};
```

## Data Models

### API Response Types

```typescript
// Authentication
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  sports: string[];
  notificationsEnabled: boolean;
}

// Activities
interface ActivityResponse {
  id: string;
  title: string;
  description?: string;
  sportKey: string;
  type: 'PUBLIC' | 'PRIVATE';
  status: 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED';
  startDate: string;
  endDate: string;
  maxPlayers: number;
  currentPlayers: number;
  shareToken?: string;
  shareExpiresAt?: string;
  organizer: Organizer;
  field: Field;
  participants: Participant[];
  location: Location;
  createdAt: string;
  updatedAt: string;
}

interface Organizer {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Participant {
  id: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  status: 'CONFIRMED' | 'CANCELLED';
  joinedAt: string;
}

interface Field {
  id: string;
  name: string;
  capacity: number;
  imageUrl?: string;
  establishment: Establishment;
  amenities: string[];
}

interface Establishment {
  id: string;
  name: string;
  address: Address;
}

interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// Courts
interface CourtResponse {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  dimensions?: FieldDimensions;
  imageUrl?: string;
  establishment: Establishment;
  sports: Sport[];
  amenities: Amenity[];
  pricingRules: PricingRule[];
}

interface FieldDimensions {
  length: number;
  width: number;
  unit: 'METERS' | 'FEET';
}

interface Amenity {
  key: string;
  name: string;
  icon: string;
}

interface PricingRule {
  period: 'PEAK' | 'OFF_PEAK' | 'WEEKEND' | 'HOLIDAY';
  pricePerHour: number;
  minDuration: number;
  maxDuration: number;
}

// Create Activity Request
interface CreateActivityRequest {
  title: string;
  description?: string;
  sportKey: string;
  fieldId: string;
  type: 'PUBLIC' | 'PRIVATE';
  startDate: string;
  endDate: string;
  maxPlayers: number;
  shareExpiresAt?: string;
}

// Participation Request
interface ParticipationRequest {
  activityId: string;
  name: string;
  phone: string;
}
```

## Error Handling

### Error Types

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  ACTIVITY_FULL = 'ACTIVITY_FULL',
  ALREADY_PARTICIPANT = 'ALREADY_PARTICIPANT',
}
```

### Error Handling Strategy

1. **Network Errors**: Display retry button with offline indicator
2. **Authentication Errors**: Clear tokens and redirect to login
3. **Validation Errors**: Show field-specific error messages
4. **Business Logic Errors**: Display user-friendly messages with context
5. **Unexpected Errors**: Log to error tracking service and show generic message

## Testing Strategy

### Unit Tests
- Utility functions (date formatting, validation)
- Custom hooks (useAuth, useActivities)
- Service layer (auth.service, storage.service)
- Component logic (form validation, state management)

### Integration Tests
- API client with mocked responses
- Navigation flows
- Form submissions
- Authentication flow

### E2E Tests (Detox)
- Complete user flows:
  - Registration → Onboarding → Home
  - Browse activities → View details → Join
  - Create activity flow
  - Profile management

### Component Tests (React Native Testing Library)
- Button interactions
- Form inputs
- Card rendering
- List rendering

## Performance Optimization

### Strategies

1. **Image Optimization**
   - Use Expo Image with caching
   - Lazy load images in lists
   - Compress uploaded images

2. **List Performance**
   - Use FlatList with proper keyExtractor
   - Implement getItemLayout for fixed-height items
   - Use memo for list items

3. **Map Performance**
   - Cluster markers when zoomed out
   - Limit visible markers to viewport
   - Debounce region change events

4. **API Optimization**
   - Implement request caching with React Query
   - Use pagination for lists
   - Debounce search inputs

5. **Bundle Size**
   - Use Expo's selective imports
   - Lazy load screens
   - Optimize images and assets

## Security Considerations

### Authentication
- Store tokens in Expo SecureStore
- Implement token refresh mechanism
- Clear sensitive data on logout

### API Communication
- Use HTTPS only
- Implement certificate pinning (production)
- Validate all API responses

### Data Protection
- Never log sensitive information
- Sanitize user inputs
- Implement proper error messages (no sensitive data leakage)

### Permissions
- Request permissions with clear explanations
- Handle permission denials gracefully
- Provide fallback functionality when possible

## Accessibility

### Requirements
- Support screen readers (iOS VoiceOver, Android TalkBack)
- Minimum touch target size: 44x44 points
- Sufficient color contrast (WCAG AA)
- Keyboard navigation support
- Descriptive labels for all interactive elements

### Implementation
- Use accessibilityLabel for all buttons and interactive elements
- Use accessibilityHint for complex interactions
- Use accessibilityRole to define element types
- Test with screen readers enabled

## Offline Support

### Cached Data
- Recently viewed activities
- User profile information
- Sport preferences
- Map tiles (limited)

### Queued Actions
- Activity participation requests
- Profile updates
- Notification preferences

### Sync Strategy
- Automatic sync on connection restore
- Manual refresh option
- Conflict resolution (server wins)

## Push Notifications

### Notification Types
1. **Participation Confirmed**: When user joins an activity
2. **Activity Cancelled**: When an activity is cancelled
3. **Activity Updated**: When activity details change
4. **New Participant**: When someone joins user's activity
5. **Activity Starting Soon**: Reminder before activity starts
6. **Activity Full**: When activity reaches max capacity

### Implementation
- Register device token on login
- Handle notification permissions
- Deep linking to relevant screens
- Badge count management
- Notification preferences in settings

## Localization

### Initial Support
- Portuguese (Brazil) - Primary language
- English - Secondary language

### Implementation
- Use i18n library (react-i18next)
- Externalize all strings
- Format dates/times according to locale
- Support RTL layouts (future)

## Analytics and Monitoring

### Events to Track
- Screen views
- Button clicks
- Activity creation
- Activity participation
- Search queries
- Errors and crashes

### Tools
- Expo Analytics (basic)
- Sentry (error tracking)
- Custom analytics endpoint (Backend API)

## Deployment

### Build Configuration
- Development: Expo Go
- Staging: Internal distribution (TestFlight, Internal Testing)
- Production: App Store, Google Play

### Environment Variables
```typescript
interface AppConfig {
  API_BASE_URL: string;
  API_AUTH_URL: string;
  GOOGLE_MAPS_API_KEY: string;
  SENTRY_DSN?: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}
```

### Release Process
1. Version bump (semantic versioning)
2. Update changelog
3. Run tests
4. Build for platforms
5. Submit to stores
6. Monitor crash reports

## Future Enhancements

### Phase 2 Features
- In-app chat between participants
- Activity ratings and reviews
- Social features (friends, followers)
- Activity recommendations based on preferences
- Calendar integration
- Payment integration for paid activities

### Technical Improvements
- Implement GraphQL for more efficient data fetching
- Add real-time updates with WebSockets
- Implement advanced caching strategies
- Add biometric authentication
- Implement app shortcuts (iOS, Android)
