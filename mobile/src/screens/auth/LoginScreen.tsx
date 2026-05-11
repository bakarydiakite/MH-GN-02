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
  Image as RNImage,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { authService } from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors } from '../../theme/colors';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricSupported(hasHardware && isEnrolled);
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().replace(/\s/g, '');
    if (!cleanEmail || (isAgent && !password)) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(cleanEmail, password);
      if (res.user.role !== role) {
        Alert.alert('Accès refusé', `Ce compte n'est pas associé au profil ${role.toLowerCase()}.`);
        setIsLoading(false);
        return;
      }
      navigation.navigate(res.user.role === 'AGENT' ? 'MainAgent' : 'MainFamille' as any);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authentification NaissanceChain',
    });
    if (result.success) {
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        navigation.navigate(user.role === 'AGENT' ? 'MainAgent' : 'MainFamille' as any);
      } else {
        Alert.alert('Note', 'Veuillez vous connecter manuellement la première fois.');
      }
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      
      {/* Immersive Top Decoration */}
      <View style={[styles.topDecoration, { height: windowHeight * 0.35, backgroundColor: Colors.primary }]}>
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
        <SafeAreaView style={styles.topContent} edges={['top']}>
          <View style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              <FontAwesome5 name="fingerprint" size={32} color="#fff" />
            </View>
            <Text style={styles.brandName}>NaissanceChain</Text>
            <Text style={styles.brandSlogan}>ÉTAT CIVIL</Text>
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.formContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.welcomeTitle}>Bienvenue</Text>
            <Text style={styles.welcomeSub}>Veuillez vous identifier pour accéder au registre d&apos;État Civil.</Text>

            {/* Premium Role Selector */}
            <View style={styles.rolePicker}>
              <TouchableOpacity 
                style={[styles.roleOption, isAgent && styles.roleOptionActive]} 
                onPress={() => setRole('AGENT')}
              >
                <Feather name="shield" size={16} color={isAgent ? '#fff' : Colors.primary} />
                <Text style={[styles.roleOptionText, isAgent && styles.roleOptionTextActive]}>Agent</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleOption, !isAgent && styles.roleOptionActive]} 
                onPress={() => setRole('FAMILLE')}
              >
                <Feather name="home" size={16} color={!isAgent ? '#fff' : Colors.primary} />
                <Text style={[styles.roleOptionText, !isAgent && styles.roleOptionTextActive]}>Famille</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isAgent ? 'Email / Identifiant' : 'Numéro de téléphone'}</Text>
              <View style={styles.inputBox}>
                <Feather name={isAgent ? "mail" : "phone"} size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder={isAgent ? "agent@gouv.gn" : "+224 6xx xx xx xx"}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {isAgent && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <View style={styles.inputBox}>
                  <Feather name="lock" size={20} color={Colors.primary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#ccc" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!isAgent && (
              <View style={styles.infoNote}>
                <Feather name="info" size={14} color={Colors.primary} />
                <Text style={styles.infoNoteText}>
                  Utilisez le numéro enregistré par l&apos;agent lors de la déclaration.
                </Text>
              </View>
            )}

            {/* Login Action */}
            <TouchableOpacity 
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Accéder au Portail</Text>
                  <Feather name="arrow-right" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Quick Auth Divider */}
            {isBiometricSupported && (
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU BIOMÉTRIE</Text>
                <View style={styles.dividerLine} />
              </View>
            )}

            {isBiometricSupported && (
              <TouchableOpacity style={styles.bioBtn} onPress={handleBiometricAuth}>
                <Ionicons name="finger-print-outline" size={32} color={Colors.primary} />
                <Text style={styles.bioBtnText}>Utiliser FaceID / Empreinte</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomLink}>
            <Text style={styles.bottomLinkText}>Besoin d&apos;assistance ? </Text>
            <TouchableOpacity>
              <Text style={styles.supportText}>Contacter le support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  topDecoration: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  decorationCircle1: { position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,255,255,0.1)' },
  decorationCircle2: { position: 'absolute', bottom: -100, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)' },
  topContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brandContainer: { alignItems: 'center' },
  logoContainer: { width: 70, height: 70, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  brandName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  brandSlogan: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 3, marginTop: 4 },
  
  formContainer: { flex: 1, marginTop: windowHeight * 0.28 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  formCard: { backgroundColor: '#fff', borderRadius: 40, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 40, elevation: 15 },
  welcomeTitle: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  welcomeSub: { fontSize: 14, color: Colors.onSurfaceVariant, opacity: 0.6, marginTop: 8, lineHeight: 22, marginBottom: 32 },
  
  rolePicker: { flexDirection: 'row', backgroundColor: '#F8FAF9', padding: 6, borderRadius: 20, marginBottom: 32 },
  roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 16 },
  roleOptionActive: { backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  roleOptionText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  roleOptionTextActive: { color: '#fff' },
  
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '800', color: Colors.onSurface, marginBottom: 8, opacity: 0.8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF9', borderRadius: 20, paddingHorizontal: 20, height: 64, borderWidth: 1, borderColor: '#F0F0F0' },
  inputIcon: { marginRight: 12, opacity: 0.8 },
  input: { flex: 1, fontSize: 16, color: Colors.onSurface, fontWeight: '600' },
  
  infoNote: { flexDirection: 'row', gap: 8, marginTop: -10, marginBottom: 20, paddingHorizontal: 4 },
  infoNoteText: { fontSize: 11, color: Colors.primary, fontWeight: '700', opacity: 0.7, flex: 1 },
  
  loginBtn: { backgroundColor: Colors.primary, height: 68, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F0F0' },
  dividerText: { fontSize: 10, fontWeight: '900', color: '#ccc', marginHorizontal: 16, letterSpacing: 1 },
  
  bioBtn: { alignItems: 'center', gap: 10 },
  bioBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary, opacity: 0.8 },
  
  bottomLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  bottomLinkText: { fontSize: 14, color: Colors.onSurfaceVariant, opacity: 0.6 },
  supportText: { fontSize: 14, color: Colors.primary, fontWeight: '700' }
});
