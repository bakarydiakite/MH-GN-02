/**
 * Service pour la gestion des naissances sur Mobile
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadService } from './upload.service';
import { API_BASE_URL } from '../config/api.config';

// const API_URL = 'https://naissancechain-api.onrender.com';
const API_URL = API_BASE_URL;

export interface CreateBirthData {
  // --- ENFANT ---
  prenomsEnfant: string;
  nomEnfant: string;
  dateNaissanceEnfant: string;
  heureNaissanceEnfant: string;
  sexeEnfant: 'MASCULIN' | 'FEMININ';
  nationaliteEnfant: string;
  
  // Lieu Naissance
  regionNaissance: string;
  prefectureNaissance: string;
  sousPrefectureNaissance: string;
  villageNaissance?: string;
  lieuNaissanceLibelle?: string;

  // --- PÈRE ---
  nomPere?: string;
  dateNaissancePere?: string;
  professionPere?: string;
  nationalitePere?: string;
  idNationalPere?: string;
  cniPere?: string;
  telephonePere?: string;

  // --- MÈRE ---
  nomMere: string;
  dateNaissanceMere?: string;
  professionMere?: string;
  nationaliteMere?: string;
  idNationalMere?: string;
  cniMere?: string;
  telephoneMere?: string;

  // Adresse Parents
  regionParents: string;
  prefectureParents: string;
  sousPrefectureParents: string;
  quartierParents: string;
  secteurParents?: string;

  // --- DÉCLARANT ---
  nomDeclarant: string;
  idNationalDeclarant?: string;
  cniDeclarant?: string;
  lienParenteDeclarant: string;

  // --- OFFICIER ---
  officierNom?: string;

  // --- PIÈCES JOINTES (Base64) ---
  carnetMaternite?: string;
  cniMerePhoto?: string;
  cniPerePhoto?: string;
  acteMariagePhoto?: string;
}

class BirthService {
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/`, { method: 'GET' });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async registerBirth(data: CreateBirthData): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/births`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur serveur (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error('[BirthService] Erreur:', error);
      throw error;
    }
  }

  async getRecentBirths(): Promise<any[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/births?limit=50`, { headers });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('[BirthService] getRecentBirths Erreur:', error);
      return [];
    }
  }

  async getStats(): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/stats/dashboard`, { headers });
      if (!response.ok) return { totalMois: 0 };
      const data = await response.json();
      return data || { totalMois: 0 };
    } catch (error) {
      console.error('[BirthService] getStats Erreur:', error);
      return { totalMois: 0 };
    }
  }

  async getBirthRecord(id: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/births/${id}`, { headers });
      if (!response.ok) throw new Error('Acte non trouvé');
      return await response.json();
    } catch (error) {
      console.error('[BirthService] getBirthRecord Erreur:', error);
      throw error;
    }
  }

  // ─── GESTION DES BROUILLONS (OFFLINE) ──────────────────────────────────
  
  private readonly DRAFTS_KEY = 'birth_drafts';

  async saveDraft(data: CreateBirthData): Promise<void> {
    try {
      const drafts = await this.getDrafts();
      drafts.push({ ...data, id_local: Date.now().toString(), status: 'brouillon' });
      await AsyncStorage.setItem(this.DRAFTS_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('[BirthService] saveDraft error:', error);
    }
  }

  async getDrafts(): Promise<any[]> {
    try {
      const draftsStr = await AsyncStorage.getItem(this.DRAFTS_KEY);
      return draftsStr ? JSON.parse(draftsStr) : [];
    } catch (error) {
      console.error('[BirthService] getDrafts error:', error);
      return [];
    }
  }

  async deleteDraft(id: string): Promise<void> {
    try {
      const drafts = await this.getDrafts();
      const filtered = drafts.filter(d => d.id_local !== id);
      await AsyncStorage.setItem(this.DRAFTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('[BirthService] deleteDraft error:', error);
    }
  }

  /**
   * Synchronise tous les brouillons locaux
   * @param onProgress Callback pour suivre l'avancement
   */
  async syncDrafts(onProgress?: (current: number, total: number) => void): Promise<{ success: number, failed: number }> {
    const drafts = await this.getDrafts();
    if (drafts.length === 0) return { success: 0, failed: 0 };

    let successCount = 0;
    let failedCount = 0;

    const isConnected = await this.checkConnection();
    if (!isConnected) throw new Error('Pas de connexion internet');

    for (let i = 0; i < drafts.length; i++) {
      const draft = drafts[i];
      try {
        // 1. Upload des images vers Supabase si nécessaire
        const photosToUpload = [
          { key: 'carnetMaternite', uri: draft.carnetMaternite },
          { key: 'cniMerePhoto', uri: draft.cniMerePhoto },
          { key: 'cniPerePhoto', uri: draft.cniPerePhoto },
          { key: 'acteMariagePhoto', uri: draft.acteMariagePhoto },
        ];

        const uploadedPhotos: any = {};
        for (const photo of photosToUpload) {
          if (photo.uri && photo.uri.startsWith('file://')) {
            const url = await uploadService.uploadImage(photo.uri, photo.key as any);
            uploadedPhotos[photo.key] = url;
          } else {
            uploadedPhotos[photo.key] = photo.uri;
          }
        }

        // 2. Envoi au backend
        const token = await AsyncStorage.getItem('token');
        
        // Nettoyage des données pour le DTO du backend
        const { id_local, status, attachments, ...cleanDraft } = draft;

        // Helper pour convertir JJ/MM/AAAA -> AAAA-MM-DD
        const toIsoDate = (dateStr?: string) => {
          if (!dateStr || !dateStr.includes('/')) return dateStr;
          const [d, m, y] = dateStr.split('/');
          return `${y}-${m}-${d}`;
        };
        
        const response = await fetch(`${API_URL}/births`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...cleanDraft,
            ...uploadedPhotos,
            dateNaissanceEnfant: toIsoDate(cleanDraft.dateNaissanceEnfant),
            dateNaissanceMere: toIsoDate(cleanDraft.dateNaissanceMere),
            dateNaissancePere: toIsoDate(cleanDraft.dateNaissancePere),
          })
        });

        if (!response.ok) {
          // Erreur d'authentification - arrêter la sync
          if (response.status === 401) {
            throw new Error('Unauthorized');
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur serveur (${response.status})`);
        }

        // 3. Suppression du brouillon si succès
        await this.deleteDraft(draft.id_local);
        successCount++;
      } catch (error: any) {
        console.error(`Sync failed for draft ${draft.id_local}:`, error);
        
        // Si erreur d'authentification, arrêter la sync
        if (error.message === 'Unauthorized') {
          throw error;
        }
        failedCount++;
      }

      if (onProgress) onProgress(i + 1, drafts.length);
    }

    return { success: successCount, failed: failedCount };
  }

  /**
   * Lie un enfant à l'utilisateur actuel via son IUN
   */
  async linkChildToUser(iun: string): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/births/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ iun })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la liaison');
      }

      return await response.json();
    } catch (error) {
      console.error('[BirthService] linkChildToUser error:', error);
      throw error;
    }
  }

  async verifyByIun(iun: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/births/verify/${iun}`);
      if (!response.ok) {
        throw new Error('Acte non trouvé ou invalide');
      }
      return await response.json();
    } catch (error) {
      console.error('[BirthService] verifyByIun error:', error);
      throw error;
    }
  }
}

export const birthService = new BirthService();
