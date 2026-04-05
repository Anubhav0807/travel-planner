/**
 * Format a date string to a readable format
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a time string
 */
export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format distance in km
 */
export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Format cost in INR
 */
export function formatCost(amount) {
  if (!amount || amount === 0) return 'Free';
  return `₹${amount.toFixed(0)}`;
}

/**
 * Get label for a mode value
 */
export function getModeLabel(value) {
  const modes = {
    walk: '🚶 Walk',
    bicycle: '🚲 Bicycle',
    two_wheeler: '🛵 Two Wheeler',
    auto_rickshaw: '🛺 Auto Rickshaw',
    car: '🚗 Car',
    taxi: '🚕 Taxi',
    bus: '🚌 Bus',
    metro: '🚇 Metro',
    train: '🚆 Train',
    other: '🔄 Other',
  };
  return modes[value] || value;
}

/**
 * Get label for a purpose value
 */
export function getPurposeLabel(value) {
  const purposes = {
    work: '💼 Work',
    education: '🎓 Education',
    shopping: '🛍️ Shopping',
    recreation: '🎭 Recreation',
    medical: '🏥 Medical',
    social: '👥 Social',
    religious: '🛕 Religious',
    personal_business: '📋 Personal Business',
    other: '🔄 Other',
  };
  return purposes[value] || value;
}

/**
 * Generate a unique client ID for offline trip sync
 */
export function generateClientId() {
  return `trip_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
