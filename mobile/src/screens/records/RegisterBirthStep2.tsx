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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useBirthForm } from '../../store/BirthContext';

export const RegisterBirthStep2 = ({ navigation }: any) => {
  const { formData, updateFormData } = useBirthForm();
  
  const [localData, setLocalData] = useState({
    nomPere: formData.nomPere || '',
    dateNaissancePere: formData.dateNaissancePere || '',
    professionPere: formData.professionPere || '',
    nationalitePere: formData.nationalitePere || 'GUINÉENNE',
    idNationalPere: formData.idNationalPere || '',
    cniPere: formData.cniPere || '',
    telephonePere: formData.telephonePere || '+224 ',
  });

  const handlePhoneChange = (text: string) => {
    if (!text.startsWith('+224')) {
      setLocalData({ ...localData, telephonePere: '+224 ' + text.replace(/[^\d]/g, '') });
    } else {
      setLocalData({ ...localData, telephonePere: text });
    }
  };

  // Fonction de masquage pour la Date (JJ/MM/AAAA)
  const formatDate = (text: string) => {
    let clean = text.replace(/\D/g, '');
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
    
    setLocalData({ ...localData, dateNaissancePere: formatted });
  };

  const handleNext = () => {
    updateFormData(localData);
    navigation.navigate('RegisterBirthStep3');
  };

  const isValid = localData.nomPere.length > 2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.stepCount}>Étape 2 sur 6</Text>
          <Text style={styles.headerTitle}>Informations du Père</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>32%</Text>
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
            <Text style={styles.sectionTitle}>Identité du Père</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nom complet (Prénom & Nom)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Amadou KOUROUMA"
                value={localData.nomPere}
                onChangeText={(v) => setLocalData({...localData, nomPere: v})}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Date de naissance</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="JJ/MM/AAAA"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={localData.dateNaissancePere}
                  onChangeText={formatDate}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Nationalité</Text>
                <TextInput 
                  style={styles.input} 
                  value={localData.nationalitePere}
                  onChangeText={(v) => setLocalData({...localData, nationalitePere: v})}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Profession</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: CULTIVATEUR"
                value={localData.professionPere}
                onChangeText={(v) => setLocalData({...localData, professionPere: v})}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents d'identification</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>CNI ou Autres</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Carte d'identité"
                value={localData.cniPere}
                onChangeText={(v) => setLocalData({...localData, cniPere: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Numéro de téléphone (+224)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="+224 6xx xx xx xx"
                keyboardType="phone-pad"
                value={localData.telephonePere}
                onChangeText={handlePhoneChange}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]} 
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.nextBtnText}>Suivant : La Mère</Text>
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
  nextBtn: { backgroundColor: '#006948', borderRadius: 16, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, elevation: 4, shadowColor: '#006948', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  nextBtnDisabled: { backgroundColor: '#ADB5BD', elevation: 0, shadowOpacity: 0 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
