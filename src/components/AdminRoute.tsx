import React from 'react';
import { useRole } from '../hooks/use-role';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAdmin, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 max-w-md">
          <CardContent className="py-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Accès Refusé
            </h2>
            <p className="text-gray-400 mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Navigate to="/" replace />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 