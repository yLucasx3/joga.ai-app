import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

export interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (chipKey: string, chipValue: string) => void;
}

/**
 * FilterChips component to display active filters as removable chips
 */
export const FilterChips: React.FC<FilterChipsProps> = ({ chips, onRemove }) => {
  if (chips.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {chips.map((chip) => (
          <View key={`${chip.key}-${chip.value}`} style={styles.chip}>
            <Text style={styles.chipLabel} numberOfLines={1}>
              {chip.label}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(chip.key, chip.value)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessible={true}
              accessibilityLabel={`Remove ${chip.label} filter`}
              accessibilityRole="button"
              accessibilityHint="Double tap to remove this filter"
            >
              <Ionicons name="close" size={16} color={colors.gray600} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 16,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    maxWidth: 200,
    minHeight: 32,
  },
  chipLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.xs,
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
