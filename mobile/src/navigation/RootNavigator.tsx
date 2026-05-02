import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
// Two separate Tab Navigators — one per role
import { AgentTabNavigator, FamilleTabNavigator } from './TabNavigator';
// Records / Birth Registration
import { RegisterBirthStep1 } from '../screens/records/RegisterBirthStep1';
import { RegisterBirthStep2 } from '../screens/records/RegisterBirthStep2';
import { RegisterBirthStep3 } from '../screens/records/RegisterBirthStep3';
import { RegisterBirthStep4 } from '../screens/records/RegisterBirthStep4';
import { RegisterBirthStep5 } from '../screens/records/RegisterBirthStep5';
import { ReviewConfirmationScreen } from '../screens/records/ReviewConfirmationScreen';
import { SuccessScreen } from '../screens/records/SuccessScreen';
import { DigitalProofScreen } from '../screens/records/DigitalProofScreen';
import { HistoryScreen } from '../screens/records/HistoryScreen';
import { VerificationScreen } from '../screens/records/VerificationScreen';
// Family screens (accessible as modal/stack from both navigators)
import { FamilleAccueilScreen } from '../screens/family/FamilleAccueilScreen';
import { MesEnfantsScreen } from '../screens/family/MesEnfantsScreen';
import { SuiviDossierScreen } from '../screens/family/SuiviDossierScreen';
import { OfflineSyncScreen } from '../screens/family/OfflineSyncScreen';
import { LinkChildScreen } from '../screens/family/LinkChildScreen';
// Profile
import { ProfileScreen } from '../screens/profile/ProfileScreen';

import { SplashScreen } from '../screens/SplashScreen';

// ─── Type definitions ─────────────────────────────────────────────────────────
export type RootStackParamList = {
  // Init
  Splash: undefined;
  // Auth
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  // Main apps (role-based routing)
  MainAgent: undefined;    // 🟢 Agent de terrain → AgentTabNavigator
  MainFamille: undefined;  // 🔵 Famille → FamilleTabNavigator
  Main: undefined;         // legacy fallback
  // ... rest same
};

const Stack = createNativeStackNavigator<any>(); // Simplified for dynamic routing

/**
 * Root Navigator
 * Routing conditionnel selon le rôle choisi à l'inscription :
 *   - AGENT  → MainAgent  → AgentTabNavigator
 *   - FAMILLE → MainFamille → FamilleTabNavigator
 */
export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* ── Init ────────────────────────────────────── */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* ── Auth Stack ───────────────────────────────── */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ animation: 'slide_from_bottom' }}
        />

        {/* ── Main Apps (Role-based) ───────────────────── */}
        {/* 🟢 Agent de terrain */}
        <Stack.Screen
          name="MainAgent"
          component={AgentTabNavigator}
          options={{ animation: 'fade' }}
        />
        {/* 🔵 Famille */}
        <Stack.Screen
          name="MainFamille"
          component={FamilleTabNavigator}
          options={{ animation: 'fade' }}
        />
        {/* Legacy fallback */}
        <Stack.Screen
          name="Main"
          component={AgentTabNavigator}
          options={{ animation: 'fade' }}
        />

        {/* ── Birth Registration Flow ───────────────────── */}
        <Stack.Screen
          name="RegisterBirthStep1"
          component={RegisterBirthStep1}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RegisterBirthStep2"
          component={RegisterBirthStep2}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RegisterBirthStep3"
          component={RegisterBirthStep3}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RegisterBirthStep4"
          component={RegisterBirthStep4}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RegisterBirthStep5"
          component={RegisterBirthStep5}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ReviewConfirmation"
          component={ReviewConfirmationScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="DigitalProof"
          component={DigitalProofScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{ animation: 'slide_from_right' }}
        />

        {/* ── Family Screens (accessible depuis les deux apps) ── */}
        <Stack.Screen
          name="FamilleAccueil"
          component={FamilleAccueilScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="MesEnfants"
          component={MesEnfantsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="SuiviDossier"
          component={SuiviDossierScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="OfflineSync"
          component={OfflineSyncScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="LinkChild"
          component={LinkChildScreen}
          options={{ animation: 'slide_from_bottom' }}
        />

        {/* ── Profile ─────────────────────────────────── */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
