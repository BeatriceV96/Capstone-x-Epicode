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
  updateUserProfile(user: iUser): Observable<iUser> {
    return this.http.put<iUser>(`${this.apiUrl}/update-profile`, user, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Ottiene il profilo utente dal backend
  getUserProfile(): Observable<iUser> {
    return this.http.get<iUser>(`${this.apiUrl}/profile`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Aggiorna l'immagine del profilo
  updateProfilePicture(profilePictureData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/updateProfilePicture`, profilePictureData, { withCredentials: true });
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
