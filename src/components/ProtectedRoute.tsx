
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Vous devez vous connecter pour accéder à cette page.",
        variant: "destructive",
      });
    }
  }, [loading, isAuthenticated, toast]);

  if (loading) {
    // Affichez un loader ou un composant vide pendant que l'authentification est en cours de vérification.
    // Cela empêche la redirection prématurée lors du rafraîchissement.
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié après le chargement,
    // redirigez-le vers la page d'accueil.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
