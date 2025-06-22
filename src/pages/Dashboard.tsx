import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReservationService } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Phone, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '../services/paymentService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Restaurant } from '../services/restaurantService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { 
    data: reservations = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userReservations'],
    queryFn: () => ReservationService.getMyReservations(),
  });

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await ReservationService.cancelReservation(reservationId);
      toast({
        title: 'Réservation annulée',
        description: 'Votre réservation a été annulée avec succès.',
      });
      refetch();
    } catch (error) {
      console.error('Cancel reservation error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'annulation de la réservation.',
        variant: 'destructive',
      });
    }
  };

  const handlePayReservation = (reservation) => {
    if (!reservation._id) {
      return;
    }
    navigate(`/payment?reservationId=${reservation._id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    if (location && typeof location === 'object' && location.type === 'Point' && location.coordinates) {
      return 'À proximité';
    }
    return 'Localisation non spécifiée';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive text-lg">Erreur lors du chargement des réservations</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.fullName}. Gérez vos réservations ici.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {reservations.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                {reservations.filter(r => r.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Annulées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500 dark:text-red-400">
                {reservations.filter(r => r.status === 'cancelled').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Mes Réservations</h2>
          
          {reservations.filter(r => r.status !== 'cancelled').length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Aucune réservation active trouvée</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Commencez par faire une réservation dans un restaurant ou un événement
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {reservations.filter(r => r.status !== 'cancelled').map((reservation, index) => (
                <Card key={reservation._id || `reservation-${index}`}> 
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-foreground mb-2">
                          {reservation.itemName || 'Réservation'}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{formatLocation(reservation.location)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(reservation.status)}
                        <div className="text-sm text-muted-foreground mt-1">
                          Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Reservation Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Détails de la réservation</h4>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        
                        {reservation.time && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>{reservation.time}</span>
                          </div>
                        )}
                        
                        {reservation.totalAmount && (
                          <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                            <span>Total: {reservation.totalAmount} MAD</span>
                          </div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Informations de contact</h4>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4 text-purple-400" />
                          <span>{reservation.customerInfo?.fullName || 'Non spécifié'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 text-purple-400" />
                          <span>{reservation.customerInfo?.email || 'Non spécifié'}</span>
                        </div>
                        
                        {reservation.customerInfo?.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-purple-400" />
                            <span>+212 {reservation.customerInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {reservation.status === 'pending' && (
                      <div className="mt-6 pt-4 border-t border-gray-700 flex gap-2">
                        <Button
                          onClick={() => handleCancelReservation(reservation._id)}
                          variant="destructive"
                          size="sm"
                        >
                          Annuler la réservation
                        </Button>
                        <Button
                          onClick={() => handlePayReservation(reservation)}
                          variant="default"
                          size="sm"
                        >
                          Payer
                        </Button>
                      </div>
                    )}
                    {reservation.status === 'confirmed' && (
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <span className="text-green-400 font-semibold">Réservation confirmée et payée</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
