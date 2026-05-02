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

const LIENS = ['PÈRE', 'MÈRE', 'TUTEUR', 'AUTRE'];

export const RegisterBirthStep4 = ({ navigation }: any) => {
  const { formData, updateFormData } = useBirthForm();
  
  const [localData, setLocalData] = useState({
    nomDeclarant: formData.nomDeclarant || '',
    idNationalDeclarant: formData.idNationalDeclarant || '',
    cniDeclarant: formData.cniDeclarant || '',
    lienParenteDeclarant: formData.lienParenteDeclarant || 'PÈRE',
  });

  const handleNext = () => {
    updateFormData(localData);
    navigation.navigate('RegisterBirthStep5');
  };

  const isValid = localData.nomDeclarant.length > 2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.stepCount}>Étape 4 sur 5</Text>
          <Text style={styles.headerTitle}>Informations du Déclarant</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>75%</Text>
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
            <View style={styles.infoIconBox}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Le déclarant est la personne qui se présente pour enregistrer la naissance.</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nom complet du déclarant</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Amadou KOUROUMA"
                value={localData.nomDeclarant}
                onChangeText={(v) => setLocalData({...localData, nomDeclarant: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Lien de parenté avec l'enfant</Text>
              <View style={styles.lienRow}>
                {LIENS.map(l => (
                  <TouchableOpacity 
                    key={l}
                    style={[styles.lienChip, localData.lienParenteDeclarant === l && styles.lienChipActive]}
                    onPress={() => setLocalData({...localData, lienParenteDeclarant: l})}
                  >
                    <Text style={[styles.lienText, localData.lienParenteDeclarant === l && styles.lienTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Numéro d'ID National (NIN)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: 1890101..."
                keyboardType="number-pad"
                value={localData.idNationalDeclarant}
                onChangeText={(v) => setLocalData({...localData, idNationalDeclarant: v})}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Type de pièce d'identité</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: CNI, Passeport, etc."
                value={localData.cniDeclarant}
                onChangeText={(v) => setLocalData({...localData, cniDeclarant: v})}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]} 
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.nextBtnText}>Vérifier l'enregistrement</Text>
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
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
  infoIconBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primary + '10', padding: 12, borderRadius: 15, marginBottom: 20 },
  infoText: { flex: 1, fontSize: 12, color: Colors.primary, fontWeight: '600' },
  field: { marginBottom: 18 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F1F3F5', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, color: '#1a1a1a' },
  lienRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  lienChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F1F3F5', borderWidth: 1.5, borderColor: '#E9ECEF' },
  lienChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  lienText: { fontSize: 12, fontWeight: '700', color: '#666' },
  lienTextActive: { color: '#fff' },
  nextBtn: { backgroundColor: '#006948', borderRadius: 16, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, elevation: 4, shadowColor: '#006948', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  nextBtnDisabled: { backgroundColor: '#ADB5BD', elevation: 0, shadowOpacity: 0 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
