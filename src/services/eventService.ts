import { ApiService } from './api';

export class EventService {
  static async getAllEvents() {
    return await ApiService.get('/events');
  }
} 