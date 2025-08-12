import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert, Image } from 'react-native';
import { Text, Card, ActivityIndicator, Divider, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import apiService from '../../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [alumniByYear, setAlumniByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlumniGrouped();
      setAlumniByYear(response.data.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      Alert.alert('Error', 'Failed to load alumni data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchAlumni = async (query) => {
    try {
      if (query.trim() === '') {
        fetchData();
        return;
      }
      
      setLoading(true);
      const response = await apiService.getAlumniGroupedWithSearch(query);
      setAlumniByYear(response.data.data);
    } catch (error) {
      console.error('Error searching alumni:', error);
      Alert.alert('Error', 'Failed to search alumni');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    searchAlumni(query);
  };

  const renderAlumniSection = ({ year, alumni }) => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.yearHeader}>{year} Graduates</Text>
        <Divider style={styles.divider} />
        {alumni.map((alumna, index) => (
          <View key={alumna._id}>
            <View 
              style={styles.alumniItem}
              onTouchEnd={() => router.push(`/(tabs)/alumni-detail?id=${alumna._id}`)}
            >
              {/* Alumni Picture */}
              <View style={styles.alumniPictureContainer}>
                {alumna.currentPicture ? (
                  <Image
                    source={{ uri: alumna.currentPicture }}
                    style={styles.alumniPicture}
                    defaultSource={require('../../assets/No_Image_Available-2.jpg')}
                  />
                ) : (
                  <Image
                    source={require('../../assets/No_Image_Available-2.jpg')}
                    style={styles.alumniPicture}
                  />
                )}
              </View>
              
              {/* Alumni Name */}
              <Text style={styles.alumniName}>
                {alumna.firstName} {alumna.lastName}
              </Text>
            </View>
            {index < alumni.length - 1 && <Divider style={styles.itemDivider} />}
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  if (loading && Object.keys(alumniByYear).length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading alumni...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search alumni by name..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.searchingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(alumniByYear).map(([year, alumni]) => ({ year, alumni }))}
          keyExtractor={(item) => item.year}
          renderItem={({ item }) => renderAlumniSection(item)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyText}>No alumni found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </Card.Content>
            </Card>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    elevation: 2,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchingText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  sectionCard: {
    marginBottom: 15,
    elevation: 2,
    borderRadius: 12,
  },
  yearHeader: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
    letterSpacing: 0.5,
  },
  divider: {
    marginBottom: 15,
    backgroundColor: '#eee',
  },
  alumniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  alumniPictureContainer: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    padding: 2,
  },
  alumniPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  alumniName: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  itemDivider: {
    backgroundColor: '#f0f0f0',
    marginLeft: 55,
  },
  emptyCard: {
    margin: 20,
    elevation: 2,
    borderRadius: 12,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});