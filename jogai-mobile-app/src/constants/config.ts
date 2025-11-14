export const config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3334',
  API_AUTH_URL: process.env.EXPO_PUBLIC_API_AUTH_URL || 'http://localhost:3333',
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  ENVIRONMENT: (process.env.EXPO_PUBLIC_ENVIRONMENT as 'development' | 'staging' | 'production') || 'development',
} as const;

export type AppConfig = typeof config;
