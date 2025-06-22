import { ApiService } from './api';

export interface Reservation {
  _id: string;
  userId: string;
  itemType: 'activity' | 'event' | 'restaurant';
  itemId: string;
  date: string;
  participants: number;
  time?: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  price: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  // Ces champs sont ajoutés après population côté serveur
  itemName?: string; 
  userFullName?: string;
}

class ReservationServiceImpl {
  async getMyReservations(): Promise<Reservation[]> {
    const response = await ApiService.get<Reservation[]>('/reservations/my');
    return response;
  }

  async getAllReservations(): Promise<Reservation[]> {
    const response = await ApiService.get<Reservation[]>('/reservations');
    return response;
  }

  async getReservationById(id: string): Promise<Reservation> {
    const response = await ApiService.get<Reservation>(`/reservations/${id}`);
    return response;
  }

  async createRestaurantReservation(reservationData: any): Promise<any> {
    const response = await ApiService.post('/reservations', reservationData);
    return response;
  }
}

export const ReservationService = new ReservationServiceImpl();
