import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import RestaurantMap from '../components/RestaurantMap';
import { RestaurantService, Restaurant } from '../services/restaurantService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { updateReservation } = useReservation();
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const restaurantsList = await RestaurantService.getAllRestaurants();
        setRestaurants(restaurantsList || []);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les restaurants.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [toast]);

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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Découvrez et réservez
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Sélectionnez un restaurant sur la carte pour commencer votre réservation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            {!restaurants || restaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">Aucun restaurant disponible pour le moment.</p>
              </div>
            ) : (
              <RestaurantMap restaurants={restaurants} onSelect={handleSelectRestaurant} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
