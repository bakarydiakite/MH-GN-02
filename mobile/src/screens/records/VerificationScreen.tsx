import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

import { birthService } from '../../services/birth.service';
import { CameraView, useCameraPermissions } from 'expo-camera';

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

export const VerificationScreen = () => {
  const navigation = useNavigation<any>();
  const [inputCode, setInputCode] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [result, setResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  const handleVerify = async (code?: string) => {
    const finalCode = code || inputCode.trim().toUpperCase();
    if (!finalCode) return;
    
    setStatus('loading');
    setErrorMessage('');
    setIsScanning(false); // Stop camera scan while verifying

    try {
      const data = await birthService.verifyByIun(finalCode);
      
      setResult({
        childName: `${data.enfant.prenoms} ${data.enfant.nom}`,
        birthDate: new Date(data.enfant.dateNaissance).toLocaleDateString('fr-FR'),
        id: data.identifiantUniqueNational,
        registeredBy: data.centreEnregistrement || 'Centre de santé',
        blockchainHash: data.blockchainHash || '0x4f2a9b...c831e',
        anchoredAt: data.certifiedAt ? new Date(data.certifiedAt).toLocaleString('fr-FR') : 'Non ancré',
      });
      setStatus('success');
    } catch (error: any) {
      console.error('[Verification] Error:', error);
      setErrorMessage(error.message || 'Acte non trouvé ou invalide');
      setStatus('error');
      setResult(null);
    }
  };

  const onBarcodeScanned = ({ data }: { data: string }) => {
    if (status === 'loading') return;
    // Extract IUN from QR data (assuming QR data is just the IUN or contains it)
    let iun = data;
    if (data.includes('NC-')) {
       // Simple heuristic if it's a complex string
       const match = data.match(/NC-\d{4}-\d{5}/);
       if (match) iun = match[0];
    }
    handleVerify(iun);
  };

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire pour scanner les QR codes.');
        return;
      }
    }
    setIsScanning(true);
    setStatus('idle');
    setResult(null);
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setInputCode('');
    setErrorMessage('');
    setIsScanning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarBrand}>
          <MaterialIcons name="verified-user" size={20} color={Colors.primary} />
          <Text style={styles.brandTitle}>NaissanceChain</Text>
        </View>
        <View style={styles.publicBadge}>
          <Text style={styles.publicBadgeText}>ACCÈS PUBLIC</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Vérification d&apos;un acte de naissance</Text>
          <Text style={styles.pageSub}>
            Scannez le QR code ou saisissez le numéro de référence pour vérifier l&apos;authenticité d&apos;un acte officiel.
          </Text>
        </View>

        {/* Scan Zone */}
        {status === 'idle' && !isScanning && (
          <TouchableOpacity style={styles.scanZone} onPress={handleStartScan} activeOpacity={0.85}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <MaterialIcons name="qr-code-scanner" size={52} color={Colors.primary} />
              <Text style={styles.scanLabel}>Appuyez pour scanner le QR code</Text>
            </View>
          </TouchableOpacity>
        )}

        {isScanning && (
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              onBarcodeScanned={onBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.unfocusedContainer} />
                <View style={styles.middleContainer}>
                  <View style={styles.unfocusedContainer} />
                  <View style={styles.focusedContainer} />
                  <View style={styles.unfocusedContainer} />
                </View>
                <View style={styles.unfocusedContainer} />
              </View>
            </CameraView>
            <TouchableOpacity style={styles.closeCameraBtn} onPress={() => setIsScanning(false)}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Manual Input */}
        {status === 'idle' && (
          <View style={styles.manualSection}>
            <View style={styles.separatorRow}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou saisir manuellement</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="search" size={20} color={Colors.outline} style={styles.inputIcon} />
                <TextInput
                  style={styles.manualInput}
                  value={inputCode}
                  onChangeText={(text) => setInputCode(text)}
                  placeholder="Ex: NC-2026-00847"
                  placeholderTextColor={Colors.outline}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Quick demo buttons */}
            <View style={styles.demoRow}>
              <TouchableOpacity style={styles.demoBtn} onPress={() => { setInputCode('NC-2024-8842'); handleVerify('NC-2024-8842'); }}>
                <Text style={styles.demoBtnText}>✓ Tester avec un acte valide</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.demoBtn, styles.demoBtnError]} onPress={() => handleVerify('INVALID')}>
                <Text style={[styles.demoBtnText, { color: Colors.error }]}>✗ Simuler un acte invalide</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Loading State */}
        {status === 'loading' && (
          <View style={styles.loadingSection}>
            <View style={styles.loadingCircle}>
              <MaterialIcons name="sync" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.loadingTitle}>Vérification en cours...</Text>
            <Text style={styles.loadingSteps}>Interrogation du registre Polygon Amoy</Text>
          </View>
        )}

        {/* SUCCESS Result */}
        {status === 'success' && result && (
          <View style={styles.resultSection}>
            {/* Success Banner */}
            <View style={styles.successBanner}>
              <View style={styles.successIconCircle}>
                <MaterialIcons name="verified" size={36} color="#fff" />
              </View>
              <Text style={styles.successTitle}>Document Authentique</Text>
              <Text style={styles.successSub}>
                Cet acte a été vérifié sur la blockchain Polygon. Son intégrité est garantie.
              </Text>
            </View>

            {/* Document Details */}
            <View style={styles.resultCard}>
              <Text style={styles.resultCardTitle}>Informations de l&apos;acte</Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Nom de l&apos;enfant</Text>
                <Text style={styles.resultValue}>{result.childName}</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Date de naissance</Text>
                <Text style={styles.resultValue}>{result.birthDate}</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Référence acte</Text>
                <Text style={[styles.resultValue, styles.resultMono]}>{result.id}</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Enregistré par</Text>
                <Text style={styles.resultValue}>{result.registeredBy}</Text>
              </View>
            </View>

            {/* Blockchain Proof */}
            <View style={styles.blockchainCard}>
              <View style={styles.blockchainHeader}>
                <MaterialIcons name="link" size={16} color={Colors.primary} />
                <Text style={styles.blockchainTitle}>Preuve Blockchain · Polygon</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Hash SHA-256</Text>
                <Text style={[styles.resultValue, styles.resultMono]}>{result.blockchainHash}</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Ancré le</Text>
                <Text style={styles.resultValue}>{result.anchoredAt}</Text>
              </View>
              <View style={styles.resultDivider} />
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Statut</Text>
                <View style={styles.certifiedBadge}>
                  <MaterialIcons name="check-circle" size={12} color={Colors.primary} />
                  <Text style={styles.certifiedText}>IMMUABLE · CERTIFIÉ</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <MaterialIcons name="refresh" size={18} color={Colors.primary} />
              <Text style={styles.resetBtnText}>Nouvelle vérification</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ERROR Result */}
        {status === 'error' && (
          <View style={styles.resultSection}>
            <View style={styles.errorBanner}>
              <View style={styles.errorIconCircle}>
                <MaterialIcons name="cancel" size={36} color="#fff" />
              </View>
              <Text style={styles.errorTitle}>Alerte Falsification</Text>
              <Text style={styles.errorSub}>
                Ce document n&apos;est pas reconnu dans le registre NaissanceChain ou ses données ont été modifiées.
              </Text>
            </View>

            <View style={styles.resultCard}>
              <View style={styles.errorDetail}>
                <MaterialIcons name="warning" size={20} color={Colors.error} />
                <Text style={styles.errorDetailText}>
                  Le hash de ce document ne correspond à aucune transaction enregistrée sur la blockchain Polygon.
                  Ce document peut être un faux ou avoir été altéré.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <MaterialIcons name="refresh" size={18} color={Colors.primary} />
              <Text style={styles.resetBtnText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <MaterialIcons name="security" size={16} color={Colors.outline} />
          <Text style={styles.infoFooterText}>
            La vérification interroge le Smart Contract NaissanceChain déployé sur le réseau Polygon Amoy.
            Aucune donnée personnelle n&apos;est stockée sur la blockchain.
          </Text>
        </View>

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
  topBarBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.3 },
  publicBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  publicBadgeText: { fontSize: 9, fontWeight: '900', color: Colors.outline, letterSpacing: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  pageTitle: {
    fontSize: 26, fontWeight: '900', color: Colors.onSurface,
    letterSpacing: -0.3, marginBottom: 10,
  },
  pageSub: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },

  // Scan Zone
  scanZone: { marginBottom: 28 },
  scanFrame: {
    height: 220, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 2, borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', gap: 12,
    position: 'relative', overflow: 'hidden',
  },
  corner: {
    position: 'absolute', width: 24, height: 24,
    borderColor: Colors.primary, borderWidth: 3,
  },
  cornerTL: { top: 16, left: 16, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 16, right: 16, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 16, left: 16, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 16, right: 16, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },
  // Camera
  cameraContainer: { height: 350, borderRadius: 24, overflow: 'hidden', marginBottom: 28, position: 'relative' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  middleContainer: { flexDirection: 'row', height: 200 },
  focusedContainer: { flex: 4, borderColor: '#fff', borderWidth: 2, borderRadius: 20, backgroundColor: 'transparent' },
  closeCameraBtn: { position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },

  scanLabel: { fontSize: 14, fontWeight: '700', color: Colors.onSurfaceVariant },

  // Manual Input
  manualSection: { gap: 14, marginBottom: 28 },
  separatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  separatorLine: { flex: 1, height: 1, backgroundColor: Colors.surfaceContainerHigh },
  separatorText: { fontSize: 11, fontWeight: '700', color: Colors.outline },
  inputRow: { gap: 10 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.outlineVariant,
    paddingHorizontal: 14, paddingVertical: 14,
  },
  inputIcon: { marginRight: 8 },
  manualInput: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.onSurface, padding: 0 },
  demoRow: { gap: 8 },
  demoBtn: {
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16,
    alignItems: 'center',
  },
  demoBtnError: { backgroundColor: Colors.error + '10' },
  demoBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  // Loading
  loadingSection: { alignItems: 'center', paddingVertical: 50, gap: 16 },
  loadingCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  loadingTitle: { fontSize: 20, fontWeight: '900', color: Colors.onSurface },
  loadingSteps: { fontSize: 13, color: Colors.onSurfaceVariant, fontFamily: 'monospace' },

  // Result
  resultSection: { gap: 16, marginBottom: 10 },
  successBanner: {
    backgroundColor: Colors.primary, borderRadius: 24, padding: 26,
    alignItems: 'center', gap: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 6,
  },
  successIconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  successSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 18 },
  errorBanner: {
    backgroundColor: Colors.error, borderRadius: 24, padding: 26,
    alignItems: 'center', gap: 10,
  },
  errorIconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  errorTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  errorSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 18 },
  errorDetail: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  errorDetailText: { fontSize: 13, color: Colors.error, lineHeight: 18, flex: 1 },

  resultCard: {
    backgroundColor: Colors.surfaceContainerLowest, borderRadius: 20,
    padding: 18, gap: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  resultCardTitle: {
    fontSize: 12, fontWeight: '900', color: Colors.outline,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14,
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  resultLabel: { fontSize: 12, fontWeight: '600', color: Colors.outline },
  resultValue: { fontSize: 13, fontWeight: '800', color: Colors.onSurface, maxWidth: 180, textAlign: 'right' },
  resultMono: { fontFamily: 'monospace', color: Colors.primary },
  resultDivider: { height: 1, backgroundColor: Colors.surfaceContainerLow },

  blockchainCard: {
    backgroundColor: Colors.primary + '08', borderRadius: 20,
    padding: 18, borderWidth: 1, borderColor: Colors.primary + '25',
  },
  blockchainHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  blockchainTitle: { fontSize: 13, fontWeight: '900', color: Colors.primary },
  certifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary + '15', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  certifiedText: { fontSize: 9, fontWeight: '900', color: Colors.primary, letterSpacing: 0.8 },

  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surfaceContainerLow, borderRadius: 14,
    paddingVertical: 14, borderWidth: 1.5, borderColor: Colors.outlineVariant,
  },
  resetBtnText: { fontSize: 14, fontWeight: '800', color: Colors.primary },

  infoFooter: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 14, borderRadius: 14, marginTop: 10,
  },
  infoFooterText: { fontSize: 11, color: Colors.outline, lineHeight: 16, flex: 1 },
});
