import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MEDITATIONS = [
    {
        id: '1',
        title: 'Morning Meditation',
        description: 'Start your day with positivity and mindfulness.',
        duration: 5,
        category: 'focus',
        image: require('../assets/morning_meditation.jpg'),
    },
    {
        id: '2',
        title: 'Evening Relaxation',
        description: 'Unwind and relax after a long day.',
        duration: 10,
        category: 'relaxation',
        image: require('../assets/evening_relaxation.jpg'),
    },
    {
        id: '3',
        title: 'Stress Relief',
        description: 'Find peace and calm in stressful times.',
        duration: 15,
        category: 'stress',
        image: require('../assets/stress_relief.jpg'),
    }
];

const MeditationCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardImageContainer}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.cardImage}
        defaultSource={require('../assets/default-meditation.png')}
      />
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{item.duration} min</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Icon name="play-circle-outline" size={24} color="#4a90e2" />
      </View>
    </View>
  </TouchableOpacity>
);

const MeditationScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'stress', name: 'Stress' },
    { id: 'sleep', name: 'Sleep' },
    { id: 'focus', name: 'Focus' },
    { id: 'gratitude', name: 'Gratitude' },
    { id: 'beginners', name: 'Beginners' }
  ];
  
  const filteredMeditations = selectedCategory === 'all' 
    ? MEDITATIONS 
    : MEDITATIONS.filter(item => item.category === selectedCategory);
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meditation</Text>
      </View>
      
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.id && styles.categoryButtonTextActive
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      
      <FlatList
        data={filteredMeditations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MeditationCard 
            item={item} 
            onPress={() => navigation.navigate('MeditationPlayer', { meditation: item })} 
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  categoryList: {
    paddingHorizontal: 15
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0'
  },
  categoryButtonActive: {
    backgroundColor: '#4a90e2'
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '500'
  },
  categoryButtonTextActive: {
    color: '#fff'
  },
  listContainer: {
    padding: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2
  },
  cardImageContainer: {
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: 150
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15
  },
  durationText: {
    color: '#fff',
    fontSize: 12
  },
  cardContent: {
    padding: 15
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryText: {
    fontSize: 12,
    color: '#4a90e2',
    textTransform: 'uppercase',
  },
});