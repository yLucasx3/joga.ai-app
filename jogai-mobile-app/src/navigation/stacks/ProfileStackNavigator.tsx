/**
 * Profile Stack Navigator
 * 
 * Stack navigator for profile management flow
 * Handles profile view and edit profile
 */

import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { ProfileStackParamList } from '../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

// Import screens
import ProfileScreen from '../../screens/profile/ProfileScreen';
import EditProfileScreen from '../../screens/profile/EditProfileScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

/**
 * Profile Stack Navigator Component
 */
const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
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
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
