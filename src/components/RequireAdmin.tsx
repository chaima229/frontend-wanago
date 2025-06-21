import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  console.log('RequireAdmin - user:', user);
  console.log('RequireAdmin - user.role:', user?.role);

  if (!user || user.role !== 'admin') {
    console.log('RequireAdmin - Redirection vers / car user ou role invalide');
    return <Navigate to="/" replace />;
  }

  console.log('RequireAdmin - Accès autorisé');
  return <>{children}</>;
};

export default RequireAdmin; 