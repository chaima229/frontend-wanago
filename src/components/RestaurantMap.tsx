import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Restaurant } from '../services/restaurantService';

// Créer une icône rouge uniforme pour tous les restaurants
const createRestaurantIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #e74c3c;
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
        ">📍</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

type Props = {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
};

export default function RestaurantMap({ restaurants, onSelect }: Props) {
  // Filtrer les restaurants avec des coordonnées valides
  const validRestaurants = restaurants.filter(r => 
    r.location && 
    typeof r.location === 'object' && 
    'coordinates' in r.location &&
    Array.isArray(r.location.coordinates) && 
    r.location.coordinates.length === 2
  );

  // Calculer le centre et les limites pour afficher tous les restaurants
  let center: [number, number] = [33.5731, -7.5898]; // Casablanca par défaut
  let zoom = 10; // Zoom plus éloigné par défaut

  if (validRestaurants.length > 0) {
    const coordinates = validRestaurants.map(r => (r.location as any).coordinates);
    const lats = coordinates.map(coord => coord[1]);
    const lngs = coordinates.map(coord => coord[0]);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calculer le centre
    center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
    
    // Calculer le zoom approprié pour voir tous les restaurants
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    if (maxDiff > 0.1) zoom = 8; // Très éloigné si les restaurants sont très dispersés
    else if (maxDiff > 0.05) zoom = 9; // Éloigné
    else if (maxDiff > 0.02) zoom = 10; // Moyen
    else if (maxDiff > 0.01) zoom = 11; // Proche
    else zoom = 12; // Très proche
  }

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {validRestaurants.map((r) => {
        const customIcon = createRestaurantIcon();
        const coordinates = (r.location as any).coordinates;
        
        return (
          <Marker
            key={r.id || r._id || `restaurant-${coordinates[0]}-${coordinates[1]}`}
            position={[coordinates[1], coordinates[0]] as [number, number]}
            icon={customIcon}
          >
            <Popup>
              <div className="restaurant-popup" style={{ minWidth: '200px' }}>
                <div style={{ 
                  backgroundColor: '#e74c3c', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  marginBottom: '8px',
                  textAlign: 'center'
                }}>
                  <strong>{r.name}</strong>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div><strong>Cuisine:</strong> {r.cuisine}</div>
                  <div><strong>Prix:</strong> {r.price} MAD / pers</div>
                  {r.rating && <div><strong>Note:</strong> ⭐ {r.rating}</div>}
                </div>
                <button 
                  onClick={() => onSelect(r)} 
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold'
                  }}
                >
                  Choisir ce restaurant
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
} 