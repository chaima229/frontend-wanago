import { ApiService } from './api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

  async createEventReservation(event: any, user: any): Promise<any> {
    const reservationPayload = {
      itemType: 'event',
      itemId: event._id || event.id,
      date: event.dateStart,
      participants: 1, // ou adaptez selon votre logique
      customerInfo: {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
      },
      price: event.price,
      totalAmount: event.price,
    };
    const response = await ApiService.post('/reservations', reservationPayload);
    return response;
  }

  async cancelReservation(reservationId: string): Promise<any> {
    const response = await ApiService.put(`/reservations/${reservationId}/cancel`, {});
    return response;
  }
}

export const ReservationService = new ReservationServiceImpl();

const handlePayReservation = (reservation) => {
  const navigate = useNavigate();
  navigate(`/payment?reservationId=${reservation._id}`);
};
