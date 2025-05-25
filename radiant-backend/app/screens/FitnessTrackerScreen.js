import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://localhost:5000/api';

const FitnessTrackerScreen = () => {
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');
  const [fitnessHistory, setFitnessHistory] = useState([]);

  const activityTypes = [
    'Walking', 'Running', 'Cycling', 'Swimming', 
    'Yoga', 'Strength Training', 'HIIT', 'Other'
  ];

  useEffect(() => {
    fetchFitnessHistory();
  }, []);

  const fetchFitnessHistory = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/fitness`, {
        headers: { 'x-auth-token': token }
      });
      setFitnessHistory(response.data);
    } catch (error) {
      console.error('Error fetching fitness history:', error);
      Alert.alert('Error', 'Failed to load fitness history');
    }
  };

  const saveFitnessActivity = async () => {
    if (!activityType) {
      Alert.alert('Error', 'Please select an activity type');
      return;
    }

    if (!duration) {
      Alert.alert('Error', 'Please enter duration');
      return;
    }

    try {
      const token = await getToken();
      const fitnessData = {
        activityType,
        duration: parseInt(duration),
        distance: distance ? parseFloat(distance) : undefined,
        calories: calories ? parseInt(calories) : undefined,
        steps: steps ? parseInt(steps) : undefined,
        heartRate: heartRate ? parseInt(heartRate) : undefined,
        notes
      };

      await axios.post(`${API_URL}/fitness`, fitnessData, {
        headers: { 'x-auth-token': token }
      });

      Alert.alert('Success', 'Your fitness activity has been saved');
      fetchFitnessHistory();
      resetForm();
    } catch (error) {
      console.error('Error saving fitness activity:', error);
      Alert.alert('Error', 'Failed to save your fitness activity');
    }
  };

  const resetForm = () => {
    setActivityType('');
    setDuration('');
    setDistance('');
    setCalories('');
    setSteps('');
    setHeartRate('');
    setNotes('');
  };


  const getToken = async () => {
    return 'your-auth-token';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Fitness Tracker</Text>
        
        <Text style={styles.sectionTitle}>Activity Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityTypesContainer}>
          {activityTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.activityTypeButton,
                activityType === type && styles.selectedActivityTypeButton
              ]}
              onPress={() => setActivityType(type)}
            >
              <Text style={[
                styles.activityTypeText,
                activityType === type && styles.selectedActivityTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={styles.sectionTitle}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter duration"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>Distance (km)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter distance (optional)"
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>Calories Burned</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter calories (optional)"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>Steps</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter steps (optional)"
          value={steps}
          onChangeText={setSteps}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>Average Heart Rate</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter heart rate (optional)"
          value={heartRate}
          onChangeText={setHeartRate}
          keyboardType="numeric"
        />
        
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Add any notes about your workout..."
          value={notes}
          onChangeText={setNotes}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={saveFitnessActivity}>
          <Text style={styles.saveButtonText}>Save Activity</Text>
        </TouchableOpacity>
        
        {fitnessHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Fitness History</Text>
            {fitnessHistory.slice(0, 5).map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text style={styles.historyActivity}>
                  {entry.activityType} ({entry.duration} min)
                </Text>
                {entry.distance && (
                  <Text style={styles.historyDetail}>
                    Distance: {entry.distance} km
                  </Text>
                )}
                {entry.calories && (
                  <Text style={styles.historyDetail}>
                    Calories: {entry.calories}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  activityTypesContainer: {
    marginBottom: 15
  },
  activityTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginRight: 10
  },
  selectedActivityTypeButton: {
    backgroundColor: '#4a90e2'
  },
  activityTypeText: {
    fontSize: 16
  },
  selectedActivityTypeText: {
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  historyItem: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#4a90e2'
  },
  historyDate: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5
  },
  historyActivity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  historyDetail: {
    fontSize: 14,
    color: '#6c757d'
  }
});

export default FitnessTrackerScreen;