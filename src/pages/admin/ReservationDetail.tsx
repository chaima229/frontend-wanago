import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ReservationService, Reservation } from '@/services/reservationService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';

const ReservationDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: reservation, isLoading, error } = useQuery<Reservation>({
    queryKey: ['reservation', id],
    queryFn: () => ReservationService.getReservationById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Erreur lors du chargement de la réservation.</p>
      </div>
    );
  }

  if (!reservation) {
    return <div className="text-center py-10">Réservation non trouvée.</div>;
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-blue-500 text-white">Payé</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500 text-white">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la réservation</CardTitle>
            <CardDescription>ID: {reservation._id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Information sur l'élément</h3>
                  <p><strong>Nom:</strong> {reservation.itemName}</p>
                  <p><strong>Type:</strong> {reservation.itemType}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Statuts</h3>
                  <p className="flex items-center gap-2"><strong>Réservation:</strong> {getStatusBadge(reservation.status)}</p>
                  <p className="flex items-center gap-2"><strong>Paiement:</strong> {getPaymentStatusBadge(reservation.paymentStatus)}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Information sur le client</h3>
                <p><strong>Nom:</strong> {reservation.customerInfo.fullName}</p>
                <p><strong>Email:</strong> {reservation.customerInfo.email}</p>
                <p><strong>Téléphone:</strong> {reservation.customerInfo.phone}</p>
                <p><strong>Utilisateur (si connecté):</strong> {reservation.userFullName}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Détails de la réservation</h3>
                <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                {reservation.time && <p><strong>Heure:</strong> {reservation.time}</p>}
                <p><strong>Participants:</strong> {reservation.participants}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Détails financiers</h3>
                <p><strong>Prix unitaire:</strong> {reservation.price.toFixed(2)} MAD</p>
                <p><strong>Montant Total:</strong> {reservation.totalAmount.toFixed(2)} MAD</p>
              </div>
              <div className="border-t pt-4 text-sm text-muted-foreground">
                <p><strong>Créée le:</strong> {new Date(reservation.createdAt).toLocaleString()}</p>
                <p><strong>Mise à jour le:</strong> {new Date(reservation.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReservationDetail; 