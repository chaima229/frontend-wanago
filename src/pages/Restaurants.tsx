import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RestaurantService } from '@/services/restaurantService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
  { label: 'Note', value: 'rating' },
];

const RestaurantCard = ({ restaurant }: { restaurant: any }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col gap-2 shadow hover:shadow-lg transition cursor-pointer">
      <div className="flex items-center gap-2">
        <img src={restaurant.photos?.[0] || '/placeholder.svg'} alt={restaurant.name} className="w-12 h-12 rounded object-cover bg-gray-200" />
        <div>
          <div className="font-bold text-lg">{restaurant.name}</div>
          <div className="text-xs text-muted-foreground">{restaurant.ville}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={i < Math.round(restaurant.rating || 4) ? 'fill-yellow-500' : 'text-gray-400'} />
        ))}
        <span className="ml-2 text-xs text-muted-foreground">{restaurant.rating?.toFixed(1) || '4.0'}</span>
      </div>
      <div className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</div>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-primary">{restaurant.price} MAD</span>
        <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => navigate(`/restaurants/${restaurant._id || restaurant.id}`)}>Voir</Button>
      </div>
    </div>
  );
};

const Restaurants = () => {
  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => RestaurantService.getAllRestaurants(),
  });
  const [search, setSearch] = useState('');
  const [ville, setVille] = useState('');
  const [sort, setSort] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Villes disponibles
  const villes = useMemo(() => Array.from(new Set(restaurants.map((r: any) => r.ville).filter(Boolean))), [restaurants]);

  // Filtrage
  const filtered = useMemo(() => {
    let list = restaurants;
    if (search) list = list.filter((r: any) => r.name.toLowerCase().includes(search.toLowerCase()));
    if (ville) list = list.filter((r: any) => r.ville === ville);
    if (sort === 'price-asc') list = [...list].sort((a: any, b: any) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a: any, b: any) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [restaurants, search, ville, sort]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRestaurants = filtered.slice(startIndex, endIndex);

  React.useEffect(() => { setCurrentPage(1); }, [search, ville, sort]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header de recherche */}
      <div className="bg-gradient-to-b from-primary/80 to-background py-12 px-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">
            Explorez les meilleurs restaurants
          </h1>
          <div className="flex flex-col md:flex-row gap-2 justify-center items-center mb-6">
            <Input placeholder="Rechercher un restaurant..." value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-64" />
            <select value={ville} onChange={e => setVille(e.target.value)} className="border rounded px-2 py-1 bg-card text-foreground border-border">
              <option value="">Toutes les villes</option>
              {villes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value="" className="border rounded px-2 py-1 bg-card text-foreground border-border"><option>Maroc</option></select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-2 py-1 bg-card text-foreground border-border">
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="text-lg font-bold mb-4">{filtered.length} restaurants trouvés</div>
        </div>
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {currentRestaurants.map((r: any) => (
              <div key={r._id || r.id} className="flex justify-center">
                <div className="w-full max-w-sm">
                  <RestaurantCard restaurant={r} />
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 gap-2">
              <button
                className="px-3 py-1 rounded bg-card border border-border text-foreground disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-card border border-border text-foreground'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-card border border-border text-foreground disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Restaurants;
