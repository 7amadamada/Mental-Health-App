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
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '../config';

const MoodTrackerScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  
  const moods = [
    { emoji: '😊', name: 'happy' },
    { emoji: '😐', name: 'neutral' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😡', name: 'angry' },
    { emoji: '😴', name: 'tired' }
  ];
  
  const factors = [
    'work', 'family', 'health', 'social', 
    'sleep', 'exercise', 'nutrition', 'other'
  ];

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/moods`, {
        headers: { 'x-auth-token': token }
      });
      setMoodHistory(response.data);
    } catch (error) {
      console.error('Error fetching mood history:', error);
      Alert.alert('Error', 'Failed to load mood history');
    }
  };

  const toggleFactor = (factor) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };

  const saveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const moodData = {
        mood: selectedMood,
        intensity,
        notes,
        factors: selectedFactors
      };

      await axios.post(`${API_URL}/api/moods`, moodData, {
        headers: { 'x-auth-token': token }
      });

      Alert.alert('Success', 'Your mood has been saved');
      fetchMoodHistory();
      resetForm();
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert('Error', 'Failed to save your mood');
    }
  };

  const resetForm = () => {
    setSelectedMood(null);
    setIntensity(3);
    setNotes('');
    setSelectedFactors([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>How are you feeling today?</Text>
        
        <View style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodButton,
                selectedMood === mood.name && styles.selectedMoodButton
              ]}
              onPress={() => setSelectedMood(mood.name)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodText}>{mood.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Intensity (1-5)</Text>
        <View style={styles.intensityContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.intensityButton,
                intensity === value && styles.selectedIntensityButton
              ]}
              onPress={() => setIntensity(value)}
            >
              <Text style={styles.intensityText}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Contributing Factors</Text>
        <View style={styles.factorsContainer}>
          {factors.map((factor, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.factorButton,
                selectedFactors.includes(factor) && styles.selectedFactorButton
              ]}
              onPress={() => toggleFactor(factor)}
            >
              <Text style={styles.factorText}>{factor}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Add any notes about how you're feeling..."
          value={notes}
          onChangeText={setNotes}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
          <Text style={styles.saveButtonText}>Save Mood</Text>
        </TouchableOpacity>
        
        {moodHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Mood History</Text>
            {moodHistory.slice(0, 5).map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text style={styles.historyMood}>
                  {entry.mood} (Intensity: {entry.intensity})
                </Text>
                {entry.factors.length > 0 && (
                  <Text style={styles.historyFactors}>
                    Factors: {entry.factors.join(', ')}
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
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  moodButton: {
    width: '18%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    marginBottom: 10
  },
  selectedMoodButton: {
    backgroundColor: '#4a90e2',
  },
  moodEmoji: {
    fontSize: 30,
    marginBottom: 5
  },
  moodText: {
    fontSize: 12
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  intensityButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#e9ecef'
  },
  selectedIntensityButton: {
    backgroundColor: '#4a90e2'
  },
  intensityText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  factorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  factorButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginRight: 10,
    marginBottom: 10
  },
  selectedFactorButton: {
    backgroundColor: '#4a90e2'
  },
  factorText: {
    fontSize: 14
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
  historyMood: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  historyFactors: {
    fontSize: 14,
    color: '#6c757d'
  }
});

export default MoodTrackerScreen;
