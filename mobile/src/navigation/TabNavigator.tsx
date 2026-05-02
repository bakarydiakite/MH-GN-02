import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';

// Agent screens
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { HistoryScreen } from '../screens/records/HistoryScreen';
import { OfflineSyncScreen } from '../screens/family/OfflineSyncScreen';
import { VerificationScreen } from '../screens/records/VerificationScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Famille screens
import { FamilleAccueilScreen } from '../screens/family/FamilleAccueilScreen';
import { MesEnfantsScreen } from '../screens/family/MesEnfantsScreen';
import { SuiviDossierScreen } from '../screens/family/SuiviDossierScreen';


// ─── Custom FAB (Agent only — bouton central d'enregistrement) ───────────────
const CustomFABButton = ({ children, onPress }: any) => (
  <TouchableOpacity style={fabStyles.container} onPress={onPress} activeOpacity={0.8}>
    <View style={fabStyles.fab}>
      <MaterialIcons name="add" size={28} color="#004d33" />
    </View>
  </TouchableOpacity>
);

const fabStyles = StyleSheet.create({
  container: { top: -30, justifyContent: 'center', alignItems: 'center' },
  fab: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#cadaff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#cadaff', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 5,
    borderWidth: 4, borderColor: '#00261a',
  },
});

const AgentTab = createBottomTabNavigator();
const FamilleTab = createBottomTabNavigator();

// ─── Placeholder simple pour le tab FAB ──────────────────────────────────────
const EmptyScreen = () => <View style={{ flex: 1, backgroundColor: Colors.background }} />;

// ═══════════════════════════════════════════════════════════════════════════════
// 🟢 AGENT TAB NAVIGATOR
// Dashboard | Mes Dossiers | [+] Enregistrer | Sync | Profil
// ═══════════════════════════════════════════════════════════════════════════════
export const AgentTabNavigator = () => {
  return (
    <AgentTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#80f9c2',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* Dashboard */}
      <AgentTab.Screen
        name="AgentHome"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />

      {/* Mes dossiers / Historique */}
      <AgentTab.Screen
        name="AgentHistory"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Dossiers',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="folder-open" size={size} color={color} />,
        }}
      />

      {/* FAB — Nouvel enregistrement */}
      <AgentTab.Screen
        name="AgentAction"
        component={EmptyScreen}
        options={{
          tabBarButton: (props) => <CustomFABButton {...props} />,
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('RegisterBirthStep1');
          },
        })}
      />

      {/* Sync offline */}
      <AgentTab.Screen
        name="AgentSync"
        component={OfflineSyncScreen}
        options={{
          tabBarLabel: 'Sync',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="sync" size={size} color={color} />,
        }}
      />

      {/* Profil agent */}
      <AgentTab.Screen
        name="AgentProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </AgentTab.Navigator>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔵 FAMILLE TAB NAVIGATOR
// Accueil | Mes Enfants | Suivi | Vérifier | Profil
// ═══════════════════════════════════════════════════════════════════════════════
export const FamilleTabNavigator = () => {
  return (
    <FamilleTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#80f9c2',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* Portail famille accueil */}
      <FamilleTab.Screen
        name="FamilleHome"
        component={FamilleAccueilScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />

      {/* Liste des enfants */}
      <FamilleTab.Screen
        name="FamilleEnfants"
        component={MesEnfantsScreen}
        options={{
          tabBarLabel: 'Mes Enfants',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="child-care" size={size} color={color} />,
        }}
      />

      {/* Suivi de dossier */}
      <FamilleTab.Screen
        name="FamilleSuivi"
        component={SuiviDossierScreen}
        options={{
          tabBarLabel: 'Suivi',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="timeline" size={size} color={color} />,
        }}
      />

      {/* Vérification acte */}
      <FamilleTab.Screen
        name="FamilleVerif"
        component={VerificationScreen}
        options={{
          tabBarLabel: 'Vérifier',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="qr-code-scanner" size={size} color={color} />,
        }}
      />

      {/* Profil famille */}
      <FamilleTab.Screen
        name="FamilleProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </FamilleTab.Navigator>
  );
};

// ─── Legacy export (for backwards compat) ────────────────────────────────────
export const TabNavigator = AgentTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: '#00261a',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    borderRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    paddingBottom: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 10,
  },
});
