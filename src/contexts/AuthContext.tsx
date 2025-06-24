import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirebaseAuthService, User } from '../services/firebaseAuthService';
import { UserService, User as BackendUser } from '../services/userService';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import SessionTimeoutModal from '@/components/SessionTimeoutModal';

interface User extends BackendUser {
  // This combines properties from Firebase and Backend
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: (options?: { isInactive?: boolean; isBlocked?: boolean }) => Promise<void>;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  const logout = useCallback(async (options: { isInactive?: boolean; isBlocked?: boolean } = {}): Promise<void> => {
    const { isInactive = false, isBlocked = false } = options;
    try {
      setLoading(true);
      await FirebaseAuthService.logout();
      if (isInactive) {
        toast({
          title: "Session expirée",
          description: "Vous avez été déconnecté pour inactivité.",
          variant: "destructive"
        });
      }
      if (isBlocked) {
        toast({
          title: "Accès bloqué",
          description: "Votre compte a été bloqué par un administrateur.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setFirebaseUser(null);
      setLoading(false);
    }
  }, [toast]);

  // Fonction pour récupérer les données utilisateur depuis la base
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userData = await UserService.getUserByUid(firebaseUser.uid);
      if (userData) {
        if (!userData.isValidated) {
          await logout({ isBlocked: true });
          return null;
        }
        return {
          ...userData,
          id: firebaseUser.uid,
          email: firebaseUser.email!,
        };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      await logout();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const customUser = await fetchUserData(fbUser);
        setUser(customUser as User);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const interval = setInterval(async () => {
      try {
        const { isValidated } = await UserService.checkUserValidation(user._id);
        if (!isValidated) {
          await logout({ isBlocked: true });
        }
      } catch (error) {
        console.error("Error checking user validation status:", error);
      }
    }, 30 * 1000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user?._id, logout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let sessionTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timer;

    const LOGOUT_TIME = 10 * 60 * 3000; // 10 minutes
    const WARNING_TIME = LOGOUT_TIME - (1 * 60 * 1000); // 1 minute before logout

    const startTimers = () => {
      warningTimer = setTimeout(() => {
        setIsModalOpen(true);
        setCountdown(60); 
        countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              handleLogout(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, WARNING_TIME);

      sessionTimer = setTimeout(() => {
        handleLogout(true);
      }, LOGOUT_TIME);
    };

    const clearTimers = () => {
      clearTimeout(sessionTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
    };

    const resetTimers = () => {
      clearTimers();
      startTimers();
    };

    const handleContinue = () => {
      setIsModalOpen(false);
      resetTimers();
    };
    
    const handleLogout = async (isInactive = false) => {
        setIsModalOpen(false);
        await logout({ isInactive });
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimers));

    startTimers();

    return () => {
      clearTimers();
      events.forEach(event => window.removeEventListener(event, resetTimers));
    };
  }, [isAuthenticated, logout]);

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

  const value = {
    user,
    firebaseUser,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout: (options) => logout(options),
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionTimeoutModal
        isOpen={isModalOpen}
        onContinue={() => {
          setIsModalOpen(false);
          // The reset timers logic will be handled by the main event listeners
        }}
        onLogout={() => logout()}
        countdown={countdown}
      />
    </AuthContext.Provider>
  );
};
