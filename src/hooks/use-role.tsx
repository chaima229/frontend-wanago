import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUserProfile, UserProfile } from '../services/userService';

export type UserRole = 'user' | 'partner' | 'restaurant' | 'admin';

export const useRole = () => {
  const { firebaseUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) return;

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const profile = await getCurrentUserProfile(token);
          setUserProfile(profile);
        } catch (error) {
          console.error('useRole - Error fetching profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [firebaseUser, authLoading]);

  const userRole: UserRole = (userProfile?.role as UserRole) || 'user';
  console.log('useRole - Current userRole:', userRole);
  console.log('useRole - userProfile:', userProfile);

  const isAdmin = userRole === 'admin';
  const isPartner = userRole === 'partner';
  const isRestaurant = userRole === 'restaurant';
  const isUser = userRole === 'user';

  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(userRole);
  };

  return {
    userRole,
    isAdmin,
    isPartner,
    isRestaurant,
    isUser,
    hasPermission,
    isLoading: authLoading || isLoading,
    userProfile
  };
}; 