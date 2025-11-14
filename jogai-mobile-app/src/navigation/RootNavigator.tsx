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
  const { isLoading } = useAuth();

  /**
   * Show loading screen while checking auth status
   */
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName="Main"
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
            gestureEnabled: false,
          }}
        />
        
        {/* Onboarding flow - shown after first login */}
        <Stack.Screen 
          name="Onboarding" 
          component={SportSelectionScreen}
          options={{
            presentation: 'modal',
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
