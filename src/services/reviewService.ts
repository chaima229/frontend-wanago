import { ApiService } from './api';

export interface Review {
  _id: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface ReviewData {
    comment: string;
    rating: number;
}

export class ReviewService {
  static async submitReview(data: ReviewData): Promise<Review> {
    const response = await ApiService.post<Review>('/reviews', data);
    return response;
  }
} 