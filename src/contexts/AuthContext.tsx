import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirebaseAuthService, User } from '../services/firebaseAuthService';
import { UserService, UserData } from '../services/userService';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Fonction pour récupérer les données utilisateur depuis la base
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userData = await UserService.getUserByUid(firebaseUser.uid);
      if (userData) {
        return {
          id: firebaseUser.uid,
          _id: userData._id, // Ajout de l'ID de la base de données
          fullName: userData.fullName,
          email: firebaseUser.email!,
          role: userData.role
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    
    // Fallback si pas de données en base
    const fallbackUser = FirebaseAuthService.convertFirebaseUser(firebaseUser);
    return {
      ...fallbackUser,
      role: 'user' // Rôle par défaut
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const customUser = await fetchUserData(fbUser);
        setUser(customUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await FirebaseAuthService.login(email, password);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await FirebaseAuthService.register(fullName, email, password);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      await FirebaseAuthService.loginWithGoogle();
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    try {
      setLoading(true);
      await FirebaseAuthService.loginWithFacebook();
      return true;
    } catch (error) {
      console.error('Facebook login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await FirebaseAuthService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    firebaseUser,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
