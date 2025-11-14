import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_HEIGHT = 200;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

interface BottomSheetProps {
  children: ReactNode;
  height?: number;
}

/**
 * Bottom sheet component for displaying content over the map
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  height = MAX_HEIGHT,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.handle}>
        <View style={styles.handleBar} />
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray300,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
