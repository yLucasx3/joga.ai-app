import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * SearchInput component with search icon and clear button
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search activities...',
  onFocus,
  onBlur,
}) => {
  const hasValue = value.trim().length > 0;

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Ionicons
        name="search"
        size={20}
        color={colors.gray400}
        style={styles.searchIcon}
      />

      {/* Text Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray400}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={onFocus}
        onBlur={onBlur}
        accessible={true}
        accessibilityLabel="Search activities"
        accessibilityHint="Type to search for activities by name or location"
        accessibilityRole="search"
      />

      {/* Clear Button */}
      {hasValue && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={20} color={colors.gray400} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.sm,
    height: 44,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
    paddingHorizontal: 0,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
