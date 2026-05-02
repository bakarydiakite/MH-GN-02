import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { birthService } from '../../services/birth.service';

// ─── Types ───────────────────────────────────
type RecordStatus = 'draft' | 'complete' | 'synced' | 'certified';

type StatusConfig = {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
};

const STATUS_CONFIG: Record<RecordStatus, StatusConfig> = {
  draft: {
    label: 'Brouillon',
    color: Colors.outline,
    bgColor: Colors.surfaceContainerHigh,
    icon: 'edit',
  },
  complete: {
    label: 'Complet',
    color: '#d97706',
    bgColor: '#fef3c7',
    icon: 'pending',
  },
  synced: {
    label: 'Synchronisé',
    color: '#2563eb',
    bgColor: '#dbeafe',
    icon: 'cloud-done',
  },
  certified: {
    label: 'Certifié ✓',
    color: Colors.primary,
    bgColor: Colors.primary + '18',
    icon: 'verified',
  },
};

type RecordItem = {
  id: string;
  childName: string;
  date: string;
  location: string;
  status: RecordStatus;
  agentId: string;
};

// ─── Composant StatusBadge ────────────────────
const StatusBadge = ({ status }: { status: RecordStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[badgeStyles.badge, { backgroundColor: cfg.bgColor }]}>
      <MaterialIcons name={cfg.icon as any} size={12} color={cfg.color} />
      <Text style={[badgeStyles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  text: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
});

const FILTERS: { key: RecordStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'certified', label: 'Certifiés' },
  { key: 'synced', label: 'Synchronisés' },
  { key: 'complete', label: 'Complets' },
  { key: 'draft', label: 'Brouillons' },
];

/**
 * HistoryScreen — Liste des enregistrements avec badges de statut
 * Statuts : Brouillon → Complet → Synchronisé → Certifié
 */
export const HistoryScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<RecordStatus | 'all'>('all');
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const data = await birthService.getRecentBirths();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchRecords();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  const getStatusMap = (backendStatus: string): RecordStatus => {
    switch (backendStatus) {
      case 'EN_ATTENTE': return 'complete';
      case 'VALIDE': return 'certified';
      case 'REJETE': return 'draft'; // Simplified mapping
      default: return 'draft';
    }
  };

  const filtered = filter === 'all'
    ? records
    : records.filter(r => getStatusMap(r.statut) === filter);

  const stats = {
    total: records.length,
    certified: records.filter(r => r.statut === 'VALIDE').length,
    pending: records.filter(r => r.statut === 'EN_ATTENTE').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>Mes Enregistrements</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.navigate('RegisterBirthStep1')}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.newBtnText}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: Colors.primary }]}>{stats.certified}</Text>
          <Text style={styles.statLabel}>Certifiés</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#d97706' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Records List */}
      <ScrollView 
        contentContainerStyle={styles.listContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={48} color={Colors.outlineVariant} />
            <Text style={styles.emptyText}>Aucun enregistrement dans cette catégorie</Text>
          </View>
        ) : (
          filtered.map((record) => {
            const status = getStatusMap(record.statut);
            const childName = `${record.enfant?.prenoms} ${record.enfant?.nom}`;
            const date = new Date(record.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric'
            });

            return (
              <TouchableOpacity
                key={record.id}
                style={styles.recordCard}
                onPress={() => navigation.navigate('DigitalProof', { recordId: record.id })}
                activeOpacity={0.8}
              >
                {/* Left accent bar */}
                <View style={[
                  styles.cardAccentBar,
                  { backgroundColor: STATUS_CONFIG[status].color },
                ]} />

                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    {/* Avatar */}
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {record.enfant?.prenoms?.[0]}{record.enfant?.nom?.[0]}
                      </Text>
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.childName}>{childName}</Text>
                      <Text style={styles.recordId}>{record.identifiantUniqueNational || 'En attente...'}</Text>
                    </View>

                    <StatusBadge status={status} />
                  </View>

                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="calendar-today" size={12} color={Colors.outline} />
                      <Text style={styles.metaText}>{date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="location-on" size={12} color={Colors.outline} />
                      <Text style={styles.metaText}>{record.enfant?.lieuNaissanceLibelle || 'Lieu inconnu'}</Text>
                    </View>
                  </View>

                  {/* Blockchain certified indicator */}
                  {status === 'certified' && (
                    <View style={styles.blockchainBadge}>
                      <MaterialIcons name="link" size={12} color={Colors.primary} />
                      <Text style={styles.blockchainText}>Ancré sur Polygon · Immuable</Text>
                    </View>
                  )}
                </View>

                <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  brandTitle: { fontSize: 20, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.3 },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 12, shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 3,
  },
  newBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.outline, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.surfaceContainerHigh },

  // Filters
  filterBar: { flexGrow: 0, marginBottom: 10 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1.5, borderColor: Colors.outlineVariant,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '700', color: Colors.onSurfaceVariant },
  filterChipTextActive: { color: '#fff' },

  // List
  listContent: { paddingHorizontal: 20, paddingTop: 4 },
  emptyState: {
    alignItems: 'center', gap: 14, paddingTop: 60,
  },
  emptyText: { fontSize: 14, color: Colors.outline, fontWeight: '600' },

  // Record Card
  recordCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 20, marginBottom: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  cardAccentBar: { width: 4, alignSelf: 'stretch' },
  cardContent: { flex: 1, padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '900', color: Colors.primary },
  cardInfo: { flex: 1 },
  childName: { fontSize: 14, fontWeight: '900', color: Colors.onSurface, marginBottom: 2 },
  recordId: { fontSize: 11, color: Colors.outline, fontFamily: 'monospace' },
  cardMeta: { flexDirection: 'row', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: Colors.outline, fontWeight: '600' },
  blockchainBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primary + '10', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  blockchainText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
});
