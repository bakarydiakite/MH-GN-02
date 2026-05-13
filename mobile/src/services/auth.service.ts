import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api.config';

const API_URL = API_BASE_URL;

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  role: 'ADMINISTRATEUR' | 'SUPERVISEUR' | 'VERIFICATEUR' | 'AGENT' | 'FAMILLE';
  photoUrl?: string;
  telephone?: string;
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
  googleLogin(idToken: string): Promise<AuthResponse>;
  updateProfile(data: { prenom?: string, nom?: string, telephone?: string, photoUrl?: string }): Promise<User>;
  uploadImage(base64: string): Promise<string>;
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

  async googleLogin(idToken: string): Promise<AuthResponse> {
    // Placeholder for Google Login - to be implemented with Expo Auth Session
    console.log('Google Login with token:', idToken);
    throw new Error('Google Login non configuré sur ce build');
  }

  async updateProfile(data: { prenom?: string, nom?: string, telephone?: string, photoUrl?: string }): Promise<User> {
    try {
      const token = await this.getToken();
      if (!token) throw new Error('Non authentifié');

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Erreur lors de la mise à jour du profil' }));
        throw new Error(err.message || 'Erreur lors de la mise à jour du profil');
      }

      const updatedUser: User = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(base64: string): Promise<string> {
    try {
      const token = await this.getToken();
      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ base64, filename: `profile_${Date.now()}.jpg` }),
      });

      if (!response.ok) throw new Error('Erreur upload image');
      const result = await response.json();
      return result.url;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
