import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EventService } from '@/services/eventService';
import { RestaurantService } from '@/services/restaurantService';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import EventMap from '@/components/EventMap';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const MAX_ITEMS = 4;
const ITEMS_PER_PAGE = 4; // 2 colonnes x 3 lignes

const Home = () => {
  const navigate = useNavigate();
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => EventService.getAllEvents(),
  });
  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => RestaurantService.getAllRestaurants(),
  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [toggle, setToggle] = useState<'restaurants' | 'events'>('restaurants');
  const [page, setPage] = useState(1);

  // Sélectionner quelques events et restaurants
  const topEvents = useMemo(() => events.slice(0, MAX_ITEMS), [events]);
  const topRestaurants = useMemo(() => restaurants.slice(0, MAX_ITEMS), [restaurants]);

  // Marqueurs pour la carte : TOUS les restaurants et events
  const allEvents = useMemo(() => events, [events]);
  const allRestaurants = useMemo(() => restaurants, [restaurants]);

  // Pagination sur la liste affichée
  const paginatedRestaurants = useMemo(() => allRestaurants.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE), [allRestaurants, page]);
  const paginatedEvents = useMemo(() => allEvents.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE), [allEvents, page]);
  const totalPages = useMemo(() => (toggle === 'restaurants' ? Math.ceil(allRestaurants.length / ITEMS_PER_PAGE) : Math.ceil(allEvents.length / ITEMS_PER_PAGE)), [toggle, allRestaurants, allEvents]);

  // Pour la carte : tous les items du type sélectionné
  const mapRestaurants = toggle === 'restaurants' ? allRestaurants : [];
  const mapEvents = toggle === 'events' ? allEvents : [];

  // Hauteur d'une carte + gap + padding (ex: 2*240px + 24px de gap + 32px de padding)
  const GRID_HEIGHT = 2 * 240 + 24 + 32; // 240px par carte, 24px gap, 32px padding

  // Affichage étoiles
  function renderStars(rating: number) {
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={i < Math.round(rating || 4) ? 'fill-yellow-500 w-4 h-4' : 'text-gray-300 w-4 h-4'} />
        ))}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="px-8 py-8 bg-card border-b border-border text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Bienvenue sur WanaGo</h1>
        <p className="text-muted-foreground mb-2">Découvrez les meilleurs événements et restaurants à Casablanca</p>
      </div>
      {/* Layout principal */}
      <div className="flex flex-col md:flex-row gap-16 px-8 py-12 max-w-7xl mx-auto items-start">
        {/* Colonne gauche : toggle + grille + pagination (2 colonnes, 3 lignes) */}
        <div className="md:w-[420px] flex flex-col gap-8">
          <div className="flex gap-4 mb-6">
            <Button variant={toggle === 'restaurants' ? 'default' : 'outline'} onClick={() => { setToggle('restaurants'); setPage(1); }}>Restaurants</Button>
            <Button variant={toggle === 'events' ? 'default' : 'outline'} onClick={() => { setToggle('events'); setPage(1); }}>Events</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {(toggle === 'restaurants' ? paginatedRestaurants : paginatedEvents).map(item => (
              <div
                key={item._id}
                className={`bg-muted rounded-2xl p-4 shadow-lg cursor-pointer border-2 transition flex flex-col h-[240px] ${selectedItem && selectedItem._id === item._id ? 'border-primary' : 'border-transparent'} hover:scale-105 hover:shadow-2xl`}
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.photos?.[0] || '/placeholder.svg'} alt={item.name || item.title} className="w-full h-24 object-cover rounded-xl mb-2" />
                <div className="font-bold text-base mb-1 truncate">{item.name || item.title}</div>
                <div className="text-xs text-muted-foreground mb-1 truncate">{item.ville || 'Lieu inconnu'}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description?.slice(0, 60) || ''}</div>
                <div className="flex items-center gap-1 mt-auto">
                  {renderStars(Array.isArray(item.ratings) && item.ratings.length > 0 ? item.ratings.reduce((a, b) => a + b, 0) / item.ratings.length : 4)}
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i+1}
                className={`w-8 h-8 rounded-full border-2 text-sm font-semibold ${page === i+1 ? 'bg-primary text-white border-primary' : 'bg-card text-foreground border-border'} transition`}
                onClick={() => setPage(i+1)}
              >
                {i+1}
              </button>
            ))}
          </div>
        </div>
        {/* Carte à droite alignée en haut et plus large */}
        <div className="md:w-[600px] w-full self-start">
          <div className="h-[503px] rounded-3xl shadow-xl mt-24 border border-border bg-white/10 overflow-hidden sticky top-8">
            <EventMap
              events={mapEvents}
              restaurants={mapRestaurants}
              selectedItem={selectedItem}
              onSelect={setSelectedItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
