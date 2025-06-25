import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RestaurantService } from '@/services/restaurantService';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      RestaurantService.getRestaurantById(id)
        .then(setRestaurant)
        .finally(() => setLoading(false));
    }
  }, [id]);

  function renderStars(rating: number) {
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={i < Math.round(rating || 4) ? 'fill-yellow-500 w-5 h-5' : 'text-gray-300 w-5 h-5'} />
        ))}
      </span>
    );
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!restaurant) return <div className="p-8 text-center text-destructive">Restaurant introuvable.</div>;

  const avgRating = Array.isArray(restaurant.ratings) && restaurant.ratings.length > 0
    ? restaurant.ratings.reduce((a, b) => a + b, 0) / restaurant.ratings.length
    : 4;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-card rounded-2xl shadow-lg mt-8">
      <img src={restaurant.photos?.[0] || '/placeholder.svg'} alt={restaurant.name} className="w-full h-64 object-cover rounded-xl mb-6" />
      <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
      <div className="text-muted-foreground mb-2">{restaurant.ville}</div>
      <div className="mb-4">{renderStars(avgRating)}</div>
      <div className="mb-6 text-lg text-foreground/80">{restaurant.description}</div>
      <Button size="lg" onClick={() => navigate(`/reservation?restaurantId=${restaurant._id}`)}>
        Faire une réservation
      </Button>
    </div>
  );
};

export default RestaurantDetail; 