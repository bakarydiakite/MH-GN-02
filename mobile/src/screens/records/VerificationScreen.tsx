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
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { birthService } from '../../services/birth.service';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

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
    setIsScanning(false);

    try {
      const data = await birthService.verifyByIun(finalCode);
      setResult({
        childName: `${data.enfant.prenoms} ${data.enfant.nom}`,
        birthDate: new Date(data.enfant.dateNaissance).toLocaleDateString('fr-FR'),
        id: data.identifiantUniqueNational,
        registeredBy: data.centreEnregistrement || 'Hôpital Régional',
        blockchainHash: data.blockchainHash || '0x7f3a9b...e21c9',
        anchoredAt: data.certifiedAt ? new Date(data.certifiedAt).toLocaleString('fr-FR') : 'Horodatage immuable',
      });
      setStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Authentification échouée');
      setStatus('error');
    }
  };

  const onBarcodeScanned = ({ data }: { data: string }) => {
    if (status === 'loading') return;
    handleVerify(data);
  };

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setIsScanning(true);
    setStatus('idle');
    setResult(null);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      
      {/* Premium Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vérification</Text>
          <View style={styles.headerRight}>
            <View style={styles.publicBadge}>
              <Text style={styles.publicBadgeText}>GUINÉE STATE</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Futuristic Intro */}
        <View style={styles.intro}>
          <Text style={styles.title}>Vérifier l&apos;authenticité</Text>
          <Text style={styles.sub}>Authentification cryptographique des actes d&apos;état civil sur le réseau NaissanceChain.</Text>
        </View>

        {/* Scan / Camera Section */}
        <View style={styles.scannerWrapper}>
          {isScanning ? (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={onBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.scanTarget}>
                    <View style={[styles.scanCorner, styles.tl]} />
                    <View style={[styles.scanCorner, styles.tr]} />
                    <View style={[styles.scanCorner, styles.bl]} />
                    <View style={[styles.scanCorner, styles.br]} />
                    <View style={styles.scanLine} />
                  </View>
                </View>
              </CameraView>
              <TouchableOpacity style={styles.stopCameraBtn} onPress={() => setIsScanning(false)}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.scanTrigger} onPress={handleStartScan} activeOpacity={0.9}>
              <View style={styles.scanIconBox}>
                <Feather name="maximize" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.scanTriggerText}>Scanner le QR Code</Text>
              <Text style={styles.scanTriggerSub}>Démarrer la vérification visuelle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status / Results */}
        {status === 'loading' && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingTitle}>Vérification cryptographique...</Text>
            <Text style={styles.loadingSub}>Interrogation des nœuds du registre d&apos;État.</Text>
          </View>
        )}

        {status === 'success' && result && (
          <View style={styles.resultBox}>
            <View style={styles.successCard}>
              <View style={styles.successHeader}>
                <View style={styles.verifiedIcon}>
                  <MaterialIcons name="verified" size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.verifiedTitle}>ACTE AUTHENTIFIÉ</Text>
                  <Text style={styles.verifiedSub}>Origine Gouvernementale Garantie</Text>
                </View>
              </View>
              
              <View style={styles.resultDetails}>
                <ResultItem label="IDENTITÉ" value={result.childName} />
                <ResultItem label="RÉFÉRENCE" value={result.id} mono />
                <ResultItem label="STRUCTURE" value={result.registeredBy} />
                <ResultItem label="HORODATAGE" value={result.anchoredAt} />
              </View>

              <View style={styles.hashBox}>
                <Text style={styles.hashLabel}>PREUVE BLOCKCHAIN (SHA-256)</Text>
                <Text style={styles.hashValue}>{result.blockchainHash}</Text>
              </View>

              <TouchableOpacity style={styles.resetBtn} onPress={() => setStatus('idle')}>
                <Text style={styles.resetBtnText}>Nouvelle vérification</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.errorBox}>
            <View style={styles.errorCard}>
              <Feather name="alert-triangle" size={48} color="#FF5252" />
              <Text style={styles.errorTitle}>Document Non Reconnu</Text>
              <Text style={styles.errorSub}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => setStatus('idle')}>
                <Text style={styles.retryBtnText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Manual Input - Futuristic Look */}
        {status === 'idle' && !isScanning && (
          <View style={styles.manualInputContainer}>
            <View style={styles.inputDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU MANUELLEMENT</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.manualInputBox}>
              <TextInput 
                style={styles.manualInput}
                placeholder="Réf: NC-2024-XXXXX"
                value={inputCode}
                onChangeText={setInputCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.verifyBtn} onPress={() => handleVerify()}>
                <Feather name="arrow-right" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}



        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const ResultItem = ({ label, value, mono }: any) => (
  <View style={styles.resultItem}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={[styles.resultValue, mono && styles.monoText]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAF9' },
  header: { backgroundColor: '#fff', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAF9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.onSurface },
  headerRight: {},
  publicBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: Colors.primary + '15' },
  publicBadgeText: { fontSize: 9, fontWeight: '900', color: Colors.primary, letterSpacing: 1 },
  scrollContent: { padding: 24 },
  intro: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  sub: { fontSize: 14, color: Colors.onSurfaceVariant, opacity: 0.6, marginTop: 8, lineHeight: 22 },
  
  scannerWrapper: { marginBottom: 32 },
  cameraContainer: { height: 350, borderRadius: 32, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  scanTarget: { width: 220, height: 220, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  scanCorner: { position: 'absolute', width: 30, height: 30, borderColor: Colors.primary, borderWidth: 4 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
  scanLine: { width: '80%', height: 2, backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 10 },
  stopCameraBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  
  scanTrigger: { height: 200, borderRadius: 32, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, elevation: 5 },
  scanIconBox: { width: 70, height: 70, borderRadius: 24, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scanTriggerText: { fontSize: 18, fontWeight: '800', color: Colors.onSurface },
  scanTriggerSub: { fontSize: 12, color: Colors.onSurfaceVariant, opacity: 0.5, marginTop: 4 },

  loadingBox: { alignItems: 'center', paddingVertical: 40 },
  loadingTitle: { fontSize: 16, fontWeight: '800', color: Colors.onSurface, marginTop: 16 },
  loadingSub: { fontSize: 12, color: Colors.onSurfaceVariant, opacity: 0.5, marginTop: 4 },

  resultBox: { marginBottom: 32 },
  successCard: { backgroundColor: '#fff', borderRadius: 32, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.08, shadowRadius: 40, elevation: 8 },
  successHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  verifiedIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  verifiedTitle: { fontSize: 18, fontWeight: '900', color: Colors.primary, letterSpacing: 0.5 },
  verifiedSub: { fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.5, fontWeight: '700' },
  resultDetails: { gap: 16, marginBottom: 24 },
  resultItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 11, fontWeight: '800', color: Colors.onSurfaceVariant, opacity: 0.5, textTransform: 'uppercase' },
  resultValue: { fontSize: 14, fontWeight: '800', color: Colors.onSurface },
  monoText: { fontFamily: 'monospace', color: Colors.primary },
  hashBox: { backgroundColor: '#F8FAF9', padding: 16, borderRadius: 20, marginBottom: 24 },
  hashLabel: { fontSize: 9, fontWeight: '900', color: Colors.primary, marginBottom: 4 },
  hashValue: { fontSize: 10, color: Colors.onSurfaceVariant, opacity: 0.7, fontFamily: 'monospace' },
  resetBtn: { height: 56, borderRadius: 20, backgroundColor: Colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  resetBtnText: { fontSize: 14, fontWeight: '800', color: Colors.primary },

  errorBox: { marginBottom: 32 },
  errorCard: { backgroundColor: '#FFF5F5', borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#FFE0E0' },
  errorTitle: { fontSize: 20, fontWeight: '900', color: '#FF5252', marginTop: 16 },
  errorSub: { fontSize: 14, color: '#FF5252', opacity: 0.7, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  retryBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, backgroundColor: '#FF5252' },
  retryBtnText: { color: '#fff', fontWeight: '800' },

  manualInputContainer: { marginBottom: 32 },
  inputDivider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F0F0' },
  dividerText: { fontSize: 10, fontWeight: '900', color: '#ccc', marginHorizontal: 16, letterSpacing: 1 },
  manualInputBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  manualInput: { flex: 1, height: 64, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, fontSize: 16, fontWeight: '700', color: Colors.onSurface, borderWidth: 1, borderColor: '#F0F0F0' },
  verifyBtn: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5 },


});
