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
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { birthService } from '../../services/birth.service';

type RecordStatus = 'draft' | 'complete' | 'synced' | 'certified';

const STATUS_MAP: Record<RecordStatus, { label: string; color: string; bg: string; icon: string }> = {
  draft: { label: 'Brouillon', color: '#666', bg: '#F5F5F5', icon: 'edit-2' },
  complete: { label: 'En attente', color: '#E65100', bg: '#FFF3E0', icon: 'clock' },
  synced: { label: 'Synchronisé', color: '#1565C0', bg: '#E3F2FD', icon: 'cloud-check' },
  certified: { label: 'Certifié', color: Colors.primary, bg: '#F0F7F4', icon: 'shield' },
};

const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'certified', label: 'Certifiés' },
  { key: 'complete', label: 'En attente' },
  { key: 'draft', label: 'Brouillons' },
];

export const HistoryScreen = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

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

  const getRecordStatus = (backendStatus: string): RecordStatus => {
    switch (backendStatus) {
      case 'VALIDE': return 'certified';
      case 'EN_ATTENTE': return 'complete';
      case 'REJETE': return 'draft';
      default: return 'draft';
    }
  };

  const filteredRecords = records.filter(r => {
    const status = getRecordStatus(r.statut);
    const matchesFilter = filter === 'all' || status === filter;
    const name = `${r.enfant?.prenoms} ${r.enfant?.nom}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || (r.identifiantUniqueNational || '').includes(search);
    return matchesFilter && matchesSearch;
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Historique</Text>
            <TouchableOpacity style={styles.actionBtn}>
              <Feather name="filter" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color={Colors.onSurfaceVariant} style={{ opacity: 0.5 }} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Rechercher un nom ou IUN..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="rgba(0,0,0,0.3)"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterScroll}
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
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : filteredRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="folder-minus" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={styles.emptySub}>Essayez de modifier vos filtres ou votre recherche.</Text>
          </View>
        ) : (
          filteredRecords.map((record) => {
            const status = getRecordStatus(record.statut);
            const cfg = STATUS_MAP[status];
            return (
              <TouchableOpacity 
                key={record.id} 
                style={styles.recordCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('DigitalProof', { recordId: record.id })}
              >
                <View style={styles.cardMain}>
                  <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>{record.enfant?.prenoms?.[0]}{record.enfant?.nom?.[0]}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.childName}>{record.enfant?.prenoms} {record.enfant?.nom}</Text>
                    <Text style={styles.recordIUN}>{record.identifiantUniqueNational || 'IUN Non assigné'}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Feather name={cfg.icon as any} size={10} color={cfg.color} />
                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.metaBox}>
                    <Feather name="calendar" size={12} color="#999" />
                    <Text style={styles.metaText}>
                      {new Date(record.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaBox}>
                    <Feather name="map-pin" size={12} color="#999" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {record.enfant?.lieuNaissanceLibelle || 'Structure Inconnue'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('RegisterBirthStep1')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAF9' },
  header: { 
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 20, 
    elevation: 5,
    zIndex: 10,
  },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAF9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: Colors.onSurface },
  actionBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAF9', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF9', borderRadius: 20, paddingHorizontal: 16, height: 54, borderWidth: 1, borderColor: '#F0F0F0' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  filterScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 20 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16, backgroundColor: '#F8FAF9', borderWidth: 1, borderColor: '#F0F0F0' },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '800', color: Colors.onSurfaceVariant, opacity: 0.7 },
  filterChipTextActive: { color: '#fff', opacity: 1 },
  
  scrollContent: { padding: 24, paddingTop: 10 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, opacity: 0.5 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface, marginTop: 16 },
  emptySub: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
  
  recordCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  cardMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarBox: { width: 50, height: 50, borderRadius: 16, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '900', color: Colors.primary, letterSpacing: 0.5 },
  cardInfo: { flex: 1, marginLeft: 16 },
  childName: { fontSize: 16, fontWeight: '800', color: Colors.onSurface },
  recordIUN: { fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.5, marginTop: 2, fontFamily: 'monospace' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  
  cardFooter: { flexDirection: 'row', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F8FAF9' },
  metaBox: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  metaText: { fontSize: 12, color: '#999', fontWeight: '600' },
  metaDivider: { width: 1, height: 12, backgroundColor: '#F0F0F0', marginHorizontal: 12 },
  
  fab: { position: 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }
});
