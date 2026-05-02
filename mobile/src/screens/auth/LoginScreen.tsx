import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { authService } from '../../services/auth.service';
import Svg, { Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { SocialLoginButtons } from '../../components/ui/SocialLoginButtons';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(windowWidth, 420) : windowWidth;
const height = windowHeight;

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<'AGENT' | 'FAMILLE'>('AGENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const isAgent = role === 'AGENT';

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '562296537435-otvk2csot7l83qq42ojslolbgumqd1ib.apps.googleusercontent.com',
    webClientId: '562296537435-icjckdmo951k5gg6cerbngei2hjnm4ki.apps.googleusercontent.com',
    iosClientId: '562296537435-icjckdmo951k5gg6cerbngei2hjnm4ki.apps.googleusercontent.com',
  });

  useEffect(() => {
    checkDeviceForHardware();
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const navigateToMain = (userRole: string) => {
    if (userRole === 'AGENT') navigation.navigate('MainAgent');
    else navigation.navigate('MainFamille');
  };

  const handleGoogleLogin = async (idToken: string) => {
    setIsLoading(true);
    try {
      const res = await authService.googleLogin(idToken);
      navigateToMain(res.user.role);
    } catch (error: any) {
      Alert.alert('Erreur Google', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Non configuré', 'Aucune empreinte enregistrée.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentification NaissanceChain',
        fallbackLabel: 'Utiliser le mot de passe',
      });

      if (result.success) {
        const storedUser = await AsyncStorage.getItem('user_data');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          navigateToMain(user.role);
        } else {
          Alert.alert('Action requise', 'Veuillez vous connecter manuellement une fois.');
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la biométrie.');
    }
  };

  const handleRoleChange = (newRole: 'AGENT' | 'FAMILLE') => {
    setRole(newRole);
    if (newRole === 'FAMILLE' && !email.startsWith('+224')) {
      setEmail('+224 ');
    } else if (newRole === 'AGENT' && email === '+224 ') {
      setEmail('');
    }
  };

  const handlePhoneChange = (text: string) => {
    if (!isAgent) {
      // Force le +224
      if (!text.startsWith('+224')) {
        setEmail('+224 ' + text.replace(/[^\d]/g, ''));
      } else {
        setEmail(text);
      }
    } else {
      setEmail(text);
    }
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().replace(/\s/g, '');
    if (!cleanEmail || (isAgent && !password)) {
      Alert.alert('Champs requis', `Veuillez renseigner votre ${isAgent ? 'identifiant et mot de passe' : 'numéro de téléphone'}.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(cleanEmail, password);
      
      // Vérification du rôle
      if (res.user.role !== role) {
        Alert.alert('Accès refusé', `Ce compte n'est pas enregistré comme un profil ${isAgent ? 'Agent' : 'Famille'}.`);
        setIsLoading(false);
        return;
      }

      navigateToMain(res.user.role);
    } catch (error: any) {
      let friendlyMessage = 'Une erreur est survenue lors de la connexion.';
      
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Identifiants invalides') || errorMessage.includes('numéro non reconnu')) {
        friendlyMessage = isAgent 
          ? 'Email/Téléphone ou mot de passe incorrect.' 
          : "Numéro non reconnu. Vérifiez que l'agent a bien enregistré votre numéro sur l'acte de naissance.";
      } else if (errorMessage) {
        friendlyMessage = errorMessage; // Utiliser le message précis du backend
      }

      Alert.alert('Oups !', friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <View style={[styles.headerTextContainer, { paddingTop: insets.top + 15 }]}>
            <Text style={styles.headerSmall}>Bon retour parmi nous !</Text>
            <Text style={styles.headerLarge}>Connexion</Text>
          </View>
        </View>
        <View style={styles.svgWrapper}>
          <Svg height="80" width={width} viewBox={`0 0 ${width} 80`} style={styles.waveSvg}>
            <Path d={`M0,0 C${width * 0.3},80 ${width * 0.7},0 ${width},80 L${width},80 L0,80 Z`} fill="#fff" />
          </Svg>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleTab, isAgent && styles.roleTabActive]} 
              onPress={() => handleRoleChange('AGENT')}
            >
              <Ionicons name="medical" size={18} color={isAgent ? '#fff' : '#006948'} style={{marginRight: 8}} />
              <Text style={[styles.roleText, isAgent && styles.roleTextActive]}>Agent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleTab, !isAgent && styles.roleTabActive]} 
              onPress={() => handleRoleChange('FAMILLE')}
            >
              <Ionicons name="people" size={18} color={!isAgent ? '#fff' : '#006948'} style={{marginRight: 8}} />
              <Text style={[styles.roleText, !isAgent && styles.roleTextActive]}>Famille</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isAgent ? 'Email ou Téléphone' : 'Numéro de Téléphone'}</Text>
            <View style={styles.inputWrapper}>
              <Feather name={isAgent ? "user" : "phone"} size={18} color="#006948" style={{marginRight: 10}} />
              <TextInput 
                style={styles.input} 
                placeholder={isAgent ? "exemple@mail.com ou 6xxxxxxxx" : "+224 6xx xx xx xx"} 
                placeholderTextColor="#A0A0A0" 
                value={email} 
                onChangeText={handlePhoneChange} 
                keyboardType={isAgent ? "default" : "phone-pad"} 
                autoCapitalize="none" 
              />
            </View>
            {!isAgent && (
              <Text style={styles.inputHint}>
                Connectez-vous avec le numéro donné lors de l&apos;enregistrement.
              </Text>
            )}
          </View>

          {isAgent && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {isAgent ? 'Se connecter' : 'Accéder à mon espace'}
                </Text>
              )}
            </TouchableOpacity>

            {isBiometricSupported && (
              <TouchableOpacity style={styles.biometryBtn} onPress={handleBiometricAuth}>
                <Ionicons name="finger-print" size={28} color="#006948" />
              </TouchableOpacity>
            )}
          </View>

          <SocialLoginButtons onGooglePress={() => promptAsync()} isLoading={isLoading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: height * 0.24, backgroundColor: '#006948', position: 'relative' },
  headerBackground: { flex: 1 },
  headerTextContainer: { paddingHorizontal: 35 },
  headerSmall: { fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', fontWeight: '500' },
  headerLarge: { fontSize: 36, color: '#fff', fontWeight: '900', marginTop: 2 },
  svgWrapper: { position: 'absolute', bottom: -1, left: 0, right: 0 },
  waveSvg: { backgroundColor: 'transparent' },
  formContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 35, paddingBottom: 40, paddingTop: 10 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#f5fbf4', borderRadius: 15, padding: 5, marginBottom: 25 },
  roleTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, flexDirection: 'row', justifyContent: 'center' },
  roleTabActive: { backgroundColor: '#006948' },
  roleText: { fontSize: 14, fontWeight: '700', color: '#006948' },
  roleTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 22 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 18, height: 58, borderWidth: 1, borderColor: '#F0F0F0' },
  input: { flex: 1, fontSize: 15, color: '#000' },
  inputHint: { fontSize: 11, color: '#006948', marginTop: 6, fontWeight: '600', opacity: 0.8 },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 15 },
  loginButton: { flex: 1, backgroundColor: '#006948', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  biometryBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f5fbf4', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 105, 72, 0.1)' },
  buttonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { color: '#666', fontSize: 15 },
  signupText: { color: '#006948', fontSize: 15, fontWeight: '700' },
});
