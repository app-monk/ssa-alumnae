import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, IconButton } from 'react-native-paper';
import apiService from '../../services/api';

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents();
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const getAudienceLabel = (event) => {
    switch (event.audience) {
      case 'batch':
        return `Batch ${event.batchYear}`;
      case 'group':
        return event.groupName || 'Group Event';
      case 'alumnae':
        return 'All Alumni';
      default:
        return 'Event';
    }
  };

  const renderEvent = ({ item }) => (
    <Card style={styles.eventCard}>
      <Card.Content>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <IconButton 
            icon="bell" 
            size={20} 
            onPress={() => {}}
            style={styles.bellIcon}
          />
        </View>
        <Text style={styles.audience}>{getAudienceLabel(item)}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.eventInfo}>📅 {new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.eventInfo}>⏰ {item.time}</Text>
          <Text style={styles.eventInfo}>📍 {item.location}</Text>
        </View>
        <Text style={styles.createdBy}>Organized by: {item.organizerName}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Button 
          mode="contained" 
          onPress={() => router.push('/(tabs)/create-event')}
          icon="plus"
          style={styles.createButton}
        >
          Create Event
        </Button>
      </View>
      
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEvent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
            <Button 
              mode="contained" 
              onPress={() => router.push('/(tabs)/create-event')}
              style={styles.createFirstButton}
            >
              Create First Event
            </Button>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    borderRadius: 8,
  },
  listContainer: {
    padding: 15,
  },
  eventCard: {
    marginBottom: 20,
    elevation: 3,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  bellIcon: {
    margin: 0,
  },
  audience: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 15,
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  eventDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  eventDetails: {
    marginBottom: 15,
  },
  eventInfo: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  createdBy: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  createFirstButton: {
    borderRadius: 8,
  },
});