import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocation, getAddressFromCoords, calculateDistance } from '../services/locationService';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [tripStart, setTripStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    fetchLocation();
  }, []);

  // Timer for active trip
  useEffect(() => {
    let interval;
    if (tracking && tripStart) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - tripStart.time) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tracking, tripStart]);

  async function fetchLocation() {
    try {
      const loc = await getCurrentLocation();
      setCurrentLocation(loc);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (err) {
      Alert.alert('Location Error', err.message);
    }
  }

  async function startTrip() {
    try {
      const loc = await getCurrentLocation();
      const address = await getAddressFromCoords(loc.lat, loc.lng);
      setTripStart({ ...loc, address, time: Date.now() });
      setTracking(true);
      setElapsed(0);
    } catch (err) {
      Alert.alert('Error', 'Could not get your location. Please check permissions.');
    }
  }

  async function stopTrip() {
    try {
      const loc = await getCurrentLocation();
      const address = await getAddressFromCoords(loc.lat, loc.lng);
      const distance = calculateDistance(tripStart.lat, tripStart.lng, loc.lat, loc.lng);

      setTracking(false);

      navigation.navigate('NewTrip', {
        origin: { lat: tripStart.lat, lng: tripStart.lng, address: tripStart.address },
        destination: { lat: loc.lat, lng: loc.lng, address },
        startTime: new Date(tripStart.time).toISOString(),
        endTime: new Date().toISOString(),
        distance,
      });
    } catch (err) {
      Alert.alert('Error', 'Could not get destination location.');
      setTracking(false);
    }
  }

  function formatElapsed(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: 10.0,
          longitude: 76.3,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {tripStart && (
          <Marker
            coordinate={{ latitude: tripStart.lat, longitude: tripStart.lng }}
            title="Trip Start"
            description={tripStart.address || 'Starting point'}
            pinColor={COLORS.success}
          />
        )}
      </MapView>

      {/* Greeting card */}
      <View style={styles.greetingCard}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Traveller'} 👋</Text>
        <Text style={styles.greetingSub}>Ready to record your trip?</Text>
      </View>

      {/* Controls */}
      <View style={styles.bottomPanel}>
        {tracking ? (
          <View style={styles.trackingPanel}>
            <View style={styles.trackingInfo}>
              <View style={styles.pulsingDot} />
              <Text style={styles.trackingText}>Recording trip…</Text>
              <Text style={styles.timerText}>{formatElapsed(elapsed)}</Text>
            </View>
            <Text style={styles.originText}>
              From: {tripStart?.address || `${tripStart?.lat?.toFixed(4)}, ${tripStart?.lng?.toFixed(4)}`}
            </Text>
            <TouchableOpacity style={styles.stopButton} onPress={stopTrip}>
              <Ionicons name="stop-circle" size={24} color={COLORS.white} />
              <Text style={styles.stopButtonText}>End Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionPanel}>
            <TouchableOpacity style={styles.startButton} onPress={startTrip}>
              <Ionicons name="navigate" size={24} color={COLORS.white} />
              <Text style={styles.startButtonText}>Start Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => navigation.navigate('NewTrip', {})}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              <Text style={styles.manualButtonText}>Add Manually</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* My location button */}
      <TouchableOpacity style={styles.locationButton} onPress={fetchLocation}>
        <Ionicons name="locate" size={22} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  greetingCard: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  greetingSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  actionPanel: { gap: 12 },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  manualButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  manualButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  trackingPanel: { gap: 12 },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.danger,
  },
  trackingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    fontVariant: ['tabular-nums'],
  },
  originText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  stopButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stopButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
