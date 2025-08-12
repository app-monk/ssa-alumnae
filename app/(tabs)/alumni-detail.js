import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, Image } from 'react-native';
import { Text, Card, ActivityIndicator, TextInput, Button, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/api';

export default function AlumniDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (id) {
      fetchAlumniDetail();
    }
  }, [id]);

  const fetchAlumniDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlumna(id);
      setAlumni(response.data.data);
    } catch (error) {
      console.error('Error fetching alumni detail:', error);
      Alert.alert('Error', 'Failed to load alumni details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const submitEditRequest = async () => {
    try {
      const updateData = { [editField]: editValue };
      await apiService.updateAlumna(id, updateData);
      Alert.alert('Success', 'Information updated successfully!');
      setEditModalVisible(false);
      fetchAlumniDetail(); // Refresh data
    } catch (error) {
      console.error('Error updating alumni:', error);
      Alert.alert('Error', 'Failed to update information');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!alumni) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Alumni not found</Text>
        <Button 
          mode="contained" 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Profile Pictures */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.header}>
            {/* Student Picture Section */}
            <View style={styles.pictureSection}>
              <Text style={styles.pictureLabel}>Student Photo</Text>
              <View style={styles.pictureContainer}>
                {alumni.studentPicture ? (
                  <Image
                    source={{ uri: alumni.studentPicture }}
                    style={styles.studentPicture}
                    onError={(error) => console.log('Student image load error:', error)}
                  />
                ) : (
                  <Image
                    source={require('../../assets/No_Image_Available.jpg')}
                    style={styles.studentPicture}
                  />
                )}
              </View>
            </View>
            
            {/* Current Picture Section */}
            <View style={styles.pictureSection}>
              <Text style={styles.pictureLabel}>Current Photo</Text>
              <View style={styles.pictureContainer}>
                {alumni.currentPicture ? (
                  <Image
                    source={{ uri: alumni.currentPicture }}
                    style={styles.currentPicture}
                    onError={(error) => console.log('Current image load error:', error)}
                  />
                ) : (
                  <Image
                    source={require('../../assets/No_Image_Available-2.jpg')}
                    style={styles.currentPicture}
                  />
                )}
              </View>
            </View>
          </View>
          
          {/* Name and Batch Information */}
          <View style={styles.nameContainer}>
            <Text style={styles.fullName}>
              {alumni.prefix || ''} {alumni.firstName} {alumni.middleName || ''} {alumni.lastName}
            </Text>
            <Text style={styles.batchYear}>Class of {alumni.batchYear.year}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Contact Information */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <IconButton 
              icon="pencil" 
              size={20} 
              onPress={() => {}}
              style={styles.editIcon}
            />
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{alumni.email || 'Not provided'}</Text>
              <IconButton 
                icon="pencil" 
                size={20} 
                onPress={() => handleEditRequest('email', alumni.email || '')}
              />
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{alumni.contactNumber || 'Not provided'}</Text>
              <IconButton 
                icon="pencil" 
                size={20} 
                onPress={() => handleEditRequest('contactNumber', alumni.contactNumber || '')}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <IconButton 
              icon="pencil" 
              size={20} 
              onPress={() => {}}
              style={styles.editIcon}
            />
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name:</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>
                {alumni.firstName} {alumni.middleName || ''} {alumni.lastName}
              </Text>
              <IconButton 
                icon="pencil" 
                size={20} 
                onPress={() => {
                  setEditField('firstName');
                  setEditValue(`${alumni.firstName} ${alumni.middleName || ''} ${alumni.lastName}`);
                  setEditModalVisible(true);
                }}
              />
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Batch Year:</Text>
            <Text style={styles.value}>{alumni.batchYear.year}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            
            <TextInput
              style={styles.editInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${editField}`}
              mode="outlined"
            />
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setEditModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={submitEditRequest}
                style={styles.modalButton}
              >
                Update
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 10,
  },
  headerCard: {
    margin: 15,
    elevation: 4,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  pictureSection: {
    alignItems: 'center',
  },
  pictureLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  pictureContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 5,
    backgroundColor: '#fff',
  },
  studentPicture: {
    width: 120,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  currentPicture: {
    width: 120,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  batchYear: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 15,
  },
  sectionCard: {
    margin: 15,
    marginTop: 0,
    elevation: 2,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  editIcon: {
    margin: 0,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    width: 120,
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  editInput: {
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});