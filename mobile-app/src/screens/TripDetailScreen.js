import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { formatDate, formatTime, formatDistance, formatCost, getModeLabel, getPurposeLabel, getModeIcon, getPurposeIcon } from '../utils/helpers';

const { width } = Dimensions.get('window');

export default function TripDetailScreen({ route }) {
  const { trip } = route.params;

  const origin = { latitude: trip.origin.lat, longitude: trip.origin.lng };
  const destination = { latitude: trip.destination.lat, longitude: trip.destination.lng };

  const midLat = (origin.latitude + destination.latitude) / 2;
  const midLng = (origin.longitude + destination.longitude) / 2;
  const deltaLat = Math.abs(origin.latitude - destination.latitude) * 1.8 || 0.01;
  const deltaLng = Math.abs(origin.longitude - destination.longitude) * 1.8 || 0.01;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: deltaLat,
            longitudeDelta: deltaLng,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={origin} title="Origin" pinColor={COLORS.success} />
          <Marker coordinate={destination} title="Destination" pinColor={COLORS.danger} />
          <Polyline
            coordinates={[origin, destination]}
            strokeColor={COLORS.accent}
            strokeWidth={3}
            lineDashPattern={[6, 3]}
          />
        </MapView>
        <View style={styles.tripBadge}>
          <Text style={styles.tripBadgeText}>Trip #{trip.trip_number}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Route */}
        <View style={styles.card}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: COLORS.success }]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Origin</Text>
              <Text style={styles.routeAddress}>{trip.origin.address || `${trip.origin.lat.toFixed(4)}, ${trip.origin.lng.toFixed(4)}`}</Text>
              <Text style={styles.routeTime}>{formatDate(trip.start_time)} • {formatTime(trip.start_time)}</Text>
            </View>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: COLORS.danger }]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeAddress}>{trip.destination.address || `${trip.destination.lat.toFixed(4)}, ${trip.destination.lng.toFixed(4)}`}</Text>
              <Text style={styles.routeTime}>{formatDate(trip.end_time)} • {formatTime(trip.end_time)}</Text>
            </View>
          </View>
        </View>

        {/* Details grid */}
        <View style={styles.detailsGrid}>
          <DetailItem icon={getModeIcon(trip.mode)} label="Mode" value={getModeLabel(trip.mode)} />
          <DetailItem icon={getPurposeIcon(trip.purpose)} label="Purpose" value={getPurposeLabel(trip.purpose)} />
          <DetailItem icon="map-outline" label="Distance" value={formatDistance(trip.distance)} />
          <DetailItem icon="cash-outline" label="Cost" value={formatCost(trip.cost)} />
          <DetailItem icon="people-outline" label="Companions" value={String(trip.companions)} />
          <DetailItem icon="repeat-outline" label="Frequency" value={trip.frequency.replace('_', ' ')} />
        </View>
      </View>
    </ScrollView>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={20} color={COLORS.accent} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapContainer: { height: 250, position: 'relative' },
  map: { flex: 1 },
  tripBadge: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tripBadgeText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  content: { padding: 16, marginTop: -20 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  routeInfo: { flex: 1 },
  routeLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  routeAddress: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  routeTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  routeDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14, marginLeft: 24 },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    width: (width - 42) / 2,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  detailValue: { fontSize: 15, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
});
