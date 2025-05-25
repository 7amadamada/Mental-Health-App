import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://localhost:5000/api';

const JournalScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEntryDetail, setShowEntryDetail] = useState(false);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setIsLoadingEntries(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/journals`, {
        headers: { 'x-auth-token': token }
      });
      setJournalEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      Alert.alert('Error', 'Failed to load journal entries');
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const saveJournalEntry = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please enter both title and content');
      return;
    }

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const journalData = {
        title: title.trim(),
        content: content.trim(),
        mood: mood || undefined,
        tags,
        isPrivate
      };

      await axios.post(`${API_URL}/journals`, journalData, {
        headers: { 'x-auth-token': token }
      });

      Alert.alert('Success', 'Journal entry saved successfully');
      resetForm();
      fetchJournalEntries();
      setShowNewEntryForm(false);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (entryId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_URL}/journals/${entryId}`, {
                headers: { 'x-auth-token': token }
              });
              
              setShowEntryDetail(false);
              setSelectedEntry(null);
              fetchJournalEntries();
              Alert.alert('Success', 'Journal entry deleted successfully');
            } catch (error) {
              console.error('Error deleting journal entry:', error);
              Alert.alert('Error', 'Failed to delete journal entry');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setTags([]);
    setTagInput('');
    setIsPrivate(true);
  };

  const viewEntryDetail = (entry) => {
    setSelectedEntry(entry);
    setShowEntryDetail(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏' },
    { id: 'reflective', label: 'Reflective', emoji: '🤔' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'sad', label: 'Sad', emoji: '😢' }
  ];

  const getMoodEmoji = (moodId) => {
    const foundMood = moods.find(m => m.id === moodId);
    return foundMood ? foundMood.emoji : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      {showNewEntryForm ? (
        <ScrollView style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>New Journal Entry</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                resetForm();
                setShowNewEntryForm(false);
              }}
            >
              <Ionicons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a title for your entry"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts here..."
            multiline
            value={content}
            onChangeText={setContent}
          />

          <Text style={styles.label}>How are you feeling?</Text>
          <View style={styles.moodSelector}>
            {moods.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.moodButton,
                  mood === item.id && styles.selectedMoodButton
                ]}
                onPress={() => setMood(item.id)}
              >
                <Text style={styles.moodEmoji}>{item.emoji}</Text>
                <Text style={styles.moodLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tags (e.g., work, family)"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Ionicons name="close-circle" size={16} color="#6c757d" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.privacyContainer}>
            <Text style={styles.label}>Private Entry</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#767577', true: '#4a90e2' }}
              thumbColor={isPrivate ? '#f5f5f5' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveJournalEntry}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save Entry</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.entriesContainer}>
          <View style={styles.entriesHeader}>
            <Text style={styles.title}>My Journal</Text>
            <TouchableOpacity
              style={styles.newEntryButton}
              onPress={() => setShowNewEntryForm(true)}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {isLoadingEntries ? (
            <ActivityIndicator style={styles.loader} color="#4a90e2" />
          ) : journalEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={64} color="#6c757d" />
              <Text style={styles.emptyText}>No journal entries yet</Text>
              <Text style={styles.emptySubtext}>
                Start writing to track your thoughts and feelings
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setShowNewEntryForm(true)}
              >
                <Text style={styles.startButtonText}>Create First Entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView>
              {journalEntries.map((entry, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.entryCard}
                  onPress={() => viewEntryDetail(entry)}
                >
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    {entry.isPrivate && (
                      <Ionicons name="lock-closed" size={16} color="#6c757d" />
                    )}
                  </View>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.entryPreview} numberOfLines={2}>
                    {entry.content}
                  </Text>
                  {entry.tags && entry.tags.length > 0 && (
                    <View style={styles.entryTagsContainer}>
                      {entry.tags.map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.entryTag}>
                          <Text style={styles.entryTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <Modal
        visible={showEntryDetail}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowEntryDetail(false);
          setSelectedEntry(null);
        }}
      >
        {selectedEntry && (
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowEntryDetail(false);
                    setSelectedEntry(null);
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="#4a90e2" />
                </TouchableOpacity>
                <View style={styles.modalHeaderRight}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteEntry(selectedEntry._id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.modalTitle}>{selectedEntry.title}</Text>
              <View style={styles.modalMetaContainer}>
                <Text style={styles.modalDate}>
                  {formatDate(selectedEntry.date)}
                </Text>
                {selectedEntry.isPrivate && (
                  <View style={styles.privateTag}>
                    <Ionicons name="lock-closed" size={12} color="white" />
                    <Text style={styles.privateTagText}>Private</Text>
                  </View>
                )}
                {selectedEntry.mood && (
                  <Text style={styles.modalMood}>
                    {getMoodEmoji(selectedEntry.mood)} {selectedEntry.mood}
                  </Text>
                )}
              </View>

              <Text style={styles.modalContent}>{selectedEntry.content}</Text>

              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <View style={styles.modalTagsContainer}>
                  <Text style={styles.modalTagsTitle}>Tags:</Text>
                  <View style={styles.modalTags}>
                    {selectedEntry.tags.map((tag, tagIndex) => (
                      <View key={tagIndex} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  formContainer: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 5
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  contentInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8
  },
  moodButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    width: '18%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  selectedMoodButton: {
    backgroundColor: '#4a90e2'
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4
  },
  moodLabel: {
    fontSize: 12,
    textAlign: 'center'
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginTop: 8
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  addTagButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60
  },
  addTagButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    marginRight: 4
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  entriesContainer: {
    flex: 1,
    padding: 16
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  newEntryButton: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    marginTop: 50
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 32
  },
  startButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    width: '80%'
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  entryDate: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8
  },
  entryPreview: {
    fontSize: 16,
    color: '#333'
  },
  entryTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  entryTag: {
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  entryTagText: {
    fontSize: 12,
    color: '#333'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalHeaderRight: {
    flexDirection: 'row',
    gap: 16
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  modalMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalDate: {
    fontSize: 14,
    color: '#6c757d'
  },
  privateTag: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  privateTagText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4
  },
  modalMood: {
    fontSize: 14,
    color: '#333'
  },
  modalContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  modalTagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  modalTag: {
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  modalTagText: {
    fontSize: 12,
    color: '#333'
  }
});

export default JournalScreen;