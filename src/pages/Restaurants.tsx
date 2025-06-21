import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { RestaurantService, Restaurant, GeoJSONPoint } from '../services/restaurantService';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Clock, Loader2, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '../hooks/useGeolocation';
import RestaurantMap from '../components/RestaurantMap';

const formatDistance = (meters?: number) => {
  if (meters === undefined) return null;
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

const formatLocation = (location: GeoJSONPoint | string) => {
  if (typeof location === 'string') {
    return location;
  }
  // Pour l'instant, on ne montre pas les coordonnées. La distance est plus utile.
  // On pourrait faire un appel à une API de geocoding inversé pour avoir une adresse.
  return 'À proximité';
};

const Restaurants = () => {
  const navigate = useNavigate();
  const { updateReservation, reservationData } = useReservation();
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [title, setTitle] = useState('Restaurants disponibles');

  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setPageLoading(true);
        let restaurantsList: Restaurant[] = [];

        const hasFilters = reservationData.ville || reservationData.date || reservationData.guests;

        if (hasFilters) {
          setTitle('Résultats de votre recherche');
          const filters = {
            ville: reservationData.ville,
            date: reservationData.date,
            guests: reservationData.guests,
          };
          const response = await RestaurantService.searchRestaurants(filters);
          restaurantsList = response.restaurants;
        } else if (!geoLoading) {
          if (latitude && longitude) {
            setTitle('Restaurants à proximité');
            restaurantsList = await RestaurantService.getNearbyRestaurants(latitude, longitude);
          } else {
            setTitle('Tous les restaurants');
            if (geoError) {
              toast({
                title: 'Géolocalisation échouée',
                description: `${geoError}. Affichage de tous les restaurants.`,
                variant: 'default',
              });
            }
            restaurantsList = await RestaurantService.getAllRestaurants();
          }
        }
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les restaurants.',
          variant: 'destructive',
        });
      } finally {
        setPageLoading(false);
      }
    };

    if (!geoLoading) {
       fetchRestaurants();
    }
  }, [reservationData, toast, latitude, longitude, geoError, geoLoading]);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    updateReservation({ restaurant });
    navigate('/reservation');
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">{geoLoading ? 'Récupération de votre position...' : 'Chargement des restaurants...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
          <div className="text-gray-300">
            {reservationData.ville && (
              <span>Ville: {reservationData.ville} • </span>
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
            <p className="text-gray-300 text-lg">Aucun restaurant trouvé.</p>
          </div>
        ) : (
          <RestaurantMap restaurants={restaurants} onSelect={handleSelectRestaurant} />
        )}
      </div>
    </div>
  );
};

export default Restaurants;
