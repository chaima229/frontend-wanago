import { ApiService } from './api';
import { getAuth } from 'firebase/auth';
import type { User } from './firebaseAuthService'; // Importer le type User depuis le bon endroit
import type { Event } from './eventService'; // Importer le type Event

export interface RestaurantReservationData {
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  price: number; // Prix par personne
  totalAmount: number; // Montant total
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface EventReservationData {
  itemType: 'event';
  itemId: string;
  date: string;
  participants: number;
  price?: number;
  totalAmount?: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface Reservation {
  _id: string;
  userId: string;
  itemType: string;
  itemId: string;
  date: string;
  time?: string;
  participants: number; // Backend field
  guests: number; // Frontend compatibility field
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  price: number; // Prix par personne
  totalAmount?: number; // Montant total
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  restaurant?: { // Rendre optionnel
    _id: string;
    name: string;
    location: any;
  };
  event?: { // Ajouter le champ event
    _id: string;
    title: string;
    location: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationResponse {
  reservation: Reservation;
  message: string;
}

export class ReservationService {
  static async createRestaurantReservation(data: RestaurantReservationData): Promise<CreateReservationResponse> {
    try {
      // Get the current user's ID token
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const idToken = await user.getIdToken();
      
      // Add the token to the request headers
      const headers = {
        'Authorization': `Bearer ${idToken}`
      };

      const payload = {
        itemType: 'restaurant',
        itemId: data.restaurantId,
        date: data.date,
        participants: data.guests, // Map guests to participants
        time: data.time,
        price: data.price,
        totalAmount: data.totalAmount,
        customerInfo: data.customerInfo
      };

      return await ApiService.post<CreateReservationResponse>('/reservations', payload, headers);
    } catch (error) {
      console.error('Create reservation error:', error);
      throw new Error('Erreur lors de la création de la réservation.');
    }
  }

  static async createEventReservation(event: Event, currentUser: User): Promise<CreateReservationResponse> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user || !currentUser) {
        throw new Error('Utilisateur non authentifié');
      }

      const idToken = await user.getIdToken();
      
      const headers = {
        'Authorization': `Bearer ${idToken}`
      };

      const reservationData: EventReservationData = {
        itemType: 'event',
        itemId: event._id,
        date: event.dateStart,
        participants: 1, // Par défaut à 1 pour un événement
        price: event.price,
        totalAmount: event.price,
        customerInfo: {
          fullName: currentUser.fullName, // Correction: .name -> .fullName
          email: currentUser.email,
          phone: currentUser.phone || '',
        }
      };

      return await ApiService.post<CreateReservationResponse>('/reservations', reservationData, headers);
    } catch (error) {
      console.error('Create event reservation error:', error);
      throw new Error('Erreur lors de la création de la réservation de l\'événement.');
    }
  }

  static async getUserReservations(): Promise<Reservation[]> {
    try {
      // Get the current user's ID token
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const idToken = await user.getIdToken();
      
      // Add the token to the request headers
      const headers = {
        'Authorization': `Bearer ${idToken}`
      };

      const response = await ApiService.get<Reservation[]>('/reservations/my', headers);
      return response || [];
    } catch (error) {
      console.error('Get user reservations error:', error);
      throw new Error('Erreur lors de la récupération des réservations.');
    }
  }

  static async getReservationById(id: string): Promise<Reservation> {
    try {
      // Get the current user's ID token
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const idToken = await user.getIdToken();
      
      // Add the token to the request headers
      const headers = {
        'Authorization': `Bearer ${idToken}`
      };

      return await ApiService.get<Reservation>(`/reservations/${id}`, headers);
    } catch (error) {
      console.error('Get reservation error:', error);
      throw new Error('Erreur lors de la récupération de la réservation.');
    }
  }

  static async cancelReservation(id: string): Promise<void> {
    try {
      // Get the current user's ID token
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const idToken = await user.getIdToken();
      
      // Add the token to the request headers
      const headers = {
        'Authorization': `Bearer ${idToken}`
      };

      await ApiService.put(`/reservations/${id}/cancel`, {}, headers);
    } catch (error) {
      console.error('Cancel reservation error:', error);
      throw new Error('Erreur lors de l\'annulation de la réservation.');
    }
  }
}
