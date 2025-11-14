/**
 * Navigation Types
 * 
 * Defines all navigation parameter lists for type-safe navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root Stack Navigator
 * Top-level navigator that switches between Auth, Onboarding, and Main flows
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

/**
 * Auth Stack Navigator
 * Handles authentication flow (Login, Register, Forgot Password)
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/**
 * Main Tab Navigator
 * Bottom tab navigation for main app features
 */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: undefined;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  NotificationsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Home Stack Navigator
 * Handles home screen and activity viewing flow
 */
export type HomeStackParamList = {
  HomeMap: undefined;
  ActivityDetails: { activityId: string };
  ConfirmParticipation: { activityId: string };
};

/**
 * Create Stack Navigator
 * Handles activity creation flow
 */
export type CreateStackParamList = {
  SelectCourt: undefined;
  SelectSport: { courtId: string };
  CreateActivity: { courtId: string; sportKey: string };
  ReviewActivity: { activityData: CreateActivityData };
};

/**
 * Profile Stack Navigator
 * Handles profile and settings flow
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};

/**
 * Activity creation data structure
 */
export interface CreateActivityData {
  title: string;
  description?: string;
  sportKey: string;
  fieldId: string;
  courtId: string;
  courtName: string;
  type: 'PUBLIC' | 'PRIVATE';
  startDate: Date;
  endDate: Date;
  maxPlayers: number;
  shareExpiresAt?: Date;
}

/**
 * Type declarations for navigation props
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
