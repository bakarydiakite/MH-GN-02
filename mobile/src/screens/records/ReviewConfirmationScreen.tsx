import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useBirthForm } from '../../store/BirthContext';
import { birthService, CreateBirthData } from '../../services/birth.service';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'Non renseigné'}</Text>
  </View>
);

const Section = ({ title, icon, children }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color="#006948" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

import { uploadService } from '../../services/upload.service';

export const ReviewConfirmationScreen = ({ navigation }: any) => {
  const { formData, resetForm } = useBirthForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // 1. Vérifier la connexion d'abord
      const isOnline = await birthService.checkConnection();
      
      if (!isOnline) {
        throw new Error('OFFLINE');
      }

      // Helper pour convertir JJ/MM/AAAA -> AAAA-MM-DD
      const toIsoDate = (dateStr?: string) => {
        if (!dateStr || !dateStr.includes('/')) return dateStr;
        const [d, m, y] = dateStr.split('/');
        return `${y}-${m}-${d}`;
      };

      // Upload des images sur Supabase
      const carnetUrl = await uploadService.uploadImage(formData.attachments?.carnet_maternite, 'carnet');
      const cniMereUrl = await uploadService.uploadImage(formData.attachments?.cni_mere, 'cni_mere');
      const cniPereUrl = await uploadService.uploadImage(formData.attachments?.cni_pere, 'cni_pere');
      const acteMariageUrl = await uploadService.uploadImage(formData.attachments?.acte_mariage, 'acte_mariage');

      // Préparation des données pour le serveur
      const finalData: CreateBirthData = {
        prenomsEnfant: formData.prenomsEnfant!,
        nomEnfant: formData.nomEnfant!,
        dateNaissanceEnfant: toIsoDate(formData.dateNaissanceEnfant)!,
        heureNaissanceEnfant: formData.heureNaissanceEnfant || '00:00',
        sexeEnfant: formData.sexeEnfant as any,
        nationaliteEnfant: formData.nationaliteEnfant || 'GUINÉENNE',
        regionNaissance: formData.regionNaissance!,
        prefectureNaissance: formData.prefectureNaissance!,
        sousPrefectureNaissance: formData.sousPrefectureNaissance!,
        lieuNaissanceLibelle: formData.lieuNaissanceLibelle,
        
        nomPere: formData.nomPere,
        dateNaissancePere: toIsoDate(formData.dateNaissancePere),
        professionPere: formData.professionPere,
        nationalitePere: formData.nationalitePere,
        idNationalPere: formData.idNationalPere,
        cniPere: formData.cniPere,
        telephonePere: formData.telephonePere,
        
        nomMere: formData.nomMere!,
        dateNaissanceMere: toIsoDate(formData.dateNaissanceMere),
        professionMere: formData.professionMere,
        nationaliteMere: formData.nationaliteMere,
        idNationalMere: formData.idNationalMere,
        cniMere: formData.cniMere,
        telephoneMere: formData.telephoneMere,
        
        regionParents: formData.regionParents!,
        prefectureParents: formData.prefectureParents!,
        sousPrefectureParents: formData.sousPrefectureParents!,
        quartierParents: formData.quartierParents!,
        secteurParents: formData.secteurParents!,
        
        nomDeclarant: formData.nomDeclarant!,
        idNationalDeclarant: formData.idNationalDeclarant,
        cniDeclarant: formData.cniDeclarant,
        lienParenteDeclarant: formData.lienParenteDeclarant!,

        // URLs des images Supabase
        carnetMaternite: carnetUrl,
        cniMerePhoto: cniMereUrl,
        cniPerePhoto: cniPereUrl,
        acteMariagePhoto: acteMariageUrl,
      };

      const result = await birthService.registerBirth(finalData);
      resetForm();
      navigation.navigate('SuccessScreen', { 
        recordId: result.id,
        iun: result.identifiantUniqueNational 
      });
    } catch (error: any) {
      console.error('[ReviewConfirmation] Submission error:', error);
      
      const isOfflineError = error.message === 'OFFLINE' || error.message.includes('Network request failed');

      Alert.alert(
        isOfflineError ? 'Mode Hors-ligne' : 'Erreur de Connexion',
        isOfflineError 
          ? "Vous semblez être hors-ligne. Voulez-vous sauvegarder cet enregistrement localement pour le synchroniser plus tard ?"
          : "Impossible d'envoyer l'enregistrement au serveur. Voulez-vous le sauvegarder en brouillon ?",
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Sauvegarder Brouillon', 
            onPress: async () => {
              try {
                await birthService.saveDraft(formData as any);
                resetForm();
                Alert.alert('Succès', 'Enregistrement sauvegardé localement.');
                navigation.navigate('Dashboard');
              } catch (e) {
                Alert.alert('Erreur', 'Impossible de sauvegarder localement');
              }
            } 
          },
          { text: 'Réessayer', onPress: () => handleConfirm() }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vérification Finale</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <MaterialCommunityIcons name="file-certificate-outline" size={60} color="#006948" />
          <Text style={styles.heroTitle}>Récapitulatif de l'acte</Text>
          <Text style={styles.heroSub}>Vérifiez les données avant la signature biométrique.</Text>
        </View>

        <Section title="L'ENFANT" icon="person-outline">
          <InfoRow label="Prénoms" value={formData.prenomsEnfant!} />
          <InfoRow label="Nom" value={formData.nomEnfant!} />
          <InfoRow label="Date & Heure" value={`${formData.dateNaissanceEnfant} à ${formData.heureNaissanceEnfant}`} />
          <InfoRow label="Sexe" value={formData.sexeEnfant!} />
          <InfoRow label="Lieu" value={`${formData.sousPrefectureNaissance}, ${formData.prefectureNaissance}`} />
        </Section>

        <Section title="LE PÈRE" icon="man-outline">
          <InfoRow label="Nom complet" value={formData.nomPere!} />
          <InfoRow label="Profession" value={formData.professionPere!} />
          <InfoRow label="Nationalité" value={formData.nationalitePere!} />
          <InfoRow label="NIN" value={formData.idNationalPere!} />
          <InfoRow label="Téléphone" value={formData.telephonePere!} />
        </Section>

        <Section title="LA MÈRE" icon="woman-outline">
          <InfoRow label="Nom complet" value={formData.nomMere!} />
          <InfoRow label="Profession" value={formData.professionMere!} />
          <InfoRow label="Nationalité" value={formData.nationaliteMere!} />
          <InfoRow label="NIN" value={formData.idNationalMere!} />
          <InfoRow label="Téléphone" value={formData.telephoneMere!} />
        </Section>

        <Section title="ADRESSE DES PARENTS" icon="home-outline">
          <InfoRow label="Localité" value={`${formData.quartierParents}, ${formData.sousPrefectureParents}`} />
          <InfoRow label="Préfecture" value={formData.prefectureParents!} />
        </Section>

        <Section title="DÉCLARANT" icon="document-text-outline">
          <InfoRow label="Nom" value={formData.nomDeclarant!} />
          <InfoRow label="Lien" value={formData.lienParenteDeclarant!} />
        </Section>

        <View style={styles.alertBox}>
          <Ionicons name="shield-checkmark" size={20} color="#006948" />
          <Text style={styles.alertText}>L'enregistrement sera certifié par la blockchain après validation.</Text>
        </View>

        <TouchableOpacity 
          style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]} 
          onPress={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : (
            <>
              <Text style={styles.confirmBtnText}>Signer et Enregistrer</Text>
              <Ionicons name="cloud-upload" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Modifier les informations</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#006948', paddingHorizontal: 20, paddingVertical: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, color: '#fff', fontWeight: '800' },
  scrollContent: { padding: 20 },
  hero: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginTop: 15 },
  heroSub: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5, paddingHorizontal: 20 },
  section: { backgroundColor: '#fff', borderRadius: 25, padding: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F3F5', paddingBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#006948', textTransform: 'uppercase', letterSpacing: 1 },
  sectionBody: { gap: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: '#888', fontWeight: '600', flex: 1 },
  infoValue: { fontSize: 13, color: '#1a1a1a', fontWeight: '700', flex: 1.5, textAlign: 'right' },
  alertBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#E6F3EF', padding: 15, borderRadius: 15, marginBottom: 25 },
  alertText: { flex: 1, fontSize: 12, color: '#006948', fontWeight: '600' },
  confirmBtn: { backgroundColor: '#006948', borderRadius: 16, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 4 },
  confirmBtnDisabled: { backgroundColor: '#ADB5BD' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', marginTop: 20 },
  cancelBtnText: { color: '#666', fontSize: 14, fontWeight: '700' },
});
