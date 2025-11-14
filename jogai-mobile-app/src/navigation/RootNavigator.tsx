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
  const { isAuthenticated, isLoading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  /**
   * Check if user has completed onboarding
   */
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await storageService.getOnboardingCompleted();
        setHasCompletedOnboarding(completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      checkOnboarding();
    } else if (!isLoading) {
      setIsCheckingOnboarding(false);
      setHasCompletedOnboarding(null);
    }
  }, [isAuthenticated, isLoading]);

  /**
   * Show loading screen while checking auth and onboarding status
   */
  if (isLoading || isCheckingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  /**
   * Determine initial route based on auth and onboarding status
   */
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) {
      return 'Auth';
    }
    
    if (!hasCompletedOnboarding) {
      return 'Onboarding';
    }
    
    return 'Main';
  };

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        {!isAuthenticated ? (
          // Auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !hasCompletedOnboarding ? (
          // Onboarding flow
          <Stack.Screen name="Onboarding" component={SportSelectionScreen} />
        ) : (
          // Main app flow
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
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
