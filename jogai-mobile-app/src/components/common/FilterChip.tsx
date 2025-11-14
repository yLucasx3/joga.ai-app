import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  icon?: string;
}

/**
 * Filter chip component for filtering options
 */
export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.containerSelected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginRight: spacing.sm,
  },
  containerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.white,
  },
});
