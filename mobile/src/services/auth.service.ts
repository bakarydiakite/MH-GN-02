import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://naissancechain-api.onrender.com';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  role: 'ADMINISTRATEUR' | 'SUPERVISEUR' | 'VERIFICATEUR' | 'AGENT' | 'FAMILLE';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface IAuthService {
  login(email: string, pass: string): Promise<AuthResponse>;
  register(data: any): Promise<AuthResponse>;
  logout(): Promise<void>;
  getToken(): Promise<string | null>;
  getUser(): Promise<User | null>;
}

class AuthService implements IAuthService {
  async register(data: { 
    prenom: string, 
    nom: string, 
    email: string, 
    password: string, 
    telephone: string, 
    role: 'AGENT' | 'FAMILLE',
    matricule?: string,
    fonction?: string,
    centerId?: string,
    nin?: string
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erreur lors de l\'inscription');
      }

      const authData: AuthResponse = await response.json();
      await this.saveAuthData(authData);
      return authData;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, pass: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Identifiants invalides');
      }

      const authData: AuthResponse = await response.json();
      await this.saveAuthData(authData);
      return authData;
    } catch (error) {
      throw error;
    }
  }

  private async saveAuthData(data: AuthResponse) {
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  async getUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authService = new AuthService();
