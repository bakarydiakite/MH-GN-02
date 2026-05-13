import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

type DossierStatus = 'draft' | 'complete' | 'synced' | 'certified';

type Dossier = {
  id: string;
  childName: string;
  birthDate: string;
  submittedAt: string;
  status: DossierStatus;
  reference: string;
};

const DOSSIERS: Dossier[] = [
  {
    id: '1',
    childName: 'Ibrahima Diallo',
    birthDate: '25/10/2025',
    submittedAt: '14 oct. 2025',
    status: 'certified',
    reference: 'GN-2026-CMVFTP',
  },
  {
    id: '2',
    childName: 'Fatoumata Camara',
    birthDate: '05/08/2025',
    submittedAt: '02 fév. 2025',
    status: 'synced',
    reference: 'GN-2026-X922LA',
  },
];

const STEPS = [
  { key: 'submitted', label: 'Déclaration', sub: 'Agent de terrain', icon: 'edit-3' },
  { key: 'synced', label: 'Transmission', sub: 'Serveur Central', icon: 'send' },
  { key: 'review', label: 'Validation', sub: 'Officier État Civil', icon: 'shield' },
  { key: 'certified', label: 'Certification', sub: 'Ancrage Blockchain', icon: 'lock' },
];

export const SuiviDossierScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedId, setSelectedId] = useState<string>(DOSSIERS[0].id);

  const selected = DOSSIERS.find((d) => d.id === selectedId) ?? DOSSIERS[0];
  
  const getStepStatus = (stepKey: string, dossierStatus: DossierStatus) => {
    const statusOrder = ['draft', 'complete', 'synced', 'review', 'certified'];
    const currentIdx = statusOrder.indexOf(dossierStatus === 'synced' ? 'synced' : dossierStatus);
    const stepIdx = ['submitted', 'synced', 'review', 'certified'].indexOf(stepKey);
    
    if (dossierStatus === 'certified') return 'completed';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  const getOverallProgress = (status: DossierStatus) => {
    if (status === 'certified') return 100;
    if (status === 'synced') return 50;
    return 25;
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suivi de Dossier</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Traçabilité Civile</Text>
            <Text style={styles.introSub}>Suivez en temps réel l&apos;évolution de vos certificats officiels.</Text>
          </View>

          {/* Visual Child Selector (Avatars) */}
          <Text style={styles.labelTitle}>Documents actifs</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarSelectorScroll}>
            {DOSSIERS.map((d) => (
              <TouchableOpacity 
                key={d.id} 
                activeOpacity={0.8}
                style={styles.avatarItem}
                onPress={() => setSelectedId(d.id)}
              >
                <View style={[
                  styles.avatarBorder, 
                  selectedId === d.id && styles.avatarBorderActive
                ]}>
                  <RNImage 
                    source={{ uri: `https://i.pravatar.cc/100?u=${d.id}` }} 
                    style={styles.childAvatar} 
                  />
                  {selectedId === d.id && (
                    <View style={styles.activeCheck}>
                      <MaterialIcons name="check" size={10} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.avatarName, 
                  selectedId === d.id && styles.avatarNameActive
                ]}>
                  {d.childName.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Main Status Card */}
          <View style={styles.mainCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.cardRef}>{selected.reference}</Text>
                <Text style={styles.cardTitle}>{selected.childName}</Text>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{getOverallProgress(selected.status)}%</Text>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${getOverallProgress(selected.status)}%` }]} />
            </View>

            <View style={styles.statusBadgeRow}>
              <View style={[styles.statusIndicator, { backgroundColor: selected.status === 'certified' ? '#E8F5E9' : '#FFF3E0' }]}>
                <Text style={[styles.statusIndicatorText, { color: selected.status === 'certified' ? '#2E7D32' : '#E65100' }]}>
                  {selected.status === 'certified' ? 'CERTIFIÉ' : 'EN TRAITEMENT'}
                </Text>
              </View>
              <Text style={styles.lastUpdate}>Mise à jour : Aujourd&apos;hui</Text>
            </View>
          </View>

          {/* Timeline Section */}
          <Text style={styles.labelTitle}>Historique des étapes</Text>
          <View style={styles.timelineBox}>
            {STEPS.map((step, index) => {
              const status = getStepStatus(step.key, selected.status);
              const isLast = index === STEPS.length - 1;
              
              return (
                <View key={step.key} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View style={[
                      styles.stepPoint,
                      status === 'completed' && styles.pointCompleted,
                      status === 'active' && styles.pointActive
                    ]}>
                      {status === 'completed' ? (
                        <MaterialIcons name="check" size={14} color="#fff" />
                      ) : (
                        <View style={[styles.innerPoint, status === 'pending' && { backgroundColor: '#DDD' }]} />
                      )}
                    </View>
                    {!isLast && (
                      <View style={[styles.stepLine, status === 'completed' && styles.lineCompleted]} />
                    )}
                  </View>
                  <View style={styles.stepRight}>
                    <View style={styles.stepHeader}>
                      <Text style={[styles.stepLabel, status === 'pending' && styles.textMuted]}>{step.label}</Text>
                      {status === 'active' && (
                        <View style={styles.activeTag}>
                          <Text style={styles.activeTagText}>EN COURS</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.stepSubText}>{step.sub}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {selected.status === 'certified' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('DigitalProof', { recordId: selected.id })}
            >
              <Feather name="file-text" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Voir le certificat</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9F9FB' },
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  
  scrollContent: { paddingHorizontal: 10, paddingTop: 10 },
  introSection: { marginBottom: 30 },
  introTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  introSub: { fontSize: 14, color: '#999', marginTop: 6, lineHeight: 20 },

  labelTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },

  avatarSelectorScroll: { gap: 20, marginBottom: 30, paddingRight: 20 },
  avatarItem: { alignItems: 'center', gap: 8 },
  avatarBorder: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    padding: 3, 
    borderWidth: 2, 
    borderColor: 'transparent',
    position: 'relative'
  },
  avatarBorderActive: { borderColor: Colors.primary },
  childAvatar: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: '#EEE' },
  activeCheck: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  avatarName: { fontSize: 12, fontWeight: '600', color: '#999' },
  avatarNameActive: { color: '#1A1A1A', fontWeight: '700' },

  mainCard: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 20, 
    elevation: 4, 
    marginBottom: 35 
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardRef: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginTop: 4 },
  progressCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F7F4', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.primary + '30' },
  progressText: { fontSize: 11, fontWeight: '900', color: Colors.primary },

  progressBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, marginBottom: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },

  statusBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusIndicator: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusIndicatorText: { fontSize: 10, fontWeight: '800' },
  lastUpdate: { fontSize: 11, color: '#BBB', fontWeight: '500' },

  timelineBox: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3 },
  stepRow: { flexDirection: 'row', gap: 16 },
  stepLeft: { alignItems: 'center', width: 24 },
  stepPoint: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  pointCompleted: { backgroundColor: Colors.primary },
  pointActive: { backgroundColor: '#FFF3E0', borderWidth: 2, borderColor: '#FFAB40' },
  innerPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFAB40' },
  stepLine: { width: 2, height: 40, backgroundColor: '#F0F0F0', marginVertical: 4 },
  lineCompleted: { backgroundColor: Colors.primary + '50' },

  stepRight: { flex: 1, paddingBottom: 30 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  textMuted: { color: '#BBB' },
  activeTag: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  activeTagText: { fontSize: 9, fontWeight: '900', color: '#E65100' },
  stepSubText: { fontSize: 12, color: '#999', marginTop: 4, fontWeight: '500' },

  actionButton: { backgroundColor: Colors.primary, height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
