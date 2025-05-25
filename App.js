import React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import HomeScreen from './radiant-backend/app/screens/HomeScreen.js';
import {LoginScreen} from './radiant-backend/app/screens/LoginScreen.js';
import {SignupScreen} from './radiant-backend/app/screens/SignupScreen.js';
import ChangePasswordScreen from './radiant-backend/app/screens/ChangePasswordScreen.js';
import MeditationScreen from './radiant-backend/app/screens/MeditationScreen.js';
import ProfileScreen from './radiant-backend/app/screens/ProfileScreen.js';
import MeditationPlayerScreen from './radiant-backend/app/screens/MeditationPlayerScreen.js';
import  JournalScreen  from './radiant-backend/app/screens/JournalScreen.js';
import MoodTrackerScreen from './radiant-backend/app/screens/MoodTrackerScreen.js';
import TalkToProScreen from './radiant-backend/app/screens/TalkToProScreen.js';
import FitnessTrackerScreen from './radiant-backend/app/screens/FitnessTrackerScreen.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Meditation" component={MeditationScreen} />
          <Stack.Screen name="MeditationPlayer" component={MeditationPlayerScreen} />
          <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
          <Stack.Screen name="FitnessTracker" component={FitnessTrackerScreen} />
          <Stack.Screen name="Journal" component={JournalScreen} />
          <Stack.Screen name="TalkToPro" component={TalkToProScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>);
};


export default App;