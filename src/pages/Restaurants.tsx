import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RestaurantService } from '@/services/restaurantService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const categories = [
  'Marocain', 'Italien', 'Asiatique', 'Fast Food', 'Végétarien', 'Français', 'Autre'
];

const priceRanges = [
  { label: 'Gratuit', value: 'free' },
  { label: 'Payant', value: 'paid' },
];

const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
  { label: 'Note', value: 'rating' },
];

const RestaurantCard = ({ restaurant }: { restaurant: any }) => (
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
      <Button size="sm" variant="outline">Voir</Button>
    </div>
  </div>
);

const Restaurants = () => {
  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => RestaurantService.getAllRestaurants(),
  });
  const [search, setSearch] = useState('');
  const [ville, setVille] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [sort, setSort] = useState('relevance');

  // Villes disponibles
  const villes = useMemo(() => Array.from(new Set(restaurants.map((r: any) => r.ville).filter(Boolean))), [restaurants]);

  // Filtrage
  const filtered = useMemo(() => {
    let list = restaurants;
    if (search) list = list.filter((r: any) => r.name.toLowerCase().includes(search.toLowerCase()));
    if (ville) list = list.filter((r: any) => r.ville === ville);
    if (category) list = list.filter((r: any) => r.category === category);
    if (price === 'free') list = list.filter((r: any) => r.price === 0);
    if (price === 'paid') list = list.filter((r: any) => r.price > 0);
    if (sort === 'price-asc') list = [...list].sort((a: any, b: any) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a: any, b: any) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [restaurants, search, ville, category, price, sort]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header de recherche */}
      <div className="bg-gradient-to-b from-primary/80 to-background py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Explorez les meilleurs restaurants</h1>
        <div className="flex flex-col md:flex-row gap-2 justify-center items-center max-w-xl mx-auto">
          <Input placeholder="Rechercher un restaurant..." value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-64" />
          <select value={ville} onChange={e => setVille(e.target.value)} className="border rounded px-2 py-1">
            <option value="">Toutes les villes</option>
            {villes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value="" className="border rounded px-2 py-1"><option>Maroc</option></select>
        </div>
      </div>
      <div className="flex">
        {/* Sidebar filtres */}
        <aside className="w-64 p-6 bg-card/80 border-r border-border hidden md:block">
          <div className="mb-6">
            <div className="font-bold mb-2">Prix</div>
            {priceRanges.map(p => (
              <div key={p.value} className="flex items-center gap-2 mb-1">
                <input type="radio" id={p.value} name="price" value={p.value} checked={price === p.value} onChange={e => setPrice(e.target.value)} />
                <label htmlFor={p.value}>{p.label}</label>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <div className="font-bold mb-2">Catégorie</div>
            {categories.map(c => (
              <div key={c} className="flex items-center gap-2 mb-1">
                <input type="radio" id={c} name="category" value={c} checked={category === c} onChange={e => setCategory(e.target.value)} />
                <label htmlFor={c}>{c}</label>
              </div>
            ))}
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold">{filtered.length} restaurants trouvés</div>
            <div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-2 py-1">
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r: any) => <RestaurantCard key={r._id || r.id} restaurant={r} />)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Restaurants;
