import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

/**
 * Main Entry Point
 * Points to the RootNavigator to keep App.tsx clean and simple.
 * Follows the Single Responsibility Principle.
 */
import { BirthProvider } from './src/store/BirthContext';
import { NotificationProvider } from './src/store/NotificationContext';
import { View, StyleSheet, Platform } from 'react-native';
import { GlobalToastContainer } from './src/components/shared/Toast';
import { useNotification } from './src/store/NotificationContext';

import { birthService } from './src/services/birth.service';
import { authService } from './src/services/auth.service';
import { API_BASE_URL } from './src/config/api.config';

// Correctif global pour le curseur sur le Web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    [role="button"], 
    [data-focusable="true"], 
    button, 
    a {
      cursor: pointer !important;
    }
  `;
  document.head.append(style);
}

const BackgroundSync = () => {
  const { showNotification } = useNotification();

  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Vérifier d'abord si l'utilisateur est connecté
        const token = await authService.getToken();
        if (!token) {
          return; // Pas de token, pas de sync
        }
        
        // Vérifier la validité du token
        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!verifyResponse.ok) {
            // Token invalide, déconnecter l'utilisateur
            console.log('[AutoSync] Token invalide, déconnexion...');
            await authService.logout();
            showNotification("Votre session a expiré. Veuillez vous reconnecter.", "warning");
            return;
          }
        } catch (e) {
          // Erreur réseau, on continue quand même (mode offline)
          console.log('[AutoSync] Erreur réseau, sync annulée');
          return;
        }
        
        const drafts = await birthService.getDrafts();
        if (drafts.length > 0) {
          const isConnected = await birthService.checkConnection();
          if (isConnected) {
            console.log(`[AutoSync] Déclenchement de la synchro pour ${drafts.length} brouillons...`);
            const result = await birthService.syncDrafts();
            
            if (result.success > 0) {
              showNotification(`${result.success} enregistrement(s) synchronisé(s) avec succès !`, "success");
            }
            
            if (result.failed > 0) {
              showNotification(`Échec de la synchro pour ${result.failed} brouillon(s).`, "error");
            }
          }
        }
      } catch (e) {
        // Silent fail for background sync
        console.log('[AutoSync] Erreur:', e);
      }
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default function App() {
  const content = (
    <>
      <BackgroundSync />
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
      <NotificationProvider>
        <BirthProvider>
          <View style={styles.webContainer}>
            <View style={styles.webContent}>
              {content}
            </View>
          </View>
          <GlobalToastContainer />
        </BirthProvider>
      </NotificationProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <BirthProvider>
          {content}
          <GlobalToastContainer />
        </BirthProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore
    pointerEvents: 'box-none',
  },
  webContent: {
    width: '100%',
    maxWidth: 420,
    height: '90%',
    maxHeight: 850,
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 10,
    borderColor: '#222',
    overflow: 'hidden',
    // @ts-ignore
    boxShadow: '0 20px 30px rgba(0,0,0,0.6)',
    // @ts-ignore
    cursor: 'default',
    // @ts-ignore
    pointerEvents: 'auto',
  },
});
