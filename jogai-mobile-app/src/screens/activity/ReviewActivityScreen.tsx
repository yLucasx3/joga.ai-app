/**
 * Review Activity Screen
 * 
 * Screen for reviewing activity before creation
 * TODO: Implement in task 8.7
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ReviewActivityScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Review Activity Screen</Text>
      <Text style={styles.subtext}>To be implemented in task 8</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
});

export default ReviewActivityScreen;
