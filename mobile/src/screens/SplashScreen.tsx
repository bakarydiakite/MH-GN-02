import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { authService } from '../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Logique de redirection
    const checkStatus = async () => {
      try {
        // Attendre au moins 2.5 secondes pour l'effet visuel
        const [user, onboardingDone] = await Promise.all([
          authService.getUser(),
          AsyncStorage.getItem('onboarding_done'),
          new Promise(resolve => setTimeout(resolve, 2500))
        ]);

        if (user) {
          // Déjà connecté -> Dashboard selon le rôle
          if (user.role === 'AGENT' || user.role === 'ADMINISTRATEUR' || user.role === 'SUPERVISEUR') {
            navigation.replace('MainAgent');
          } else {
            navigation.replace('MainFamille');
          }
        } else if (onboardingDone === 'true') {
          // Onboarding déjà fait mais pas connecté -> Login
          navigation.replace('Login');
        } else {
          // Première fois -> Onboarding
          navigation.replace('Onboarding');
        }
      } catch (error) {
        navigation.replace('Login');
      }
    };

    checkStatus();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Shapes */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="verified-user" size={60} color="#fff" />
          </View>
          <View style={styles.logoGlow} />
        </View>

        <Text style={styles.title}>NaissanceChain</Text>
        <Text style={styles.subtitle}>L'identité numérique pour chaque enfant</Text>

        <View style={styles.loaderContainer}>
          <View style={styles.loaderBar}>
            <Animated.View style={styles.loaderProgress} />
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>RÉPUBLIQUE DE GUINÉE</Text>
        <View style={styles.guineeColors}>
          <View style={[styles.colorBar, { backgroundColor: '#CE1126' }]} />
          <View style={[styles.colorBar, { backgroundColor: '#FCD116' }]} />
          <View style={[styles.colorBar, { backgroundColor: '#009460' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006948',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle2: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    fontWeight: '600',
  },
  loaderContainer: {
    marginTop: 50,
    width: 150,
  },
  loaderBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderProgress: {
    height: '100%',
    width: '40%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },
  guineeColors: {
    flexDirection: 'row',
    height: 3,
    width: 60,
    borderRadius: 2,
    overflow: 'hidden',
  },
  colorBar: {
    flex: 1,
  },
});
