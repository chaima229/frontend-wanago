
import { ApiService } from './api';

export interface ReservationData {
  restaurantId: string;
  date: string;
  time: string;
  guests: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface Reservation extends ReservationData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  restaurant: {
    id: string;
    name: string;
    location: string;
  };
}

export interface CreateReservationResponse {
  reservation: Reservation;
  message: string;
}

export class ReservationService {
  static async createReservation(data: ReservationData): Promise<CreateReservationResponse> {
    try {
      return await ApiService.post<CreateReservationResponse>('/reservations', data);
    } catch (error) {
      console.error('Create reservation error:', error);
      throw new Error('Erreur lors de la création de la réservation.');
    }
  }

  static async getUserReservations(): Promise<Reservation[]> {
    try {
      const response = await ApiService.get<{ reservations: Reservation[] }>('/reservations/my');
      return response.reservations;
    } catch (error) {
      console.error('Get user reservations error:', error);
      throw new Error('Erreur lors de la récupération des réservations.');
    }
  }

  static async getReservationById(id: string): Promise<Reservation> {
    try {
      return await ApiService.get<Reservation>(`/reservations/${id}`);
    } catch (error) {
      console.error('Get reservation error:', error);
      throw new Error('Erreur lors de la récupération de la réservation.');
    }
  }

  static async cancelReservation(id: string): Promise<void> {
    try {
      await ApiService.put(`/reservations/${id}/cancel`);
    } catch (error) {
      console.error('Cancel reservation error:', error);
      throw new Error('Erreur lors de l\'annulation de la réservation.');
    }
  }
}
