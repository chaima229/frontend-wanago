import { ApiService } from './api';
import { getAuth } from 'firebase/auth';

export interface ReservationData {
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

export interface Reservation {
  id: string;
  userId: string;
  itemType: string;
  itemId: string;
  date: string;
  time: string;
  participants: number; // Backend field
  guests: number; // Frontend compatibility field
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  price: number; // Prix par personne
  totalAmount: number; // Montant total
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  restaurant: {
    id: string;
    name: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationResponse {
  reservation: Reservation;
  message: string;
}

export class ReservationService {
  static async createReservation(data: ReservationData): Promise<CreateReservationResponse> {
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

      return await ApiService.post<CreateReservationResponse>('/reservations', data, headers);
    } catch (error) {
      console.error('Create reservation error:', error);
      throw new Error('Erreur lors de la création de la réservation.');
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
