import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'ADMINISTRATEUR' | 'SUPERVISEUR' | 'VERIFICATEUR' | 'AGENT' | 'FAMILLE';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  telephone?: string | null;
  role: UserRole;
  centreId?: string;
  centreNom?: string;
  photoUrl?: string;
}

// Configuration des redirections par rôle
export const ROLE_ROUTES: Record<UserRole, { dashboard: string; label: string; description: string }> = {
  'ADMINISTRATEUR': {
    dashboard: '/admin',
    label: 'Administration',
    description: 'Gestion du système'
  },
  'SUPERVISEUR': {
    dashboard: '/admin',
    label: 'Supervision',
    description: 'Validation des actes'
  },
  'VERIFICATEUR': {
    dashboard: '/admin',
    label: 'Vérification',
    description: 'Consultation des actes'
  },
  'AGENT': {
    dashboard: '/mobile', // Redirection vers l'app mobile
    label: 'Agent',
    description: 'Enregistrement mobile'
  },
  'FAMILLE': {
    dashboard: '/mobile',
    label: 'Famille',
    description: 'Application mobile uniquement',
  },
};

/** Rôles autorisés sur le portail web (administration & partenaires). */
export const WEB_PORTAL_ROLES: UserRole[] = ['ADMINISTRATEUR', 'SUPERVISEUR', 'VERIFICATEUR'];

export interface RegisterVerifierPayload {
  email: string;
  password: string;
  nom: string;
  prenom?: string;
  telephone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ redirectPath: string }>;
  registerVerifier: (payload: RegisterVerifierPayload) => Promise<{ redirectPath: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe au chargement
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ redirectPath: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de connexion');
      }

      const data = await response.json();
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.access_token);
      setUser(data.user);

      // Retourner le chemin de redirection selon le rôle
      const userRole = data.user.role as UserRole;
      const redirectPath = ROLE_ROUTES[userRole]?.dashboard || '/admin';
      return { redirectPath };
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  };

  /** Inscription web : compte institutionnel (rôle vérificateur côté serveur). */
  const registerVerifier = async (
    payload: RegisterVerifierPayload,
  ): Promise<{ redirectPath: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        role: 'VERIFICATEUR',
      }),
    });

    if (!response.ok) {
      let message = 'Inscription impossible';
      try {
        const err = await response.json();
        message = Array.isArray(err.message) ? err.message.join(', ') : err.message || message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);

    const userRole = data.user.role as UserRole;
    const redirectPath = ROLE_ROUTES[userRole]?.dashboard || '/admin';
    return { redirectPath };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const getRedirectPath = (): string => {
    if (!user) return '/login';
    return ROLE_ROUTES[user.role]?.dashboard || '/admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      registerVerifier,
      logout,
      isAuthenticated: !!token && !!user,
      isLoading,
      hasRole,
      getRedirectPath,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
