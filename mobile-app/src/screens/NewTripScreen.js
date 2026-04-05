import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTrip } from '../services/tripService';
import { getCurrentLocation, getAddressFromCoords, calculateDistance } from '../services/locationService';
import { COLORS, TRAVEL_MODES, TRIP_PURPOSES, FREQUENCIES } from '../utils/constants';
import { generateClientId } from '../utils/helpers';

export default function NewTripScreen({ route, navigation }) {
  const params = route.params || {};

  // Pre-fill from auto-tracking or empty
  const [originLat, setOriginLat] = useState(params.origin?.lat?.toString() || '');
  const [originLng, setOriginLng] = useState(params.origin?.lng?.toString() || '');
  const [originAddress, setOriginAddress] = useState(params.origin?.address || '');
  const [destLat, setDestLat] = useState(params.destination?.lat?.toString() || '');
  const [destLng, setDestLng] = useState(params.destination?.lng?.toString() || '');
  const [destAddress, setDestAddress] = useState(params.destination?.address || '');
  const [startTime] = useState(params.startTime || new Date().toISOString());
  const [endTime] = useState(params.endTime || new Date().toISOString());
  const [distance, setDistance] = useState(params.distance?.toString() || '');
  const [mode, setMode] = useState('');
  const [purpose, setPurpose] = useState('');
  const [companions, setCompanions] = useState('0');
  const [frequency, setFrequency] = useState('one_time');
  const [cost, setCost] = useState('0');
  const [loading, setLoading] = useState(false);

  // Auto-fill origin location if not provided
  useEffect(() => {
    if (!originLat) {
      fillCurrentLocation();
    }
  }, []);

  async function fillCurrentLocation() {
    try {
      const loc = await getCurrentLocation();
      setOriginLat(loc.lat.toString());
      setOriginLng(loc.lng.toString());
      const addr = await getAddressFromCoords(loc.lat, loc.lng);
      if (addr) setOriginAddress(addr);
    } catch (err) {
      // Silently fail
    }
  }

  async function handleSubmit() {
    if (!mode) {
      Alert.alert('Missing Field', 'Please select a travel mode.');
      return;
    }
    if (!purpose) {
      Alert.alert('Missing Field', 'Please select a trip purpose.');
      return;
    }
    if (!originLat || !originLng || !destLat || !destLng) {
      Alert.alert('Missing Location', 'Please provide both origin and destination coordinates.');
      return;
    }

    const oLat = parseFloat(originLat);
    const oLng = parseFloat(originLng);
    const dLat = parseFloat(destLat);
    const dLng = parseFloat(destLng);

    const tripDistance = distance ? parseFloat(distance) : calculateDistance(oLat, oLng, dLat, dLng);

    setLoading(true);
    try {
      await createTrip({
        origin_lat: oLat,
        origin_lng: oLng,
        origin_address: originAddress || null,
        dest_lat: dLat,
        dest_lng: dLng,
        dest_address: destAddress || null,
        start_time: startTime,
        end_time: endTime,
        mode,
        distance: tripDistance,
        purpose,
        companions: parseInt(companions, 10) || 0,
        frequency,
        cost: parseFloat(cost) || 0,
        client_id: generateClientId(),
      });
      Alert.alert('Success! 📍', 'Your trip has been recorded.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save trip.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }

  function OptionGrid({ options, selected, onSelect }) {
    return (
      <View style={styles.optionGrid}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.optionChip,
              selected === opt.value && styles.optionChipSelected,
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[
              styles.optionChipText,
              selected === opt.value && styles.optionChipTextSelected,
            ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>📍 Origin</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Latitude" placeholderTextColor={COLORS.textLight} value={originLat} onChangeText={setOriginLat} keyboardType="numeric" />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Longitude" placeholderTextColor={COLORS.textLight} value={originLng} onChangeText={setOriginLng} keyboardType="numeric" />
      </View>
      <TextInput style={styles.input} placeholder="Origin address (auto-filled)" placeholderTextColor={COLORS.textLight} value={originAddress} onChangeText={setOriginAddress} />

      <Text style={styles.sectionTitle}>📍 Destination</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Latitude" placeholderTextColor={COLORS.textLight} value={destLat} onChangeText={setDestLat} keyboardType="numeric" />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Longitude" placeholderTextColor={COLORS.textLight} value={destLng} onChangeText={setDestLng} keyboardType="numeric" />
      </View>
      <TextInput style={styles.input} placeholder="Destination address" placeholderTextColor={COLORS.textLight} value={destAddress} onChangeText={setDestAddress} />

      <Text style={styles.sectionTitle}>🚌 Travel Mode</Text>
      <OptionGrid options={TRAVEL_MODES} selected={mode} onSelect={setMode} />

      <Text style={styles.sectionTitle}>🎯 Trip Purpose</Text>
      <OptionGrid options={TRIP_PURPOSES} selected={purpose} onSelect={setPurpose} />

      <Text style={styles.sectionTitle}>📊 Trip Details</Text>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.inputLabel}>Distance (km)</Text>
          <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="numeric" placeholder="Auto-calc" placeholderTextColor={COLORS.textLight} />
        </View>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.inputLabel}>Cost (₹)</Text>
          <TextInput style={styles.input} value={cost} onChangeText={setCost} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textLight} />
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.inputLabel}>Companions</Text>
          <TextInput style={styles.input} value={companions} onChangeText={setCompanions} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textLight} />
        </View>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.inputLabel}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            {FREQUENCIES.map(f => (
              <TouchableOpacity
                key={f.value}
                style={[styles.freqChip, frequency === f.value && styles.freqChipSelected]}
                onPress={() => setFrequency(f.value)}
              >
                <Text style={[styles.freqChipText, frequency === f.value && styles.freqChipTextSelected]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
        <Text style={styles.submitText}>{loading ? 'Saving...' : 'Save Trip'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 16 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  halfInput: { flex: 1 },
  row: { flexDirection: 'row', gap: 10 },
  inputContainer: { marginBottom: 4 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionChipTextSelected: {
    color: COLORS.white,
  },
  frequencyContainer: {
    gap: 4,
  },
  freqChip: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  freqChipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  freqChipText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  freqChipTextSelected: {
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitDisabled: { opacity: 0.7 },
  submitText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
