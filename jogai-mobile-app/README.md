# Jogai Mobile App

Mobile application for connecting people who want to play sports. Built with React Native and Expo.

## 🚀 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: React Context + TanStack Query (React Query)
- **API Client**: Axios
- **Forms**: React Hook Form + Zod
- **Maps**: react-native-maps
- **Storage**: Expo SecureStore + AsyncStorage

## 📋 Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator
- Expo Go app on physical device (optional)

## 🛠️ Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your API URLs and keys

## 🏃 Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## 📱 Development

### Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # Reusable components
├── screens/      # Screen components
├── navigation/   # Navigation configuration
├── hooks/        # Custom hooks
├── contexts/     # React contexts
├── services/     # Business logic
├── types/        # TypeScript types
├── utils/        # Utility functions
├── constants/    # Constants and config
└── theme/        # Theme configuration
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 🔗 API Integration

The app connects to two backend services:

- **Authentication API**: `api-authentication` (default: http://localhost:3001)
- **App API**: `api-app` (default: http://localhost:3000)

Configure the URLs in your `.env` file.

## 📦 Building

```bash
# Build for development
expo build:android
expo build:ios

# Build for production (EAS)
eas build --platform android
eas build --platform ios
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📄 License

ISC
