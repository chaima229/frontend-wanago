import { ApiService } from './api';
import { getAuth } from 'firebase/auth';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  uid: string;
}

class UserServiceImpl {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  async getAllUsers(): Promise<User[]> {
    const response = await ApiService.get<User[]>('/users');
    return response || [];
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await ApiService.put<User>(`/users/${userId}`, data);
    return response;
  }

  async toggleUserValidation(userId: string): Promise<User> {
    const response = await ApiService.patch<User>(`/users/${userId}/toggle-validation`, {});
    return response;
  }

  async getUserByUid(uid: string): Promise<User | null> {
    try {
      const user = await ApiService.get<User>(`/users/uid/${uid}`);
      return user;
    } catch (error) {
      console.error(`Error fetching user by UID ${uid}:`, error);
      // Retourner null si l'utilisateur n'est pas trouvé (erreur 404) ou autre erreur
      return null;
    }
  }

  async getUserById(id: string): Promise<User> {
    const response = await ApiService.get<User>(`/users/${id}`);
    return response;
  }
}

export const UserService = new UserServiceImpl(); 