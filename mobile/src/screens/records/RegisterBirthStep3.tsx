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

export const RegisterBirthStep3 = ({ navigation }: any) => {
  const { formData, updateFormData } = useBirthForm();
  
  const [localData, setLocalData] = useState({
    // Mère
    nomMere: formData.nomMere || '',
    dateNaissanceMere: formData.dateNaissanceMere || '',
    professionMere: formData.professionMere || '',
    nationaliteMere: formData.nationaliteMere || 'GUINÉENNE',
    idNationalMere: formData.idNationalMere || '',
    cniMere: formData.cniMere || '',
    telephoneMere: formData.telephoneMere || '+224 ',
    
    // Adresse Parents
    regionParents: formData.regionParents || '',
    prefectureParents: formData.prefectureParents || '',
    sousPrefectureParents: formData.sousPrefectureParents || '',
    quartierParents: formData.quartierParents || '',
    secteurParents: formData.secteurParents || '',
  });

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
    
    setLocalData({ ...localData, dateNaissanceMere: formatted });
  };

  const handlePhoneChange = (text: string) => {
    if (!text.startsWith('+224')) {
      setLocalData({ ...localData, telephoneMere: '+224 ' + text.replace(/[^\d]/g, '') });
    } else {
      setLocalData({ ...localData, telephoneMere: text });
    }
  };

  const handleNext = () => {
    updateFormData(localData);
    navigation.navigate('RegisterBirthStep4');
  };

  const isValid = localData.nomMere.length > 2 && localData.regionParents.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.stepCount}>Étape 3 sur 6</Text>
          <Text style={styles.headerTitle}>Informations de la Mère</Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>50%</Text>
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
            <Text style={styles.sectionTitle}>Identité de la Mère</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nom complet (Prénom & Nom)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Fadima KOUROUMA"
                value={localData.nomMere}
                onChangeText={(v) => setLocalData({...localData, nomMere: v})}
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
                  value={localData.dateNaissanceMere}
                  onChangeText={formatDate}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Nationalité</Text>
                <TextInput 
                  style={styles.input} 
                  value={localData.nationaliteMere}
                  onChangeText={(v) => setLocalData({...localData, nationaliteMere: v})}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Profession</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: MÉNAGÈRE"
                value={localData.professionMere}
                onChangeText={(v) => setLocalData({...localData, professionMere: v})}
              />
            </View>
            
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1.2 }]}>
                <Text style={styles.fieldLabel}>Numéro d'ID (NIN)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: 1900101..."
                  keyboardType="number-pad"
                  value={localData.idNationalMere}
                  onChangeText={(v) => setLocalData({...localData, idNationalMere: v})}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Type de pièce</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="CNI, etc."
                  value={localData.cniMere}
                  onChangeText={(v) => setLocalData({...localData, cniMere: v})}
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Numéro de téléphone (+224)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="+224 6xx xx xx xx"
                keyboardType="phone-pad"
                value={localData.telephoneMere}
                onChangeText={handlePhoneChange}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse des Parents</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Région de résidence</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: KANKAN"
                value={localData.regionParents}
                onChangeText={(v) => setLocalData({...localData, regionParents: v})}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Préfecture</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: KÉROUANÉ"
                  value={localData.prefectureParents}
                  onChangeText={(v) => setLocalData({...localData, prefectureParents: v})}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Sous-Préfecture</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: SABADOU"
                  value={localData.sousPrefectureParents}
                  onChangeText={(v) => setLocalData({...localData, sousPrefectureParents: v})}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Quartier / District</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: CENTRE"
                  value={localData.quartierParents}
                  onChangeText={(v) => setLocalData({...localData, quartierParents: v})}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Secteur / Village</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Secteur 1"
                  value={localData.secteurParents}
                  onChangeText={(v) => setLocalData({...localData, secteurParents: v})}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]} 
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.nextBtnText}>Suivant : Le Déclarant</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF9' },
  header: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingVertical: 25, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, marginLeft: 15 },
  stepCount: { fontSize: 10, color: Colors.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, opacity: 0.6 },
  headerTitle: { fontSize: 20, color: Colors.onSurface, fontWeight: '900', letterSpacing: -0.5 },
  progressCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
  progressText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  scrollContent: { padding: 10 },
  section: { backgroundColor: '#fff', borderRadius: 25, padding: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 },
  field: { marginBottom: 15 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F1F3F5', borderRadius: 12, paddingHorizontal: 15, height: 64, fontSize: 16, color: '#1a1a1a' },
  row: { flexDirection: 'row', gap: 15 },
  nextBtn: { backgroundColor: '#006948', borderRadius: 16, height: 64, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10, elevation: 4, shadowColor: '#006948', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  nextBtnDisabled: { backgroundColor: '#ADB5BD', elevation: 0, shadowOpacity: 0 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
