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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useBirthForm } from '../../store/BirthContext';

// Composant de sélection rapide
const SelectionGrid = ({ label, options, selectedValue, onSelect }: any) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.gridRow}>
      {options.map((opt: any) => (
        <TouchableOpacity 
          key={opt.value} 
          style={[styles.gridItem, selectedValue === opt.value && styles.gridItemActive]} 
          onPress={() => onSelect(opt.value)}
        >
          <Text style={[styles.gridItemText, selectedValue === opt.value && styles.gridItemTextActive]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

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

  // Fonction de masquage pour la Date (JJ/MM/AAAA)
  const formatBirthDate = (text: string) => {
    let clean = text.replace(/\D/g, ''); // Garder uniquement les chiffres
    if (clean.length > 8) clean = clean.slice(0, 8);
    
    let formatted = clean;
    if (clean.length > 2) {
      const day = parseInt(clean.slice(0, 2));
      const validDay = Math.min(Math.max(day, 1), 31).toString().padStart(2, '0');
      formatted = `${validDay}/${clean.slice(2)}`;
    }
    if (clean.length > 4) {
      const month = parseInt(clean.slice(2, 4));
      const validMonth = Math.min(Math.max(month, 1), 12).toString().padStart(2, '0');
      formatted = `${formatted.slice(0, 3)}${validMonth}/${clean.slice(4)}`;
    }
    
    setLocalData({ ...localData, dateNaissanceEnfant: formatted });
  };

  // Fonction de masquage pour l'Heure (HH:MM)
  const formatBirthTime = (text: string) => {
    let clean = text.replace(/\D/g, '');
    if (clean.length > 4) clean = clean.slice(0, 4);
    
    let formatted = clean;
    if (clean.length > 2) {
      const hour = parseInt(clean.slice(0, 2));
      const validHour = Math.min(hour, 23).toString().padStart(2, '0');
      formatted = `${validHour}:${clean.slice(2)}`;
    }
    if (clean.length === 4) {
      const minute = parseInt(clean.slice(2, 4));
      const validMin = Math.min(minute, 59).toString().padStart(2, '0');
      formatted = `${formatted.slice(0, 3)}${validMin}`;
    }
    
    setLocalData({ ...localData, heureNaissanceEnfant: formatted });
  };

  const handleNext = () => {
    updateFormData(localData);
    navigation.navigate('RegisterBirthStep2');
  };

  const isValid = 
    localData.prenomsEnfant.length > 1 && 
    localData.nomEnfant.length > 1 &&
    localData.dateNaissanceEnfant.length === 10 &&
    localData.prefectureNaissance.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.stepCount}>Étape 1 sur 6</Text>
          <Text style={styles.headerTitle}>Informations de l'Enfant</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>15%</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identité de l'Enfant</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Prénom(s)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Mamadou Safaiou"
                value={localData.prenomsEnfant}
                onChangeText={(v) => setLocalData({...localData, prenomsEnfant: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nom</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: BARRY"
                autoCapitalize="characters"
                value={localData.nomEnfant}
                onChangeText={(v) => setLocalData({...localData, nomEnfant: v})}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Sexe</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity 
                    style={[styles.genderBtn, localData.sexeEnfant === 'MASCULIN' && styles.genderBtnActive]}
                    onPress={() => setLocalData({...localData, sexeEnfant: 'MASCULIN'})}
                  >
                    <Text style={[styles.genderBtnText, localData.sexeEnfant === 'MASCULIN' && styles.genderBtnTextActive]}>M</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.genderBtn, localData.sexeEnfant === 'FEMININ' && styles.genderBtnActiveF]}
                    onPress={() => setLocalData({...localData, sexeEnfant: 'FEMININ'})}
                  >
                    <Text style={[styles.genderBtnText, localData.sexeEnfant === 'FEMININ' && styles.genderBtnTextActive]}>F</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.field, { flex: 1.5 }]}>
                <Text style={styles.fieldLabel}>Nationalité</Text>
                <TextInput 
                  style={styles.input} 
                  value={localData.nationaliteEnfant}
                  onChangeText={(v) => setLocalData({...localData, nationaliteEnfant: v})}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temps et Lieu</Text>
            
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1.5 }]}>
                <Text style={styles.fieldLabel}>Date de naissance</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="JJ/MM/AAAA"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={localData.dateNaissanceEnfant}
                  onChangeText={formatBirthDate}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Heure</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="HH:MM"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={localData.heureNaissanceEnfant}
                  onChangeText={formatBirthTime}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Région de naissance</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: KANKAN"
                value={localData.regionNaissance}
                onChangeText={(v) => setLocalData({...localData, regionNaissance: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Préfecture de naissance</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: KÉROUANÉ"
                value={localData.prefectureNaissance}
                onChangeText={(v) => setLocalData({...localData, prefectureNaissance: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Sous-Préfecture / Commune</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: SABADOU-BARANAMA"
                value={localData.sousPrefectureNaissance}
                onChangeText={(v) => setLocalData({...localData, sousPrefectureNaissance: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Structure de santé (Optionnel)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Hôpital National Donka"
                value={localData.lieuNaissanceLibelle}
                onChangeText={(v) => setLocalData({...localData, lieuNaissanceLibelle: v})}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]} 
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.nextBtnText}>Suivant : Le Père</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    backgroundColor: '#006948', 
    paddingHorizontal: 20, 
    paddingVertical: 25, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, marginLeft: 15 },
  stepCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase' },
  headerTitle: { fontSize: 18, color: '#fff', fontWeight: '800' },
  progressCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#80f9c2', justifyContent: 'center', alignItems: 'center' },
  progressText: { color: '#80f9c2', fontSize: 12, fontWeight: '800' },
  scrollContent: { padding: 20 },
  section: { backgroundColor: '#fff', borderRadius: 25, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 },
  field: { marginBottom: 15 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F1F3F5', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, color: '#1a1a1a' },
  row: { flexDirection: 'row', gap: 15 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { flex: 1, height: 45, borderRadius: 12, backgroundColor: '#F1F3F5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E9ECEF' },
  genderBtnActive: { backgroundColor: '#006948', borderColor: '#006948' },
  genderBtnActiveF: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  genderBtnText: { fontWeight: '800', color: '#666' },
  genderBtnTextActive: { color: '#fff' },
  nextBtn: { backgroundColor: '#006948', borderRadius: 16, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, elevation: 4, shadowColor: '#006948', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  nextBtnDisabled: { backgroundColor: '#ADB5BD', elevation: 0, shadowOpacity: 0 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
