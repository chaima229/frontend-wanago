import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventService, Event } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useReservation } from '@/contexts/ReservationContext';
import { Loader2, Calendar, MapPin, Tag, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { updateReservation } = useReservation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réserver.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    if (!event) return;

    // Mettre à jour le contexte avec les infos de l'événement
    updateReservation({
      event: {
        _id: event._id,
        title: event.title,
        description: event.description,
        dateStart: event.dateStart,
        photos: event.photos,
        price: event.price
      },
      // Effacer les données de restaurant au cas où
      restaurant: undefined,
    });
    
    // Rediriger vers la page de finalisation
    navigate('/reservation-event');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground text-xl">
        Événement non trouvé.
      </div>
    );
  }

  const eventImage = Array.isArray(event.photos) && event.photos.length > 0
    ? event.photos[0]
    : '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
            <Button onClick={() => navigate('/events')} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la carte
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="p-0">
                            <img
                                src={eventImage}
                                alt={event.title}
                                className="w-full h-96 object-cover rounded-t-lg"
                                onError={e => { e.target.src = '/placeholder.svg'; }}
                            />
                        </CardHeader>
                        <CardContent className="p-6">
                            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                            <p className="text-muted-foreground text-lg">{event.description}</p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="p-6">
                        <CardTitle className="mb-6 text-2xl">Détails de l'événement</CardTitle>
                        <div className="space-y-4 text-muted-foreground">
                            <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-primary" /> <span>{new Date(event.dateStart).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                            <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-primary" /> <span>{event.address || 'Lieu à définir'}</span></div>
                            <div className="flex items-center"><Tag className="w-5 h-5 mr-3 text-primary" /> <span>{event.category}</span></div>
                            <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-primary" /> <span>{event.capacity} places disponibles</span></div>
                        </div>
                        <div className="border-t my-6"></div>
                        <div className="flex justify-between items-center text-3xl font-bold mb-6">
                            <span>Prix:</span>
                            <span className="text-primary">{event.price} MAD</span>
                        </div>
                        <Button onClick={handleReserveClick} size="lg" className="w-full">
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