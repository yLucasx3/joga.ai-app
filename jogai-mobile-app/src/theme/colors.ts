export const colors = {
  // Primary
  primary: '#E67E22',
  primaryLight: '#F39C12',
  primaryDark: '#D35400',

  // Secondary
  secondary: '#27AE60',
  secondaryLight: '#2ECC71',
  secondaryDark: '#229954',

  // Status
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F3F5',

  // Text
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',

  // Border
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  borderDark: '#CED4DA',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Badge
  badgeSuccess: '#D4EDDA',
  badgeSuccessText: '#155724',
  badgeWarning: '#FFF3CD',
  badgeWarningText: '#856404',
  badgeError: '#F8D7DA',
  badgeErrorText: '#721C24',
  badgeInfo: '#D1ECF1',
  badgeInfoText: '#0C5460',

  // Activity Status
  statusOpen: '#27AE60',
  statusFull: '#E74C3C',
  statusCancelled: '#95A5A6',
  statusCompleted: '#3498DB',
} as const;

export type Colors = typeof colors;
