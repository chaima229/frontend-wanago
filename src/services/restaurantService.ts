import { ApiService } from './api';

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  ville: string; // 'ville' in some backend parts
  cuisineType: string;
  description: string;
  location: GeoJSONPoint | string;
  photos: string[];
  videos: string[];
  openingHours: string;
  priceRange: string;
  price?: number;
  amenities: string[];
  ownerId?: string;
  cancellationPolicy: string;
  ratings?: number[];
  distance?: number;
}

export interface SearchFilters {
  ville?: string;
  date?: string;
  guests?: number;
}

export interface RestaurantSearchResponse {
  restaurants: Restaurant[];
  total: number;
}

class RestaurantServiceImpl {
  // --- Admin Methods ---
  async getAllRestaurants(): Promise<Restaurant[]> {
    return ApiService.get<Restaurant[]>('/restaurants');
  }

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    return ApiService.post<Restaurant>('/restaurants', data);
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    return ApiService.put<Restaurant>(`/restaurants/${id}`, data);
  }

  async deleteRestaurant(id: string): Promise<void> {
    return ApiService.delete<void>(`/restaurants/${id}`);
  }

  // --- Public Methods ---
  async searchRestaurants(filters: SearchFilters): Promise<RestaurantSearchResponse> {
    const queryParams = new URLSearchParams();
    if (filters.ville) queryParams.append('ville', filters.ville);
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.guests) queryParams.append('guests', filters.guests.toString());
    const endpoint = `/restaurants/search?${queryParams.toString()}`;
    return ApiService.get<RestaurantSearchResponse>(endpoint);
  }

  async getNearbyRestaurants(latitude: number, longitude: number): Promise<Restaurant[]> {
    const endpoint = `/restaurants/nearby?lat=${latitude}&lon=${longitude}`;
    return ApiService.get<Restaurant[]>(endpoint);
  }
  
  async getRestaurantById(id: string): Promise<Restaurant> {
    return ApiService.get<Restaurant>(`/restaurants/${id}`);
  }
}

export const RestaurantService = new RestaurantServiceImpl();
