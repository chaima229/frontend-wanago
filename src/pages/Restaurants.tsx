
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Clock } from 'lucide-react';

const restaurantImage = '/lovable-uploads/89269bf6-2752-42a2-8f1b-4fedf111efac.png';

const mockRestaurants = [
  {
    id: '1',
    name: 'Restaurant le Nomads',
    image: restaurantImage,
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
    image: restaurantImage,
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
    image: restaurantImage,
    description: 'Tradition et modernité se rencontrent dans ce restaurant aux allures de palais oriental.',
    location: 'Marrakech - Médina',
    price: 1200,
    rating: 4.9,
    cuisine: 'Fusion',
    openingHours: '18:00 - 24:00'
  }
];

const Restaurants = () => {
  const navigate = useNavigate();
  const { updateReservation, reservationData } = useReservation();

  const handleSelectRestaurant = (restaurant: typeof mockRestaurants[0]) => {
    updateReservation({ restaurant });
    navigate('/reservation');
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {mockRestaurants.map((restaurant) => (
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
      </div>
    </div>
  );
};

export default Restaurants;
