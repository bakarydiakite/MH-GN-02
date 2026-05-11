// Utiliser VITE_API_URL pour le local, sinon localhost par défaut
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper pour obtenir le token JWT
const getAuthToken = () => localStorage.getItem('token');

// Helper pour les headers avec authentification
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

export const apiService = {
  /**
   * Récupère les statistiques globales pour le dashboard
   */
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  },

  /**
   * Récupère la liste de tous les dossiers de naissance
   */
  async getBirths() {
    try {
      const response = await fetch(`${API_BASE_URL}/births`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        return data;
      }
      // Si data a une propriété data qui est un tableau
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      // Sinon retourner un tableau vide
      console.warn('getBirths: réponse inattendue', data);
      return [];
    } catch (error) {
      console.error('Erreur getBirths:', error);
      return [];
    }
  },

  /**
   * Récupère les dossiers en attente de validation
   */
  async getPendingBirths() {
    try {
      const response = await fetch(`${API_BASE_URL}/births/pending`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur getPendingBirths:', error);
      return [];
    }
  },

  /**
   * Récupère les dossiers par statut
   */
  async getBirthsByStatus(status: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/births/by-status/${status}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur getBirthsByStatus:', error);
      return [];
    }
  },

  /**
   * Valide un dossier et l'ancre sur la blockchain
   */
  async validateBirth(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/births/${id}/validate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erreur HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur validateBirth:', error);
      throw error;
    }
  },

  /**
   * Rejette un dossier avec un motif
   */
  async rejectBirth(id: string, motif: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/births/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ commentaireRejet: motif }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erreur HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur rejectBirth:', error);
      throw error;
    }
  },

  /**
   * Vérifie si un acte est ancré sur la blockchain
   */
  async verifyBirthOnBlockchain(hash: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/blockchain/verify/${hash}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur Blockchain API:', error);
      return { verified: false, mode: 'error' };
    }
  }
};
