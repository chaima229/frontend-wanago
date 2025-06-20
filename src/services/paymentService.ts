import { ApiService } from './api';
import { getAuth } from 'firebase/auth';

export interface PaymentData {
  reservationId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface PayPalOrderResponse {
  orderId: string;
  approvalUrl: string;
  status: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export class PaymentService {
  static async createPayPalOrder(paymentData: PaymentData): Promise<PayPalOrderResponse> {
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

      return await ApiService.post<PayPalOrderResponse>('/payments/create-paypal-order', paymentData, headers);
    } catch (error) {
      console.error('Create PayPal order error:', error);
      throw new Error('Erreur lors de la création de la commande PayPal.');
    }
  }

  static async capturePayPalPayment(orderId: string): Promise<PaymentResponse> {
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

      return await ApiService.post<PaymentResponse>(`/payments/capture-paypal-payment/${orderId}`, {}, headers);
    } catch (error) {
      console.error('Capture PayPal payment error:', error);
      throw new Error('Erreur lors de la capture du paiement PayPal.');
    }
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
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

      return await ApiService.get<PaymentResponse>(`/payments/status/${paymentId}`, headers);
    } catch (error) {
      console.error('Get payment status error:', error);
      throw new Error('Erreur lors de la récupération du statut du paiement.');
    }
  }
} 