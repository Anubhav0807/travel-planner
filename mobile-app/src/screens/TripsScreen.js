import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTrips } from '../services/tripService';
import { COLORS } from '../utils/constants';

export default function TripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadTrips(1);
    }, [])
  );

  async function loadTrips(pageNum = 1) {
    try {
      if (pageNum === 1) setLoading(true);
      const res = await getTrips(pageNum);
      const data = res.data;

      if (pageNum === 1) {
        setTrips(data.trips);
      } else {
        setTrips(prev => [...prev, ...data.trips]);
      }
      setPage(data.page);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.log('Failed to load trips:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    loadTrips(1);
  }

  function handleLoadMore() {
    if (page < totalPages) {
      loadTrips(page + 1);
    }
  }

  if (loading) return <LoadingSpinner message="Loading your trips..." />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.count}>{total} trip{total !== 1 ? 's' : ''}</Text>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptyText}>
            Start recording your journeys to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => navigation.navigate('TripDetail', { trip: item })}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  count: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
