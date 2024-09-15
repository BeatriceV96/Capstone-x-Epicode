import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iUser } from '../Models/i-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5034/api/userdashboard';

  constructor(private http: HttpClient) { }

  // Aggiorna il profilo utente
  // Aggiorna il profilo utente (compreso l'URL dell'immagine di profilo)
  updateUserProfile(user: iUser): Observable<iUser> {
    return this.http.put<iUser>(`${this.apiUrl}/update-profile`, user, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Aggiorna l'immagine del profilo tramite FormData
  updateProfilePicture(profilePictureData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/updateProfilePicture`, profilePictureData, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserById(userId: number): Observable<iUser> {
    return this.http.get<iUser>(`${this.apiUrl}/users/${userId}`);
  }


// Ottiene il profilo utente dal backend
getUserProfile(): Observable<iUser> {
  return this.http.get<iUser>(`${this.apiUrl}/profile`, { withCredentials: true })
    .pipe(
      catchError(this.handleError)
    );
}
  // Aggiunge un'opera ai preferiti
  addFavorite(artworkId: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/favorites/${artworkId}`, {}, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Rimuove un'opera dai preferiti
  removeFavorite(artworkId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/favorites/${artworkId}`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestisce gli errori HTTP
  private handleError(error: any): Observable<never> {
    console.error('Si è verificato un errore:', error);
    return throwError(error.message || 'Errore sconosciuto');
  }
}
