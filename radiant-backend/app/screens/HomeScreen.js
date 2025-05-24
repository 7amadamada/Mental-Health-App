import React from 'react';
import{
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FeatureCard = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
        <Icon name={icon} size={40} color="#4a90e2" />
        <Text style={styles.featureTitle}>{title}</Text>
    </TouchableOpacity>
);
