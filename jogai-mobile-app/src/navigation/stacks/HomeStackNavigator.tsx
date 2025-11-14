/**
 * Home Stack Navigator
 * 
 * Stack navigator for home flow
 * Handles home map, activity details, and participation confirmation
 */

import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { HomeStackParamList } from '../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

// Import screens
import HomeScreen from '../../screens/home/HomeScreen';
import ActivityDetailsScreen from '../../screens/activity/ActivityDetailsScreen';
import ConfirmParticipationScreen from '../../screens/activity/ConfirmParticipationScreen';

const Stack = createStackNavigator<HomeStackParamList>();

/**
 * Home Stack Navigator Component
 */
const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeMap"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontSize: typography.fontSize.lg,
          fontWeight: '600',
        },
        cardStyle: { backgroundColor: colors.background },
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name="HomeMap"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="ActivityDetails"
        component={ActivityDetailsScreen}
        options={{
          title: 'Activity Details',
          headerShown: true,
        }}
      />
      
      <Stack.Screen
        name="ConfirmParticipation"
        component={ConfirmParticipationScreen}
        options={{
          title: 'Confirm Participation',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
