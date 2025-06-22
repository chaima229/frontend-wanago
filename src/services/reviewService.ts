import { ApiService } from './api';

export interface Review {
  _id: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface ReviewData {
    comment: string;
    rating: number;
    entityType: 'restaurant' | 'event';
    entityId: string;
}

export interface AdminReview {
  _id: string;
  comment: string;
  rating: number;
  entityType: string;
  entityId: string;
  createdAt: string;
  userName: string;
  userEmail: string;
}

export class ReviewService {
  static async submitReview(data: ReviewData): Promise<Review> {
    const response = await ApiService.post<Review>('/reviews', data);
    return response;
  }

  static async getAllReviewsForAdmin(): Promise<AdminReview[]> {
    return ApiService.get<AdminReview[]>('/reviews');
  }

  static async deleteReview(id: string): Promise<void> {
    return ApiService.delete(`/reviews/${id}`);
  }
} 