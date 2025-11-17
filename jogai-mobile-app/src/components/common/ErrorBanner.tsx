import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

/**
 * ErrorBanner component for displaying temporary error messages at the top of the screen
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  onRetry,
  type = 'error',
}) => {
  const getIconName = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'alert-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.error;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Ionicons name={getIconName()} size={20} color={colors.white} style={styles.icon} />
      
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityLabel="Retry"
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={18} color={colors.white} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.dismissButton}
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessible={true}
        accessibilityLabel="Dismiss error"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  retryButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  dismissButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
