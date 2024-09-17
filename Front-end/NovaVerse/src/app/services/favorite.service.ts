import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../Models/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:5034/api/favorite'; // Assicurati che l'URL sia corretto

  constructor(private http: HttpClient) {}

  // Recupera i favoriti dell'utente
  getUserFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/myfavorites`, { withCredentials: true });
  }

  // Aggiungi un'opera ai preferiti
  addFavorite(favorite: Favorite): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, favorite, { withCredentials: true });
  }

  // Rimuovi un'opera dai preferiti
  removeFavorite(favoriteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${favoriteId}`);
  }
}
