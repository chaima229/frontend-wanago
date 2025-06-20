import { ApiService } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  // Ajoute d'autres champs si besoin
}

export async function getCurrentUserProfile(token: string): Promise<UserProfile> {
  if (!token) {
    throw new Error('Token manquant pour getCurrentUserProfile');
  }
  const headers = { Authorization: `Bearer ${token}` };
  return ApiService.get<UserProfile>('/users/me', headers);
} 