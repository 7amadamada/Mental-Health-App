import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handleLogin = () => {
        navigation.navigate('Home');
    };

    const handleAnonymousLogin = () => {
        setIsAnonymous(true);
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Radiant</Text>
            <Text style={styles.subtitle}>Your Wellness Companion</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize='none'
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.anonymousButton} onPress={handleAnonymousLogin}>
                <Text style={styles.anonymousButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
        </SafeAreaView>

  
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4a90e2',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
        marginBottom: 40,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        height: 50,
        backgroundColor: '#4a90e2',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4a90e2',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#4a90e2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    anonymousButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    anonymousButtonText: {
        color: '#4a90e2',
        fontSize: 14
    },
});

export default LoginScreen;