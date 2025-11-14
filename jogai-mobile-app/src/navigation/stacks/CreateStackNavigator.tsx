/**
 * Create Stack Navigator
 * 
 * Stack navigator for activity creation flow
 * Handles court selection, sport selection, activity form, and review
 */

import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { CreateStackParamList } from '../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

// Import screens
import SelectCourtScreen from '../../screens/court/SelectCourtScreen';
import SelectSportScreen from '../../screens/court/SelectSportScreen';
import CreateActivityScreen from '../../screens/activity/CreateActivityScreen';
import ReviewActivityScreen from '../../screens/activity/ReviewActivityScreen';

const Stack = createStackNavigator<CreateStackParamList>();

/**
 * Create Stack Navigator Component
 */
const CreateStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SelectCourt"
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
        name="SelectCourt"
        component={SelectCourtScreen}
        options={{
          title: 'Select Court',
          headerShown: true,
        }}
      />
      
      <Stack.Screen
        name="SelectSport"
        component={SelectSportScreen}
        options={{
          title: 'Select Sport',
          headerShown: true,
        }}
      />
      
      <Stack.Screen
        name="CreateActivity"
        component={CreateActivityScreen}
        options={{
          title: 'Create Activity',
          headerShown: true,
        }}
      />
      
      <Stack.Screen
        name="ReviewActivity"
        component={ReviewActivityScreen}
        options={{
          title: 'Review Activity',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default CreateStackNavigator;
