import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#007AFF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>User Name</Text>
              <Text style={styles.email}>user@example.com</Text>
              <Text style={styles.memberSince}>Member since Jan 2024</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <Card.Content>
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.menuItem}
            icon="key"
          >
            Change Password
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.menuItem}
            icon="account-edit"
          >
            Edit Profile
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.menuItem}
            icon="information"
          >
            About
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.menuItem}
            icon="help-circle"
          >
            Help & Support
          </Button>
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        buttonColor="#FF3B30"
        textColor="#fff"
        contentStyle={styles.logoutButtonContent}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  profileCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  memberSince: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  menuCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
  },
  menuItem: {
    marginBottom: 15,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 'auto',
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 10,
  },
});