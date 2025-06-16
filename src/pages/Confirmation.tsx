
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { Button } from '@/components/ui/button';
import { Check, Calendar, MapPin, Users, Clock } from 'lucide-react';

const Confirmation = () => {
  const navigate = useNavigate();
  const { reservationData, clearReservation } = useReservation();

  const handleNewReservation = () => {
    clearReservation();
    navigate('/');
  };

  if (!reservationData.restaurant) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Réservation confirmée !</h1>
            <p className="text-gray-300 mb-8">
              Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation sous peu.
            </p>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-xl font-bold text-white mb-4">Détails de votre réservation</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={reservationData.restaurant.image}
                      alt={reservationData.restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{reservationData.restaurant.name}</h4>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {reservationData.restaurant.location}
                    </div>
                  </div>
                </div>

                {reservationData.date && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Date: {new Date(reservationData.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}

                {reservationData.guests && (
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-3" />
                    <span>Nombre de personnes: {reservationData.guests}</span>
                  </div>
                )}

                {reservationData.customerInfo && (
                  <div className="border-t border-gray-600 pt-4">
                    <h5 className="text-white font-medium mb-2">Informations de contact:</h5>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>Nom: {reservationData.customerInfo.fullName}</div>
                      <div>Email: {reservationData.customerInfo.email}</div>
                      <div>Téléphone: {reservationData.customerInfo.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleNewReservation}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Nouvelle réservation
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
