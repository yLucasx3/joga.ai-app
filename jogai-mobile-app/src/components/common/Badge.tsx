import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Badge component for status indicators
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          container: styles.successContainer,
          text: styles.successText,
        };
      case 'warning':
        return {
          container: styles.warningContainer,
          text: styles.warningText,
        };
      case 'error':
        return {
          container: styles.errorContainer,
          text: styles.errorText,
        };
      case 'info':
        return {
          container: styles.infoContainer,
          text: styles.infoText,
        };
      default:
        return {
          container: styles.defaultContainer,
          text: styles.defaultText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.container, variantStyles.container, style]}>
      <Text style={[styles.text, variantStyles.text, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  successContainer: {
    backgroundColor: colors.badgeSuccess,
  },
  successText: {
    color: colors.badgeSuccessText,
  },
  warningContainer: {
    backgroundColor: colors.badgeWarning,
  },
  warningText: {
    color: colors.badgeWarningText,
  },
  errorContainer: {
    backgroundColor: colors.badgeError,
  },
  errorText: {
    color: colors.badgeErrorText,
  },
  infoContainer: {
    backgroundColor: colors.badgeInfo,
  },
  infoText: {
    color: colors.badgeInfoText,
  },
  defaultContainer: {
    backgroundColor: colors.gray200,
  },
  defaultText: {
    color: colors.gray700,
  },
});
