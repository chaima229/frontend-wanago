import { useEffect, useState } from 'react';
import { getCurrentUserProfile, UserProfile } from '../services/userService';

export type UserRole = 'user' | 'partner' | 'restaurant' | 'admin';

export const useRole = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
      } catch (e) {
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const userRole: UserRole = (userProfile?.role as UserRole) || 'user';

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
    isLoading,
    userProfile
  };
}; 