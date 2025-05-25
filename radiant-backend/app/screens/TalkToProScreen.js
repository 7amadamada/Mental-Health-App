import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TalkToProScreen = ({ navigation }) => {
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');

      setProfessionals([
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Psychologist',
          rating: 4.9,
          available: true
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          specialty: 'Therapist',
          rating: 4.7,
          available: true
        },
        {
          id: '3',
          name: 'Dr. Emily Rodriguez',
          specialty: 'Psychiatrist',
          rating: 4.8,
          available: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      Alert.alert('Error', 'Failed to load professionals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactPro = (professional) => {
    if (!professional.available) {
      Alert.alert('Not Available', 'This professional is currently not available for consultation.');
      return;
    }
    
    // Navigate to chat or booking screen
    Alert.alert(
      'Contact Professional',
      `Would you like to schedule a session with ${professional.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Schedule', 
          onPress: () => Alert.alert('Success', 'Your request has been sent. The professional will contact you shortly.') 
        }
      ]
    );
  };

  const renderProfessional = ({ item }) => (
    <TouchableOpacity 
      style={styles.proCard}
      onPress={() => handleContactPro(item)}
    >
      <Image source={{ uri: item.image }} style={styles.proImage} />
      <View style={styles.proInfo}>
        <Text style={styles.proName}>{item.name}</Text>
        <Text style={styles.proSpecialty}>{item.specialty}</Text>
        <Text style={styles.proRating}>Rating: {item.rating}/5.0</Text>
        <Text style={[
          styles.proStatus, 
          { color: item.available ? '#4CAF50' : '#F44336' }
        ]}>
          {item.available ? 'Available Now' : 'Currently Unavailable'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Talk to a Professional</Text>
      <Text style={styles.subheader}>
        Connect with licensed mental health professionals for personalized support
      </Text>
      
      {isLoading ? (
        <Text style={styles.loadingText}>Loading professionals...</Text>
      ) : (
        <FlatList
          data={professionals}
          renderItem={renderProfessional}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  listContainer: {
    paddingBottom: 20
  },
  proCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  proImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16
  },
  proInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  proName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333'
  },
  proSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4
  },
  proRating: {
    fontSize: 14,
    color: '#FFA000',
    marginBottom: 4
  },
  proStatus: {
    fontSize: 14,
    fontWeight: '500'
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666'
  }
});

export default TalkToProScreen;