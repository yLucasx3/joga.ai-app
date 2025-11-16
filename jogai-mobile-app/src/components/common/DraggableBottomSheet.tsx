import React, { ReactNode, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define snap points as percentages of screen height
const SNAP_POINTS = {
  MIN: SCREEN_HEIGHT * 0.25,  // 25% - Minimized
  MID: SCREEN_HEIGHT * 0.5,   // 50% - Medium
  MAX: SCREEN_HEIGHT * 0.85,  // 85% - Maximized
};

interface DraggableBottomSheetProps {
  children: ReactNode;
  initialSnapPoint?: 'MIN' | 'MID' | 'MAX';
  onSnapPointChange?: (snapPoint: 'MIN' | 'MID' | 'MAX') => void;
}

/**
 * Draggable bottom sheet component with snap points
 * Allows users to drag to expand/collapse the sheet
 */
export const DraggableBottomSheet: React.FC<DraggableBottomSheetProps> = ({
  children,
  initialSnapPoint = 'MID',
  onSnapPointChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT - SNAP_POINTS[initialSnapPoint]);
  const context = useSharedValue({ y: 0 });
  const currentSnapPoint = useSharedValue(SNAP_POINTS[initialSnapPoint]);

  /**
   * Find nearest snap point
   */
  const findNearestSnapPoint = (y: number): number => {
    'worklet';
    const snapValues = Object.values(SNAP_POINTS);
    let nearest = snapValues[0];
    let minDistance = Math.abs(y - nearest);

    for (const snap of snapValues) {
      const distance = Math.abs(y - snap);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = snap;
      }
    }

    return nearest;
  };

  /**
   * Get snap point name
   */
  const getSnapPointName = (value: number): 'MIN' | 'MID' | 'MAX' => {
    'worklet';
    if (value === SNAP_POINTS.MIN) return 'MIN';
    if (value === SNAP_POINTS.MID) return 'MID';
    return 'MAX';
  };

  /**
   * Notify snap point change
   */
  const notifySnapPointChange = useCallback((snapPoint: 'MIN' | 'MID' | 'MAX') => {
    onSnapPointChange?.(snapPoint);
  }, [onSnapPointChange]);

  /**
   * Set dragging state
   */
  const setDraggingState = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  /**
   * Pan gesture handler
   */
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
      runOnJS(setDraggingState)(true);
    })
    .onUpdate((event) => {
      // Drag down = positive, drag up = negative
      const newY = context.value.y + event.translationY;
      
      // Clamp between MIN and MAX
      const maxTranslation = SCREEN_HEIGHT - SNAP_POINTS.MIN;
      const minTranslation = SCREEN_HEIGHT - SNAP_POINTS.MAX;
      
      translateY.value = Math.max(
        minTranslation,
        Math.min(maxTranslation, newY)
      );
    })
    .onEnd((event) => {
      runOnJS(setDraggingState)(false);
      
      // Calculate current height
      const currentHeight = SCREEN_HEIGHT - translateY.value;
      
      // Consider velocity for snap decision
      const velocityFactor = event.velocityY * 0.0005;
      const targetHeight = currentHeight - velocityFactor;
      
      // Find nearest snap point
      const nearestSnap = findNearestSnapPoint(targetHeight);
      const snapPointName = getSnapPointName(nearestSnap);
      
      // Animate to snap point
      currentSnapPoint.value = nearestSnap;
      translateY.value = withSpring(SCREEN_HEIGHT - nearestSnap, {
        damping: 20,
        stiffness: 90,
      });

      // Notify change
      runOnJS(notifySnapPointChange)(snapPointName);
    });

  /**
   * Animated style for the sheet
   */
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: SNAP_POINTS.MAX,
    };
  });

  /**
   * Animated style for handle bar (changes opacity when dragging)
   */
  const handleBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - SNAP_POINTS.MAX, SCREEN_HEIGHT - SNAP_POINTS.MIN],
      [0.4, 0.8],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.handle}>
          <Animated.View style={[styles.handleBar, handleBarStyle]} />
        </View>
      </GestureDetector>
      
      <View style={styles.content}>
        {children}
      </View>
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
