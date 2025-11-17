import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface ActivityCardSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader component for activity cards with shimmer animation
 */
export const ActivityCardSkeleton: React.FC<ActivityCardSkeletonProps> = ({
  count = 5,
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.container}>
          {/* Image placeholder */}
          <Animated.View style={[styles.image, { opacity }]} />

          {/* Content placeholder */}
          <View style={styles.content}>
            {/* Header row */}
            <View style={styles.headerRow}>
              <Animated.View style={[styles.sportBadge, { opacity }]} />
              <Animated.View style={[styles.statusBadge, { opacity }]} />
            </View>

            {/* Title */}
            <Animated.View style={[styles.title, { opacity }]} />
            <Animated.View style={[styles.titleShort, { opacity }]} />

            {/* Info rows */}
            <Animated.View style={[styles.infoRow, { opacity }]} />
            <Animated.View style={[styles.infoRow, { opacity }]} />

            {/* Footer */}
            <View style={styles.footer}>
              <Animated.View style={[styles.playersInfo, { opacity }]} />
              <Animated.View style={[styles.spotsInfo, { opacity }]} />
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray100,
  },
  content: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sportBadge: {
    width: 80,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray100,
  },
  statusBadge: {
    width: 60,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray100,
  },
  title: {
    width: '90%',
    height: 20,
    borderRadius: 4,
    marginBottom: spacing.xs,
    backgroundColor: colors.gray100,
  },
  titleShort: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: spacing.sm,
    backgroundColor: colors.gray100,
  },
  infoRow: {
    width: '80%',
    height: 16,
    borderRadius: 4,
    marginBottom: spacing.xs,
    backgroundColor: colors.gray100,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  playersInfo: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.gray100,
  },
  spotsInfo: {
    width: 80,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.gray100,
  },
});
