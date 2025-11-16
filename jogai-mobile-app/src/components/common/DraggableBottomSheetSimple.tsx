import React, { ReactNode, useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define snap points as percentages of screen height
const SNAP_POINTS = {
  MIN: SCREEN_HEIGHT * 0.25, // 25% - Minimized
  MID: SCREEN_HEIGHT * 0.5, // 50% - Medium
  MAX: SCREEN_HEIGHT * 0.85, // 85% - Maximized
};

interface DraggableBottomSheetSimpleProps {
  children: ReactNode;
  initialSnapPoint?: 'MIN' | 'MID' | 'MAX';
  onSnapPointChange?: (snapPoint: 'MIN' | 'MID' | 'MAX') => void;
}

/**
 * Draggable bottom sheet component with snap points
 * Uses React Native Animated API (no reanimated dependency)
 */
export const DraggableBottomSheetSimple: React.FC<
  DraggableBottomSheetSimpleProps
> = ({ children, initialSnapPoint = 'MID', onSnapPointChange }) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState<'MIN' | 'MID' | 'MAX'>(
    initialSnapPoint
  );

  // Animation value for translateY
  const translateY = useRef(
    new Animated.Value(SCREEN_HEIGHT - SNAP_POINTS[initialSnapPoint])
  ).current;

  // Track the current height for gesture calculations
  const currentHeight = useRef(SNAP_POINTS[initialSnapPoint]);

  /**
   * Find nearest snap point
   */
  const findNearestSnapPoint = (height: number): 'MIN' | 'MID' | 'MAX' => {
    const distances = {
      MIN: Math.abs(height - SNAP_POINTS.MIN),
      MID: Math.abs(height - SNAP_POINTS.MID),
      MAX: Math.abs(height - SNAP_POINTS.MAX),
    };

    if (distances.MIN <= distances.MID && distances.MIN <= distances.MAX) {
      return 'MIN';
    }
    if (distances.MID <= distances.MAX) {
      return 'MID';
    }
    return 'MAX';
  };

  /**
   * Animate to snap point
   */
  const animateToSnapPoint = useCallback(
    (snapPoint: 'MIN' | 'MID' | 'MAX') => {
      const targetHeight = SNAP_POINTS[snapPoint];
      currentHeight.current = targetHeight;

      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - targetHeight,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();

      setCurrentSnapPoint(snapPoint);
      onSnapPointChange?.(snapPoint);
    },
    [translateY, onSnapPointChange]
  );

  /**
   * Pan responder for drag gestures
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond if vertical movement is significant
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animation
        translateY.stopAnimation((value) => {
          currentHeight.current = SCREEN_HEIGHT - value;
        });
      },
      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        // Calculate new height based on drag
        const newHeight = currentHeight.current - gestureState.dy;

        // Clamp between MIN and MAX
        const clampedHeight = Math.max(
          SNAP_POINTS.MIN,
          Math.min(SNAP_POINTS.MAX, newHeight)
        );

        // Update translateY
        translateY.setValue(SCREEN_HEIGHT - clampedHeight);
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        // Calculate final height considering velocity
        const velocityFactor = -gestureState.vy * 100;
        const finalHeight = currentHeight.current - gestureState.dy + velocityFactor;

        // Find nearest snap point
        const nearestSnap = findNearestSnapPoint(finalHeight);

        // Animate to snap point
        animateToSnapPoint(nearestSnap);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          height: SNAP_POINTS.MAX,
        },
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.handle}>
        <View style={styles.handleBar} />
      </View>

      <View style={styles.content}>{children}</View>
    </Animated.View>
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
    paddingVertical: spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray400,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
