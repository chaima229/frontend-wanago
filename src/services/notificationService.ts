import { ApiService } from './api';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  relatedId: string;
  createdAt: string;
}

class NotificationServiceImpl {
  async getMyNotifications(): Promise<Notification[]> {
    const response = await ApiService.get<Notification[]>('/notifications/my-notifications');
    return response || [];
  }

  async markAllAsRead(): Promise<{ message: string }> {
    return await ApiService.post('/notifications/mark-as-read', {});
  }
}

export const NotificationService = new NotificationServiceImpl(); 