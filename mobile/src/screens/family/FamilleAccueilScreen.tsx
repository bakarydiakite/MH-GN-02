import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/auth.service';
import { birthService } from '../../services/birth.service';
import { Image } from 'react-native';

/**
 * FamilleAccueilScreen
 * Portail famille premium - inspiré de la maquette portail_famille_accueil
 */
export const FamilleAccueilScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = React.useState<any>(null);
  const [stats, setStats] = React.useState({ total: 0 });
  const [children, setChildren] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>NaissanceChain</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications" size={24} color={Colors.primary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Greeting Section */}
        <View style={styles.heroSection}>
          {/* Decorative blob */}
          <View style={styles.heroBlob} />

          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>Bonjour,</Text>
            <Text style={styles.heroName}>Famille {user?.nom || 'Diallo'}</Text>
            <Text style={styles.heroSub}>
              Bienvenue sur votre portail sécurisé. La protection de l&apos;identité de votre famille commence ici.
            </Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {String(stats?.total || 0).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabel}>ENFANTS ENREGISTRÉS</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="verified-user" size={28} color="rgba(255,255,255,0.9)" />
                <Text style={styles.statLabel}>IDENTITÉ SÉCURISÉE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section: Mes Enfants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes Enfants</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MesEnfants')}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {children.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childrenScroll}>
            {children.map((record) => (
              <TouchableOpacity 
                key={record.id} 
                style={styles.childCard}
                onPress={() => navigation.navigate('DigitalProof', { recordId: record.id })}
              >
                <Image 
                  source={{ uri: record.attachments?.[0]?.urlFichier || 'https://i.pravatar.cc/150?u=' + record.id }} 
                  style={styles.childImage} 
                />
                <View style={styles.childCardContent}>
                  <Text style={styles.childCardName} numberOfLines={1}>
                    {record.enfant?.prenoms}
                  </Text>
                  <Text style={styles.childCardDate}>
                    {new Date(record.enfant?.dateNaissance).toLocaleDateString('fr-FR')}
                  </Text>
                  <View style={styles.certifiedBadge}>
                    <MaterialIcons name="verified" size={12} color="#fff" />
                    <Text style={styles.certifiedText}>CERTIFIÉ</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : !isLoading ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="child-care" size={40} color="#ccc" />
            <Text style={styles.emptyText}>Aucun enfant lié à votre compte</Text>
          </View>
        ) : null}

        {/* Dynamic Welcome Guide for new users */}
        {stats.total === 0 && !isLoading && (
          <View style={styles.starterGuide}>
            <View style={styles.starterHeader}>
              <MaterialIcons name="auto-awesome" size={20} color="#006948" />
              <Text style={styles.starterTitle}>Guide de démarrage rapide</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Liez votre premier enfant</Text>
                <Text style={styles.stepDesc}>Utilisez le bouton "Lier un enfant" ci-dessous et scannez le QR Code sur son acte papier.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>Vérifiez l&apos;authenticité</Text>
                <Text style={styles.stepDesc}>Une fois lié, l&apos;acte apparaîtra dans "Mes Enfants" avec son certificat blockchain.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services administratifs</Text>
          <Text style={styles.sectionSub}>Gérez vos documents officiels en toute simplicité.</Text>

          {/* Service Cards */}
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation.navigate('MesEnfants')}
          >
            <View style={styles.serviceIconBox}>
              <MaterialIcons name="description" size={28} color={Colors.primary} />
            </View>
            <View style={styles.serviceText}>
              <Text style={styles.serviceTitle}>Actes de naissance</Text>
              <Text style={styles.serviceSub}>Consultez et téléchargez les actes numérisés de vos enfants.</Text>
            </View>
            <View style={styles.serviceArrow}>
              <Text style={styles.serviceAcceder}>Accéder</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}>
            <View style={styles.serviceIconBox}>
              <MaterialIcons name="menu-book" size={28} color={Colors.primary} />
            </View>
            <View style={styles.serviceText}>
              <Text style={styles.serviceTitle}>Demande de livret</Text>
              <Text style={styles.serviceSub}>Commandez un nouveau livret de famille ou une copie certifiée.</Text>
            </View>
            <View style={styles.serviceArrow}>
              <Text style={styles.serviceAcceder}>Commander</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard}
            onPress={() => navigation.navigate('SuiviDossier')}
          >
            <View style={styles.serviceIconBox}>
              <MaterialIcons name="edit-note" size={28} color={Colors.primary} />
            </View>
            <View style={styles.serviceText}>
              <Text style={styles.serviceTitle}>Suivi de dossier</Text>
              <Text style={styles.serviceSub}>Signalez une erreur sur un document officiel pour rectification.</Text>
            </View>
            <View style={styles.serviceArrow}>
              <Text style={styles.serviceAcceder}>Rectifier</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.serviceCard, { backgroundColor: '#e6f3ef', borderColor: Colors.primary, borderWidth: 1 }]}
            onPress={() => navigation.navigate('LinkChild')}
          >
            <View style={[styles.serviceIconBox, { backgroundColor: Colors.primary }]}>
              <MaterialIcons name="add-link" size={28} color="#fff" />
            </View>
            <View style={styles.serviceText}>
              <Text style={[styles.serviceTitle, { color: Colors.primary }]}>Lier un enfant</Text>
              <Text style={styles.serviceSub}>Ajoutez un enfant à votre compte via QR Code ou numéro de téléphone.</Text>
            </View>
            <View style={styles.serviceArrow}>
              <Text style={styles.serviceAcceder}>Lier maintenant</Text>
              <MaterialIcons name="qr-code-scanner" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Mission Statement Section */}
        <View style={styles.missionSection}>
          <View style={styles.missionBadge}>
            <Text style={styles.missionBadgeText}>NOTRE ENGAGEMENT</Text>
          </View>
          <Text style={styles.missionTitle}>
            Une identité souveraine pour chaque citoyen.
          </Text>
          <Text style={styles.missionText}>
            NaissanceChain utilise la technologie blockchain pour garantir l&apos;intégrité et la pérennité des archives d&apos;état civil. Nous construisons le socle numérique de la Guinée de demain.
          </Text>
          <TouchableOpacity style={styles.missionBtn}>
            <Text style={styles.missionBtnText}>En savoir plus</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerLowest,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero
  heroSection: {
    marginHorizontal: 16,
    marginBottom: 28,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    minHeight: 220,
  },
  heroBlob: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroContent: {
    padding: 28,
  },
  heroGreeting: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.2,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 20,
  },

  // Service Cards
  serviceCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
    gap: 12,
  },
  serviceIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  serviceSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },
  serviceArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  serviceAcceder: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Mission
  missionSection: {
    marginHorizontal: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 28,
    padding: 28,
    marginBottom: 12,
  },
  missionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#78fbb6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  missionBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#002111',
    letterSpacing: 1.5,
  },
  missionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 12,
  },
  missionText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 20,
  },
  missionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignSelf: 'flex-start',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  missionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  // Starter Guide styles
  starterGuide: {
    marginHorizontal: 20,
    backgroundColor: '#f5fbf4',
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e6f3ef',
  },
  starterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#006948',
  },
  stepItem: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#006948',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  seeAll: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  childrenScroll: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  childCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  childImage: {
    width: '100%',
    height: 110,
  },
  childCardContent: {
    padding: 12,
  },
  childCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  childCardDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006948',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  certifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },
  emptyState: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
  },
});
