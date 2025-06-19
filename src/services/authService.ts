
import { ApiService } from './api';

export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await ApiService.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      
      if (response.token) {
        ApiService.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erreur de connexion. Vérifiez vos identifiants.');
    }
  }

  static async register(fullName: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await ApiService.post<RegisterResponse>('/auth/register', {
        fullName,
        email,
        password,
      });
      
      if (response.token) {
        ApiService.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Erreur lors de la création du compte.');
    }
  }

  static async logout(): Promise<void> {
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      ApiService.removeToken();
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      return await ApiService.get<User>('/auth/me');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
}
