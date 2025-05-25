import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MeditationPlayerScreen = ({ route, navigation }) => {
  const { meditation } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (1 / (meditation.duration * 60));
          setCurrentTime(prev => prev + 1);
          if (newProgress >= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 1;
          }
          return newProgress;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, meditation.duration]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  }
  };

  export default MeditationPlayerScreen;