import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Text, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import apiService from '../../services/api';

export default function CreateEventScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: new Date(),
    location: '',
    organizerName: '',
    organizerEmail: '',
    audience: 'alumnae'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.organizerName || !formData.organizerEmail) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date.toISOString().split('T')[0],
        time: format(formData.time, 'HH:mm'),
        location: formData.location,
        organizerName: formData.organizerName,
        organizerEmail: formData.organizerEmail,
        audience: formData.audience
      };

      await apiService.createEvent(eventData);
      
      Alert.alert('Success', 'Event created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      handleInputChange('time', selectedTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Create New Event</Text>
          
          <TextInput
            label="Event Title *"
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="calendar-text" />}
          />
          
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            style={styles.input}
            multiline
            numberOfLines={4}
            mode="outlined"
            left={<TextInput.Icon icon="text" />}
          />
          
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
            icon="calendar"
          >
            {format(formData.date, 'MMMM d, yyyy')}
          </Button>
          
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          
          <Button 
            mode="outlined" 
            onPress={() => setShowTimePicker(true)}
            style={styles.dateButton}
            icon="clock"
          >
            {format(formData.time, 'h:mm a')}
          </Button>
          
          {showTimePicker && (
            <DateTimePicker
              value={formData.time}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
          
          <TextInput
            label="Location *"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker" />}
          />
          
          <Text style={styles.sectionTitle}>Organizer Information</Text>
          
          <TextInput
            label="Organizer Name *"
            value={formData.organizerName}
            onChangeText={(value) => handleInputChange('organizerName', value)}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
          />
          
          <TextInput
            label="Organizer Email *"
            value={formData.organizerEmail}
            onChangeText={(value) => handleInputChange('organizerEmail', value)}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />
          
          <Text style={styles.sectionTitle}>Audience</Text>
          
          <View style={styles.radioGroup}>
            <RadioButton.Group 
              onValueChange={(value) => handleInputChange('audience', value)}
              value={formData.audience}
            >
              <View style={styles.radioButton}>
                <RadioButton value="alumnae" />
                <Text>All Alumni</Text>
              </View>
              
              <View style={styles.radioButton}>
                <RadioButton value="batch" />
                <Text>Specific Batch</Text>
              </View>
              
              <View style={styles.radioButton}>
                <RadioButton value="group" />
                <Text>Specific Group</Text>
              </View>
            </RadioButton.Group>
          </View>
          
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            icon="check"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    margin: 15,
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    marginBottom: 20,
  },
  dateButton: {
    marginBottom: 20,
    justifyContent: 'flex-start',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 10,
    color: '#333',
  },
  radioGroup: {
    marginBottom: 25,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});