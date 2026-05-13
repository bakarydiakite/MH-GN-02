/**
 * Configuration de l'API
 * 
 * Pour tester en LOCAL : changer USE_LOCAL_API à true
 * Pour la PRODUCTION : changer USE_LOCAL_API à false
 */

import Constants from 'expo-constants';

// ⚠️ CHANGER ICI POUR LES TESTS LOCAUX ⚠️
const USE_LOCAL_API = true; // true = localhost, false = production

// URLs
const LOCAL_API_URL = 'http://192.168.1.127:3000';
const PRODUCTION_API_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://naissancechain-api.onrender.com';

// URL active
export const API_BASE_URL = USE_LOCAL_API ? LOCAL_API_URL : PRODUCTION_API_URL;

// Log pour debug
console.log(`🔗 API URL: ${API_BASE_URL} (${USE_LOCAL_API ? 'LOCAL' : 'PRODUCTION'})`);
