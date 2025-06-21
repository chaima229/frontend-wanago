import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type UserRole = 'user' | 'partner' | 'restaurant' | 'admin';

export const useRole = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const userRole: UserRole = (user?.role as UserRole) || 'user';

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
    userProfile: user
  };
}; 