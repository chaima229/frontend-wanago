import { ApiService } from './api';
import { getAuth } from 'firebase/auth';

export interface PaymentData {
  reservationId: string;
  montant: number;
  currency: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  success?: boolean;
  message: string;
  transactionId?: string;
  orderId?: string;
  approvalUrl?: string;
  status?: string;
}

export class PaymentService {
  // src/services/PaymentService.ts
  static async createPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('--- Creating payment ---');
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('Payment Error: User not authenticated.');
        throw new Error('Utilisateur non authentifié pour le paiement.');
      }
      
      console.log(`User UID: ${user.uid}`);
      const idToken = await user.getIdToken(true); // Forcer le rafraîchissement du token
      console.log('Token generated for payment.');

      const headers = { 'Authorization': `Bearer ${idToken}` };
      
      const response = await ApiService.post<PaymentResponse>('/payments', paymentData, headers);
  
      if (response.approvalUrl) {
        // Redirige vers PayPal
        window.location.href = response.approvalUrl;
      }
  
      return response;
    } catch (error) {
      console.error('Create payment error in service:', error);
      throw new Error('Erreur lors de la création du paiement.');
    }
  }
  

  static async capturePayPalPayment(orderId: string): Promise<PaymentResponse> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Utilisateur non authentifié");
  
      const idToken = await user.getIdToken();
      const headers = {
        Authorization: `Bearer ${idToken}`,
      };
  
      return await ApiService.post<PaymentResponse>(`/payments/capture/${orderId}`, {}, headers);
    } catch (error) {
      console.error("Capture PayPal payment error:", error);
      throw new Error("Erreur lors de la capture du paiement PayPal.");
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

  static async getAllPayments(): Promise<any[]> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('Authentification administrateur requise');

      const idToken = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${idToken}` };
      
      const response = await ApiService.get<any[]>('/payments', headers);
      return response || [];
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw new Error('Erreur lors de la récupération de tous les paiements.');
    }
  }
} 