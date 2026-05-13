import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image as RNImage,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { authService, User } from '../../services/auth.service';
import { birthService } from '../../services/birth.service';
import { TransactionItem } from '../../components/ui/TransactionItem';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ totalMois: 0, totalBirths: 0, pendingLocal: 0 });
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
      setStats({
        ...(statsData || { totalMois: 0, totalBirths: 0 }),
        pendingLocal: localDrafts.length
      });
      setRecentBirths(birthsData || []);
    } catch (error) {
      console.error('[Dashboard] Error:', error);
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [240, 140],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const displayName = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : 'Agent';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Premium Background Header */}
      <Animated.View style={[styles.headerBg, { height: headerHeight, backgroundColor: Colors.primary }]}>
        <View style={styles.headerDecoration} />
      </Animated.View>

      <SafeAreaView style={styles.headerContent} edges={['top']}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Feather name="menu" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tableau de bord</Text>
          <TouchableOpacity style={styles.headerIconButton}>
            <Feather name="bell" size={22} color="#fff" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.profileSection, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          <RNImage 
            source={{ uri: 'https://i.pravatar.cc/150?u=' + (user?.id || 'agent') }} 
            style={styles.avatar} 
          />
        </Animated.View>
      </SafeAreaView>

      <Animated.ScrollView 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Stats Card - Cyber Style */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{stats.totalMois}</Text>
              <Text style={styles.statLab}>Ce mois</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{stats.totalBirths}</Text>
              <Text style={styles.statLab}>Total actes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: stats.pendingLocal > 0 ? '#FFAB40' : Colors.primary }]}>
                {stats.pendingLocal}
              </Text>
              <Text style={styles.statLab}>Brouillons</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.statsActionBtn}>
            <Text style={styles.statsActionText}>Consulter les rapports détaillés</Text>
            <Feather name="arrow-right" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionGrid}>
          <QuickAction 
            icon="plus-circle" 
            label="Enregistrer" 
            color="#E8F5E9" 
            onPress={() => navigation.navigate('RegisterBirthStep1')} 
          />
          <QuickAction 
            icon="maximize" 
            label="Vérifier" 
            color="#E3F2FD" 
            onPress={() => navigation.navigate('Verification')} 
          />
          <QuickAction 
            icon="refresh-cw" 
            label="Synchro" 
            color="#FFF3E0" 
            onPress={() => navigation.navigate('OfflineSync')} 
          />
          <QuickAction 
            icon="clock" 
            label="Historique" 
            color="#F3E5F5" 
            onPress={() => navigation.navigate('History')} 
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Activité Récente</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          {recentBirths.length > 0 ? (
            recentBirths.map((item, index) => (
              <TouchableOpacity 
                key={item.id || index} 
                style={styles.activityItem}
                onPress={() => navigation.navigate('DigitalProof', { recordId: item.id })}
              >
                <View style={styles.activityIcon}>
                  <FontAwesome5 name="baby" size={18} color={Colors.primary} />
                </View>
                <View style={styles.activityText}>
                  <Text style={styles.activityTitle}>{item.enfant?.prenoms} {item.enfant?.nom}</Text>
                  <Text style={styles.activitySub}>{item.enfant?.lieuNaissanceLibelle || 'Hôpital'}</Text>
                </View>
                <Text style={styles.activityDate}>
                  {item.enfant?.dateNaissance ? new Date(item.enfant.dateNaissance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : ''}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyActivity}>
              <Feather name="info" size={24} color="#ccc" />
              <Text style={styles.emptyText}>Aucun enregistrement récent</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Futuristic Floating Button */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate('RegisterBirthStep1')}
      >
        <View style={styles.fabIcon}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const QuickAction = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.actionIconWrapper, { backgroundColor: color }]}>
      <Feather name={icon} size={24} color={Colors.primary} />
    </View>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBg: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    borderBottomLeftRadius: 48, 
    borderBottomRightRadius: 48,
    overflow: 'hidden'
  },
  headerDecoration: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerContent: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10 
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFAB40',
    borderWidth: 1.5,
    borderColor: '#006948',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  greeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  name: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scrollContent: {
    paddingTop: 200, // Account for header
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  statLab: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    fontWeight: '800',
    marginTop: 6,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  statsActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    gap: 8,
  },
  statsActionText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  actionBtn: {
    alignItems: 'center',
    width: width * 0.2,
  },
  actionIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
    opacity: 0.7,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    opacity: 0.8,
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#F0F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  activitySub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    opacity: 0.5,
  },
  activityDate: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    opacity: 0.4,
  },
  emptyActivity: {
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fabIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
