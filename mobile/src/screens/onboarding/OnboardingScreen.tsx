import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  Animated,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { Platform } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(windowWidth, 420) : windowWidth;
const height = windowHeight;

const DATA = [
  {
    id: '1',
    title: 'Identité Souveraine',
    description: 'Chaque naissance est ancrée sur la blockchain, garantissant une preuve d\'existence immuable pour chaque enfant.',
    image: require('../../assets/images/identity_souveraine.png'),
  },
  {
    id: '2',
    title: 'Accessibilité Mobile',
    description: 'Enregistrez les naissances n\'importe où, même sans connexion internet. Synchronisez vos données plus tard.',
    image: require('../../assets/images/accessibilite_mobile.png'),
  },
  {
    id: '3',
    title: 'Registre National',
    description: 'Un système moderne et transparent pour digitaliser l\'état civil de la République de Guinée.',
    image: require('../../assets/images/registre_nationnal.png'),
  },
];

export const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flatListRef = React.useRef<FlatList>(null);

  const handleNext = async () => {
    console.log('[Onboarding] Bouton Suivant pressé ! Index actuel:', currentIndex);
    if (currentIndex < DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('[Onboarding] Passage manuel à l\'index:', nextIndex);
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      console.log('[Onboarding] Fin de l\'onboarding, redirection vers Login...');
      await AsyncStorage.setItem('onboarding_done', 'true');
      navigation.replace('Login');
    }
  };

  const renderItem = ({ item, index }: { item: typeof DATA[0], index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [20, 0, 20],
    });

    return (
      <View style={styles.slide}>
        <View style={styles.topSection}>
          <Animated.Image 
            source={item.image} 
            style={[styles.image, { transform: [{ scale }] }]} 
            resizeMode="contain"
          />
        </View>
        <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={DATA}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          snapToAlignment="center"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.footer}>
          <View style={styles.indicatorContainer}>
            {DATA.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  { width: currentIndex === i ? 28 : 8, backgroundColor: currentIndex === i ? Colors.primary : 'rgba(0, 105, 72, 0.1)' }
                ]}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>
              {currentIndex === DATA.length - 1 ? 'ACCÉDER AU PORTAIL' : 'SUIVANT'}
            </Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
  },
  topSection: {
    flex: 1,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fbf4',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  content: {
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '90%',
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 25,
    alignItems: 'center',
    gap: 15,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  indicator: {
    height: 6,
    borderRadius: 3,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    // @ts-ignore
    boxShadow: '0 10px 15px rgba(0, 105, 72, 0.2)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
});
