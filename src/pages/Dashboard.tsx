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

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { 
    data: reservations = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userReservations'],
    queryFn: ReservationService.getUserReservations,
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

  const handlePayReservation = async (reservation) => {
    try {
      console.log('=== PAYMENT REQUEST DEBUG ===');
      console.log('Reservation object:', reservation);
      console.log('Reservation ID:', reservation._id);
      console.log('Reservation totalAmount:', reservation.totalAmount);
      console.log('Reservation price:', reservation.price);
      console.log('Reservation itemType:', reservation.itemType);
      
      if (!reservation._id) {
        throw new Error('ID de réservation manquant');
      }
      
      // Calculer le montant en fonction du type de réservation
      let montant = reservation.totalAmount;
      if (!montant || montant === 0) {
        if (reservation.itemType === 'event' || reservation.event) {
          montant = reservation.event?.price || reservation.price || 0;
        } else if (reservation.itemType === 'restaurant' || reservation.restaurant) {
          montant = (reservation.price || 0) * (reservation.guests || 1);
        }
      }
      
      console.log('Calculated montant:', montant);
      
      if (!montant || montant === 0) {
        throw new Error('Montant de paiement invalide');
      }
      
      await PaymentService.createPayment({
        reservationId: reservation._id,
        montant: montant,
        currency: 'MAD',
        paymentMethod: 'paypal'
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la création du paiement.',
        variant: 'destructive',
      });
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-red-400 text-lg">Erreur lors du chargement des réservations</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-300">
            Bienvenue, {user?.fullName}. Gérez vos réservations ici.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {reservations.length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Confirmées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {reservations.filter(r => r.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Annulées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {reservations.filter(r => r.status === 'cancelled').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Mes Réservations</h2>
          
          {reservations.filter(r => r.status !== 'cancelled').length === 0 ? (
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Aucune réservation active trouvée</p>
                <p className="text-gray-500 text-sm mt-2">
                  Commencez par faire une réservation dans un restaurant ou un événement
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {reservations.filter(r => r.status !== 'cancelled').map((reservation, index) => (
                <Card key={reservation._id || `reservation-${index}`} className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-white mb-2">
                          {reservation.restaurant?.name || reservation.event?.title || 'Réservation'}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{formatLocation(reservation.restaurant?.location || reservation.event?.location)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(reservation.status)}
                        <div className="text-sm text-gray-400 mt-1">
                          Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Reservation Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Détails de la réservation</h4>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        
                        {reservation.time && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>{reservation.time}</span>
                          </div>
                        )}
                        
                        {reservation.guests && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span>{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}</span>
                          </div>
                        )}
                        
                        {reservation.totalAmount && (
                          <div className="flex items-center gap-2 text-gray-300 font-semibold">
                            <span>Total: {reservation.totalAmount} MAD</span>
                          </div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Informations de contact</h4>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="w-4 h-4 text-purple-400" />
                          <span>{reservation.customerInfo?.fullName || 'Non spécifié'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="w-4 h-4 text-purple-400" />
                          <span>{reservation.customerInfo?.email || 'Non spécifié'}</span>
                        </div>
                        
                        {reservation.customerInfo?.phone && (
                          <div className="flex items-center gap-2 text-gray-300">
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
                        {/* Only show pay button for restaurant reservations with valid amount */}
                        {reservation.restaurant && (reservation.totalAmount > 0 || (reservation.price > 0 && reservation.guests > 0)) && (
                          <Button
                            onClick={() => handlePayReservation(reservation)}
                            variant="default"
                            size="sm"
                          >
                            Payer
                          </Button>
                        )}
                        {/* Show pay button for event reservations with valid price */}
                        {reservation.event && (reservation.event as any).price > 0 && (
                          <Button
                            onClick={() => handlePayReservation(reservation)}
                            variant="default"
                            size="sm"
                          >
                            Payer
                          </Button>
                        )}
                        {/* Debug info */}
                        {reservation.status === 'pending' && (
                          <div className="text-xs text-gray-500 mt-2">
                            Debug: Restaurant: {reservation.restaurant ? 'Yes' : 'No'}, 
                            Event: {reservation.event ? 'Yes' : 'No'}, 
                            TotalAmount: {reservation.totalAmount}, 
                            Price: {reservation.price}, 
                            Event Price: {(reservation.event as any)?.price || 'N/A'}, 
                            Guests: {reservation.guests}
                          </div>
                        )}
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
