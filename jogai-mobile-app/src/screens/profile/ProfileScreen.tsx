/**
 * Profile Screen
 * 
 * Screen for viewing and managing user profile
 * Shows login prompt if user is not authenticated
 * TODO: Implement in task 9.1
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { storageService } from '../../services/storage.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

type RootNavigation = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigation = useNavigation<RootNavigation>();

  const handleLoginPress = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleShowStorage = async () => {
    try {
      // Get all storage data
      const accessToken = await storageService.getAccessToken();
      const refreshToken = await storageService.getRefreshToken();
      const userData = await storageService.getUser();
      const preferences = await storageService.getPreferences();
      const onboardingCompleted = await storageService.isOnboardingCompleted();

      // Format data for display
      const storageData = {
        'Access Token': accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
        'Refresh Token': refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
        'User Data': userData ? JSON.stringify(userData, null, 2) : 'null',
        'Preferences': preferences ? JSON.stringify(preferences, null, 2) : 'null',
        'Onboarding Completed': onboardingCompleted ? 'Yes' : 'No',
      };

      // Create formatted message
      const message = Object.entries(storageData)
        .map(([key, value]) => `${key}:\n${value}`)
        .join('\n\n');

      Alert.alert('📦 Storage Data', message, [
        { text: 'Copy to Console', onPress: () => console.log('Storage Data:', storageData) },
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to read storage data');
      console.error('Storage read error:', error);
    }
  };

  const handleGoToOnboarding = () => {
    navigation.navigate('Onboarding');
  };

  const handleSimulateNewUser = async () => {
    Alert.alert(
      '🧪 Simulate New User',
      'This will create a fake user and mark onboarding as incomplete.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Simulate',
          onPress: async () => {
            try {
              // Clear storage first
              await storageService.clearAll();
              
              // Create fake user
              await storageService.saveUser({
                id: 'test-user-123',
                email: 'test@example.com',
                name: 'Test User',
              });
              
              // Mark onboarding as NOT completed
              await storageService.setOnboardingCompleted(false);
              
              Alert.alert(
                '✅ Success',
                'Fake user created! Close and reopen the app to see onboarding.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to simulate user');
            }
          },
        },
      ]
    );
  };

  const handleClearStorage = async () => {
    Alert.alert(
      '🧹 Clear Storage',
      'This will clear all app data including authentication and preferences. You will need to login again.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearAll();
              Alert.alert(
                '✅ Success',
                'Storage cleared! Please restart the app to see the onboarding screen.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Force logout to reset auth state
                      // logout();
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear storage');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Joga.ai</Text>
        <Text style={styles.subtext}>Login to access your profile and more features</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>Login / Sign Up</Text>
        </TouchableOpacity>
        
        {/* Debug Buttons */}
        <Text style={styles.debugTitle}>🛠️ Debug Tools</Text>
        <View style={styles.debugContainer}>
          <TouchableOpacity style={styles.debugButtonInfo} onPress={handleShowStorage}>
            <Text style={styles.debugButtonText}>📦 Storage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.debugButton} onPress={handleClearStorage}>
            <Text style={styles.debugButtonText}>🧹 Clear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.debugContainer}>
          <TouchableOpacity style={styles.debugButtonSuccess} onPress={handleSimulateNewUser}>
            <Text style={styles.debugButtonText}>🧪 Simulate User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.debugButtonWarning} onPress={handleGoToOnboarding}>
            <Text style={styles.debugButtonText}>🎯 Go to Onboarding</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Text style={styles.subtext}>Logged in as: {user?.name || user?.email}</Text>
      <Text style={styles.subtext}>To be implemented in task 9</Text>
      
      {/* Debug Buttons */}
      <Text style={styles.debugTitle}>🛠️ Debug Tools</Text>
      <View style={styles.debugContainer}>
        <TouchableOpacity style={styles.debugButtonInfo} onPress={handleShowStorage}>
          <Text style={styles.debugButtonText}>📦 Storage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.debugButton} onPress={handleClearStorage}>
          <Text style={styles.debugButtonText}>🧹 Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.debugContainer}>
        <TouchableOpacity style={styles.debugButtonSuccess} onPress={handleSimulateNewUser}>
          <Text style={styles.debugButtonText}>🧪 Simulate User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.debugButtonWarning} onPress={handleGoToOnboarding}>
          <Text style={styles.debugButtonText}>🎯 Go to Onboarding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  text: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.lg,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
  debugTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  debugContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  debugButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  debugButtonInfo: {
    backgroundColor: colors.info,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  debugButtonSuccess: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  debugButtonWarning: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  debugButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});

export default ProfileScreen;
