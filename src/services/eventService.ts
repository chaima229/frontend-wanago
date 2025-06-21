import { ApiService } from './api';
import type { GeoJSONPoint } from './restaurantService'; // Importer si possible, sinon redéfinir

export interface Event {
  _id: string;
  title: string;
  description: string;
  dateStart: string;
  dateEnd?: string;
  location: GeoJSONPoint | string;
  organizerId?: string;
  photos?: string[];
  videos?: string[];
  price?: number;
  capacity?: number;
  category?: string;
  distance?: number; // Distance in meters from user
}

export class EventService {
  static async getAllEvents(): Promise<Event[]> {
    try {
      const response = await ApiService.get<{ events: Event[] }>('/events');
      return response.events;
    } catch (error) {
      console.error('Get all events error:', error);
      throw new Error('Erreur lors de la récupération des événements.');
    }
  }

  static async getNearbyEvents(latitude: number, longitude: number, radius: number = 10000): Promise<Event[]> {
    try {
      const endpoint = `/events/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
      const response = await ApiService.get<{ events: Event[] }>(endpoint);
      return response.events;
    } catch (error) {
      console.error('Nearby events error:', error);
      throw new Error('Erreur lors de la récupération des événements à proximité.');
    }
  }

  static async getEventById(id: string): Promise<Event> {
    try {
      const response = await ApiService.get<{ event: Event }>(`/events/${id}`);
      return response.event;
    } catch (error) {
      console.error(`Get event by ID ${id} error:`, error);
      throw new Error("Erreur lors de la récupération de l'événement.");
    }
  }
} 