
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users } from 'lucide-react';
import { useReservation } from '../contexts/ReservationContext';
import DatePicker from '../components/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Home = () => {
  const navigate = useNavigate();
  const { updateReservation } = useReservation();
  const [departureDate, setDepartureDate] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState<string>('');
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = () => {
    if (!departureDate || !arrivalDate || !city || !guests) {
      return;
    }

    updateReservation({
      date: departureDate,
      city,
      guests: parseInt(guests),
    });

    navigate('/restaurants');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Trouvez votre restaurant idéal
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Réservez en quelques clics
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-8">
              <Search className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-white font-medium">Recherchez un restaurant</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <DatePicker
                selected={departureDate}
                onDateSelect={setDepartureDate}
                label="Date de départ"
              />
              <DatePicker
                selected={arrivalDate}
                onDateSelect={setArrivalDate}
                label="Date d'arrivée"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center text-white mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ville
                </label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Entrez votre ville"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="flex items-center text-white mb-3">
                  <Users className="w-4 h-4 mr-2" />
                  Nombre de personnes
                </label>
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="2"
                  min="1"
                  max="20"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              disabled={!departureDate || !arrivalDate || !city || !guests}
            >
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
