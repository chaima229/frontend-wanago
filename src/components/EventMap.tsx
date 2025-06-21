import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Event } from '../services/eventService';

// Créer une icône bleue uniforme pour tous les événements
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

type Props = {
  events: Event[];
  onSelect: (e: Event) => void;
};

export default function EventMap({ events, onSelect }: Props) {
  // Filtrer les événements avec des coordonnées valides
  const validEvents = events.filter(e => 
    e.location && 
    typeof e.location === 'object' && 
    'coordinates' in e.location &&
    Array.isArray(e.location.coordinates) && 
    e.location.coordinates.length === 2
  );

  let center: [number, number] = [33.5731, -7.5898]; // Casablanca par défaut
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
                  onClick={() => onSelect(event)} 
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
  );
} 