const API_BASE_URL = 'https://naissancechain-api.onrender.com';

export const apiService = {
  /**
   * Récupère les statistiques globales pour le dashboard
   */
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Note : On ajoutera le token d'authentification ici plus tard
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des stats');
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
      const response = await fetch(`${API_BASE_URL}/births`);
      return await response.json();
    } catch (error) {
      console.error('Erreur getBirths:', error);
      return [];
    }
  },

  /**
   * Valide un dossier et l'ancre sur la blockchain
   */
  async validateBirth(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/births/${id}/validate`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur validateBirth:', error);
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
