import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../contexts/ReservationContext';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReservationService } from '../services/reservationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReservationEventPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reservationData, updateReservation } = useReservation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
  });

  const event = reservationData.event;

  const createReservationMutation = useMutation({
    mutationFn: ReservationService.createEventReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?._id] });
      toast({
        title: 'Réservation réussie !',
        description: `Votre place pour l'événement "${event?.title}" a été réservée.`,
      });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: 'Échec de la réservation',
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !user) return;

    const reservationPayload = {
      itemType: 'event',
      itemId: event._id,
      date: event.dateStart,
      participants: 1, // Pour les événements, on réserve une place à la fois
      customerInfo,
      price: event.price,
      totalAmount: event.price,
    };
    
    createReservationMutation.mutate(reservationPayload);
  };

  if (!event) {
    navigate('/events');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Button onClick={() => navigate(`/events/${event._id}`)} variant="ghost" className="self-start">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
          </Button>
          <CardTitle className="text-center text-2xl">Finaliser votre réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{new Date(event.dateStart).toLocaleDateString('fr-FR')}</p>
            <p className="text-xl font-bold mt-2">{event.price} MAD</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="fullName">Nom complet</label>
                <Input id="fullName" name="fullName" value={customerInfo.fullName} disabled />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <Input id="email" name="email" value={customerInfo.email} disabled />
              </div>
              <div>
                <label htmlFor="phone">Téléphone</label>
                <Input 
                    id="phone" 
                    name="phone" 
                    value={customerInfo.phone} 
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="Votre numéro de téléphone"
                    required
                />
              </div>
            <Button type="submit" className="w-full" disabled={createReservationMutation.isPending}>
              {createReservationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer votre réservation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationEventPage; 