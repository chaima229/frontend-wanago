import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReservationService } from "../services/reservationService";
// Si tu as des icônes Lucide ou similaires, importe-les ici
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reservationId = params.get("reservationId");

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen flex items-center justify-center bg-background py-4 px-2">
      <div className="w-full max-w-4xl rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden bg-card border border-border">
        {/* Détails réservation */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-muted">
          <div>
            <h2 className="text-lg font-semibold text-primary mb-4">Détails de la réservation</h2>
            <div className="flex items-center mb-4">
              <img src={itemImage} alt={itemName} className="w-14 h-14 rounded-lg object-cover mr-4 border border-primary" />
              <div>
                <h3 className="text-base font-semibold text-foreground">{itemName}</h3>
                <p className="text-muted-foreground flex items-center mt-1 text-sm"><MapPin className="w-4 h-4 mr-2" />{itemAddress}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-muted-foreground text-sm"><Calendar className="w-4 h-4 mr-2 text-primary" /> {reservation.date ? new Date(reservation.date).toLocaleDateString('fr-FR') : '-'}</div>
              <div className="flex items-center text-muted-foreground text-sm"><Users className="w-4 h-4 mr-2 text-primary" /> {reservation.participants} personne(s)</div>
              {reservation.time && <div className="flex items-center text-muted-foreground text-sm"><Clock className="w-4 h-4 mr-2 text-primary" /> {reservation.time}</div>}
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <h4 className="text-base font-semibold text-foreground mb-1">Contact</h4>
              <p className="text-muted-foreground text-sm">Nom : {customerInfo.fullName}</p>
              <p className="text-muted-foreground text-sm">Email : {customerInfo.email}</p>
              <p className="text-muted-foreground text-sm">Téléphone : {customerInfo.phone}</p>
            </div>
          </div>
        </div>
        {/* Paiement */}
        <div className="flex-1 p-6 flex flex-col justify-center bg-background border-l border-border">
          <h2 className="text-lg font-semibold text-primary mb-4">Paiement</h2>
          <div className="bg-card rounded-lg p-4 mb-4 shadow border border-border">
            <div className="flex justify-between text-muted-foreground text-sm mb-1"><span>Prix par personne :</span> <span>{reservation.price} MAD</span></div>
            <div className="flex justify-between text-muted-foreground text-sm mb-1"><span>Nombre de personnes :</span> <span>{reservation.participants}</span></div>
            <div className="border-t border-border my-2"></div>
            <div className="flex justify-between text-base font-bold text-foreground"><span>Total :</span> <span className="text-primary">{reservation.totalAmount} MAD</span></div>
          </div>
          <h3 className="text-base font-semibold mb-3 text-foreground">Choisissez votre méthode de paiement</h3>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm">Carte Bancaire</button>
            <button className="w-full py-2 px-4 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-sm">Stripe</button>
            <button className="w-full py-2 px-4 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition text-sm">PayPal</button>
          </div>
          <div className="flex items-center justify-center mt-4 text-green-600 dark:text-green-400">
            <span className="text-xs">Paiement sécurisé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;