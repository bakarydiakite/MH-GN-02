import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { birthService } from '../../services/birth.service';
import { uploadService } from '../../services/upload.service';

type SyncRecord = {
  id: string;
  name: string;
  draftId: string;
  editedAt: string;
};

const PENDING_RECORDS: SyncRecord[] = [
  { id: '1', name: 'Mamadou Diallo', draftId: '8823-GX-01', editedAt: '12 Oct, 14:30' },
  { id: '2', name: 'Mariama Camara', draftId: '9012-GX-42', editedAt: '12 Oct, 15:12' },
  { id: '3', name: 'Ibrahim Sylla', draftId: '7711-GX-09', editedAt: '12 Oct, 16:45' },
];

/**
 * OfflineSyncScreen
 * File d'attente de synchronisation hors-ligne
 * Inspiré de la maquette offline_sync_queue
 */
export const OfflineSyncScreen = () => {
  const navigation = useNavigation<any>();
  const [drafts, setDrafts] = React.useState<any[]>([]);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const loadDrafts = async () => {
    const data = await birthService.getDrafts();
    setDrafts(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDrafts();
    }, [])
  );

  const handleSync = async () => {
    if (drafts.length === 0) {
      Alert.alert('Info', 'Aucun brouillon à synchroniser.');
      return;
    }

    const isConnected = await birthService.checkConnection();
    if (!isConnected) {
      Alert.alert('Erreur', 'Vous devez être connecté à internet pour synchroniser.');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await birthService.syncDrafts();
      
      if (result.failed === 0) {
        Alert.alert('Succès', 'Tous les enregistrements ont été synchronisés.');
      } else {
        Alert.alert('Attention', `${result.success} réussis, ${result.failed} échoués.`);
      }
      loadDrafts();
    } catch (error: any) {
      Alert.alert('Erreur', 'La synchronisation a échoué.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>NaissanceChain</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Offline Status Banner */}
        <View style={styles.offlineBanner}>
          <View style={styles.offlineBannerGlow} />
          <View style={styles.offlineBannerTop}>
            <MaterialIcons name="cloud-off" size={22} color={Colors.primary} />
            <Text style={styles.offlineModeLabel}>MODE HORS LIGNE ACTIF</Text>
          </View>
          <Text style={styles.offlineBannerTitle}>Synchronisation des données</Text>
          <Text style={styles.offlineBannerSub}>
            Vous travaillez sans connexion internet. Vos enregistrements sont stockés localement et seront transmis en toute sécurité dès que vous retrouverez un accès réseau.
          </Text>
          <TouchableOpacity 
            style={[styles.syncBtn, isSyncing && { opacity: 0.7 }]} 
            onPress={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? <ActivityIndicator color="#fff" /> : (
              <>
                <MaterialIcons name="sync" size={20} color="#fff" />
                <Text style={styles.syncBtnText}>Synchroniser maintenant</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.surfaceContainer }]}>
              <MaterialIcons name="pending-actions" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>En attente</Text>
            <Text style={styles.statValue}>{drafts.length}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#78fbb620' }]}>
              <MaterialIcons name="storage" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Espace local</Text>
            <Text style={styles.statValue}>{(drafts.length * 0.15).toFixed(1)} MB</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.surfaceContainerHigh }]}>
              <MaterialIcons name="history" size={22} color={Colors.outline} />
            </View>
            <Text style={styles.statLabel}>Dernière sync</Text>
            <Text style={styles.statValue}>Aujourd'hui</Text>
          </View>
        </View>

        {/* Queue List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Détails des enregistrements locaux</Text>
        </View>

        {drafts.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
            <MaterialIcons name="check-circle" size={48} color={Colors.primary} />
            <Text style={{ marginTop: 10, fontWeight: '700' }}>Aucun brouillon en attente</Text>
          </View>
        ) : drafts.map((record) => (
          <View key={record.id_local} style={styles.recordCard}>
            <View style={styles.recordLeft}>
              <View style={styles.recordAvatar}>
                <MaterialIcons name="person" size={24} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.recordName}>{record.prenomsEnfant} {record.nomEnfant}</Text>
                <Text style={styles.recordDraftId}>DRAFT_ID: {record.id_local}</Text>
              </View>
            </View>
            <View style={styles.recordRight}>
              <View style={styles.actionsRow}>
                <View style={styles.pendingBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.pendingText}>EN ATTENTE</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => {
                    Alert.alert(
                      'Supprimer',
                      'Voulez-vous supprimer ce brouillon local ?',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        { 
                          text: 'Supprimer', 
                          style: 'destructive',
                          onPress: async () => {
                            await birthService.deleteDraft(record.id_local);
                            loadDrafts();
                          }
                        }
                      ]
                    );
                  }}
                >
                  <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.recordDate}>Brouillon local</Text>
            </View>
          </View>
        ))}

        {/* Info footer */}
        <View style={styles.infoHint}>
          <MaterialIcons name="info" size={14} color={Colors.outline} />
          <Text style={styles.infoHintText}>La synchronisation nécessite une connexion stable de plus de 50kbps.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Offline Banner
  offlineBanner: {
    backgroundColor: '#78fbb620',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    overflow: 'hidden',
    position: 'relative',
  },
  offlineBannerGlow: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primary + '15',
  },
  offlineBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  offlineModeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  offlineBannerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  offlineBannerSub: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
    marginBottom: 20,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  syncBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },

  // List
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  recordCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recordAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  recordDraftId: {
    fontSize: 11,
    color: Colors.outline,
    fontFamily: 'monospace',
  },
  recordRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ff525215',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
  },
  recordDate: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },

  // Info hint
  infoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 16,
    opacity: 0.6,
  },
  infoHintText: {
    fontSize: 11,
    color: Colors.outline,
    textAlign: 'center',
    flex: 1,
  },
});
