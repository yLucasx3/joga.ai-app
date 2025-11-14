/**
 * Hook to require authentication before performing actions
 * 
 * Used to prompt login when user tries to:
 * - Create an activity
 * - Join/participate in an activity
 */

import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './useAuth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type RootNavigation = StackNavigationProp<RootStackParamList>;

interface UseRequireAuthReturn {
  /**
   * Check if user is authenticated, if not navigate to login
   * @returns true if authenticated, false if redirected to login
   */
  requireAuth: () => boolean;
  
  /**
   * Execute callback only if authenticated, otherwise redirect to login
   * @param callback Function to execute if authenticated
   * @param onAuthRequired Optional callback when auth is required
   */
  withAuth: <T>(
    callback: () => T,
    onAuthRequired?: () => void
  ) => T | undefined;
}

export const useRequireAuth = (): UseRequireAuthReturn => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<RootNavigation>();

  const requireAuth = useCallback((): boolean => {
    if (!isAuthenticated) {
      // Navigate to auth screen
      navigation.navigate('Auth', { screen: 'Login' });
      return false;
    }
    return true;
  }, [isAuthenticated, navigation]);

  const withAuth = useCallback(
    <T,>(callback: () => T, onAuthRequired?: () => void): T | undefined => {
      if (!isAuthenticated) {
        onAuthRequired?.();
        navigation.navigate('Auth', { screen: 'Login' });
        return undefined;
      }
      return callback();
    },
    [isAuthenticated, navigation]
  );

  return {
    requireAuth,
    withAuth,
  };
};
