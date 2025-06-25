import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReservationService } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, MapPin, Phone, Mail, User, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // États pour la pagination et les filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { 
    data: reservations = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['userReservations'],
    queryFn: () => ReservationService.getMyReservations(),
  });

  // Fonction pour déterminer le type de réservation
  const getReservationType = (reservation) => {
    return reservation.itemType || 'other';
  };

  // Filtrage et tri des réservations
  const filteredAndSortedReservations = useMemo(() => {
    let filtered = reservations;

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => getReservationType(r) === typeFilter);
    }

    // Tri par date de création (plus récent en premier)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [reservations, statusFilter, typeFilter]);

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredAndSortedReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = filteredAndSortedReservations.slice(startIndex, endIndex);

  // Reset de la page quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter]);

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

  const getTypeBadge = (reservation) => {
    const type = getReservationType(reservation);
    switch (type) {
      case 'restaurant':
        return <Badge className="bg-blue-500">Restaurant</Badge>;
      case 'event':
        return <Badge className="bg-purple-500">Événement</Badge>;
      default:
        return <Badge variant="secondary">Autre</Badge>;
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

        {/* Filtres */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filtres:</span>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="restaurant">Restaurants</SelectItem>
                <SelectItem value="event">Événements</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {filteredAndSortedReservations.length} réservation(s) trouvée(s)
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Mes Réservations</h2>
          
          {currentReservations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {filteredAndSortedReservations.length === 0 
                    ? 'Aucune réservation trouvée avec les filtres actuels'
                    : 'Aucune réservation active trouvée'
                  }
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {filteredAndSortedReservations.length === 0 && (
                    'Essayez de modifier vos filtres ou commencez par faire une réservation'
                  )}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentReservations.map((reservation, index) => (
                  <Card
                    key={reservation._id || `reservation-${index}`}
                    className="flex flex-col justify-between w-full h-96 max-w-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg text-foreground line-clamp-1">
                              {reservation.itemName || 'Réservation'}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{formatLocation(reservation.location)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(reservation.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {getTypeBadge(reservation)}
                        <div className="text-xs text-muted-foreground">
                          {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col justify-between pt-0 pb-0">
                      <div>
                        {/* Reservation Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span>{formatDate(reservation.date)}</span>
                          </div>
                          
                          {reservation.time && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 text-purple-400" />
                              <span>{reservation.time}</span>
                            </div>
                          )}
                          
                          {reservation.totalAmount && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                              <span>Total: {reservation.totalAmount} MAD</span>
                            </div>
                          )}
                        </div>

                        {/* Customer Info - Compact */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3 text-purple-400" />
                            <span className="line-clamp-1">{reservation.customerInfo?.fullName || 'Non spécifié'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3 text-purple-400" />
                            <span className="line-clamp-1">{reservation.customerInfo?.email || 'Non spécifié'}</span>
                          </div>
                          
                          {reservation.customerInfo?.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3 text-purple-400" />
                              <span>+212 {reservation.customerInfo.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        {reservation.status === 'pending' && (
                          <div className="pt-3 border-t border-gray-700 flex gap-8 mb-4">
                            <Button
                              onClick={() => handleCancelReservation(reservation._id)}
                              variant="destructive"
                              size="sm"
                              className="flex-1 text-xs"
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={() => handlePayReservation(reservation)}
                              variant="default"
                              size="sm"
                              className="flex-1 text-xs"
                            >
                              Payer
                            </Button>
                          </div>
                        )}
                        {reservation.status === 'confirmed' && (
                          <div className="pt-3 border-t border-gray-700 mb-4">
                            <span className="text-green-400 font-semibold text-sm">✓ Confirmée et payée</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-muted-foreground">
                    Affichage de {startIndex + 1} à {Math.min(endIndex, filteredAndSortedReservations.length)} sur {filteredAndSortedReservations.length} réservations
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
