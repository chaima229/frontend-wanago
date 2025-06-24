import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { useAuth } from '../contexts/AuthContext';
import { ReservationService } from '../services/reservationService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DatePicker from '@/components/DatePicker';

const Reservation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reservationData, updateReservation } = useReservation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('Reservation data updated:', reservationData);
  }, [reservationData]);
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
  });
  const [selectedTime, setSelectedTime] = useState(reservationData.time || '');

  const createReservationMutation = useMutation({
    mutationFn: ReservationService.createRestaurantReservation,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?._id] });
      
      if (!response || !response.reservation || !response.reservation._id) {
        throw new Error('Réponse invalide du serveur: ID de réservation manquant');
      }
      
      updateReservation({ 
        customerInfo,
        time: selectedTime,
        reservationId: response.reservation._id,
        price: reservationData.restaurant.price || 0,
        totalAmount: (reservationData.restaurant.price || 0) * (reservationData.guests || 1),
      });
      
      toast({
        title: 'Réservation créée !',
        description: 'Votre réservation a été créée avec succès. Vous allez être redirigé.',
      });
      
      navigate('/');
    },
    onError: (error) => {
      console.error('Reservation error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la réservation. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationData.date) {
      toast({
        title: 'Date manquante',
        description: 'Veuillez sélectionner une date pour votre réservation.',
        variant: 'destructive',
      });
      return;
    }

    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !selectedTime || !reservationData.guests) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs requis, sélectionner une heure et un nombre de personnes.',
        variant: 'destructive',
      });
      return;
    }

    if (!reservationData.restaurant || !reservationData.date) {
      toast({
        title: 'Erreur',
        description: 'Informations de réservation manquantes. Veuillez retourner et sélectionner un restaurant et une date.',
        variant: 'destructive',
      });
      return;
    }

    if (!reservationData.restaurant.id) {
      toast({
        title: 'Erreur',
        description: 'ID du restaurant manquant. Veuillez sélectionner un restaurant.',
        variant: 'destructive',
      });
      return;
    }

    const restaurantPrice = reservationData.restaurant.price || 0;
      
    const reservationPayload = {
      itemType: 'restaurant',
      itemId: reservationData.restaurant.id,
      date: reservationData.date,
      time: selectedTime,
      participants: reservationData.guests,
      customerInfo,
      price: restaurantPrice,
      totalAmount: restaurantPrice * (reservationData.guests || 1),
    };
    
    createReservationMutation.mutate(reservationPayload);
  };

  const handleCancel = () => {
    navigate('/restaurants');
  };

  if (!reservationData || !reservationData.restaurant) {
    navigate('/restaurants');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground text-lg font-medium">Finaliser votre réservation</h2>
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
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border">
            <div className="flex items-center mb-4">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-foreground">Détails de la réservation</h3>
            </div>

            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={reservationData.restaurant.photos?.[0] || '/placeholder.svg'}
                alt={reservationData.restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h4 className="text-lg font-bold text-foreground mb-2">
              {reservationData.restaurant.name}
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              {reservationData.restaurant.description}
            </p>
            <p className="text-muted-foreground mb-4">
              {reservationData.restaurant.address}, {reservationData.restaurant.ville}
            </p>

            <div className="border-t border pt-4 space-y-2">
              {reservationData.date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground">
                    {new Date(reservationData.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {reservationData.guests && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Personnes:</span>
                  <span className="text-foreground">{reservationData.guests}</span>
                </div>
              )}
              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heure:</span>
                  <span className="text-foreground">{selectedTime}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                <span className="text-muted-foreground">Prix par personne:</span>
                <span className="text-blue-400 font-bold">
                  {reservationData.restaurant.price} MAD
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-foreground">
                <span>Total:</span>
                <span className="text-blue-400">
                  {(reservationData.restaurant.price * (reservationData.guests || 1))} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h4 className="text-lg font-bold text-foreground mb-4">Informations de réservation</h4>

              {/* Date Selection */}
              <div>
                <DatePicker 
                  label="Date de réservation *"
                  selected={reservationData.date}
                  onDateSelect={(date) => updateReservation({ date })}
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
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
                          ? 'bg-purple-600 border-purple-500 text-foreground'
                          : 'bg-gray-800 border-gray-600 text-muted-foreground hover:border-purple-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Guests Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Nombre de personnes *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => updateReservation({ guests: num })}
                      className={`p-3 rounded-lg border transition-colors ${
                        reservationData.guests === num
                          ? 'bg-purple-600 border-purple-500 text-foreground'
                          : 'bg-gray-800 border-gray-600 text-muted-foreground hover:border-purple-500'
                      }`}
                    >
                      {num} {num === 1 ? 'personne' : 'personnes'}
                    </button>
                  ))}
                </div>
              </div>

              <h5 className="text-md font-bold text-foreground">Vos informations</h5>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Nom complet *
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Votre nom complet"
                  required
                  className="bg-gray-800 border-gray-600 text-foreground placeholder-gray-400 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="bg-gray-800 border-gray-600 text-foreground placeholder-gray-400 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Téléphone *
                </label>
                <div className="flex">
                  <div className="bg-gray-800 border border-gray-600 rounded-l-md px-3 py-2 text-foreground text-sm">
                    +212
                  </div>
                  <Input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Numéro de téléphone"
                    required
                    className="bg-gray-800 border-gray-600 text-foreground placeholder-gray-400 focus:border-purple-500 rounded-l-none border-l-0"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-opacity"
                disabled={createReservationMutation.isPending}
              >
                {createReservationMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Confirmer et continuer
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
