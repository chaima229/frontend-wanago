import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Loader2, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventService, Event } from '@/services/eventService';
import { ReservationService } from '@/services/reservationService'; // Importer le service
import { useGeolocation } from '@/hooks/useGeolocation';
import type { GeoJSONPoint } from '@/services/restaurantService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext'; // Importer useAuth
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Importer Tooltip
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


const eventImage = '/lovable-uploads/2aa0cf26-fb8b-4c05-b09c-7a7aa4d64ea4.png';

const formatDistance = (meters?: number) => {
  if (meters === undefined) return null;
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

const formatLocation = (location: GeoJSONPoint | string) => {
  if (typeof location === 'string') {
    return location;
  }
  return 'À proximité';
};


const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Obtenir l'utilisateur
  const [promoCode, setPromoCode] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [title, setTitle] = useState('Événements');
  const [reservingEventId, setReservingEventId] = useState<string | null>(null);

  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setPageLoading(true);
        let eventsList: Event[] = [];
        
        if (!geoLoading) {
          if (latitude && longitude) {
            setTitle('Événements à proximité');
            eventsList = await EventService.getNearbyEvents(latitude, longitude);
          } else {
            setTitle('Tous les événements');
            if (geoError) {
              toast({
                title: 'Géolocalisation échouée',
                description: `${geoError}. Affichage de tous les événements.`,
                variant: 'default',
              });
            }
            eventsList = await EventService.getAllEvents();
          }
        }
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
         toast({
          title: 'Erreur',
          description: 'Impossible de charger les événements.',
          variant: 'destructive',
        });
      } finally {
        setPageLoading(false);
      }
    };
    if(!geoLoading) {
      fetchEvents();
    }
  }, [toast, latitude, longitude, geoError, geoLoading]);


  const handleValidatePromo = () => {
    console.log('Validating promo code:', promoCode);
  };

  const handleReserveClick = async (event: Event) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réserver.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setReservingEventId(event._id);
    try {
      await ReservationService.createEventReservation(event, user);
      toast({
        title: "Réservation réussie !",
        description: `Votre place pour l'événement "${event.title}" a été réservée.`,
        variant: "default"
      });
      navigate('/dashboard'); // Rediriger vers le tableau de bord
    } catch (error) {
      toast({
        title: "Échec de la réservation",
        description: error instanceof Error ? error.message : "Une erreur inconnue est survenue.",
        variant: "destructive"
      });
    } finally {
      setReservingEventId(null);
    }
  };

  if (showPayment) {
    // ... (Le code du formulaire de paiement reste identique pour l'instant)
    // ... Il faudra le lier à un vrai service de paiement plus tard.
    return (
        <div>Paiement pour {selectedEvent?.title}</div>
    )
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white">{geoLoading ? 'Récupération de votre position...' : 'Chargement des événements...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Aucun événement trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = event.dateStart ? new Date(event.dateStart) : null;
              const isDateInvalid = !eventDate || isNaN(eventDate.getTime());
              const dayOfMonth = isDateInvalid ? '?' : eventDate.getDate();
              
              const reserveButton = (
                <Button
                  onClick={() => handleReserveClick(event)}
                  disabled={reservingEventId === event._id || isDateInvalid}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reservingEventId === event._id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Réserver
                </Button>
              );

              return (
                <Card key={event._id} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {event.dateStart ? new Date(event.dateStart).toLocaleString() : 'Date non spécifiée'}
                    </CardDescription>
                    <CardDescription>
                      {event.distance ? `À ${(event.distance / 1000).toFixed(2)} km` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleReserveClick(event)}
                      disabled={reservingEventId === event._id || isDateInvalid}
                    >
                      {reservingEventId === event._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Réserver
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
