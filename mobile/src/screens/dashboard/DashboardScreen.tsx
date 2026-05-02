import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService, User } from '../../services/auth.service';
import { birthService } from '../../services/birth.service';
import { TransactionItem } from '../../components/ui/TransactionItem';

const { width } = Dimensions.get('window');

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ totalMois: 0, total: 0, pendingLocal: 0 });
  const [recentBirths, setRecentBirths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [userData, statsData, birthsData, localDrafts] = await Promise.all([
        authService.getUser(),
        birthService.getStats(),
        birthService.getRecentBirths(),
        birthService.getDrafts()
      ]);
      
      setUser(userData);
      
      // Merge server stats with local drafts count
      const finalStats = {
        ...(statsData || { totalMois: 0, total: 0 }),
        pendingLocal: localDrafts.length
      };
      
      setStats(finalStats);
      setRecentBirths(birthsData || []);
    } catch (error) {
      console.error('[Dashboard] Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006948" />
        <Text style={styles.loadingText}>Chargement de votre espace...</Text>
      </View>
    );
  }

  const displayName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : 'Agent';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#fff" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── PRENIUM GLASS HEADER ── */}
        <LinearGradient
          colors={['#004d33', '#006948', '#058c5c']}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.topBar}>
            <View style={styles.profileRow}>
              <View style={styles.avatarGlow}>
                <Image 
                  source={{ uri: user?.photoUrl || 'https://i.pravatar.cc/150?u=' + (user?.id || 'agent') }} 
                  style={styles.avatar} 
                />
              </View>
              <View>
                <Text style={styles.greetingText}>Bonjour,</Text>
                <Text style={styles.profileName}>{displayName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Stats Card (Glassmorphism) */}
          <View style={styles.statsCard}>
            <View style={styles.statsIconBg}>
              <FontAwesome5 name="baby" size={20} color="#80f9c2" />
            </View>
            <Text style={styles.statsLabel}>Enregistrements (Temps Réel)</Text>
            <View style={styles.statsValueRow}>
              <View>
                <Text style={styles.statsValue}>{Number(stats?.totalMois ?? 0).toLocaleString()}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700' }}>CE MOIS</Text>
              </View>
              <View style={styles.statsDivider} />
              <View>
                <Text style={styles.statsValue}>{Number((stats as any)?.total ?? 0).toLocaleString()}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700' }}>TOTAL</Text>
              </View>
              <View style={styles.trendBadge}>
                <Ionicons name="trending-up" size={14} color="#80f9c2" />
                <Text style={styles.trendText}>+12%</Text>
              </View>
            </View>
            
            <View style={styles.statsActions}>
              <TouchableOpacity style={styles.statsBtn}>
                <MaterialIcons name="assessment" size={18} color="#fff" />
                <Text style={styles.statsBtnText}>Rapport</Text>
              </TouchableOpacity>
              <View style={styles.statsDivider} />
              <TouchableOpacity style={styles.statsBtn}>
                <MaterialIcons name="inventory" size={18} color="#fff" />
                <Text style={styles.statsBtnText}>Archives</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Registry Status Section */}
          <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>État du Registre</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusPill, styles.activePill]}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusTextActive}>EN LIGNE</Text>
              </View>
              {stats.pendingLocal > 0 && (
                <View style={[styles.statusPill, { backgroundColor: '#FF9800', marginLeft: 8 }]}>
                  <Text style={[styles.statusTextActive, { color: '#fff' }]}>
                    {stats.pendingLocal} BROUILLON{stats.pendingLocal > 1 ? 'S' : ''}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.checkButton} onPress={onRefresh}>
                <Ionicons name={stats.pendingLocal > 0 ? "cloud-upload" : "sync"} size={16} color="#fff" />
                <Text style={styles.checkText}>{stats.pendingLocal > 0 ? "Synchro" : "Check"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('RegisterBirthStep1')}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#e6f3ef' }]}>
              <Ionicons name="add-circle" size={28} color="#006948" />
            </View>
            <Text style={styles.actionLabel}>Nouveau</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Verification')}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#fff5f5' }]}>
              <Ionicons name="qr-code-outline" size={26} color="#FF5252" />
            </View>
            <Text style={styles.actionLabel}>Scanner</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('OfflineSync')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#f0f3ff' }]}>
              <Ionicons name="cloud-upload-outline" size={26} color="#536DFE" />
            </View>
            <Text style={styles.actionLabel}>Synchro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('History')}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#fff8f0' }]}>
              <Ionicons name="time-outline" size={26} color="#FFAB40" />
            </View>
            <Text style={styles.actionLabel}>Historique</Text>
          </TouchableOpacity>
        </View>

        {/* ── RECENT RECORDS ── */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Derniers enregistrements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recordsList}>
            {recentBirths.length > 0 ? (
              recentBirths.map((item, index) => (
                <TransactionItem 
                  key={item.id || index}
                  title={`${item.enfant?.prenoms || 'Enfant'} ${item.enfant?.nom || ''}`}
                  sub={item.enfant?.lieuNaissanceLibelle || 'Hôpital Central'}
                  value={item.enfant?.dateNaissance ? new Date(item.enfant.dateNaissance).toLocaleDateString('fr-FR') : '--/--/----'}
                  icon="child-care"
                  color="#006948"
                  onPress={() => navigation.navigate('DigitalProof', { recordId: item.id })}
                />
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <MaterialIcons name="info-outline" size={32} color="#ccc" />
                <Text style={{ marginTop: 10, color: '#999', fontSize: 13, fontWeight: '600' }}>Aucun enregistrement récent</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate('RegisterBirthStep1')}
      >
        <LinearGradient colors={['#006948', '#058c5c']} style={styles.fabGradient}>
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 15, color: '#666', fontSize: 14, fontWeight: '600' },
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarGlow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: { width: '100%', height: '100%', borderRadius: 21 },
  greetingText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' },
  profileName: { fontSize: 18, color: '#fff', fontWeight: '800' },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: { position: 'absolute', top: 12, right: 13, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#80f9c2', borderWidth: 1.5, borderColor: '#006948' },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statsIconBg: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(128, 249, 194, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statsLabel: { fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600', marginBottom: 6 },
  statsValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginBottom: 20 },
  statsValue: { fontSize: 36, color: '#fff', fontWeight: '900', letterSpacing: -1 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(128, 249, 194, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendText: { color: '#80f9c2', fontSize: 12, fontWeight: '800' },
  statsActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  statsBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  statsDivider: { width: 1, height: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  statusSection: { marginTop: 25 },
  statusTitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusPill: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(0, 0, 0, 0.15)', flexDirection: 'row', alignItems: 'center', gap: 8 },
  activePill: { backgroundColor: '#80f9c2' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#004d33' },
  statusText: { fontSize: 11, color: 'rgba(255, 255, 255, 0.5)', fontWeight: '800' },
  statusTextActive: { fontSize: 11, color: '#004d33', fontWeight: '900' },
  checkButton: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  checkText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: -25, marginBottom: 30 },
  actionItem: { alignItems: 'center', gap: 10 },
  actionIconCircle: { width: 68, height: 68, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  actionLabel: { fontSize: 13, color: '#444', fontWeight: '700' },
  recentSection: { paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a1a' },
  seeAllText: { fontSize: 14, color: '#006948', fontWeight: '700' },
  recordsList: { gap: 18, backgroundColor: '#fff', padding: 15, borderRadius: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  fab: { position: 'absolute', right: 24, width: 64, height: 64, borderRadius: 32, elevation: 8, shadowColor: '#006948', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, overflow: 'hidden' },
  fabGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
