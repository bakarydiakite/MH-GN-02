<<<<<<< HEAD
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

const TOKEN_KEY = 'naissancechain_admin_token';
const USER_KEY = 'naissancechain_admin_user';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = authService.getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || `Erreur HTTP: ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return payload as T;
}

export type AdminUser = {
  id: string;
  email?: string;
  nom: string;
  prenom?: string;
  role: string;
};

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AdminUser | null {
    const rawUser = localStorage.getItem(USER_KEY);
    return rawUser ? (JSON.parse(rawUser) as AdminUser) : null;
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  async login(email: string, password: string) {
    const data = await request<{ access_token: string; user: AdminUser }>('/auth/admin/login', {
      auth: false,
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async registerAdmin(input: {
    nom: string;
    prenom?: string;
    email: string;
    telephone?: string;
    password: string;
  }) {
    const data = await request<{ access_token: string; user: AdminUser }>('/auth/admin/register', {
      auth: false,
      method: 'POST',
      body: JSON.stringify(input),
    });

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async me() {
    const user = await request<AdminUser>('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
=======
// Utiliser VITE_API_URL pour le local, sinon localhost par défaut
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper pour obtenir le token JWT
const getAuthToken = () => localStorage.getItem('token');

// Helper pour les headers avec authentification
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e

export const apiService = {
  async getDashboardStats() {
<<<<<<< HEAD
    return request<any>('/stats/dashboard');
=======
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
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
  },

  async getBirths() {
<<<<<<< HEAD
    const data = await request<any>('/births');

    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  },

  async validateBirth(id: string) {
    return request<any>(`/births/${id}/validate`, {
      method: 'POST',
    });
  },

  async verifyBirth(reference: string) {
    return request<any>(`/births/verify/${encodeURIComponent(reference)}`, {
      auth: false,
    });
  },

  async verifyBirthOnBlockchain(hash: string) {
    return request<any>(`/blockchain/verify/${encodeURIComponent(hash)}`, {
      auth: false,
    });
=======
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
        body: JSON.stringify({ motif }),
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
  },

  /**
   * Carte terrain (admin / superviseur uniquement, hors vérificateur — cahier des charges).
   * Query optionnelle : `?from=2026-01-01&to=2026-12-31` (ISO date).
   */
  async getFieldMap(queryString = '') {
    const response = await fetch(`${API_BASE_URL}/stats/field-map${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  },

  /** Recherche de lieux en Guinée (Nominatim via backend). Admin / superviseur. */
  async geocodeGuinea(q: string) {
    const response = await fetch(`${API_BASE_URL}/stats/geocode?q=${encodeURIComponent(q)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json() as Promise<{
      results: { lat: number; lng: number; displayName: string }[];
    }>;
  },

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  },

  async patchMe(body: {
    prenom?: string;
    nom?: string;
    telephone?: string;
    photoUrl?: string;
    password?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  },

  async getBirth(id: string) {
    const response = await fetch(`${API_BASE_URL}/births/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  },

  async linkBirthIun(iun: string) {
    const response = await fetch(`${API_BASE_URL}/births/link`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ iun }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  },

  async getAgentRejections() {
    const response = await fetch(`${API_BASE_URL}/births/agent/rejections`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async resubmitBirth(id: string) {
    const response = await fetch(`${API_BASE_URL}/births/${id}/resubmit`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  },

  async patchRejectedBirth(id: string, body: Record<string, unknown>) {
    const response = await fetch(`${API_BASE_URL}/births/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
>>>>>>> 147c53fee3b35f3abc4900c392072781bff9eb1e
  },
};
