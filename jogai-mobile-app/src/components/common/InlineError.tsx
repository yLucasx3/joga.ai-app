import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface InlineErrorProps {
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  type?: 'error' | 'warning' | 'info';
}

/**
 * InlineError component for small inline error messages
 */
export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  action,
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

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.error;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return '#FFF3CD';
      case 'info':
        return '#D1ECF1';
      default:
        return '#F8D7DA';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Ionicons name={getIconName()} size={20} color={getIconColor()} style={styles.icon} />
      
      <Text style={styles.message}>{message}</Text>

      {action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={action.onPress}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={action.label}
          accessibilityRole="button"
        >
          <Text style={[styles.actionText, { color: getIconColor() }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  icon: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
});
