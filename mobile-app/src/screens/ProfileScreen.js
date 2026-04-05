import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || 'traveller'}</Text>
        </View>
      </View>

      {/* Info cards */}
      <View style={styles.infoSection}>
        <InfoRow icon="mail-outline" label="Email" value={user?.email} />
        <InfoRow icon="call-outline" label="Phone" value={user?.phone || 'Not set'} />
        <InfoRow icon="calendar-outline" label="Member since" value={user?.created_at ? formatDate(user.created_at) : 'Unknown'} />
        <InfoRow icon="shield-checkmark-outline" label="Role" value={user?.role === 'scientist' ? 'NATPAC Scientist' : 'Traveller'} />
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Travel Planner v1.0.0</Text>
      <Text style={styles.footerSub}>Built for NATPAC • SIH 2025</Text>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={COLORS.accent} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 40 },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  roleText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
    gap: 14,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  infoValue: { fontSize: 15, color: COLORS.text, fontWeight: '600', marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
  },
  footer: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: 32,
    fontWeight: '600',
  },
  footerSub: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
});
