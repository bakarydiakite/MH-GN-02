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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { birthService } from '../../services/birth.service';

// ─────────────────────────────────────────────
// Sub-components for the certificate table
// ─────────────────────────────────────────────

const Row = ({ left, right, leftFlex = 1, rightFlex = 1 }: {
  left: string; right: string; leftFlex?: number; rightFlex?: number;
}) => (
  <View style={tableStyles.row}>
    <View style={[tableStyles.cell, { flex: leftFlex }]}>
      <Text style={tableStyles.cellText}>{left}</Text>
    </View>
    <View style={[tableStyles.cell, tableStyles.cellRight, { flex: rightFlex }]}>
      <Text style={tableStyles.cellText}>{right}</Text>
    </View>
  </View>
);

const FullRow = ({ text }: { text: string }) => (
  <View style={tableStyles.fullRow}>
    <Text style={tableStyles.cellText}>{text}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={tableStyles.sectionHeader}>
    <Text style={tableStyles.sectionHeaderText}>{title}</Text>
  </View>
);

const tableStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderTopWidth: 0.8,
    borderColor: '#555',
  },
  cell: {
    padding: 5,
    borderRightWidth: 0,
  },
  cellRight: {
    borderLeftWidth: 0.8,
    borderColor: '#555',
  },
  cellText: {
    fontSize: 9.5,
    color: '#111',
    fontWeight: '500',
    lineHeight: 13,
  },
  fullRow: {
    padding: 5,
    borderTopWidth: 0.8,
    borderColor: '#555',
  },
  sectionHeader: {
    backgroundColor: '#e8e8e8',
    borderTopWidth: 0.8,
    borderColor: '#555',
    paddingVertical: 4,
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, color: Colors.primary, fontWeight: '700' }}>Chargement de l'acte sécurisé...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <MaterialIcons name="error-outline" size={60} color={Colors.error} />
        <Text style={{ marginTop: 12, fontSize: 18, fontWeight: '700' }}>Acte non trouvé</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, padding: 12, backgroundColor: Colors.primary, borderRadius: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const child = record.enfant;
  const parents = record.parents || [];
  const mother = parents.find((p: any) => p.type === 'MERE');
  const father = parents.find((p: any) => p.type === 'PERE');
  const declarant = record.declarant;
  const attachments = record.attachments || [];

  const formatDate = (date: any) => date ? new Date(date).toLocaleDateString('fr-FR') : 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Acte de Naissance</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="share" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.verifiedBanner}>
        <MaterialIcons name="verified" size={16} color={Colors.primary} />
        <Text style={styles.verifiedText}>Document certifié blockchain · NaissanceChain</Text>
        <View style={styles.verifiedDot} />
        <Text style={styles.verifiedId}>{record.identifiantUniqueNational || 'PROVISOIRE'}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.certificateOuter}>
          <View style={styles.borderLine1} />
          <View style={styles.borderLine2} />

          <View style={styles.certificateInner}>
            <View style={styles.docHeader}>
              <View style={styles.headerTopRight}>
                <Text style={styles.headerCertNum}>ID Système : {record.id.substring(0, 8).toUpperCase()}</Text>
                <Text style={styles.headerRepublic}>République de Guinée</Text>
                <Text style={styles.headerNIN}>IUN : {record.identifiantUniqueNational || 'EN ATTENTE DE VALIDATION'}</Text>
              </View>

              <View style={styles.headerCenter}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Coat_of_arms_of_Guinea.svg/800px-Coat_of_arms_of_Guinea.svg.png' }}
                  style={styles.coatOfArms}
                  resizeMode="contain"
                />
                <Text style={styles.titleMain}>Acte de Naissance</Text>
                <Text style={styles.titleSub}>Certificate of Birth</Text>
                <Text style={styles.titleSub2}>Acte De Naissance</Text>
              </View>
            </View>

            <View style={styles.table}>
              <Row
                left={`Ville / Préfecture : ${child.prefectureNaissance || 'N/A'}`}
                right={`Je Soussigné : ${record.agent?.user?.prenom || 'Agent'} ${record.agent?.user?.nom || 'NaissanceChain'}`}
              />
              <FullRow text={`Commune : ${child.sousPrefectureNaissance || 'N/A'}`} />

              <SectionHeader title="ENFANT" />
              <FullRow text={`Prénoms : ${child.prenoms}`} />
              <FullRow text={`Nom : ${child.nom}`} />
              <Row
                left={`Lieu de naissance : ${child.regionNaissance || 'N/A'}, ${child.prefectureNaissance || 'N/A'}`}
                right={`Date et Heure : ${formatDate(child.dateNaissance)}\n ${child.heureNaissance ? new Date(child.heureNaissance).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}`}
              />
              <Row
                left={`Sexe : ${child.sexe}`}
                right={`Nationalité : ${child.nationalite || 'GUINÉENNE'}`}
              />

              <SectionHeader title="PÈRE" />
              <FullRow text={`Nom : ${father?.nom || 'N/A'}`} />
              <Row
                left={`Date de naissance : ${formatDate(father?.dateNaissance)}`}
                right={`Profession : ${father?.profession || 'N/A'}`}
              />

              <SectionHeader title="MÈRE" />
              <FullRow text={`Nom : ${mother?.nom || 'N/A'}`} />
              <Row
                left={`Date de naissance : ${formatDate(mother?.dateNaissance)}`}
                right={`Profession : ${mother?.profession || 'N/A'}`}
              />
              <FullRow text={`Adresse : ${mother?.regionAdresse || ''}, ${mother?.quartierDistrict || ''}`} />

              <SectionHeader title="DÉCLARANT" />
              <FullRow text={`Nom : ${declarant?.nom || 'N/A'}`} />
              <Row
                left={`Identifiant : ${declarant?.numeroIdentification || 'N/A'}`}
                right={`Lien : ${declarant?.lienParente || 'N/A'}`}
              />
            </View>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Text style={styles.footerDresseLine}>Dressé le : {formatDate(record.createdAt)}</Text>
                <View style={{ height: 40 }} />
                <Text style={styles.footerOfficierLabel}>Officier de l&apos;Etat Civil Délégué</Text>
                <View style={styles.stampCircle}>
                  <Text style={styles.stampLine1}>REPUBLIQUE</Text>
                  <View style={styles.stampSeal}>
                    <MaterialIcons name="account-balance" size={18} color="#1a4a8a" />
                  </View>
                  <Text style={styles.stampLine2}>GUINEE</Text>
                  <Text style={styles.stampLine3}>ÉTAT CIVIL</Text>
                </View>
              </View>

              <View style={styles.footerRight}>
                <Image
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${record.identifiantUniqueNational || record.id}` }}
                  style={styles.qrCode}
                  resizeMode="contain"
                />
                <Text style={styles.qrRef}>{record.id.substring(0, 10).toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.borderLine2B} />
            <View style={styles.borderLine1B} />
          </View>
        </View>

        {attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.sectionTitle}>Pièces Justificatives</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attachmentsScroll}>
              {attachments.map((att: any, index: number) => (
                <View key={index} style={styles.attachmentCard}>
                  <Image source={{ uri: att.urlFichier }} style={styles.attachmentImage} />
                  <Text style={styles.attachmentLabel}>{att.type.replace('PHOTO_', '')}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionPrimary}>
            <MaterialIcons name="file-download" size={20} color="#fff" />
            <Text style={styles.actionPrimaryText}>Télécharger le PDF officiel</Text>
          </TouchableOpacity>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionSecondary}>
              <MaterialIcons name="share" size={20} color={Colors.primary} />
              <Text style={styles.actionSecondaryText}>Partager</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionSecondary}>
              <MaterialIcons name="print" size={20} color={Colors.primary} />
              <Text style={styles.actionSecondaryText}>Imprimer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.blockchainCard}>
          <View style={styles.blockchainHeader}>
            <MaterialIcons name="security" size={18} color={Colors.primary} />
            <Text style={styles.blockchainTitle}>Certification Blockchain</Text>
          </View>
          <View style={styles.blockchainRow}>
            <Text style={styles.blockchainKey}>Statut d&apos;immuabilité</Text>
            <View style={styles.blockchainStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{record.identifiantUniqueNational ? 'CERTIFIÉ' : 'ENREGISTRÉ'}</Text>
            </View>
          </View>
          <View style={styles.blockchainDivider} />
          <View style={styles.blockchainRow}>
            <Text style={styles.blockchainKey}>Réseau</Text>
            <Text style={styles.blockchainValue}>Polygon Amoy Testnet</Text>
          </View>
        </View>

        <View style={styles.vaccinationCard}>
          <View style={styles.vaccinationHeader}>
            <MaterialIcons name="health-and-safety" size={24} color="#006948" />
            <Text style={styles.vaccinationTitle}>Suivi de Vaccination (PEV)</Text>
          </View>
          <Text style={styles.vaccinationSub}>Calendrier vaccinal de la République de Guinée</Text>
          
          <View style={styles.vaccineItem}>
            <View style={styles.vaccineInfo}>
              <Text style={styles.vaccineName}>BCG / VPO 0</Text>
              <Text style={styles.vaccineDate}>Administré à la naissance</Text>
            </View>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          </View>

          <View style={styles.vaccineItem}>
            <View style={styles.vaccineInfo}>
              <Text style={styles.vaccineName}>Penta 1 / VPO 1</Text>
              <Text style={styles.vaccineDate}>Prévu à 6 semaines</Text>
            </View>
            <MaterialIcons name="schedule" size={24} color="#FFA000" />
          </View>

          <TouchableOpacity style={styles.vaccinationBtn}>
            <Text style={styles.vaccinationBtnText}>Voir le carnet de santé complet</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  topBarTitle: { fontSize: 16, fontWeight: '900', color: Colors.onSurface },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + '20',
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: Colors.primary, flex: 1 },
  verifiedDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.outline },
  verifiedId: { fontSize: 11, fontWeight: '800', color: Colors.outline, fontFamily: 'monospace' },
  scrollContent: { padding: 12, paddingBottom: 40 },
  certificateOuter: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  borderLine1: { height: 10, backgroundColor: '#4b0082' },
  borderLine2: { height: 5, backgroundColor: '#006400', marginBottom: 10 },
  borderLine2B: { height: 5, backgroundColor: '#006400', marginTop: 10 },
  borderLine1B: { height: 10, backgroundColor: '#4b0082' },
  certificateInner: { paddingHorizontal: 16, paddingBottom: 0 },
  docHeader: { marginBottom: 10 },
  headerTopRight: { alignItems: 'flex-end', marginBottom: 6 },
  headerCertNum: { fontSize: 8.5, color: '#222', fontWeight: '600' },
  headerRepublic: { fontSize: 9, color: '#222', fontWeight: '700', marginTop: 1 },
  headerNIN: { fontSize: 8.5, color: '#222', fontWeight: '600' },
  headerCenter: { alignItems: 'center', marginBottom: 8 },
  coatOfArms: { width: 52, height: 52, marginBottom: 8 },
  titleMain: { fontSize: 20, fontWeight: '900', color: '#000', fontStyle: 'italic', letterSpacing: 0.5 },
  titleSub: { fontSize: 11, fontWeight: '600', color: '#333', fontStyle: 'italic' },
  titleSub2: { fontSize: 13, fontWeight: '900', color: '#000' },
  table: { borderWidth: 1.2, borderColor: '#555', marginBottom: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14, paddingHorizontal: 4, marginBottom: 8 },
  footerLeft: { flex: 1 },
  footerDresseLine: { fontSize: 10, fontWeight: '700', color: '#111', marginBottom: 8 },
  footerOfficierLabel: { fontSize: 9.5, fontWeight: '600', color: '#111', marginBottom: 10, textDecorationLine: 'underline' },
  stampCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#1a4a8a', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', padding: 6 },
  stampLine1: { fontSize: 9, fontWeight: '900', color: '#1a4a8a', letterSpacing: 1.5 },
  stampSeal: { marginVertical: 2 },
  stampLine2: { fontSize: 7, color: '#1a4a8a', fontWeight: '700' },
  stampLine3: { fontSize: 7, color: '#1a4a8a', fontWeight: '700' },
  footerRight: { alignItems: 'center', gap: 6, paddingLeft: 10 },
  qrCode: { width: 80, height: 80, borderWidth: 1, borderColor: '#ccc' },
  qrRef: { fontSize: 9, fontWeight: '800', color: '#333', letterSpacing: 1 },
  actions: { gap: 10, marginBottom: 14 },
  actionPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, paddingVertical: 15, borderRadius: 16, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  actionPrimaryText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surfaceContainerLowest, paddingVertical: 13, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.outlineVariant },
  actionSecondaryText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  blockchainCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: Colors.outlineVariant },
  blockchainHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  blockchainTitle: { fontSize: 14, fontWeight: '900', color: Colors.onSurface },
  blockchainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  blockchainKey: { fontSize: 12, color: Colors.onSurfaceVariant, fontWeight: '600' },
  blockchainValue: { fontSize: 12, color: Colors.onSurface, fontWeight: '700', fontFamily: 'monospace', maxWidth: 160 },
  blockchainDivider: { height: 1, backgroundColor: Colors.surfaceContainerLow },
  blockchainStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary + '12', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  statusText: { fontSize: 9, fontWeight: '900', color: Colors.primary, letterSpacing: 1 },
  // Attachment styles
  attachmentsSection: { marginBottom: 20, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: Colors.onSurface, marginBottom: 12 },
  attachmentsScroll: { gap: 12, paddingRight: 20 },
  attachmentCard: { width: 120, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  attachmentImage: { width: 120, height: 80, backgroundColor: '#f9f9f9' },
  attachmentLabel: { fontSize: 10, fontWeight: '800', color: '#666', textAlign: 'center', paddingVertical: 6, textTransform: 'uppercase' },
  // Vaccination styles
  vaccinationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  vaccinationTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#006948',
  },
  vaccinationSub: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  vaccineDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  vaccinationBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5fbf4',
    borderRadius: 12,
  },
  vaccinationBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#006948',
  },
});
