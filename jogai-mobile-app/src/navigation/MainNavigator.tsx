/**
 * Main Navigator
 * 
 * Bottom tab navigator for main app features
 * Includes Home, Search, Create, Notifications, and Profile tabs
 */

import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

// Import stack navigators (will be created in next subtask)
import HomeStackNavigator from './stacks/HomeStackNavigator';
import CreateStackNavigator from './stacks/CreateStackNavigator';
import ProfileStackNavigator from './stacks/ProfileStackNavigator';

// Import screens
import SearchScreen from '../screens/home/SearchScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Custom FAB button for Create tab
 */
const CreateTabButton: React.FC<{ onPress?: (e: any) => void }> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.fabContainer}
    onPress={(e) => onPress?.(e)}
    activeOpacity={0.8}
  >
    <View style={styles.fab}>
      <MaterialCommunityIcons name="plus" size={28} color={colors.white} />
    </View>
  </TouchableOpacity>
);

/**
 * Main Navigator Component
 */
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <CreateTabButton onPress={props.onPress} />
          ),
        }}
      />
      
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarBadge: undefined, // Can be set dynamically for unread count
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
    paddingTop: spacing.sm,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabBarIcon: {
    marginBottom: -4,
  },
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default MainNavigator;
