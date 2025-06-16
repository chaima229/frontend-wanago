
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Mail, Phone, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reservation = () => {
  const navigate = useNavigate();
  const { reservationData, updateReservation, setCurrentStep, currentStep } = useReservation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis.',
        variant: 'destructive',
      });
      return;
    }

    updateReservation({ customerInfo });
    setCurrentStep(2);
    setShowConfirmation(true);
  };

  const handleConfirmReservation = () => {
    toast({
      title: 'Réservation confirmée !',
      description: 'Votre réservation a été confirmée avec succès.',
    });
    navigate('/confirmation');
  };

  const handleCancel = () => {
    navigate('/restaurants');
  };

  if (!reservationData.restaurant) {
    navigate('/restaurants');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-medium">Étape {currentStep} / 4</h2>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Restaurant Info */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white">Détails de la réservation</h3>
            </div>

            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={reservationData.restaurant.image}
                alt={reservationData.restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h4 className="text-lg font-bold text-white mb-2">
              {reservationData.restaurant.name}
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              {reservationData.restaurant.description}
            </p>
            <p className="text-gray-300 mb-4">
              {reservationData.restaurant.location}
            </p>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Prix par personne:</span>
                <span className="text-blue-400 font-bold">
                  {reservationData.restaurant.price} MAD
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>Total:</span>
                <span className="text-blue-400">
                  {reservationData.restaurant.price} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            {!showConfirmation ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-blue-400 mr-3" />
                    <span className="text-white font-medium">
                      Connectez-vous pour réserver facilement ou inscrivez-vous pour gérer vos réservations à tout moment.
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <h4 className="text-lg font-bold text-white mb-4">Vos informations</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Votre nom complet *
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      L'email de confirmation sera envoyé à cette adresse
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Numéro de téléphone *
                    </label>
                    <div className="flex">
                      <div className="bg-gray-800 border border-gray-600 rounded-l-md px-3 py-2 text-white text-sm">
                        MA +212
                      </div>
                      <Input
                        type="tel"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Numéro de téléphone"
                        required
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-l-none border-l-0"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Suivant →
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Merci !</h3>
                <p className="text-gray-300 mb-6">
                  Vous êtes sur le point de finaliser votre réservation
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirmReservation}
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    Confirmer la réservation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
