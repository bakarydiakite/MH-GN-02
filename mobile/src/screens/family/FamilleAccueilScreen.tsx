import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/auth.service';
import { birthService } from '../../services/birth.service';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const FamilleAccueilScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any>({ totalBirths: 0, validated: 0 });
  const [children, setChildren] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, statsData, childrenData] = await Promise.all([
        authService.getUser(),
        birthService.getStats(),
        birthService.getRecentBirths(),
      ]);
      setUser(userData);
      setStats(statsData);
      setChildren(childrenData);
    } catch (e) {
      console.error('Error loading family data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderChildCard = (record: any, index: number) => {
    const isValide = record.statut === 'VALIDE';
    const statusLabel = isValide ? 'Protégé' : 'Traitement';
    const statusColor = isValide ? '#006948' : '#FFAB40';

    return (
      <TouchableOpacity 
        key={record.id} 
        activeOpacity={0.9}
        style={styles.memberCard}
        onPress={() => navigation.navigate('DigitalProof', { recordId: record.id })}
      >
        <View style={styles.memberAvatarWrapper}>
          <View style={[styles.avatarRing, { borderColor: statusColor + '40' }]} />
          <RNImage 
            source={{ uri: record.attachments?.[0]?.urlFichier || 'https://i.pravatar.cc/150?u=' + record.id }} 
            style={styles.memberAvatar} 
          />
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        
        <Text style={styles.memberName} numberOfLines={1}>
          {record.enfant?.prenoms}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        <View style={styles.uxProgressBar}>
          <View style={[styles.uxProgressFill, { width: isValide ? '100%' : '50%', backgroundColor: statusColor }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      
      {/* Dynamic Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerInner}>
            <Text style={styles.headerTitle}>Famille {user?.nom}</Text>
          </View>
        </SafeAreaView>
      </Animated.View>

      <SafeAreaView style={styles.container} edges={['top']}>
        <Animated.ScrollView 
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Top Nav Action */}
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.roundBtn}>
              <Feather name="grid" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn}>
              <RNImage 
                source={{ uri: 'https://i.pravatar.cc/100?u=' + user?.id }} 
                style={styles.miniAvatar} 
              />
            </TouchableOpacity>
          </View>

          {/* Futuristic Greeting */}
          <View style={styles.hero}>
            <Text style={styles.heroGreeting}>Bonjour,</Text>
            <Text style={styles.heroName}>{user?.nom || 'Famille'}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatVal}>{stats?.totalBirths || 0}</Text>
                <Text style={styles.heroStatLab}>Membres</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatVal}>{stats?.validated || 0}</Text>
                <Text style={styles.heroStatLab}>Certifiés</Text>
              </View>
            </View>
          </View>

          {/* Section: Ma Tribu (Grid) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ma Tribu</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MesEnfants')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {children.map(renderChildCard)}
            
            {/* Minimal Add Button */}
            <TouchableOpacity 
              style={styles.addMemberBtn}
              onPress={() => navigation.navigate('LinkChild')}
            >
              <View style={styles.addIconBox}>
                <Ionicons name="add-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.addBtnText}>Nouveau membre</Text>
            </TouchableOpacity>
          </View>

          {/* Futuristic Control Center (Services) */}
          <View style={styles.controlCenter}>
            <Text style={styles.sectionTitle}>Centre de Contrôle</Text>
            <View style={styles.serviceGrid}>
              <ControlItem 
                icon="file-text" 
                label="Registres" 
                sub="Mes actes"
                onPress={() => navigation.navigate('MesEnfants')}
                color="#E8F5E9"
                iconColor="#2E7D32"
              />
              <ControlItem 
                icon="shield" 
                label="Sécurité" 
                sub="Blockchain"
                onPress={() => navigation.navigate('Vérifier')}
                color="#E3F2FD"
                iconColor="#1565C0"
              />
              <ControlItem 
                icon="clock" 
                label="Suivi" 
                sub="Demandes"
                onPress={() => navigation.navigate('SuiviDossier')}
                color="#FFF3E0"
                iconColor="#E65100"
              />
              <ControlItem 
                icon="settings" 
                label="Réglages" 
                sub="Profil"
                onPress={() => {}}
                color="#F3E5F5"
                iconColor="#7B1FA2"
              />
            </View>
          </View>

          {/* Futuristic Footer */}
          <View style={styles.futuristicFooter}>
            <View style={styles.footerLine} />
            <Text style={styles.footerCopyright}>NAISSANCECHAIN GUINÉE v2.0</Text>
            <Text style={styles.footerSlogan}>L&apos;identité est un droit, la sécurité est notre devoir.</Text>
          </View>

          <View style={{ height: 60 }} />
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Futuristic Floating Navigation Bar can be added here if needed */}
    </View>
  );
};

const ControlItem = ({ icon, label, sub, onPress, color, iconColor }: any) => (
  <TouchableOpacity 
    style={[styles.controlItem, { backgroundColor: Colors.surfaceContainerLowest }]} 
    onPress={onPress}
  >
    <View style={[styles.controlIconCircle, { backgroundColor: color }]}>
      <Feather name={icon} size={20} color={iconColor} />
    </View>
    <View>
      <Text style={styles.controlLabel}>{label}</Text>
      <Text style={styles.controlSub}>{sub}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAF9', // Ultra clean off-white
  },
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 250, 249, 0.95)',
    zIndex: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  headerInner: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  miniAvatar: {
    width: '100%',
    height: '100%',
  },
  hero: {
    marginBottom: 35,
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.onSurface,
    opacity: 0.6,
    letterSpacing: -0.5,
  },
  heroName: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1.5,
    marginTop: -5,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 4,
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatVal: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primary,
  },
  heroStatLab: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    opacity: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  memberCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.06,
    shadowRadius: 25,
    elevation: 5,
  },
  memberAvatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 45,
    borderWidth: 1.5,
  },
  memberAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F0F0F0',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  memberName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  statusBadge: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  uxProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  uxProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  addMemberBtn: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  addIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.onSurface,
    opacity: 0.6,
  },
  controlCenter: {
    marginTop: 45,
  },
  serviceGrid: {
    marginTop: 20,
    gap: 12,
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  controlIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  controlLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  controlSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
  },
  futuristicFooter: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  footerLine: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginBottom: 15,
    opacity: 0.2,
  },
  footerCopyright: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
    opacity: 0.4,
  },
  footerSlogan: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.5,
    lineHeight: 16,
  }
});
