import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:5034/api/notifications'; // URL base per l'API

  constructor(private http: HttpClient) {}

  // Recupera le notifiche non lette
  getUnreadNotifications(receiverId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${receiverId}`, { withCredentials: true });
  }

  // Marca tutte le notifiche come lette
  markAllNotificationsAsRead(notificationIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-as-read`, notificationIds, {
        withCredentials: true,
    });
}

markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-as-read/${notificationId}`, null, {
        withCredentials: true,
    });
}


}
