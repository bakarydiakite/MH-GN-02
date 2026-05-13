import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { birthService } from '../../services/birth.service';

const { width } = Dimensions.get('window');

// Asset paths for the official look
const COAT_OF_ARMS = 'file:///C:/Users/SHERLOCK/.gemini/antigravity/brain/4af8de6a-84ec-4759-b964-5e14c15fb5a5/guinea_coat_of_arms_1778467141292.png';
const RED_SEAL = 'file:///C:/Users/SHERLOCK/.gemini/antigravity/brain/4af8de6a-84ec-4759-b964-5e14c15fb5a5/official_guinea_seal_1778467287015.png';

export const DigitalProofScreen = ({ route, navigation }: any) => {
  const { recordId } = route.params || {};
  const [record, setRecord] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      const data = await birthService.getBirthRecord(recordId);
      setRecord(data);
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Génération du document officiel...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Document introuvable</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const child = record.enfant;
  const parents = record.parents || [];
  const mother = parents.find((p: any) => p.type === 'MERE');
  const father = parents.find((p: any) => p.type === 'PERE');
  const isValide = record.statut === 'VALIDE';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* Modern Header for Navigation */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Extrait de Naissance</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="download" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* THE OFFICIAL CERTIFICATE */}
          <View style={styles.certificateWrapper}>
            {/* Ornate Border Background */}
            <View style={styles.ornateBorder}>
              <View style={styles.certificateInner}>
                
                {/* Official Header Section */}
                <View style={styles.certHeader}>
                  <Image source={{ uri: COAT_OF_ARMS }} style={styles.coatOfArms} />
                  <View style={styles.certHeaderInfo}>
                    <Text style={styles.countryName}>République de Guinée</Text>
                    <Text style={styles.motto}>Travail - Justice - Solidarité</Text>
                    <View style={styles.certNumbers}>
                      <Text style={styles.certNumText}>N° certificat : {record.id.substring(0, 8).toUpperCase()}</Text>
                      <Text style={styles.certNumText}>IUN : {record.identifiantUniqueNational || 'GN-2026-XXXXX'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.titleSection}>
                  <Text style={styles.certMainTitle}>ACTE DE NAISSANCE</Text>
                  <Text style={styles.certSubTitle}>Certificate of Birth</Text>
                </View>

                {/* Tabular Layout */}
                <View style={styles.table}>
                  {/* Top Location Info */}
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1.2 }]}>
                      <Text style={styles.cellLabel}>Ville / Préfecture :</Text>
                      <Text style={styles.cellValue}>{child.prefectureNaissance || 'KÉROUANÉ'}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Commune :</Text>
                      <Text style={styles.cellValue}>{child.sousPrefectureNaissance || 'KÉROUANÉ'}</Text>
                    </View>
                  </View>

                  {/* Undersigned Header */}
                  <View style={[styles.tableRow, styles.bgLight]}>
                    <Text style={styles.underSignedText}>
                      Je Soussigné : <Text style={styles.boldText}>MAMADOU BOYE BAH</Text>, Officier de l'État Civil de la commune susmentionnée, certifie les informations suivantes :
                    </Text>
                  </View>

                  {/* ENFANT Section */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderText}>ENFANT</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Prénoms :</Text>
                      <Text style={styles.cellValue}>{child.prenoms}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Nom :</Text>
                      <Text style={styles.cellValue}>{child.nom}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 2 }]}>
                      <Text style={styles.cellLabel}>Lieu de naissance :</Text>
                      <Text style={styles.cellValue}>{child.lieuNaissanceLibelle || child.prefectureNaissance}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Date de naissance :</Text>
                      <Text style={styles.cellValue}>{formatDate(child.dateNaissance)}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Sexe :</Text>
                      <Text style={styles.cellValue}>{child.sexe === 'M' ? 'MASCULIN' : 'FÉMININ'}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Nationalité :</Text>
                      <Text style={styles.cellValue}>{child.nationalite || 'GUINÉENNE'}</Text>
                    </View>
                  </View>

                  {/* PÈRE Section */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderText}>PÈRE</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Nom complet :</Text>
                      <Text style={styles.cellValue}>{father?.nom || 'N/A'}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Date de naissance :</Text>
                      <Text style={styles.cellValue}>{formatDate(father?.dateNaissance)}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Profession :</Text>
                      <Text style={styles.cellValue}>{father?.profession || 'CULTIVATEUR'}</Text>
                    </View>
                  </View>

                  {/* MÈRE Section */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderText}>MÈRE</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Nom complet :</Text>
                      <Text style={styles.cellValue}>{mother?.nom || 'N/A'}</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Date de naissance :</Text>
                      <Text style={styles.cellValue}>{formatDate(mother?.dateNaissance)}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1 }]}>
                      <Text style={styles.cellLabel}>Profession :</Text>
                      <Text style={styles.cellValue}>{mother?.profession || 'MÉNAGÈRE'}</Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Verification Section */}
                <View style={styles.bottomSection}>
                  <View style={styles.signatureArea}>
                    <Text style={styles.dateDressText}>Dressé le : {formatDate(record.createdAt)}</Text>
                    <Text style={styles.officerText}>L&apos;Officier de l&apos;État Civil Délégué</Text>
                    <View style={styles.signatureBox}>
                      <Image 
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch%27s_Signature.png' }} 
                        style={styles.signatureImg} 
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  
                  {/* Stamps & QR */}
                  <View style={styles.stampsArea}>
                    <View style={styles.stampsGrid}>
                      <Image source={{ uri: RED_SEAL }} style={styles.redSeal} />
                      <View style={styles.blueStamp}>
                        <MaterialIcons name="verified" size={14} color="#000080" />
                        <Text style={styles.blueStampText}>OFFICIER D&apos;ÉTAT CIVIL</Text>
                        <Text style={styles.blueStampText}>COMMUNE DE KÉROUANÉ</Text>
                      </View>
                    </View>
                    <View style={styles.qrContainer}>
                      <Image
                        source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${record.id}` }}
                        style={styles.qrCode}
                      />
                      <Text style={styles.qrHash}>{record.id.substring(0, 10).toUpperCase()}</Text>
                    </View>
                  </View>
                </View>

              </View>
            </View>
          </View>

          {/* Verification Actions */}
          <View style={styles.actions}>
            <View style={styles.verifyBadge}>
              <MaterialIcons name="security" size={16} color="#4CAF50" />
              <Text style={styles.verifyText}>AUTHENTIFIÉ SUR LA BLOCKCHAIN NATIONALE</Text>
            </View>
            <TouchableOpacity style={styles.btnPrimary}>
              <Feather name="printer" size={20} color="#fff" />
              <Text style={styles.btnText}>Télécharger le PDF officiel</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontWeight: '700', color: Colors.primary },
  errorText: { color: Colors.error, fontWeight: '800' },
  backBtn: { marginTop: 20, padding: 12, backgroundColor: Colors.primary, borderRadius: 12 },
  backBtnText: { color: '#fff', fontWeight: '800' },
  
  navBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: Colors.onSurface },

  scrollContent: { padding: 10, paddingBottom: 40 },
  
  // Certificate Wrapper
  certificateWrapper: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 5 
  },
  ornateBorder: { 
    borderWidth: 15, 
    borderColor: '#9B51E015', // Subtle purple ornate feel
    padding: 2,
  },
  certificateInner: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    padding: 15,
    backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)', // Paper texture feel
  },

  // Cert Header
  certHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  coatOfArms: { width: 60, height: 60, marginRight: 15 },
  certHeaderInfo: { flex: 1 },
  countryName: { fontSize: 16, fontWeight: '900', color: '#1A1A1A', textTransform: 'uppercase' },
  motto: { fontSize: 10, fontWeight: '600', color: '#666', marginTop: 2 },
  certNumbers: { marginTop: 8 },
  certNumText: { fontSize: 9, color: '#333', fontWeight: '700', fontFamily: 'monospace' },

  titleSection: { alignItems: 'center', marginBottom: 20 },
  certMainTitle: { fontSize: 22, fontWeight: '900', color: '#000', letterSpacing: 1 },
  certSubTitle: { fontSize: 12, fontStyle: 'italic', color: '#555', marginTop: -2 },

  // Table Styles
  table: { borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableCell: { padding: 8, borderRightWidth: 1, borderColor: '#000' },
  cellLabel: { fontSize: 9, color: '#666', fontWeight: '600' },
  cellValue: { fontSize: 13, color: '#000', fontWeight: '800', marginTop: 2 },
  bgLight: { backgroundColor: '#F9F9F9' },
  underSignedText: { fontSize: 11, padding: 10, lineHeight: 16 },
  boldText: { fontWeight: '900' },

  sectionHeaderRow: { backgroundColor: '#E0E0E0', paddingVertical: 4, alignItems: 'center', borderBottomWidth: 1, borderColor: '#000' },
  sectionHeaderText: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },

  // Bottom Section
  bottomSection: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  signatureArea: { flex: 1.5 },
  dateDressText: { fontSize: 10, fontWeight: '700' },
  officerText: { fontSize: 11, fontWeight: '900', marginTop: 5 },
  signatureBox: { height: 60, width: 120, marginTop: 5, justifyContent: 'center' },
  signatureImg: { width: '100%', height: '100%', opacity: 0.8 },

  stampsArea: { flex: 1, alignItems: 'flex-end', gap: 10 },
  stampsGrid: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  redSeal: { width: 50, height: 50 },
  blueStamp: { 
    borderWidth: 2, 
    borderColor: '#000080', 
    padding: 4, 
    borderRadius: 8, 
    alignItems: 'center',
    transform: [{ rotate: '-5deg' }],
  },
  blueStampText: { fontSize: 7, color: '#000080', fontWeight: '900', textAlign: 'center' },

  qrContainer: { alignItems: 'center' },
  qrCode: { width: 60, height: 60 },
  qrHash: { fontSize: 8, fontWeight: '700', color: '#555', marginTop: 2 },

  // Actions
  actions: { marginTop: 25, gap: 15 },
  verifyBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#E8F5E9', paddingVertical: 8, borderRadius: 10 },
  verifyText: { fontSize: 10, fontWeight: '900', color: '#2E7D32' },
  btnPrimary: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
