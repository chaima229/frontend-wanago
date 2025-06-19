
import { ApiService } from './api';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  cuisine: string;
  openingHours: string;
}

export interface SearchFilters {
  city?: string;
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
      
      if (filters.city) queryParams.append('city', filters.city);
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
      const response = await ApiService.get<RestaurantSearchResponse>('/restaurants');
      return response.restaurants;
    } catch (error) {
      console.error('Get all restaurants error:', error);
      throw new Error('Erreur lors de la récupération des restaurants.');
    }
  }
}
