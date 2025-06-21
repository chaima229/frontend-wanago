import { ApiService } from './api';

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  uid: string;
}

export class UserService {
  static async getUserByUid(uid: string): Promise<UserData | null> {
    try {
      const response = await ApiService.get<UserData>(`/users/uid/${uid}`);
      return response;
    } catch (error) {
      console.error('Error fetching user by UID:', error);
      return null;
    }
  }

  static async getAllUsers(): Promise<UserData[]> {
    try {
      const response = await ApiService.get<UserData[]>('/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  static async updateUser(id: string, data: Partial<UserData>): Promise<UserData | null> {
    try {
      // Note: The backend route might expect the database _id, not the firebase uid
      const response = await ApiService.put<UserData>(`/users/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
} 