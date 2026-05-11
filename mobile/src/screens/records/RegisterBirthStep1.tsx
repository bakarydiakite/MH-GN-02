import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useBirthForm } from '../../store/BirthContext';

const { width } = Dimensions.get('window');

export const RegisterBirthStep1 = ({ navigation }: any) => {
  const { formData, updateFormData } = useBirthForm();
  
  const [localData, setLocalData] = useState({
    prenomsEnfant: formData.prenomsEnfant || '',
    nomEnfant: formData.nomEnfant || '',
    sexeEnfant: formData.sexeEnfant || 'MASCULIN',
    nationaliteEnfant: formData.nationaliteEnfant || 'GUINÉENNE',
    dateNaissanceEnfant: formData.dateNaissanceEnfant || '',
    heureNaissanceEnfant: formData.heureNaissanceEnfant || '',
    regionNaissance: formData.regionNaissance || '',
    prefectureNaissance: formData.prefectureNaissance || '',
    sousPrefectureNaissance: formData.sousPrefectureNaissance || '',
    lieuNaissanceLibelle: formData.lieuNaissanceLibelle || '',
  });

  const formatBirthDate = (text: string) => {
    let clean = text.replace(/\D/g, '');
    if (clean.length > 8) clean = clean.slice(0, 8);
    let formatted = clean;
    if (clean.length > 2) formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    if (clean.length > 4) formatted = `${formatted.slice(0, 5)}/${clean.slice(4)}`;
    setLocalData({ ...localData, dateNaissanceEnfant: formatted });
  };

  const formatBirthTime = (text: string) => {
    let clean = text.replace(/\D/g, '');
    if (clean.length > 4) clean = clean.slice(0, 4);
    let formatted = clean;
    if (clean.length > 2) formatted = `${clean.slice(0, 2)}:${clean.slice(2)}`;
    setLocalData({ ...localData, heureNaissanceEnfant: formatted });
  };

  const handleNext = () => {
    updateFormData(localData);
    navigation.navigate('RegisterBirthStep2');
  };

  const isValid = 
    localData.prenomsEnfant.length > 1 && 
    localData.nomEnfant.length > 1 &&
    localData.dateNaissanceEnfant.length === 10;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      
      {/* Premium Step Header */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Feather name="chevron-left" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerSub}>NOUVEL ENREGISTREMENT</Text>
              <Text style={styles.headerTitle}>L&apos;Enfant</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1 / 6</Text>
            </View>
          </View>
          
          {/* Futuristic Progress Bar */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressBase}>
              <View style={[styles.progressFill, { width: '16.6%' }]} />
            </View>
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
        >
          
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Identité Civile</Text>
            
            <FormInput 
              label="Prénom(s)" 
              placeholder="Ex: Ibrahima" 
              value={localData.prenomsEnfant} 
              onChangeText={(v) => setLocalData({...localData, prenomsEnfant: v})}
              icon="user"
            />

            <FormInput 
              label="Nom de famille" 
              placeholder="Ex: DIALLO" 
              value={localData.nomEnfant} 
              onChangeText={(v) => setLocalData({...localData, nomEnfant: v})}
              autoCapitalize="characters"
              icon="users"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Sexe</Text>
                <View style={styles.genderPicker}>
                  <TouchableOpacity 
                    style={[styles.genderOption, localData.sexeEnfant === 'MASCULIN' && styles.genderActiveM]}
                    onPress={() => setLocalData({...localData, sexeEnfant: 'MASCULIN'})}
                  >
                    <Text style={[styles.genderText, localData.sexeEnfant === 'MASCULIN' && styles.textWhite]}>M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.genderOption, localData.sexeEnfant === 'FEMININ' && styles.genderActiveF]}
                    onPress={() => setLocalData({...localData, sexeEnfant: 'FEMININ'})}
                  >
                    <Text style={[styles.genderText, localData.sexeEnfant === 'FEMININ' && styles.textWhite]}>F</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1.5 }}>
                <FormInput 
                  label="Nationalité" 
                  value={localData.nationaliteEnfant} 
                  onChangeText={(v) => setLocalData({...localData, nationaliteEnfant: v})}
                  icon="globe"
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Temps & Origine</Text>

            <View style={styles.row}>
              <View style={{ flex: 1.5 }}>
                <FormInput 
                  label="Date de naissance" 
                  placeholder="JJ/MM/AAAA"
                  value={localData.dateNaissanceEnfant} 
                  onChangeText={formatBirthDate}
                  keyboardType="number-pad"
                  icon="calendar"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput 
                  label="Heure" 
                  placeholder="HH:MM"
                  value={localData.heureNaissanceEnfant} 
                  onChangeText={formatBirthTime}
                  keyboardType="number-pad"
                  icon="clock"
                />
              </View>
            </View>

            <FormInput 
              label="Lieu / Structure de santé" 
              placeholder="Ex: Hôpital de Kankan" 
              value={localData.lieuNaissanceLibelle} 
              onChangeText={(v) => setLocalData({...localData, lieuNaissanceLibelle: v})}
              icon="map-pin"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FormInput 
                  label="Région" 
                  placeholder="Région" 
                  value={localData.regionNaissance} 
                  onChangeText={(v) => setLocalData({...localData, regionNaissance: v})}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput 
                  label="Préfecture" 
                  placeholder="Préfecture" 
                  value={localData.prefectureNaissance} 
                  onChangeText={(v) => setLocalData({...localData, prefectureNaissance: v})}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]} 
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.nextBtnText}>Suivant : Le Père</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const FormInput = ({ label, icon, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputBox}>
      {icon && <Feather name={icon} size={16} color={Colors.primary} style={styles.inputIcon} />}
      <TextInput 
        style={styles.input} 
        placeholderTextColor="#A0A0A0"
        {...props} 
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAF9' },
  header: { backgroundColor: '#fff', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, marginLeft: 16 },
  headerSub: { fontSize: 10, color: Colors.primary, fontWeight: '800', letterSpacing: 1.5, opacity: 0.6 },
  headerTitle: { fontSize: 24, color: Colors.onSurface, fontWeight: '900', letterSpacing: -0.5 },
  stepBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: Colors.primary + '15' },
  stepBadgeText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  progressWrapper: { paddingHorizontal: 40 },
  progressBase: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  
  formContainer: { flex: 1 },
  scrollContent: { padding: 10 },
  formCard: { backgroundColor: '#fff', borderRadius: 32, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 3, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface, marginBottom: 20, letterSpacing: -0.5 },
  
  inputGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 12, fontWeight: '800', color: Colors.onSurface, marginBottom: 8, opacity: 0.5, marginLeft: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF9', borderRadius: 16, paddingHorizontal: 16, height: 64, borderWidth: 1, borderColor: '#F0F0F0' },
  inputIcon: { marginRight: 12, opacity: 0.7 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.onSurface },
  
  row: { flexDirection: 'row', gap: 16 },
  genderPicker: { flexDirection: 'row', backgroundColor: '#F8FAF9', borderRadius: 16, padding: 4, height: 64, borderWidth: 1, borderColor: '#F0F0F0' },
  genderOption: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  genderActiveM: { backgroundColor: Colors.primary },
  genderActiveF: { backgroundColor: '#FF5252' },
  genderText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  textWhite: { color: '#fff' },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 24 },
  
  nextBtn: { backgroundColor: Colors.primary, height: 64, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  nextBtnDisabled: { backgroundColor: '#E0E0E0', elevation: 0, shadowOpacity: 0 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
