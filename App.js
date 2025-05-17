import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet,
   Text,
    View,
    TouchableHighlight,
    Alert,
    Image, 
    SafeAreaView,
    Button,
  } from 'react-native';

export default function App() {
  console.log('App component is rendering' );
  console.log(require('./assets/icon.png'));

  
  return (
    <SafeAreaView style={styles.container}>
      <Button 
      color={"purple"}
      title= "button"
       onPress={() =>
        Alert.prompt("my title", "my message", (text) => console.log(text))
       }/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
