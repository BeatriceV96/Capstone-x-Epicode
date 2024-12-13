import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../Models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = 'http://localhost:5034/api/messages'; // URL del backend

  // Gestisce le immagini del profilo con BehaviorSubject per reattività
  private profilePictureSubject = new BehaviorSubject<{ [userId: number]: string }>({});
  profilePictures$ = this.profilePictureSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Ottieni la conversazione tra due utenti
  getConversation(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/conversation/${senderId}/${receiverId}`, {
      withCredentials: true,
    });
  }

  // Invia un nuovo messaggio
  sendMessage(message: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/send`, message, { withCredentials: true });
  }


  // Recupera messaggi non letti per un utente
  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`http://localhost:5034/api/notifications/unread/${userId}`, {
      withCredentials: true,
    });
  }

  getUnreadMessages(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/unread/${userId}`, { withCredentials: true });
  }

  // Aggiorna l'immagine del profilo per un utente specifico
  updateProfilePicture(userId: number, profilePictureUrl: string): void {
    const currentPictures = this.profilePictureSubject.getValue();
    this.profilePictureSubject.next({ ...currentPictures, [userId]: profilePictureUrl });
  }

  // Ottieni l'immagine del profilo di un utente specifico
  getProfilePicture(userId: number): string | undefined {
    return this.profilePictureSubject.getValue()[userId];
  }
}
