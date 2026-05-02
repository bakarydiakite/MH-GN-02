import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { authService, User } from '../../services/auth.service';

type MenuItemProps = {
  icon: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  badge?: string;
  danger?: boolean;
};

const MenuItem = ({ icon, label, subtitle, onPress, showArrow = true, badge, danger }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconBox, danger && styles.menuIconBoxDanger]}>
      <MaterialIcons name={icon as any} size={22} color={danger ? Colors.error : Colors.primary} />
    </View>
    <View style={styles.menuItemContent}>
      <Text style={[styles.menuItemLabel, danger && styles.menuItemLabelDanger]}>{label}</Text>
      {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
    </View>
    {badge && <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{badge}</Text></View>}
    {showArrow && !badge && <MaterialIcons name="chevron-right" size={20} color={Colors.outline} />}
  </TouchableOpacity>
);

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
    } catch (e) {
      console.error('Error loading user profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isAgent = user?.role === 'AGENT';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>NaissanceChain</Text>
        <TouchableOpacity style={styles.iconBtn}><MaterialIcons name="notifications" size={22} color={Colors.primary} /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatarWrapper}>
            <View style={styles.profileAvatar}>
              <MaterialIcons name="person" size={48} color="#fff" />
            </View>
          </View>
          <Text style={styles.profileName}>
            {user?.prenom || ''} {user?.nom || 'Utilisateur'}
          </Text>
          <Text style={styles.profileRole}>
            {user?.role === 'AGENT' ? 'Agent de Terrain' : 
             user?.role === 'FAMILLE' ? 'Compte Famille' : 
             user?.role === 'SUPERVISEUR' ? 'Superviseur' : 'Administrateur'}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>

          <View style={styles.profileBadgeRow}>
            <View style={styles.profileBadge}>
              <MaterialIcons name="verified" size={14} color={Colors.primary} />
              <Text style={styles.profileBadgeText}>Vérifié</Text>
            </View>
            <View style={styles.profileBadge}>
              <MaterialIcons name="security" size={14} color={Colors.primary} />
              <Text style={styles.profileBadgeText}>Sécurisé</Text>
            </View>
          </View>
        </View>

        {isAgent && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionLabel}>INFORMATIONS AGENT</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Statut Professionnel</Text>
              <View style={styles.statusBadgeActive}>
                <View style={styles.statusDot} />
                <Text style={styles.statusBadgeText}>Actif</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>ID Agent</Text>
              <Text style={[styles.infoValue, styles.infoValueMono]}>
                {user?.id ? user.id.substring(0, 8).toUpperCase() : 'GN-AGT-SCAN'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>SÉCURITÉ & ACCÈS</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuIconBox}><MaterialIcons name="fingerprint" size={22} color={Colors.primary} /></View>
              <View style={styles.menuItemContent}><Text style={styles.menuItemLabel}>Authentification biométrique</Text><Text style={styles.menuItemSubtitle}>Empreinte digitale ou Face ID</Text></View>
              <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primary + '60' }} thumbColor={biometricEnabled ? Colors.primary : Colors.outline} />
            </View>
            <View style={styles.menuDivider} /><MenuItem icon="lock-reset" label="Changer le mot de passe" />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>SUPPORT</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="help-outline" label="Centre d'aide" />
            <View style={styles.menuDivider} /><MenuItem icon="policy" label="Politique de confidentialité" />
            <View style={styles.menuDivider} /><MenuItem icon="info-outline" label="Version" badge="v1.0.2" showArrow={false} />
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuCard}><MenuItem icon="logout" label="Se déconnecter" danger onPress={handleLogout} /></View>
        </View>

        <View style={styles.footer}><Text style={styles.footerText}>NaissanceChain · Guinée</Text></View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  brandTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surfaceContainerLowest, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 28, padding: 28, alignItems: 'center', marginBottom: 16, elevation: 3 },
  profileAvatarWrapper: { marginBottom: 14 },
  profileAvatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#78fbb6' },
  profileName: { fontSize: 24, fontWeight: '900', color: Colors.onSurface, marginBottom: 4 },
  profileRole: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '600', marginBottom: 2 },
  profileEmail: { fontSize: 12, color: Colors.outline, marginBottom: 14 },
  profileBadgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  profileBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  profileBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  infoCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 24, padding: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 9, fontWeight: '900', color: Colors.outline, letterSpacing: 1.5, marginBottom: 14, paddingHorizontal: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  infoKey: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '600' },
  infoValue: { fontSize: 13, color: Colors.onSurface, fontWeight: '800' },
  infoValueMono: { fontFamily: 'monospace', color: Colors.primary },
  infoDivider: { height: 1, backgroundColor: Colors.surfaceContainerLow },
  statusBadgeActive: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary + '15', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  statusBadgeText: { fontSize: 11, fontWeight: '900', color: Colors.primary },
  menuSection: { marginBottom: 16 },
  menuCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuIconBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: Colors.surfaceContainerLow, justifyContent: 'center', alignItems: 'center' },
  menuIconBoxDanger: { backgroundColor: Colors.error + '15' },
  menuItemContent: { flex: 1 },
  menuItemLabel: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  menuItemLabelDanger: { color: Colors.error },
  menuItemSubtitle: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: Colors.surfaceContainerLow, marginLeft: 70 },
  menuBadge: { backgroundColor: Colors.primary + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  menuBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  footer: { alignItems: 'center', paddingTop: 16 },
  footerText: { fontSize: 12, fontWeight: '700', color: Colors.outline },
});
