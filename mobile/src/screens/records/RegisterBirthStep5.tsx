import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

const STEP = 5;
const TOTAL_STEPS = 6;

type AttachmentItem = {
  id: string;
  type: string;
  icon: string;
  label: string;
  required: boolean;
  captured: boolean;
};

import * as ImagePicker from 'expo-image-picker';
import { useBirthForm } from '../../store/BirthContext';

export const RegisterBirthStep5 = ({ navigation }: any) => {
  const { formData, updateFormData } = useBirthForm();
  
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    { id: '1', type: 'carnet_maternite', icon: 'book', label: 'Carnet de maternité', required: false, captured: !!formData.attachments?.carnet_maternite },
    { id: '2', type: 'cni_mere', icon: 'badge', label: 'CNI de la mère', required: false, captured: !!formData.attachments?.cni_mere },
    { id: '3', type: 'cni_pere', icon: 'badge', label: 'CNI du père', required: false, captured: !!formData.attachments?.cni_pere },
    { id: '4', type: 'acte_mariage', icon: 'favorite', label: 'Acte de mariage', required: false, captured: !!formData.attachments?.acte_mariage },
  ]);

  const handleCapture = async (id: string, type: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à l\'appareil photo.');
      return;
    }

    Alert.alert(
      'Ajouter un document',
      'Comment souhaitez-vous ajouter ce document ?',
      [
        { text: 'Appareil photo', onPress: () => launchCamera(id, type) },
        { text: 'Galerie photos', onPress: () => launchGallery(id, type) },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const launchCamera = async (id: string, type: string) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // Disabling editing can prevent crashes on some Android devices
        quality: 0.5, // Lower quality for faster upload/sync
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        saveImage(id, type, result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error launching camera:', error);
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'appareil photo.');
    }
  };

  const launchGallery = async (id: string, type: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      saveImage(id, type, result.assets[0].uri);
    }
  };

  const saveImage = (id: string, type: string, uri: string) => {
    // Mettre à jour l'état local
    setAttachments(prev => prev.map(a => a.id === id ? { ...a, captured: true } : a));
    
    // Mettre à jour le contexte global
    const currentAttachments = formData.attachments || {};
    updateFormData({
      attachments: {
        ...currentAttachments,
        [type]: uri
      }
    });
  };

  const removeImage = (id: string, type: string) => {
    setAttachments(prev => prev.map(a => a.id === id ? { ...a, captured: false } : a));
    const currentAttachments = { ...(formData.attachments || {}) };
    delete (currentAttachments as any)[type];
    updateFormData({ attachments: currentAttachments });
  };

  const capturedCount = attachments.filter(a => a.captured).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.stepLabel}>Étape {STEP} sur {TOTAL_STEPS}</Text>
          <Text style={styles.topBarTitle}>Pièces jointes</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i < STEP ? styles.progressSegmentFilled : styles.progressSegmentEmpty,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="attach-file" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.pageTitle}>Documents à joindre</Text>
          <Text style={styles.pageSub}>
            Ces documents sont facultatifs mais recommandés pour accélérer la validation de l&apos;acte.
          </Text>
        </View>

        {/* Optional badge */}
        <View style={styles.optionalBanner}>
          <MaterialIcons name="info" size={16} color={Colors.outline} />
          <Text style={styles.optionalText}>
            {capturedCount} document(s) ajouté(s) · Tous les champs sont optionnels
          </Text>
        </View>

        {/* Attachment cards */}
        <View style={styles.attachmentList}>
          {attachments.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.attachmentCard, item.captured && styles.attachmentCardCaptured]}
              onPress={() => handleCapture(item.id, item.type)}
              activeOpacity={0.8}
            >
              <View style={[styles.attachIconBox, item.captured && styles.attachIconBoxCaptured]}>
                <MaterialIcons
                  name={item.captured ? 'check-circle' : (item.icon as any)}
                  size={26}
                  color={item.captured ? Colors.primary : Colors.onSurfaceVariant}
                />
              </View>
              <View style={styles.attachTextBlock}>
                <Text style={[styles.attachLabel, item.captured && styles.attachLabelCaptured]}>
                  {item.label}
                </Text>
                <Text style={styles.attachSub}>
                  {item.captured ? 'Document ajouté ✓' : 'Appuyez pour photographier'}
                </Text>
              </View>
              <View style={styles.attachAction}>
                {item.captured ? (
                  <TouchableOpacity onPress={() => removeImage(item.id, item.type)}>
                    <MaterialIcons name="close" size={18} color={Colors.error} />
                  </TouchableOpacity>
                ) : (
                  <MaterialIcons name="camera-alt" size={20} color={Colors.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scan QR info */}
        <View style={styles.scanBox}>
          <View style={styles.scanBoxHeader}>
            <MaterialIcons name="qr-code-scanner" size={20} color={Colors.primary} />
            <Text style={styles.scanBoxTitle}>Scanner un document existant</Text>
          </View>
          <Text style={styles.scanBoxSub}>
            Si l&apos;un des parents possède une carte d&apos;identité numérique avec QR code, vous pouvez la scanner pour pré-remplir les informations automatiquement.
          </Text>
          <TouchableOpacity style={styles.scanBtn}>
            <MaterialIcons name="qr-code-scanner" size={20} color={Colors.primary} />
            <Text style={styles.scanBtnText}>Scanner un QR code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('ReviewConfirmation')}
        >
          <Text style={styles.skipBtnText}>Passer cette étape</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => navigation.navigate('ReviewConfirmation')}
        >
          <Text style={styles.nextBtnText}>Révision finale</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center', alignItems: 'center',
  },
  topBarCenter: { alignItems: 'center' },
  stepLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1.5, opacity: 0.6, textTransform: 'uppercase' },
  topBarTitle: { fontSize: 20, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5 },
  progressBar: { flexDirection: 'row', paddingHorizontal: 20, gap: 4, marginBottom: 4 },
  progressSegment: { flex: 1, height: 3, borderRadius: 2 },
  progressSegmentFilled: { backgroundColor: Colors.primary },
  progressSegmentEmpty: { backgroundColor: Colors.surfaceContainerHigh },
  scrollContent: { padding: 10, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: 20 },
  headerIcon: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  pageTitle: { fontSize: 24, fontWeight: '900', color: Colors.onSurface, textAlign: 'center', marginBottom: 8 },
  pageSub: { fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 19 },
  optionalBanner: {
    flexDirection: 'row', gap: 8, alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 20,
  },
  optionalText: { fontSize: 12, color: Colors.outline, fontWeight: '600', flex: 1 },
  attachmentList: { gap: 12, marginBottom: 24 },
  attachmentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 18,
    padding: 12, borderWidth: 1.5, borderColor: Colors.outlineVariant,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  attachmentCardCaptured: {
    borderColor: Colors.primary + '50', backgroundColor: Colors.primary + '06',
  },
  attachIconBox: {
    width: 54, height: 54, borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
  },
  attachIconBoxCaptured: { backgroundColor: Colors.primary + '15' },
  attachTextBlock: { flex: 1 },
  attachLabel: { fontSize: 14, fontWeight: '700', color: Colors.onSurface, marginBottom: 3 },
  attachLabelCaptured: { color: Colors.primary },
  attachSub: { fontSize: 12, color: Colors.onSurfaceVariant },
  attachAction: { paddingLeft: 8 },
  scanBox: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 20,
    padding: 20, gap: 10, borderWidth: 1, borderColor: Colors.outlineVariant,
  },
  scanBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scanBoxTitle: { fontSize: 14, fontWeight: '800', color: Colors.onSurface },
  scanBoxSub: { fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18 },
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1.5,
    borderColor: Colors.primary + '30', alignSelf: 'flex-start',
  },
  scanBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  bottomBar: {
    padding: 20, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: Colors.surfaceContainerHigh,
    flexDirection: 'row', gap: 10,
  },
  skipBtn: {
    flex: 1, height: 64, borderRadius: 14,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center', alignItems: 'center',
  },
  skipBtnText: { fontSize: 14, fontWeight: '700', color: Colors.onSurfaceVariant },
  nextBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 64, borderRadius: 14,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
  },
  nextBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
