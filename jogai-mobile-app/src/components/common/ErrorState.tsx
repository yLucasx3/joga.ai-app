import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * ErrorState component for full-screen error displays
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  icon = 'alert-circle',
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.error} />
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={retryLabel}
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={20} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    minWidth: 150,
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
});
