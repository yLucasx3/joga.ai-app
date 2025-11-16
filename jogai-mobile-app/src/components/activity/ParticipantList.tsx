import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Avatar } from '../common/Avatar';
import { Participant } from '../../types/activity.types';

interface ParticipantListProps {
  participants: Participant[];
  maxPlayers: number;
  currentPlayers: number;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  maxPlayers,
  currentPlayers,
}) => {
  const confirmedParticipants = participants.filter(p => p.status === 'CONFIRMED');
  const availableSpots = maxPlayers - currentPlayers;
  const progressPercentage = (currentPlayers / maxPlayers) * 100;

  // Show max 5 avatars, rest as "+X"
  const maxVisibleAvatars = 5;
  const visibleParticipants = confirmedParticipants.slice(0, maxVisibleAvatars);
  const overflowCount = confirmedParticipants.length - maxVisibleAvatars;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Participants</Text>
        <Text style={styles.spotsText}>
          {currentPlayers}/{maxPlayers} players
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor:
                  progressPercentage >= 100 ? colors.error : colors.success,
              },
            ]}
          />
        </View>
        <Text style={styles.spotsAvailableText}>
          {availableSpots > 0
            ? `${availableSpots} spot${availableSpots !== 1 ? 's' : ''} available`
            : 'Full'}
        </Text>
      </View>

      {/* Avatar Group */}
      {confirmedParticipants.length > 0 && (
        <View style={styles.avatarGroup}>
          {visibleParticipants.map((participant, index) => (
            <View
              key={participant.id}
              style={[
                styles.avatarWrapper,
                index > 0 && { marginLeft: -spacing.sm },
              ]}
            >
              <Avatar
                imageUri={participant.avatarUrl}
                name={participant.name}
                size="medium"
              />
            </View>
          ))}
          {overflowCount > 0 && (
            <View style={[styles.avatarWrapper, { marginLeft: -spacing.sm }]}>
              <View style={styles.overflowAvatar}>
                <Text style={styles.overflowText}>+{overflowCount}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Participant List */}
      {confirmedParticipants.length > 0 && (
        <View style={styles.participantList}>
          {confirmedParticipants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <Avatar
                imageUri={participant.avatarUrl}
                name={participant.name}
                size="small"
              />
              <Text style={styles.participantName}>{participant.name}</Text>
            </View>
          ))}
        </View>
      )}

      {confirmedParticipants.length === 0 && (
        <Text style={styles.emptyText}>No participants yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  spotsText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    marginBottom: spacing.lg,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  spotsAvailableText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.full,
  },
  overflowAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overflowText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  participantList: {
    gap: spacing.sm,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  participantName: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
