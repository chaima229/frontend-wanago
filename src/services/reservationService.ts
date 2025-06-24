import { ApiService } from './api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RestaurantService } from "../services/restaurantService";
import { EventService } from "../services/eventService";

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

  async createRestaurantReservation(payload: any): Promise<any> {
    const response = await ApiService.post('/reservations', payload);
    return response;
  }

  async createEventReservation(payload: any): Promise<any> {
    const response = await ApiService.post('/reservations', payload);
    return response;
  }

  async cancelReservation(reservationId: string): Promise<any> {
    const response = await ApiService.put(`/reservations/${reservationId}/cancel`, {});
    return response;
  }

  async deleteReservation(id: string): Promise<void> {
    await ApiService.delete(`/reservations/${id}`);
  }
}

export const ReservationService = new ReservationServiceImpl();

const handlePayReservation = (reservation) => {
  const navigate = useNavigate();
  navigate(`/payment?reservationId=${reservation._id}`);
};
