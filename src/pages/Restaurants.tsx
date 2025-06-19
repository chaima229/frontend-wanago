
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { RestaurantService, Restaurant } from '../services/restaurantService';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Restaurants = () => {
  const navigate = useNavigate();
  const { updateReservation, reservationData } = useReservation();
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        let restaurantsList: Restaurant[];
        
        if (reservationData.city || reservationData.date || reservationData.guests) {
          // Use search with filters
          const filters = {
            city: reservationData.city,
            date: reservationData.date,
            guests: reservationData.guests,
          };
          const response = await RestaurantService.searchRestaurants(filters);
          restaurantsList = response.restaurants;
        } else {
          // Get all restaurants
          restaurantsList = await RestaurantService.getAllRestaurants();
        }
        
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les restaurants. Utilisation des données de démonstration.',
          variant: 'destructive',
        });
        
        // Fallback to mock data
        setRestaurants([
          {
            id: '1',
            name: 'Restaurant le Nomads',
            image: '/lovable-uploads/89269bf6-2752-42a2-8f1b-4fedf111efac.png',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Nam non accumsan voluptate, labore qui nostrum officia quod ex dolorum dignissimos.',
            location: 'Rabat - 2 km du centre ville',
            price: 900,
            rating: 4.8,
            cuisine: 'Marocaine',
            openingHours: '18:00 - 23:00'
          },
          {
            id: '2',
            name: 'Le Jardin Secret',
            image: '/lovable-uploads/89269bf6-2752-42a2-8f1b-4fedf111efac.png',
            description: 'Un cadre enchanteur avec une cuisine raffinée et des saveurs authentiques qui vous transportent.',
            location: 'Casablanca - Centre ville',
            price: 750,
            rating: 4.6,
            cuisine: 'Française',
            openingHours: '19:00 - 22:30'
          },
          {
            id: '3',
            name: 'Dar Zitouna',
            image: '/lovable-uploads/89269bf6-2752-42a2-8f1b-4fedf111efac.png',
            description: 'Tradition et modernité se rencontrent dans ce restaurant aux allures de palais oriental.',
            location: 'Marrakech - Médina',
            price: 1200,
            rating: 4.9,
            cuisine: 'Fusion',
            openingHours: '18:00 - 24:00'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [reservationData, toast]);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    updateReservation({ restaurant });
    navigate('/reservation');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">Chargement des restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Restaurants disponibles</h1>
          <div className="text-gray-300">
            {reservationData.city && (
              <span>Ville: {reservationData.city} • </span>
            )}
            {reservationData.guests && (
              <span>{reservationData.guests} personne(s) • </span>
            )}
            {reservationData.date && (
              <span>{new Date(reservationData.date).toLocaleDateString('fr-FR')}</span>
            )}
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Aucun restaurant trouvé pour vos critères.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{restaurant.name}</h3>
                  
                  <div className="flex items-center text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{restaurant.location}</span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {restaurant.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{restaurant.openingHours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span className="text-2xl font-bold text-blue-400">{restaurant.price} MAD</span>
                      <span className="text-gray-400 text-sm ml-1">/ personne</span>
                    </div>
                    <Button
                      onClick={() => handleSelectRestaurant(restaurant)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Sélectionner
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
