import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { Button } from '@/components/ui/button';
import { Check, Calendar, MapPin, Users, Clock, CreditCard, Lock, Shield } from 'lucide-react';
import { PaymentService } from '../services/paymentService';

const Confirmation = () => {
  const navigate = useNavigate();
  const { reservationData, clearReservation } = useReservation();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleNewReservation = () => {
    clearReservation();
    navigate('/');
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!reservationData.reservationId) {
      console.error('ID de réservation manquant');
      return;
    }

    setPaymentLoading(true);
    setSelectedPaymentMethod(paymentMethod);

    try {
      if (paymentMethod === 'paypal') {
        const paymentData = {
          reservationId: reservationData.reservationId,
          amount: reservationData.totalAmount || (getRestaurantPrice() * (reservationData.guests || 1)),
          currency: 'MAD',
          paymentMethod: 'paypal'
        };

        const response = await PaymentService.createPayPalOrder(paymentData);
        
        // Rediriger vers PayPal
        if (response.approvalUrl) {
          window.location.href = response.approvalUrl;
        }
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Helper function to get restaurant price
  const getRestaurantPrice = () => {
    return reservationData.restaurant.price || 0;
  };

  if (!reservationData.restaurant) {
    navigate('/');
    return null;
  }

  const totalAmount = reservationData.totalAmount || (getRestaurantPrice() * (reservationData.guests || 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Réservation confirmée !</h1>
            <p className="text-gray-300 mb-8">
              Votre réservation a été confirmée avec succès. Procédez au paiement pour finaliser votre réservation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Détails de la réservation */}
              <div className="bg-gray-800/50 rounded-xl p-6 text-left">
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

                  {reservationData.time && (
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-3" />
                      <span>Heure: {reservationData.time}</span>
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

              {/* Section de paiement */}
              <div className="bg-gray-800/50 rounded-xl p-6 text-left">
                <h3 className="text-xl font-bold text-white mb-4">Paiement</h3>
                
                <div className="space-y-4">
                  {/* Résumé des coûts */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Prix par personne:</span>
                      <span className="text-white">{getRestaurantPrice()} MAD</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Nombre de personnes:</span>
                      <span className="text-white">{reservationData.guests}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total:</span>
                        <span className="text-blue-400 font-bold text-xl">{totalAmount} MAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Méthodes de paiement */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Choisissez votre méthode de paiement</h4>
                    
                    <div className="space-y-3">
                      {/* PayPal */}
                      <button
                        onClick={() => handlePayment('paypal')}
                        disabled={paymentLoading}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                          selectedPaymentMethod === 'paypal'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-blue-500 bg-gray-700/50'
                        } ${paymentLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-white font-medium">Payer avec PayPal</span>
                        {paymentLoading && selectedPaymentMethod === 'paypal' && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </button>

                      {/* Carte bancaire (désactivé pour l'instant) */}
                      <button
                        disabled
                        className="w-full p-4 rounded-lg border-2 border-gray-600 bg-gray-700/50 opacity-50 cursor-not-allowed flex items-center justify-center space-x-3"
                      >
                        <CreditCard className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-400 font-medium">Carte bancaire (Bientôt disponible)</span>
                      </button>
                    </div>

                    {/* Informations de sécurité */}
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-400 text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Paiement sécurisé par PayPal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
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
