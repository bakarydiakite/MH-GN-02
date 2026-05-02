import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

// ─── Types ────────────────────────────────────────────────────────────────────
type DossierStatus = 'draft' | 'complete' | 'synced' | 'certified';

type Dossier = {
  id: string;
  childName: string;
  birthDate: string;
  submittedAt: string;
  status: DossierStatus;
  reference: string;
};

// ─── Données de démo ─────────────────────────────────────────────────────────
const DOSSIERS: Dossier[] = [
  {
    id: '1',
    childName: 'Mamadou Diallo',
    birthDate: '12 mars 2018',
    submittedAt: '14 oct. 2024',
    status: 'certified',
    reference: 'NC-2024-8842',
  },
  {
    id: '2',
    childName: 'Fatoumata Camara',
    birthDate: '05 août 2021',
    submittedAt: '02 janv. 2024',
    status: 'synced',
    reference: 'NC-2024-9011',
  },
];

// ─── Configuration des étapes ─────────────────────────────────────────────────
type Step = {
  key: string;
  label: string;
  description: string;
  icon: string;
  reachedAt: (s: DossierStatus) => boolean;
  isActive: (s: DossierStatus) => boolean;
};

const STEPS: Step[] = [
  {
    key: 'submitted',
    label: 'Dossier soumis',
    description: "L'agent terrain a rempli et envoyé le formulaire de naissance.",
    icon: 'assignment',
    reachedAt: () => true,
    isActive: (s) => s === 'draft' || s === 'complete',
  },
  {
    key: 'synced',
    label: 'Reçu par le serveur',
    description: 'Le dossier a été transmis au système central de l\'état civil.',
    icon: 'cloud-upload',
    reachedAt: (s) => s === 'synced' || s === 'certified',
    isActive: (s) => s === 'synced',
  },
  {
    key: 'review',
    label: 'Vérification officielle',
    description: "Un officier de l'état civil examine et valide les informations déclarées.",
    icon: 'fact-check',
    reachedAt: (s) => s === 'certified',
    isActive: (s) => s === 'synced',
  },
  {
    key: 'certified',
    label: 'Acte certifié ✓',
    description: 'L\'acte est ancré sur la blockchain Polygon. Il est immuable et téléchargeable.',
    icon: 'verified',
    reachedAt: (s) => s === 'certified',
    isActive: (s) => s === 'certified',
  },
];

// ─── Badge statut global ──────────────────────────────────────────────────────
const STATUS_INFO: Record<DossierStatus, { label: string; color: string; bg: string; icon: string }> = {
  draft:     { label: 'En saisie',        color: Colors.outline,  bg: Colors.surfaceContainerHigh, icon: 'edit' },
  complete:  { label: 'En attente sync',  color: '#d97706',       bg: '#fef3c7',                   icon: 'pending' },
  synced:    { label: 'En vérification',  color: '#2563eb',       bg: '#dbeafe',                   icon: 'sync' },
  certified: { label: 'Certifié ✓',       color: Colors.primary,  bg: Colors.primary + '18',       icon: 'verified' },
};

// ─── Composant : Sélecteur de dossier ────────────────────────────────────────
const DossierCard = ({
  dossier,
  selected,
  onSelect,
}: {
  dossier: Dossier;
  selected: boolean;
  onSelect: () => void;
}) => {
  const s = STATUS_INFO[dossier.status];
  return (
    <TouchableOpacity
      style={[styles.dossierCard, selected && styles.dossierCardSelected]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={styles.dossierAvatar}>
        <Text style={styles.dossierAvatarText}>
          {dossier.childName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.dossierInfo}>
        <Text style={styles.dossierName}>{dossier.childName}</Text>
        <Text style={styles.dossierDate}>Né(e) le {dossier.birthDate}</Text>
        <Text style={styles.dossierRef}>{dossier.reference}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
        <MaterialIcons name={s.icon as any} size={13} color={s.color} />
        <Text style={[styles.statusBadgeText, { color: s.color }]}>{s.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Composant : Étape de la timeline ────────────────────────────────────────
const TimelineStep = ({
  step,
  status,
  isLast,
}: {
  step: Step;
  status: DossierStatus;
  isLast: boolean;
}) => {
  const reached = step.reachedAt(status);
  const active = step.isActive(status);

  return (
    <View style={tlStyles.row}>
      {/* Left column: icon + line */}
      <View style={tlStyles.leftCol}>
        <View style={[
          tlStyles.iconCircle,
          reached && tlStyles.iconCircleReached,
          active && tlStyles.iconCircleActive,
        ]}>
          <MaterialIcons
            name={step.icon as any}
            size={20}
            color={reached ? '#fff' : active ? Colors.primary : Colors.outlineVariant}
          />
          {active && <View style={tlStyles.pulsingRing} />}
        </View>
        {!isLast && (
          <View style={[tlStyles.line, reached && tlStyles.lineDone]} />
        )}
      </View>

      {/* Right column: text */}
      <View style={[tlStyles.card, active && tlStyles.cardActive, !reached && !active && tlStyles.cardPending]}>
        <View style={tlStyles.cardHeader}>
          <Text style={[tlStyles.cardLabel, reached && tlStyles.cardLabelDone, active && tlStyles.cardLabelActive, !reached && !active && tlStyles.cardLabelPending]}>
            {step.label}
          </Text>
          {reached && (
            <View style={tlStyles.doneBadge}>
              <MaterialIcons name="check" size={11} color={Colors.primary} />
              <Text style={tlStyles.doneBadgeText}>Fait</Text>
            </View>
          )}
          {active && (
            <View style={tlStyles.activeBadge}>
              <View style={tlStyles.activeDot} />
              <Text style={tlStyles.activeBadgeText}>En cours</Text>
            </View>
          )}
        </View>
        <Text style={[tlStyles.cardDesc, (!reached && !active) && tlStyles.cardDescPending]}>
          {step.description}
        </Text>
      </View>
    </View>
  );
};

const tlStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, marginBottom: 4 },
  leftCol: { alignItems: 'center', width: 44 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative', zIndex: 1,
  },
  iconCircleReached: { backgroundColor: Colors.primary },
  iconCircleActive: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 2.5, borderColor: Colors.primary,
  },
  pulsingRing: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderColor: Colors.primary + '30',
  },
  line: {
    width: 2, flex: 1, minHeight: 16,
    backgroundColor: Colors.surfaceContainerHigh,
    marginVertical: 4,
  },
  lineDone: { backgroundColor: Colors.primary + '50' },
  card: {
    flex: 1, backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 18, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  cardActive: {
    borderWidth: 1.5, borderColor: Colors.primary + '30',
    backgroundColor: Colors.primary + '05',
  },
  cardPending: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardLabel: { fontSize: 14, fontWeight: '800', color: Colors.onSurface },
  cardLabelDone: { color: Colors.primary },
  cardLabelActive: { color: Colors.primary },
  cardLabelPending: { color: Colors.onSurfaceVariant },
  cardDesc: { fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17 },
  cardDescPending: { color: Colors.outline },
  doneBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  doneBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563eb' },
  activeBadgeText: { fontSize: 10, fontWeight: '800', color: '#2563eb' },
});

// ═══════════════════════════════════════════════════════════════════════════════
// Main Screen
// ═══════════════════════════════════════════════════════════════════════════════
export const SuiviDossierScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedId, setSelectedId] = useState<string>(DOSSIERS[0].id);

  const selected = DOSSIERS.find((d) => d.id === selectedId) ?? DOSSIERS[0];
  const statusInfo = STATUS_INFO[selected.status];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Suivi de dossier</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── SECTION 1 : Explication ── */}
        <View style={styles.explainBox}>
          <MaterialIcons name="info" size={18} color={Colors.primary} />
          <Text style={styles.explainText}>
            Cette page vous permet de voir où en est chaque acte de naissance de votre famille,
            de la saisie par l&apos;agent jusqu&apos;à la certification officielle.
          </Text>
        </View>

        {/* ── SECTION 2 : Choisir le dossier ── */}
        <Text style={styles.sectionTitle}>Choisissez un enfant</Text>
        <View style={styles.dossierList}>
          {DOSSIERS.map((d) => (
            <DossierCard
              key={d.id}
              dossier={d}
              selected={d.id === selectedId}
              onSelect={() => setSelectedId(d.id)}
            />
          ))}
        </View>

        {/* ── SECTION 3 : Statut global ── */}
        <View style={[styles.statusGlobal, { borderColor: statusInfo.color + '30' }]}>
          <View style={[styles.statusGlobalIcon, { backgroundColor: statusInfo.bg }]}>
            <MaterialIcons name={statusInfo.icon as any} size={28} color={statusInfo.color} />
          </View>
          <View style={styles.statusGlobalText}>
            <Text style={styles.statusGlobalLabel}>Statut actuel du dossier</Text>
            <Text style={[styles.statusGlobalValue, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
            <Text style={styles.statusGlobalRef}>Réf. {selected.reference} · Soumis le {selected.submittedAt}</Text>
          </View>
        </View>

        {/* ── SECTION 4 : Timeline claire ── */}
        <Text style={styles.sectionTitle}>Étapes du traitement</Text>
        <View style={styles.timeline}>
          {STEPS.map((step, i) => (
            <TimelineStep
              key={step.key}
              step={step}
              status={selected.status}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </View>

        {/* ── SECTION 5 : Action selon statut ── */}
        {selected.status === 'certified' ? (
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={() => navigation.navigate('DigitalProof')}
          >
            <MaterialIcons name="file-download" size={20} color="#fff" />
            <Text style={styles.actionBtnPrimaryText}>Télécharger l&apos;acte certifié</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.waitBanner}>
            <MaterialIcons name="hourglass-top" size={20} color="#d97706" />
            <Text style={styles.waitText}>
              Votre dossier est en cours de traitement. Vous recevrez une notification dès qu&apos;il sera certifié.
            </Text>
          </View>
        )}

        {/* ── SECTION 6 : Contact support ── */}
        <View style={styles.supportCard}>
          <MaterialIcons name="support-agent" size={22} color={Colors.primary} />
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>Une question sur votre dossier ?</Text>
            <Text style={styles.supportSub}>Contactez le centre d&apos;état civil de votre préfecture.</Text>
          </View>
          <TouchableOpacity style={styles.supportBtn}>
            <MaterialIcons name="phone" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center', alignItems: 'center',
  },
  topTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface },

  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

  // Explain
  explainBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.primary + '10',
    borderRadius: 14, padding: 14, marginBottom: 24,
  },
  explainText: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18, flex: 1 },

  // Section title
  sectionTitle: {
    fontSize: 13, fontWeight: '900', color: Colors.outline,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12,
  },

  // Dossier selector
  dossierList: { gap: 10, marginBottom: 24 },
  dossierCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 18,
    padding: 14, borderWidth: 2, borderColor: Colors.outlineVariant,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  dossierCardSelected: {
    borderColor: Colors.primary, backgroundColor: Colors.primary + '05',
  },
  dossierAvatar: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: 'center', alignItems: 'center',
  },
  dossierAvatarText: { fontSize: 14, fontWeight: '900', color: Colors.primary },
  dossierInfo: { flex: 1 },
  dossierName: { fontSize: 14, fontWeight: '800', color: Colors.onSurface, marginBottom: 2 },
  dossierDate: { fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 2 },
  dossierRef: { fontSize: 10, color: Colors.outline, fontFamily: 'monospace' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20,
  },
  statusBadgeText: { fontSize: 9, fontWeight: '900' },

  // Status global card
  statusGlobal: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 20,
    padding: 18, marginBottom: 28, borderWidth: 1.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  statusGlobalIcon: {
    width: 56, height: 56, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  statusGlobalText: { flex: 1 },
  statusGlobalLabel: { fontSize: 11, fontWeight: '700', color: Colors.outline, marginBottom: 3 },
  statusGlobalValue: { fontSize: 17, fontWeight: '900', marginBottom: 3 },
  statusGlobalRef: { fontSize: 10, color: Colors.outline, fontFamily: 'monospace' },

  // Timeline
  timeline: { marginBottom: 24 },

  // Actions
  actionBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, paddingVertical: 17, borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
  },
  actionBtnPrimaryText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  waitBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#fef3c7', borderRadius: 14, padding: 16, marginBottom: 16,
  },
  waitText: { flex: 1, fontSize: 13, color: '#92400e', lineHeight: 18 },

  // Support
  supportCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 18, padding: 16,
  },
  supportText: { flex: 1 },
  supportTitle: { fontSize: 14, fontWeight: '800', color: Colors.onSurface, marginBottom: 3 },
  supportSub: { fontSize: 12, color: Colors.onSurfaceVariant },
  supportBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.outlineVariant,
  },
});
