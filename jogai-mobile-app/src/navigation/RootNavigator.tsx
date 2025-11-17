/**
 * Root Navigator
 * 
 * Top-level navigator that handles conditional rendering between
 * Auth, Onboarding, and Main flows based on authentication state
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../hooks/useAuth';
import { storageService } from '../services/storage.service';
import { navigationTheme } from './theme';
import { RootStackParamList } from './types';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { SportSelectionScreen } from '../screens/onboarding/SportSelectionScreen';
import { colors } from '../theme/colors';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Deep linking configuration
 */
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['jogai://', 'https://jogai.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Onboarding: 'onboarding',
      Main: {
        screens: {
          HomeTab: {
            screens: {
              HomeMap: 'home',
              ActivityDetails: 'activity/:activityId',
              ConfirmParticipation: 'activity/:activityId/join',
            },
          },
          SearchTab: 'search',
          CreateTab: {
            screens: {
              SelectCourt: 'create/court',
              SelectSport: 'create/sport',
              CreateActivity: 'create/activity',
              ReviewActivity: 'create/review',
            },
          },
          NotificationsTab: 'notifications',
          ProfileTab: {
            screens: {
              ProfileMain: 'profile',
              EditProfile: 'profile/edit',
            },
          },
        },
      },
    },
  },
};

/**
 * Root Navigator Component
 */
const RootNavigator: React.FC = () => {
  const { isLoading: authIsLoading, isAuthenticated } = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  
  // Use a ref to track if we've already initialized
  const hasInitialized = React.useRef(false);
  
  // Separate loading state to prevent re-renders
  const [isInitializing, setIsInitializing] = React.useState(true);
  
  // Only use authIsLoading for initial load
  const isLoading = hasInitialized.current ? false : authIsLoading;

  /**
   * Determine initial route based on auth and onboarding status
   */
  const getInitialRouteName = (): keyof RootStackParamList => {
    // If authenticated and onboarding not completed, show onboarding
    if (!isOnboardingCompleted) {
      return 'Onboarding';
    }
    
    // Otherwise show main app
    return 'Main';
  };

  /**
   * Check if onboarding is completed - ONLY ONCE on mount
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Wait for auth to finish loading first
        if (authIsLoading) {
          return;
        }

        if (!hasInitialized.current) {
          hasInitialized.current = true;
        }

        const completed = await storageService.isOnboardingCompleted();
        setIsOnboardingCompleted(completed);
        setIsCheckingOnboarding(false);
        setIsInitializing(false);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsOnboardingCompleted(true); // Default to completed on error
        setIsCheckingOnboarding(false);
        setIsInitializing(false);
      }
    };

    if (!authIsLoading && isCheckingOnboarding) {
      initialize();
    }
  }, [authIsLoading, isCheckingOnboarding, isAuthenticated]); // ✅ Só executa quando necessário

  /**
   * Show loading screen while checking auth status or onboarding
   */
  if (isInitializing || isCheckingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Main app flow - always accessible */}
        <Stack.Screen name="Main" component={MainNavigator} />
        
        {/* Auth flow - shown as modal when needed */}
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{
            presentation: 'modal',
            gestureEnabled: false, // ✅ Desabilita gesto de fechar
            gestureDirection: 'vertical',
          }}
          listeners={() => ({
            beforeRemove: (e) => {
              // Prevent automatic close on state changes
              const action = e.data.action;
              if (action.type !== 'GO_BACK' && action.type !== 'NAVIGATE') {
                e.preventDefault();
              }
            },
          })}
        />
        
        {/* Onboarding flow - shown after first login */}
        <Stack.Screen 
          name="Onboarding" 
          component={SportSelectionScreen}
          options={{
            presentation: 'card',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
