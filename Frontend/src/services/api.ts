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

export const apiService = {
  async getDashboardStats() {
    return request<any>('/stats/dashboard');
  },

  async getBirths() {
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
  },
};
