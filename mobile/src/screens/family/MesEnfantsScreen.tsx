import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image as RNImage,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { birthService } from '../../services/birth.service';

const { width } = Dimensions.get('window');

type ChildCardProps = {
  name: string;
  birthDate: string;
  location: string;
  id: string;
  photoUri: string;
  statut: string;
  onPress: () => void;
};

const ChildCard = ({ name, birthDate, location, id, photoUri, statut, onPress }: ChildCardProps) => {
  const isValide = statut === 'VALIDE';
  
  return (
    <View style={styles.childCard}>
      <View style={styles.cardHeader}>
        <View style={styles.photoContainer}>
          <RNImage source={{ uri: photoUri }} style={styles.childPhoto} resizeMode="cover" />
          {isValide && (
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={14} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.childName} numberOfLines={1}>{name}</Text>
          <View style={[styles.statusTag, { backgroundColor: isValide ? Colors.primary + '15' : '#FFAB4015' }]}>
            <Text style={[styles.statusTagText, { color: isValide ? Colors.primary : '#E65100' }]}>
              {isValide ? 'CERTIFIÉ' : 'EN ATTENTE'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Feather name="more-horizontal" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>NAISSANCE</Text>
            <Text style={styles.infoValue}>{birthDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>RÉFÉRENCE</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{id}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={Colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
        <Text style={styles.viewBtnText}>Consulter le registre numérique</Text>
        <Feather name="arrow-right" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export const MesEnfantsScreen = () => {
  const navigation = useNavigation<any>();
  const [children, setChildren] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await birthService.getRecentBirths();
      setChildren(data);
    } catch (e) {
      console.error('Error loading children:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* Futuristic Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIconBox}>
              <FontAwesome5 name="fingerprint" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.brandText}>NaissanceChain</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Feather name="bell" size={20} color={Colors.onSurface} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.intro}>
            <Text style={styles.title}>Mes Enfants</Text>
            <Text style={styles.sub}>Accédez aux preuves numériques de filiation certifiées par l&apos;État.</Text>
          </View>

          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : children.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Feather name="users" size={48} color="#ccc" />
              </View>
              <Text style={styles.emptyTitle}>Aucun enregistrement</Text>
              <Text style={styles.emptySub}>Vos déclarations de naissance apparaîtront ici après validation.</Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {children.map((record) => (
                <ChildCard
                  key={record.id}
                  name={`${record.enfant?.prenoms} ${record.enfant?.nom}`}
                  birthDate={new Date(record.enfant?.dateNaissance).toLocaleDateString('fr-FR')}
                  location={record.enfant?.lieuNaissanceLibelle || 'Centre de Santé'}
                  id={record.identifiantUniqueNational || 'Réf: ' + record.id.substring(0, 8).toUpperCase()}
                  photoUri={record.attachments?.[0]?.urlFichier || 'https://i.pravatar.cc/150?u=' + record.id}
                  statut={record.statut}
                  onPress={() => navigation.navigate('DigitalProof', { recordId: record.id })}
                />
              ))}
            </View>
          )}

          {/* Quick Action Card */}
          <TouchableOpacity 
            style={styles.addCard}
            onPress={() => navigation.navigate('LinkChild')}
          >
            <View style={styles.addIconBox}>
              <Feather name="plus-circle" size={24} color={Colors.primary} />
            </View>
            <View style={styles.addTextContent}>
              <Text style={styles.addTitle}>Lier un membre de la famille</Text>
              <Text style={styles.addSub}>Scannez un acte papier existant</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>



          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAF9' },
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIconBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  brandText: { fontSize: 16, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  notifDot: { position: 'absolute', top: 12, right: 13, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFAB40', borderWidth: 2, borderColor: '#fff' },
  
  scrollContent: { padding: 10 },
  intro: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  sub: { fontSize: 14, color: Colors.onSurfaceVariant, opacity: 0.6, marginTop: 8, lineHeight: 22 },
  
  centerContainer: { marginTop: 60, alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 40, opacity: 0.6 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface },
  emptySub: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
  
  cardsContainer: { gap: 20, marginBottom: 32 },
  childCard: { backgroundColor: '#fff', borderRadius: 32, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.06, shadowRadius: 30, elevation: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  photoContainer: { position: 'relative' },
  childPhoto: { width: 64, height: 64, borderRadius: 24, backgroundColor: '#F0F0F0' },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.primary, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  headerText: { flex: 1 },
  childName: { fontSize: 18, fontWeight: '900', color: Colors.onSurface },
  statusTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  statusTagText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  moreBtn: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  cardBody: { marginBottom: 24 },
  infoGrid: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 9, fontWeight: '900', color: Colors.onSurfaceVariant, opacity: 0.4, letterSpacing: 1, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '800', color: Colors.onSurface },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '600' },
  
  viewBtn: { backgroundColor: Colors.primary, height: 56, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 4 },
  viewBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  
  addCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 24, marginBottom: 32, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#E0E0E0' },
  addIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  addTextContent: { flex: 1, marginLeft: 16 },
  addTitle: { fontSize: 14, fontWeight: '800', color: Colors.onSurface },
  addSub: { fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.6, marginTop: 2 },
  

});
