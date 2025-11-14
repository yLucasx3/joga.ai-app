/**
 * Protected Screen Component
 * 
 * Wrapper component that checks authentication before rendering
 * Redirects to login if user is not authenticated
 */

import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';

type RootNavigation = StackNavigationProp<RootStackParamList>;

interface ProtectedScreenProps {
  children: React.ReactNode;
}

export const ProtectedScreen: React.FC<ProtectedScreenProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<RootNavigation>();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login screen
      navigation.navigate('Auth', { screen: 'Login' });
    }
  }, [isAuthenticated, navigation]);

  // Only render children if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
