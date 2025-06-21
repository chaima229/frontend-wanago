import { ApiService } from './api';

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}
export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  description: string;
  location: GeoJSONPoint | string;
  price?: number; // Rendre optionnel car pas toujours présent
  priceRange?: string;
  rating?: number; // Rendre optionnel
  cuisine: string;
  openingHours: string;
  ownerId?: string;
  distance?: number; // Distance in meters from user
}

export interface SearchFilters {
  ville?: string;
  date?: string;
  guests?: number;
  cuisine?: string;
  priceRange?: [number, number];
}

export interface RestaurantSearchResponse {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
}

export class RestaurantService {
  static async searchRestaurants(filters: SearchFilters): Promise<RestaurantSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.ville) queryParams.append('ville', filters.ville);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.guests) queryParams.append('guests', filters.guests.toString());
      if (filters.cuisine) queryParams.append('cuisine', filters.cuisine);
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString());
        queryParams.append('maxPrice', filters.priceRange[1].toString());
      }

      const endpoint = `/restaurants/search?${queryParams.toString()}`;
      return await ApiService.get<RestaurantSearchResponse>(endpoint);
    } catch (error) {
      console.error('Search restaurants error:', error);
      throw new Error('Erreur lors de la recherche de restaurants.');
    }
  }

  static async getNearbyRestaurants(latitude: number, longitude: number, radius: number = 10000): Promise<Restaurant[]> {
    try {
      const endpoint = `/restaurants/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
      const response = await ApiService.get<{ restaurants: Restaurant[] }>(endpoint);
      return response.restaurants;
    } catch (error) {
      console.error('Nearby restaurants error:', error);
      throw new Error('Erreur lors de la récupération des restaurants à proximité.');
    }
  }

  static async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      return await ApiService.get<Restaurant>(`/restaurants/${id}`);
    } catch (error) {
      console.error('Get restaurant error:', error);
      throw new Error('Erreur lors de la récupération du restaurant.');
    }
  }

  static async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await ApiService.get<Restaurant[]>('/restaurants');
      return response || [];
    } catch (error) {
      console.error('Get all restaurants error:', error);
      throw new Error('Erreur lors de la récupération des restaurants.');
    }
  }
}
