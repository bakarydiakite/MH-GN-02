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
  Image as RNImage,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { authService, User } from '../../services/auth.service';
import * as ImagePicker from 'expo-image-picker';

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
      <Feather name={icon as any} size={20} color={danger ? '#FF5252' : '#555'} />
    </View>
    <View style={styles.menuItemContent}>
      <Text style={[styles.menuItemLabel, danger && styles.menuItemLabelDanger]}>{label}</Text>
      {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
    </View>
    {badge && <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{badge}</Text></View>}
    {showArrow && !badge && <Feather name="chevron-right" size={18} color="#ccc" />}
  </TouchableOpacity>
);

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const [tempPrenom, setTempPrenom] = useState('');
  const [tempNom, setTempNom] = useState('');
  const [tempTelephone, setTempTelephone] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
      if (userData) {
        setTempPrenom(userData.prenom || '');
        setTempNom(userData.nom || '');
        setTempTelephone(userData.telephone || '');
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setIsSaving(true);
      try {
        console.log('Uploading photo...');
        const imageUrl = await authService.uploadImage(result.assets[0].base64);
        console.log('Photo uploaded, updating profile...', imageUrl);
        const updatedUser = await authService.updateProfile({ photoUrl: imageUrl });
        setUser(updatedUser);
        Alert.alert('Succès', 'Photo de profil mise à jour');
      } catch (e: any) {
        console.error('Photo update error:', e);
        Alert.alert('Erreur', `Impossible de mettre à jour la photo: ${e.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!tempNom.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving profile...', { tempPrenom, tempNom, tempTelephone });
      const updatedUser = await authService.updateProfile({
        prenom: tempPrenom,
        nom: tempNom,
        telephone: tempTelephone,
      });
      console.log('Profile saved successfully');
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (e: any) {
      console.error('Save profile error:', e);
      Alert.alert('Erreur', `Impossible de mettre à jour le profil: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isAgent = user?.role === 'AGENT';
  const roleLabel = isAgent ? "Agent de l'État" : "Compte Citoyen";
  const badgeColor = isAgent ? '#F5D142' : '#006948';
  const badgeTextColor = isAgent ? '#000' : '#fff';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutTopText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={handlePickImage} disabled={isSaving}>
                  <RNImage 
                    source={{ uri: user?.photoUrl || 'https://i.pravatar.cc/200?u=' + (user?.id || 'agent') }} 
                    style={styles.avatarLarge} 
                  />
                  {isSaving && (
                    <View style={styles.avatarLoadingOverlay}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                  <View style={styles.photoEditBadge}>
                    <Feather name="camera" size={12} color="#fff" />
                  </View>
                </TouchableOpacity>
                
                {!isEditing ? (
                  <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setIsEditing(true)}>
                    <Feather name="edit-2" size={14} color={Colors.primary} />
                    <Text style={styles.editText}>Edit Info</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.editAvatarBtn, { backgroundColor: Colors.primary }]} 
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Feather name="check" size={14} color="#fff" />
                        <Text style={[styles.editText, { color: '#fff' }]}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {isEditing ? (
                <View style={styles.editForm}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Prénom</Text>
                    <TextInput 
                      style={styles.editInput} 
                      value={tempPrenom} 
                      onChangeText={setTempPrenom}
                      placeholder="Prénom"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Nom *</Text>
                    <TextInput 
                      style={styles.editInput} 
                      value={tempNom} 
                      onChangeText={setTempNom}
                      placeholder="Nom"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Téléphone</Text>
                    <TextInput 
                      style={styles.editInput} 
                      value={tempTelephone} 
                      onChangeText={setTempTelephone}
                      placeholder="Ex: +224 6XX XX XX XX"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>
                  <TouchableOpacity onPress={() => { setIsEditing(false); setTempPrenom(user?.prenom || ''); setTempNom(user?.nom || ''); setTempTelephone(user?.telephone || ''); }}>
                    <Text style={styles.cancelText}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.userDisplay}>
                  <Text style={styles.userNameText}>{user?.prenom} {user?.nom}</Text>
                  <Text style={styles.userEmailText}>{user?.email}</Text>
                </View>
              )}
              
              <View style={[styles.memberBadge, { backgroundColor: badgeColor }]}>
                <View style={[styles.checkCircle, { backgroundColor: isAgent ? '#000' : '#fff' }]}>
                  <MaterialIcons name="check" size={12} color={isAgent ? '#fff' : '#006948'} />
                </View>
                <Text style={[styles.memberBadgeText, { color: badgeTextColor }]}>{roleLabel}</Text>
              </View>
            </View>

            {/* Settings Section */}
            <Text style={styles.settingsLabel}>Settings</Text>
            <View style={styles.settingsCard}>
              {isAgent ? (
                <MenuItem icon="file-plus" label="Nouvel Enregistrement" onPress={() => navigation.navigate('RegisterBirthStep1')} />
              ) : (
                <MenuItem icon="users" label="Mes Enfants" onPress={() => navigation.navigate('MesEnfants')} />
              )}
              
              <View style={styles.menuDivider} />
              <MenuItem icon="file-text" label={isAgent ? "Mes Rapports" : "Mes Dossiers"} onPress={() => !isAgent && navigation.navigate('SuiviDossier')} />
              
              <View style={styles.menuDivider} />
              <MenuItem icon="bell" label="Notifications" />
              
              <View style={styles.menuDivider} />
              <MenuItem icon="globe" label="Langue" subtitle="Français" />
              
              <View style={styles.menuDivider} />
              <View style={styles.menuItem}>
                <View style={styles.menuIconBox}>
                  <Feather name="maximize" size={20} color="#555" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemLabel}>Face Id</Text>
                </View>
                <Switch 
                  value={biometricEnabled} 
                  onValueChange={setBiometricEnabled} 
                  trackColor={{ false: '#eee', true: Colors.primary + '40' }}
                  thumbColor={biometricEnabled ? Colors.primary : '#ccc'}
                />
              </View>

              <View style={styles.menuDivider} />
              <MenuItem icon="sun" label="Thème" subtitle="Clair" />
              
              <View style={styles.menuDivider} />
              <MenuItem icon="info" label="Conditions d'utilisation" />
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9F9FB' },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  logoutTopText: { fontSize: 16, fontWeight: '600', color: '#FF4D4D' },

  scrollContent: { paddingHorizontal: 24, paddingTop: 20 },

  profileSection: { alignItems: 'center', marginBottom: 40 },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatarLarge: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E0E0E0' },
  avatarLoadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
  photoEditBadge: { position: 'absolute', top: 5, right: 5, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  
  editAvatarBtn: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  editText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  userDisplay: { alignItems: 'center', marginBottom: 15 },
  userNameText: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  userEmailText: { fontSize: 13, color: '#999', fontWeight: '500' },

  editForm: { width: '100%', alignItems: 'center', gap: 15, marginBottom: 25 },
  inputWrapper: { width: '90%' },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#BBB', marginBottom: 5, textTransform: 'uppercase', marginLeft: 5 },
  editInput: { 
    width: '100%', 
    height: 48, 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  cancelText: { color: '#999', fontWeight: '700', fontSize: 14, marginTop: 5 },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberBadgeText: { fontSize: 13, fontWeight: '700' },

  settingsLabel: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  settingsCard: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 4,
  },

  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  menuIconBox: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: '#F5F6F8', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  menuItemContent: { flex: 1 },
  menuItemLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  menuItemSubtitle: { fontSize: 13, color: '#999', fontWeight: '500' },
  menuDivider: { height: 1, backgroundColor: '#F5F6F8', marginHorizontal: 16 },

  menuBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  menuBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
});
