/**
 * Confirm Participation Screen
 * 
 * Screen for confirming participation in an activity
 * Requires authentication to access
 * TODO: Implement in task 7.4
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProtectedScreen } from '../../components/auth/ProtectedScreen';

const ConfirmParticipationScreen: React.FC = () => {
  return (
    <ProtectedScreen>
      <View style={styles.container}>
        <Text style={styles.text}>Confirm Participation Screen</Text>
        <Text style={styles.subtext}>To be implemented in task 7</Text>
      </View>
    </ProtectedScreen>
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

export default ConfirmParticipationScreen;
