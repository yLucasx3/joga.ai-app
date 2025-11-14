/**
 * Navigation Theme
 * 
 * Configures React Navigation theme to match app theme
 */

import { DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { colors } from '../theme/colors';

/**
 * Custom navigation theme matching app design
 */
export const navigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.error,
  },
};
