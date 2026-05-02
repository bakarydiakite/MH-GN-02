import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export const SuccessScreen = ({ route, navigation }: any) => {
  const { recordId, iun } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>NaissanceChain</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications-none" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Success Icon Area */}
        <View style={styles.iconWrapper}>
           <View style={styles.iconGlow} />
           <View style={styles.mainIconContainer}>
             <MaterialIcons name="check-circle" size={80} color={Colors.primary} />
           </View>
           <View style={styles.badgeContainer}>
             <MaterialIcons name="verified" size={20} color={Colors.primary} />
           </View>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>SUCCÈS</Text>
          </View>
          <Text style={styles.successTitle}>Enregistrement Validé</Text>
          <Text style={styles.successSub}>
            L&apos;acte de naissance a été inscrit avec succès sur le registre numérique souverain de la République.
          </Text>
        </View>

        {/* Bento Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Identifiant Unique</Text>
              <View style={styles.idContainer}>
                <Text style={styles.idText}>{iun || 'EN ATTENTE'}</Text>
                <TouchableOpacity style={styles.copyBtn}>
                  <MaterialIcons name="content-copy" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.syncIndicator}>
              <View style={styles.dot} />
              <Text style={styles.syncText}>Synchronisé</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Date d&apos;émission</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleDateString('fr-FR')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Type de Document</Text>
              <Text style={styles.infoValue}>Acte Provisoire</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('DigitalProof', { recordId })}
          >
            <MaterialIcons name="description" size={20} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Voir la preuve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Main')}
          >
            <MaterialIcons name="home" size={20} color={Colors.primary} />
            <Text style={styles.secondaryBtnText}>Retour à l&apos;accueil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <MaterialIcons name="security" size={14} color={Colors.outline} />
          <Text style={styles.footerText}>CRYPTOGRAPHIE SOUVERAINE</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialIcons name="storage" size={14} color={Colors.outline} />
          <Text style={styles.footerText}>GRAND LIVRE NATIONAL</Text>
        </View>
      </View>
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
    paddingVertical: 15,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconWrapper: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary + '10',
  },
  mainIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successSub: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '33',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: 'monospace',
  },
  copyBtn: {
    padding: 4,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer + '50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceVariant,
    width: '100%',
    marginVertical: 20,
    opacity: 0.5,
  },
  bottomInfoRow: {
    flexDirection: 'row',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  actions: {
    width: '100%',
    marginTop: 40,
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 40,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.5,
  },
  footerText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.outline,
    letterSpacing: 1,
  },
});
