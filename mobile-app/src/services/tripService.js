import api from '../../api';

/**
 * Create a new trip
 */
export async function createTrip(tripData) {
  const res = await api.post('/api/trips', tripData);
  return res.data;
}

/**
 * Batch sync trips (offline support)
 */
export async function batchSyncTrips(trips) {
  const res = await api.post('/api/trips/batch', { trips });
  return res.data;
}

/**
 * Get paginated trip history
 */
export async function getTrips(page = 1, perPage = 20) {
  const res = await api.get('/api/trips', {
    params: { page, per_page: perPage },
  });
  return res.data;
}

/**
 * Get a single trip
 */
export async function getTrip(tripId) {
  const res = await api.get(`/api/trips/${tripId}`);
  return res.data;
}

/**
 * Update a trip
 */
export async function updateTrip(tripId, data) {
  const res = await api.put(`/api/trips/${tripId}`, data);
  return res.data;
}

/**
 * Delete a trip
 */
export async function deleteTrip(tripId) {
  const res = await api.delete(`/api/trips/${tripId}`);
  return res.data;
}
