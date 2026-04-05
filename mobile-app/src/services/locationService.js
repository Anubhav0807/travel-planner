import * as Location from 'expo-location';

/**
 * Request location permissions
 */
export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission is required to track trips.');
  }
  return true;
}

/**
 * Get current location
 */
export async function getCurrentLocation() {
  await requestLocationPermission();
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
}

/**
 * Reverse geocode coordinates to get an address
 */
export async function getAddressFromCoords(lat, lng) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (results && results.length > 0) {
      const addr = results[0];
      const parts = [
        addr.name,
        addr.street,
        addr.city || addr.subregion,
        addr.region,
      ].filter(Boolean);
      return parts.join(', ');
    }
  } catch (err) {
    console.log('Reverse geocode failed:', err);
  }
  return null;
}

/**
 * Calculate distance between two points (Haversine)
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
