import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventService, Event } from '@/services/eventService';
import { ReservationService } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Calendar, MapPin, Tag, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        toast({ title: "ID d'événement manquant", variant: "destructive" });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const eventData = await EventService.getEventById(id);
        setEvent(eventData);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'événement.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, toast]);

  const handleReserveClick = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réserver.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    if (!event) return;

    setReserving(true);
    try {
      await ReservationService.createEventReservation(event, user);
      toast({
        title: "Réservation réussie !",
        description: `Votre place pour l'événement "${event.title}" a été réservée.`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Échec de la réservation",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
        variant: "destructive",
      });
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center text-white text-xl">
        Événement non trouvé.
      </div>
    );
  }

  const eventImage = event.photos && event.photos.length > 0 ? event.photos[0] : '/placeholder.svg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
            <Button onClick={() => navigate('/events')} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la carte
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                        <CardHeader className="p-0">
                            <img src={eventImage} alt={event.title} className="w-full h-96 object-cover rounded-t-2xl" />
                        </CardHeader>
                        <CardContent className="p-6">
                            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                            <p className="text-gray-300 text-lg">{event.description}</p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 p-6">
                        <CardTitle className="mb-6 text-2xl">Détails de l'événement</CardTitle>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-purple-400" /> <span>{new Date(event.dateStart).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                            <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-purple-400" /> <span>{event.address || 'Lieu à définir'}</span></div>
                            <div className="flex items-center"><Tag className="w-5 h-5 mr-3 text-purple-400" /> <span>{event.category}</span></div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-purple-400" /> <span>{event.capacity} places disponibles</span></div>
                        </div>
                        <div className="border-t border-gray-700 my-6"></div>
                        <div className="flex justify-between items-center text-3xl font-bold mb-6">
                            <span>Prix:</span>
                            <span className="text-purple-400">{event.price} MAD</span>
                        </div>
                        <Button onClick={handleReserveClick} disabled={reserving} size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                            {reserving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Réserver maintenant
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EventDetail; 