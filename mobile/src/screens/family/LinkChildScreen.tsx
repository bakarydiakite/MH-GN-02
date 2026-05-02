import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { birthService } from '../../services/birth.service';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const LinkChildScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iun, setIun] = useState('');
  const [mode, setMode] = useState<'qr' | 'manual'>('qr');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    handleLink(data);
  };

  const handleLink = async (scannedIun: string) => {
    const codeToUse = scannedIun || iun;
    if (!codeToUse) {
      Alert.alert('Erreur', 'Veuillez saisir un code IUN valide.');
      setScanned(false);
      return;
    }

    setLoading(true);
    try {
      await birthService.linkChildToUser(codeToUse);
      Alert.alert('Succès 🎉', 'L\'enfant a été lié à votre compte avec succès !', [
        { text: 'Voir mes enfants', onPress: () => navigation.navigate('MesEnfants') }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de lier cet enfant.');
      setScanned(false);
    } finally {
      setLoading(true);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', padding: 20 }}>
          Nous avons besoin de votre permission pour utiliser la caméra.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: '#fff' }}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lier un enfant</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.modeTabs}>
        <TouchableOpacity 
          style={[styles.tab, mode === 'qr' && styles.activeTab]} 
          onPress={() => setMode('qr')}
        >
          <MaterialIcons name="qr-code-scanner" size={20} color={mode === 'qr' ? Colors.primary : '#666'} />
          <Text style={[styles.tabText, mode === 'qr' && styles.activeTabText]}>Scanner QR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mode === 'manual' && styles.activeTab]} 
          onPress={() => setMode('manual')}
        >
          <MaterialIcons name="edit" size={20} color={mode === 'manual' ? Colors.primary : '#666'} />
          <Text style={[styles.tabText, mode === 'manual' && styles.activeTabText]}>Saisie manuelle</Text>
        </TouchableOpacity>
      </View>

      {mode === 'qr' ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
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
          <Text style={styles.hint}>Placez le QR Code de l'acte de naissance dans le carré</Text>
        </View>
      ) : (
        <View style={styles.manualContainer}>
          <Text style={styles.label}>Identifiant Unique National (IUN)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: GN-2026-XXXXXX"
            value={iun}
            onChangeText={setIun}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
            onPress={() => handleLink(iun)}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Vérifier et Lier</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  backBtn: { padding: 8 },
  modeTabs: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 15, 
    padding: 4,
    marginBottom: 20
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10,
    gap: 8,
    borderRadius: 12
  },
  activeTab: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabText: { fontSize: 13, fontWeight: '700', color: '#666' },
  activeTabText: { color: Colors.primary },
  cameraContainer: { flex: 1, alignItems: 'center' },
  camera: { width: width * 0.85, height: width * 0.85, borderRadius: 24, overflow: 'hidden' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  middleContainer: { flexDirection: 'row', height: 200 },
  focusedContainer: { flex: 2, borderColor: '#fff', borderWidth: 2, borderRadius: 20 },
  hint: { marginTop: 30, textAlign: 'center', color: '#666', paddingHorizontal: 40 },
  manualContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 15, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#eee', marginBottom: 20 },
  submitBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  btn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 10, alignSelf: 'center' },
});
