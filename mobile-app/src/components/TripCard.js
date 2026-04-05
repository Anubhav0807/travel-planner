import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { formatDate, formatTime, formatDistance, formatCost, getModeLabel, getPurposeLabel } from '../utils/helpers';

export default function TripCard({ trip, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.tripNumberBadge}>
          <Text style={styles.tripNumberText}>#{trip.trip_number}</Text>
        </View>
        <Text style={styles.date}>{formatDate(trip.start_time)}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeTimeline}>
          <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
          <View style={styles.line} />
          <View style={[styles.dot, { backgroundColor: COLORS.danger }]} />
        </View>
        <View style={styles.routeDetails}>
          <View style={styles.locationRow}>
            <Text style={styles.locationText} numberOfLines={1}>
              {trip.origin?.address || `${trip.origin?.lat?.toFixed(4)}, ${trip.origin?.lng?.toFixed(4)}`}
            </Text>
            <Text style={styles.timeText}>{formatTime(trip.start_time)}</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.locationText} numberOfLines={1}>
              {trip.destination?.address || `${trip.destination?.lat?.toFixed(4)}, ${trip.destination?.lng?.toFixed(4)}`}
            </Text>
            <Text style={styles.timeText}>{formatTime(trip.end_time)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{getModeLabel(trip.mode)}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{getPurposeLabel(trip.purpose)}</Text>
        </View>
        <Text style={styles.distanceText}>{formatDistance(trip.distance)}</Text>
        <Text style={styles.costText}>{formatCost(trip.cost)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripNumberBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tripNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  routeTimeline: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    marginRight: 8,
  },
  timeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  costText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '700',
  },
});
