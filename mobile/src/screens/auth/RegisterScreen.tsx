import React, { useState, useRef, useEffect } from 'react';
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
  Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { authService } from '../../services/auth.service';
import Svg, { Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { SocialLoginButtons } from '../../components/ui/SocialLoginButtons';

WebBrowser.maybeCompleteAuthSession();

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(windowWidth, 420) : windowWidth;
const height = windowHeight;

const MOCK_CENTERS = [
  { id: '550e8400-e29b-41d4-a716-446655440001', nom: 'Hôpital National Donka' },
  { id: '550e8400-e29b-41d4-a716-446655440002', nom: 'Hôpital National Ignace Deen' },
  { id: '550e8400-e29b-41d4-a716-446655440003', nom: 'CMC de Matam' },
  { id: '550e8400-e29b-41d4-a716-446655440004', nom: 'CMC de Ratoma' },
  { id: '550e8400-e29b-41d4-a716-446655440005', nom: 'Centre de Santé de Kaloum' },
];

export const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'AGENT' | 'FAMILLE'>('AGENT');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nin, setNin] = useState('');
  
  const [matricule, setMatricule] = useState('');
  const [fonction, setFonction] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '562296537435-otvk2csot7l83qq42ojslolbgumqd1ib.apps.googleusercontent.com',
    webClientId: '562296537435-icjckdmo951k5gg6cerbngei2hjnm4ki.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setIsLoading(true);
    try {
      const res = await authService.googleLogin(idToken);
      if (res.user.role === 'AGENT') navigation.navigate('MainAgent');
      else navigation.navigate('MainFamille');
    } catch (error: any) {
      Alert.alert('Erreur Google', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isAgent = role === 'AGENT';
  const totalSteps = isAgent ? 3 : 2; // Les familles n'ont pas l'étape pro

  const nextStep = () => {
    if (step === 1) {
      if (!prenom || !nom) {
        Alert.alert('Champs requis', 'Veuillez renseigner votre nom et prénom.');
        return;
      }
      setStep(isAgent ? 2 : 3);
    } else if (step === 2) {
      if (!matricule || !fonction || !selectedCenterId) {
        Alert.alert('Champs requis', 'Veuillez remplir vos informations professionnelles.');
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step === 3) setStep(isAgent ? 2 : 1);
    else if (step === 2) setStep(1);
  };

  const handleRegister = async () => {
    if (password.length < 6 || password !== confirmPassword || !email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez vérifier vos identifiants.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        prenom, nom, email: email.trim(), password, telephone, role,
        matricule: isAgent ? matricule : undefined,
        fonction: isAgent ? fonction : undefined,
        centerId: isAgent ? selectedCenterId : undefined,
        nin: !isAgent ? nin : undefined,
      });
      Alert.alert('Succès 🎉', 'Compte créé avec succès !', [
        { text: 'Continuer', onPress: () => navigation.navigate(isAgent ? 'MainAgent' : 'MainFamille') }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Échec de l\'inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
      <Text style={styles.stepIndicator}>Étape {step === 3 ? (isAgent ? 3 : 2) : step} sur {isAgent ? 3 : 2}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <View style={[styles.headerTextContainer, { paddingTop: insets.top + 5 }]}>
            <Text style={styles.headerSmall}>Nouveau compte</Text>
            <Text style={styles.headerLarge}>Inscription</Text>
          </View>
        </View>
        <View style={styles.svgWrapper}>
          <Svg height="80" width={width} viewBox={`0 0 ${width} 80`} style={styles.waveSvg}>
            <Path d={`M0,0 C${width * 0.3},80 ${width * 0.7},0 ${width},80 L${width},80 L0,80 Z`} fill="#fff" />
          </Svg>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
        {renderProgressBar()}
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <Animated.View style={styles.stepView}>
              <Text style={styles.stepTitle}>Qui êtes-vous ?</Text>
              
              <Text style={styles.stepDesc}>
                Choisissez votre profil pour continuer. Si vous êtes un parent, utilisez le numéro de téléphone fourni lors de l&apos;enregistrement.
              </Text>
              
              <View style={styles.roleContainer}>
                <TouchableOpacity style={[styles.roleTab, isAgent && styles.roleTabActive]} onPress={() => setRole('AGENT')}>
                  <Ionicons name="medical" size={18} color={isAgent ? '#fff' : '#006948'} style={{marginRight: 8}} />
                  <Text style={[styles.roleText, isAgent && styles.roleTextActive]}>Agent</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roleTab, !isAgent && styles.roleTabActive]} onPress={() => setRole('FAMILLE')}>
                  <Ionicons name="people" size={18} color={!isAgent ? '#fff' : '#006948'} style={{marginRight: 8}} />
                  <Text style={[styles.roleText, !isAgent && styles.roleTextActive]}>Famille</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prénom</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="Votre prénom" placeholderTextColor="#A0A0A0" value={prenom} onChangeText={setPrenom} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom de famille</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="Votre nom" placeholderTextColor="#A0A0A0" value={nom} onChangeText={setNom} />
                </View>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextButtonText}>Suivant</Text>
                <Feather name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>

              <SocialLoginButtons 
                onGooglePress={() => promptAsync()} 
                isLoading={isLoading} 
              />
            </Animated.View>
          )}

          {/* STEP 2: PROFESSIONAL (Agents Only) */}
          {step === 2 && isAgent && (
            <Animated.View style={styles.stepView}>
              <Text style={styles.stepTitle}>Informations professionnelles</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Matricule</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="AGT-XXXX-XXXX" placeholderTextColor="#A0A0A0" value={matricule} onChangeText={setMatricule} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fonction</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="Ex: Sage-femme" placeholderTextColor="#A0A0A0" value={fonction} onChangeText={setFonction} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Centre de Santé d'affectation</Text>
                {MOCK_CENTERS.map((center) => (
                  <TouchableOpacity 
                    key={center.id} 
                    style={[styles.centerOption, selectedCenterId === center.id && styles.centerOptionActive]}
                    onPress={() => setSelectedCenterId(center.id)}
                  >
                    <Text style={[styles.centerOptionText, selectedCenterId === center.id && styles.centerOptionTextActive]}>{center.nom}</Text>
                    {selectedCenterId === center.id && <Ionicons name="checkmark-circle" size={20} color="#006948" />}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                  <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                  <Text style={styles.nextButtonText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* STEP 3: SECURITY & CONTACT */}
          {step === 3 && (
            <Animated.View style={styles.stepView}>
              <Text style={styles.stepTitle}>Sécurité et Contact</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Adresse e-mail</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="email@exemple.com" placeholderTextColor="#A0A0A0" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone / NIN</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="N° de téléphone (6xx xx xx xx)" placeholderTextColor="#A0A0A0" value={!isAgent ? nin : telephone} onChangeText={!isAgent ? setNin : setTelephone} keyboardType="phone-pad" />
                </View>
                {!isAgent && <Text style={styles.inputHint}>Important : Utilisez le même numéro que celui donné à l&apos;agent pour lier vos enfants.</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="6 caractères min." placeholderTextColor="#A0A0A0" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#A0A0A0" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmation</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="Confirmez le mot de passe" placeholderTextColor="#A0A0A0" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                  <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton, isLoading && {opacity: 0.7}]} onPress={handleRegister} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Terminer l'inscription</Text>}
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.signupText}>Se connecter</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: height * 0.18, backgroundColor: '#006948', position: 'relative' },
  headerBackground: { flex: 1 },
  headerTextContainer: { paddingHorizontal: 35 },
  headerSmall: { fontSize: 13, color: 'rgba(255, 255, 255, 0.85)', fontWeight: '500' },
  headerLarge: { fontSize: 32, color: '#fff', fontWeight: '900', marginTop: 2 },
  svgWrapper: { position: 'absolute', bottom: -1, left: 0, right: 0 },
  waveSvg: { backgroundColor: 'transparent' },
  formContainer: { flex: 1 },
  progressContainer: { paddingHorizontal: 35, marginTop: 15 },
  progressBar: { height: 6, backgroundColor: '#006948', borderRadius: 3 },
  stepIndicator: { fontSize: 12, color: '#666', marginTop: 5, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 35, paddingBottom: 40, paddingTop: 15 },
  stepView: { flex: 1 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: '#333', marginBottom: 8 },
  stepDesc: { fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 18 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#f5fbf4', borderRadius: 15, padding: 5, marginBottom: 25 },
  roleTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, flexDirection: 'row', justifyContent: 'center' },
  roleTabActive: { backgroundColor: '#006948' },
  roleText: { fontSize: 14, fontWeight: '700', color: '#006948' },
  roleTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  inputHint: { fontSize: 10, color: '#006948', marginTop: 5, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 18, height: 55, borderWidth: 1, borderColor: '#F0F0F0' },
  input: { flex: 1, fontSize: 14, color: '#000' },
  centerOption: { paddingVertical: 12, paddingHorizontal: 15, backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  centerOptionActive: { backgroundColor: '#e6f3ef', borderColor: '#006948' },
  centerOptionText: { fontSize: 13, color: '#666' },
  centerOptionTextActive: { color: '#006948', fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  nextButton: { flex: 1, backgroundColor: '#006948', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backButton: { width: 100, backgroundColor: '#f0f0f0', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  submitButton: { flex: 1, backgroundColor: '#006948', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666', fontSize: 14 },
  signupText: { color: '#006948', fontSize: 14, fontWeight: '700' },
});
