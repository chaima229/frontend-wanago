import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReservationService } from "../services/reservationService";
import { PaymentService } from "../services/paymentService";
// Si tu as des icônes Lucide ou similaires, importe-les ici
import { Calendar, Clock, Users, MapPin, CreditCard, Shield } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const reservationId = params.get("reservationId");

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ReservationService.getReservationById(reservationId);
        setReservation(data);
      } catch (err) {
        setError("Erreur lors du chargement de la réservation.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [reservationId]);

  const handlePayment = async (paymentMethod) => {
    if (!reservation?._id) {
      alert('Erreur: ID de réservation manquant.');
      navigate('/');
      return;
    }
    setPaymentLoading(true);
    setSelectedPaymentMethod(paymentMethod);
    try {
      if (paymentMethod === 'paypal') {
        const paymentData = {
          reservationId: reservation._id,
          montant: reservation.totalAmount,
          currency: 'MAD',
          paymentMethod: 'paypal',
        };
        const response = await PaymentService.createPayment(paymentData);
        if (response.approvalUrl) {
          window.location.href = response.approvalUrl;
        } else if (response.success) {
          alert('Paiement enregistré avec succès !');
        } else {
          alert(response.message || 'Erreur lors du paiement.');
        }
      }
    } catch (error) {
      alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleNewReservation = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-base">Chargement...</div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive text-lg">
        {error || "Aucune réservation trouvée."}
      </div>
    );
  }

  // Simuler un objet item pour l'affichage (à adapter selon ta structure réelle)
  const item = reservation.item || {};
  const itemName = item.name || item.title || 'Réservation';
  const itemImage = item.photos?.[0] || '/placeholder.svg';
  const itemAddress = item.address || '-';
  const customerInfo = reservation.customerInfo || {};

  return (
    <div className="min-h-screen bg-background py-8 px-2">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Paiement de la réservation</h1>
            <p className="text-muted-foreground mb-8">
              Veuillez procéder au paiement pour finaliser votre réservation.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Détails de la réservation */}
              <div className="bg-muted rounded-xl p-6 text-left">
                <h3 className="text-lg font-bold text-foreground mb-4">Détails de votre réservation</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{itemName}</h4>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {itemAddress}
                      </div>
                    </div>
                  </div>
                  {reservation.date && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span>Date: {new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {reservation.participants && (
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-5 h-5 mr-3" />
                      <span>Nombre de personnes: {reservation.participants}</span>
                    </div>
                  )}
                  {reservation.time && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-5 h-5 mr-3" />
                      <span>Heure: {reservation.time}</span>
                    </div>
                  )}
                  {customerInfo && (
                    <div className="border-t border-border pt-4">
                      <h5 className="text-foreground font-medium mb-2">Informations de contact:</h5>
                      <div className="text-muted-foreground text-sm space-y-1">
                        <div>Nom: {customerInfo.fullName}</div>
                        <div>Email: {customerInfo.email}</div>
                        <div>Téléphone: {customerInfo.phone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Section de paiement */}
              <div className="bg-muted rounded-xl p-6 text-left">
                <h3 className="text-lg font-bold text-foreground mb-4">Paiement</h3>
                <div className="space-y-4">
                  {/* Résumé des coûts */}
                  <div className="bg-card rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Prix par personne:</span>
                      <span className="text-foreground">{reservation.price} MAD</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Nombre de personnes:</span>
                      <span className="text-foreground">{reservation.participants}</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-bold text-base">Total:</span>
                        <span className="text-primary font-bold text-lg">{reservation.totalAmount} MAD</span>
                      </div>
                    </div>
                  </div>
                  {/* Méthodes de paiement */}
                  <div>
                    <h4 className="text-foreground font-medium mb-3">Choisissez votre méthode de paiement</h4>
                    <div className="space-y-3">
                      {/* PayPal */}
                      <button
                        onClick={() => handlePayment('paypal')}
                        disabled={paymentLoading}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                          selectedPaymentMethod === 'paypal'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-border hover:border-blue-500 bg-card'
                        } ${paymentLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}`}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-foreground font-medium">Payer avec PayPal</span>
                        {paymentLoading && selectedPaymentMethod === 'paypal' && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </button>
                      {/* Carte bancaire (désactivé pour l'instant) */}
                      <button
                        disabled
                        className="w-full p-4 rounded-lg border-2 border-border bg-card opacity-50 cursor-not-allowed flex items-center justify-center space-x-3"
                      >
                        <CreditCard className="w-6 h-6 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">Carte bancaire (Bientôt disponible)</span>
                      </button>
                    </div>
                    {/* Informations de sécurité */}
                    <div className="mt-4 p-3 bg-green-100/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Paiement sécurisé par PayPal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <button
                onClick={handleNewReservation}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Nouvelle réservation
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full border border-border text-muted-foreground hover:bg-muted py-3 rounded-lg font-semibold"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;