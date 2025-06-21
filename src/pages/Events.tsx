import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { EventService, Event } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Déplacé et adapté depuis EventMap.tsx ---
const createEventIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #3498db; // Couleur bleue pour les événements
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          line-height: 1;
        ">🎉</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};
// --- Fin du code déplacé ---

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setPageLoading(true);
        const eventsList = await EventService.getAllEvents();
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
    fetchEvents();
  }, [toast]);

  const handleSelectEvent = (event: Event) => {
    navigate(`/events/${event._id}`);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">Chargement des événements...</p>
        </div>
      </div>
    );
  }
  
  // Filtrer les événements valides et calculer le centre/zoom
  const validEvents = events.filter(e => 
    e.location && 
    typeof e.location === 'object' && 
    'coordinates' in e.location &&
    Array.isArray(e.location.coordinates) && 
    e.location.coordinates.length === 2
  );

  let center: [number, number] = [33.5731, -7.5898];
  let zoom = 10;

  if (validEvents.length > 0) {
    const coordinates = validEvents.map(e => (e.location as any).coordinates);
    const lats = coordinates.map(coord => coord[1]);
    const lngs = coordinates.map(coord => coord[0]);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
    
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    if (maxDiff > 0.1) zoom = 8;
    else if (maxDiff > 0.05) zoom = 9;
    else if (maxDiff > 0.02) zoom = 10;
    else if (maxDiff > 0.01) zoom = 11;
    else zoom = 12;
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                Découvrez nos événements
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                Cliquez sur un marqueur pour voir les détails d'un événement.
            </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border">
                {validEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Aucun événement avec une localisation valide trouvé.</p>
                </div>
                ) : (
                <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {validEvents.map((event) => {
                        const customIcon = createEventIcon();
                        const coordinates = (event.location as any).coordinates;
                        
                        return (
                        <Marker
                            key={event.id || event._id}
                            position={[coordinates[1], coordinates[0]] as [number, number]}
                            icon={customIcon}
                        >
                            <Popup>
                            <div className="event-popup" style={{ minWidth: '200px' }}>
                                <div style={{ 
                                backgroundColor: '#3498db', 
                                color: 'white', 
                                padding: '8px', 
                                borderRadius: '4px', 
                                marginBottom: '8px',
                                textAlign: 'center'
                                }}>
                                <strong>{event.title}</strong>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                <div><strong>Date:</strong> {new Date(event.dateStart).toLocaleDateString('fr-FR')}</div>
                                <div><strong>Prix:</strong> {event.price} MAD</div>
                                </div>
                                <button 
                                onClick={() => handleSelectEvent(event)} 
                                style={{
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    fontWeight: 'bold'
                                }}
                                >
                                Voir les détails
                                </button>
                            </div>
                            </Popup>
                        </Marker>
                        );
                    })}
                </MapContainer>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
