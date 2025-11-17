import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export type EmptyStateType = 'no-activities' | 'no-results' | 'no-location' | 'error';

export interface EmptyStateConfig {
  type: EmptyStateType;
  icon?: string;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface EmptyStateProps {
  config: EmptyStateConfig;
}

const DEFAULT_CONFIGS: Record<EmptyStateType, Omit<EmptyStateConfig, 'type'>> = {
  'no-activities': {
    icon: '🏃',
    title: 'No activities yet',
    message: 'Be the first to create an activity in your area!',
  },
  'no-results': {
    icon: '🔍',
    title: 'No activities found',
    message: 'Try adjusting your filters or expanding your search radius',
  },
  'no-location': {
    icon: '📍',
    title: 'Location not available',
    message: 'Enable location services to find activities near you',
  },
  'error': {
    icon: '⚠️',
    title: 'Unable to load activities',
    message: 'Please check your connection and try again',
  },
};

/**
 * EmptyState component for displaying various empty states
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ config }) => {
  const defaultConfig = DEFAULT_CONFIGS[config.type];
  
  const icon = config.icon || defaultConfig.icon;
  const title = config.title || defaultConfig.title;
  const message = config.message || defaultConfig.message;
  const action = config.action;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.message}>{message}</Text>

      {action && (
        <TouchableOpacity
          style={styles.button}
          onPress={action.onPress}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={action.label}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
});
