import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

interface DropdownProps {
  label: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string | string[];
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
  icon?: string;
}

/**
 * Dropdown component for selecting options
 * Supports single and multiple selection
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select...',
  options,
  value,
  multiple = false,
  onChange,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<View>(null);

  /**
   * Get display text for selected value(s)
   */
  const getDisplayText = (): string => {
    if (!value) return placeholder;

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find((opt) => opt.value === value[0]);
        return option?.label || placeholder;
      }
      return `${value.length} selected`;
    }

    const option = options.find((opt) => opt.value === value);
    return option?.label || placeholder;
  };

  /**
   * Check if option is selected
   */
  const isSelected = (optionValue: string): boolean => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  /**
   * Handle option press
   */
  const handleOptionPress = (optionValue: string) => {
    if (multiple) {
      const currentValues = (value as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  /**
   * Render option item
   */
  const renderOption = ({ item }: { item: DropdownOption }) => {
    const selected = isSelected(item.value);

    return (
      <TouchableOpacity
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => handleOptionPress(item.value)}
        activeOpacity={0.7}
      >
        {item.icon && <Text style={styles.optionIcon}>{item.icon}</Text>}
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {item.label}
        </Text>
        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.success}
            style={styles.checkmark}
          />
        )}
      </TouchableOpacity>
    );
  };

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : !!value;

  const selectedCount = multiple && Array.isArray(value) ? value.length : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.button, hasValue && styles.buttonActive]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
        <Text style={[styles.buttonText, hasValue && styles.buttonTextActive]}>
          {getDisplayText()}
        </Text>
        {selectedCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedCount}</Text>
          </View>
        )}
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.gray400}
          style={styles.chevron}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />

            {multiple && (
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray200,
    minWidth: 100,
  },
  buttonActive: {
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  buttonText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    fontWeight: typography.fontWeight.medium,
  },
  buttonTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semiBold,
  },
  badge: {
    backgroundColor: colors.gray700,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: Math.min(SCREEN_WIDTH - spacing.lg * 2, 400),
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  optionSelected: {
    backgroundColor: colors.gray50,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  optionText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semiBold,
  },
  checkmark: {
    marginLeft: spacing.sm,
  },
  modalFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
});
