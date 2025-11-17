import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for secure storage
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const SESSION_ID_KEY = 'session_id';
const USER_KEY = 'user_data';

// Keys for async storage (non-sensitive data)
const PREFERENCES_KEY = 'user_preferences';
const ONBOARDING_KEY = 'onboarding_completed';

/**
 * Storage service for managing secure and non-secure data
 */
export const storageService = {
  // Token Management (Secure)
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      // Use Promise.all for atomic operation - both succeed or both fail
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
      // If saving fails, attempt to clear any partially saved data
      try {
        await this.clearTokens();
      } catch (clearError) {
        console.error('Error clearing tokens after failed save:', clearError);
      }
      throw new Error('Failed to save authentication tokens');
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },

  // Session ID Management (Secure)
  async saveSessionId(sessionId: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(SESSION_ID_KEY, sessionId);
    } catch (error) {
      console.error('Error saving session ID:', error);
      throw new Error('Failed to save session ID');
    }
  },

  async getSessionId(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(SESSION_ID_KEY);
    } catch (error) {
      console.error('Error getting session ID:', error);
      return null;
    }
  },

  async clearSessionId(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SESSION_ID_KEY);
    } catch (error) {
      console.error('Error clearing session ID:', error);
    }
  },

  // User Data (Secure)
  async saveUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async clearUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  // Preferences (Non-secure)
  async savePreferences(preferences: any): Promise<void> {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Failed to save preferences');
    }
  },

  async getPreferences(): Promise<any | null> {
    try {
      const preferences = await AsyncStorage.getItem(PREFERENCES_KEY);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  },

  // Onboarding
  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(completed));
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  },

  async getOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      return completed ? JSON.parse(completed) : false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },

  async isOnboardingCompleted(): Promise<boolean> {
    return this.getOnboardingCompleted();
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.clearTokens(),
        this.clearSessionId(),
        this.clearUser(),
        AsyncStorage.removeItem(PREFERENCES_KEY),
        AsyncStorage.removeItem(ONBOARDING_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
