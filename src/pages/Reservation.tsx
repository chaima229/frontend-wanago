import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { useAuth } from '../contexts/AuthContext';
import { ReservationService } from '../services/reservationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Mail, Phone, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reservation = () => {
  const navigate = useNavigate();
  const { reservationData, updateReservation, setCurrentStep, currentStep } = useReservation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Debug: Log reservation data
  console.log('Reservation data:', reservationData);
  console.log('Restaurant object:', reservationData.restaurant);
  console.log('Restaurant ID:', reservationData.restaurant?.id);
  console.log('Restaurant keys:', reservationData.restaurant ? Object.keys(reservationData.restaurant) : 'No restaurant');
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
  });
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);

  const availableTimes = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateReservation({ time });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug: Log before validation
    console.log('Submitting reservation with data:', {
      customerInfo,
      selectedTime,
      reservationData
    });
    
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !selectedTime) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis et sélectionner une heure.',
        variant: 'destructive',
      });
      return;
    }

    if (!reservationData.restaurant || !reservationData.date || !reservationData.guests) {
      console.error('Missing reservation data:', {
        restaurant: reservationData.restaurant,
        date: reservationData.date,
        guests: reservationData.guests
      });
      toast({
        title: 'Erreur',
        description: 'Informations de réservation manquantes. Veuillez sélectionner un restaurant.',
        variant: 'destructive',
      });
      return;
    }

    // Additional check for restaurant ID
    if (!reservationData.restaurant.id) {
      console.error('Restaurant ID is missing:', reservationData.restaurant);
      toast({
        title: 'Erreur',
        description: 'ID du restaurant manquant. Veuillez sélectionner un restaurant.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('About to create reservation payload...');
      console.log('Restaurant object at this point:', reservationData.restaurant);
      console.log('Restaurant ID at this point:', reservationData.restaurant?.id);
      
      // Use restaurant price directly (now guaranteed to be present from backend)
      const restaurantPrice = reservationData.restaurant.price || 0;
      const totalAmount = restaurantPrice * (reservationData.guests || 1);
      
      const reservationPayload = {
        restaurantId: reservationData.restaurant.id,
        date: reservationData.date,
        time: selectedTime,
        guests: reservationData.guests,
        customerInfo,
        price: restaurantPrice, // Prix par personne
        totalAmount: totalAmount, // Montant total
      };

      console.log('Sending reservation payload:', reservationPayload);
      console.log('Payload validation:');
      console.log('- restaurantId:', !!reservationPayload.restaurantId);
      console.log('- date:', !!reservationPayload.date);
      console.log('- time:', !!reservationPayload.time);
      console.log('- guests:', !!reservationPayload.guests);
      console.log('- customerInfo:', !!reservationPayload.customerInfo);
      console.log('- price:', !!reservationPayload.price);
      console.log('- totalAmount:', !!reservationPayload.totalAmount);

      const response = await ReservationService.createReservation(reservationPayload);
      
      updateReservation({ 
        customerInfo,
        time: selectedTime,
        reservationId: response.reservation.id,
        price: restaurantPrice,
        totalAmount: totalAmount
      });
      
      toast({
        title: 'Réservation confirmée !',
        description: 'Votre réservation a été créée avec succès.',
      });
      
      navigate('/confirmation');
    } catch (error) {
      console.error('Reservation error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la réservation. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/restaurants');
  };

  // Enhanced check for restaurant data
  if (!reservationData || !reservationData.restaurant) {
    console.log('No restaurant data found, redirecting to restaurants page');
    navigate('/restaurants');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-medium">Finaliser votre réservation</h2>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '75%' }}
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

            <div className="border-t border-gray-700 pt-4 space-y-2">
              {reservationData.date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">
                    {new Date(reservationData.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {reservationData.guests && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Personnes:</span>
                  <span className="text-white">{reservationData.guests}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Heure:</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                <span className="text-gray-400">Prix par personne:</span>
                <span className="text-blue-400 font-bold">
                  {reservationData.restaurant.price} MAD
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>Total:</span>
                <span className="text-blue-400">
                  {(reservationData.restaurant.price * (reservationData.guests || 1))} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h4 className="text-lg font-bold text-white mb-4">Informations de réservation</h4>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Sélectionnez votre heure *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`p-2 rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <h5 className="text-md font-bold text-white">Vos informations</h5>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone *
                </label>
                <div className="flex">
                  <div className="bg-gray-800 border border-gray-600 rounded-l-md px-3 py-2 text-white text-sm">
                    +212
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
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Création en cours...' : 'Confirmer la réservation'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
