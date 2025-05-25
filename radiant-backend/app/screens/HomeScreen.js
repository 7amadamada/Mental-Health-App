import React, {useState,useEffect} from 'react';
import{
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FeatureCard = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
        <Icon name={icon} size={40} color="#4a90e2" />
        <Text style={styles.featureTitle}>{title}</Text>
    </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const cardWidth = (dimensions.width - 60) / 3;
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const dynamicStyles = {
        card: {
            width: cardWidth,
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 12,
            alignItems: 'center',
            shadowColor: '#000',
            marginBottom: 15,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2
        },
    };

    return (
        <SafeAreaView style={styles.container}>
           <View style={styles.header}>
                <Text style={styles.Greeting}>Hello, user!</Text>
                <Text style={styles.date}>{today}</Text>
            </View>
        <ScrollView>
            <View style={styles.dailyTip}>
                <Text style={styles.tipTitle}>Daily Wellness Tip</Text>
                <Text style={styles.tipText}>
                    Remember to take breaks and hydrate throughout your day!
                </Text>
            
            </View>

            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodContainer}>
                {['😊', '😐', '😢', '😡', '😴'].map((emoji, index)=> (
                    <TouchableOpacity key={index} style={styles.moodButton}>
                        <Text style={styles.moodEmoji}>{emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
                {[
            { title: "Mood Tracker", icon: "emoticon-outline", screen: "MoodTracker" },
            { title: "Meditation", icon: "meditation", screen: "Meditation" },
            { title: "Fitness", icon: "run", screen: "FitnessTracker" },
            { title: "Journal", icon: "book-outline", screen: "Journal" },
            { title: "Talk to Pro", icon: "message-text-outline", screen: "TalkToPro" },
            { title: "Profile", icon: "account-outline", screen: "Profile" }
          ].map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              icon={feature.icon}
              onPress={() => navigation.navigate(feature.screen)}
              style={{ width: cardWidth }}
            />
          ))}
        </View>
        </ScrollView>

            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
    },
    Greeting: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 16,
        color: '#888',
    },
    dailyTip: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tipText: {
        fontSize: 14,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    moodButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    moodEmoji: {
        fontSize: 25,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'space-between',
    },
    featureCard:{
        width:'48%',
        backgroundColor:'#fff',
        paddingVertical:15,
        paddingHorizontal:10,
        borderRadius:10,
        alignItems:'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginBottom:15
    },
    cardTitle:{
        marginTop:10,
        fontSize:16,
        fontWeight: '500'
    }
});

export {HomeScreen};