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
import { View, StyleSheet, Platform } from 'react-native';

import { birthService } from './src/services/birth.service';

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
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const drafts = await birthService.getDrafts();
        if (drafts.length > 0) {
          const isConnected = await birthService.checkConnection();
          if (isConnected) {
            console.log(`[AutoSync] Déclenchement de la synchro pour ${drafts.length} brouillons...`);
            await birthService.syncDrafts();
          }
        }
      } catch (e) {
        // Silent fail for background sync
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
        <BirthProvider>
          <View style={styles.webContainer}>
            <View style={styles.webContent}>
              {content}
            </View>
          </View>
        </BirthProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <BirthProvider>
        {content}
      </BirthProvider>
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
