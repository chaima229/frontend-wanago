
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  Restaurant, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { ReservationService } from '../services/reservationService';
import { RestaurantService } from '../services/restaurantService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all reservations for admin
  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['adminReservations'],
    queryFn: async () => {
      // This would need to be implemented in your backend
      const response = await fetch('/api/admin/reservations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      return response.json();
    },
  });

  // Fetch all restaurants
  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['adminRestaurants'],
    queryFn: RestaurantService.getAllRestaurants,
  });

  // Mock users data - you'd fetch this from your backend
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      // This would need to be implemented in your backend
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      return response.json();
    },
  });

  // Update reservation status
  const updateReservationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ status })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReservations'] });
      toast({
        title: 'Succès',
        description: 'Statut de la réservation mis à jour',
      });
    },
  });

  const handleUpdateReservation = (id: string, status: string) => {
    updateReservationMutation.mutate({ id, status });
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const totalRevenue = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-300">
            Gérez votre application de réservation de restaurants
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="reservations" className="data-[state=active]:bg-purple-600">
              Réservations
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="data-[state=active]:bg-purple-600">
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Total Réservations
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalReservations}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Confirmées
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{confirmedReservations}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    En attente
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{pendingReservations}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Revenus
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{totalRevenue} MAD</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between border-b border-gray-700 pb-2">
                      <div className="flex items-center space-x-3">
                        <Restaurant className="h-4 w-4 text-purple-400" />
                        <div>
                          <p className="text-white text-sm">
                            Nouvelle réservation chez {reservation.restaurant?.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {reservation.customerInfo?.fullName} - {formatDate(reservation.createdAt)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gestion des Réservations</CardTitle>
              </CardHeader>
              <CardContent>
                {reservationsLoading ? (
                  <div className="text-white">Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Client</TableHead>
                        <TableHead className="text-gray-400">Restaurant</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Heure</TableHead>
                        <TableHead className="text-gray-400">Personnes</TableHead>
                        <TableHead className="text-gray-400">Montant</TableHead>
                        <TableHead className="text-gray-400">Statut</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id} className="border-gray-700">
                          <TableCell className="text-white">
                            <div>
                              <p>{reservation.customerInfo?.fullName}</p>
                              <p className="text-sm text-gray-400">{reservation.customerInfo?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{reservation.restaurant?.name}</TableCell>
                          <TableCell className="text-white">{formatDate(reservation.date)}</TableCell>
                          <TableCell className="text-white">{reservation.time}</TableCell>
                          <TableCell className="text-white">{reservation.guests}</TableCell>
                          <TableCell className="text-white">{reservation.totalAmount} MAD</TableCell>
                          <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {reservation.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateReservation(reservation.id, 'confirmed')}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleUpdateReservation(reservation.id, 'cancelled')}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des Restaurants</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Restaurant
              </Button>
            </div>
            
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                {restaurantsLoading ? (
                  <div className="text-white">Chargement...</div>
                ) : (
                  <div className="grid gap-6">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="flex items-center justify-between border-b border-gray-700 pb-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={restaurant.image} 
                            alt={restaurant.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-white font-semibold">{restaurant.name}</h3>
                            <div className="flex items-center text-gray-400 text-sm mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {restaurant.address}, {restaurant.ville}
                            </div>
                            <p className="text-gray-400 text-sm">{restaurant.cuisine}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-white font-semibold">{restaurant.price} MAD/pers</p>
                            <p className="text-yellow-400">★ {restaurant.rating}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gestion des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-white">Chargement...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Utilisateur</TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Téléphone</TableHead>
                        <TableHead className="text-gray-400">Réservations</TableHead>
                        <TableHead className="text-gray-400">Inscrit le</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-gray-700">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-3">
                              <Users className="h-8 w-8 text-purple-400" />
                              <span>{user.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {user.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{user.reservationCount || 0}</TableCell>
                          <TableCell className="text-white">{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
