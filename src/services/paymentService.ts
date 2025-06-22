import { ApiService } from './api';

export interface Payment {
  _id: string;
  userId: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  userFullName?: string; // Ajouté depuis le backend
}

class PaymentServiceImpl {
  async getAllPayments(): Promise<Payment[]> {
    const response = await ApiService.get<Payment[]>('/payments');
    return response;
  }

  async createPayment(paymentData: any): Promise<any> {
    const response = await ApiService.post('/payments', paymentData);
    return response;
  }
}

export const PaymentService = new PaymentServiceImpl(); 