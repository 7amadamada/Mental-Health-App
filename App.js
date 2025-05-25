import React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {HomeScreen} from './radiant-backend/app/screens/HomeScreen.js';
import {LoginScreen} from './radiant-backend/app/screens/LoginScreen.js';
import {SignupScreen} from './radiant-backend/app/screens/SignupScreen.js';
import MeditationScreen from './radiant-backend/app/screens/MeditationScreen.js';
import  JournalScreen  from './radiant-backend/app/screens/JournalScreen.js';
import MoodTrackerScreen from './radiant-backend/app/screens/MoodTrackerScreen.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Meditation" component={MeditationScreen} />
          <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
          <Stack.Screen name="Journal" component={JournalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>);
};


export default App;