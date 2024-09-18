import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { Favorite } from '../Models/favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:5034/api/favorite';
  private favoritesSubject: BehaviorSubject<Favorite[]> = new BehaviorSubject<Favorite[]>([]);

  get favorites$(): Observable<Favorite[]> {
    return this.favoritesSubject.asObservable();
  }

  constructor(private http: HttpClient) {}

  getUserFavorites(): Observable<Favorite[]> {
    return this.http.get<{$values:Favorite[]}>('http://localhost:5034/api/favorite/myfavorites', { withCredentials: true }).pipe(
      map(response => response.$values),
      //catchError(error => console.error('Errore nel caricamento dei preferiti:', error))
    )
  }

  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/add`, favorite, {
      withCredentials: true
    });
  }

  removeFavorite(favoriteId: number): void {
    this.http.delete(`http://localhost:5034/api/favorite/remove/${favoriteId}`, { withCredentials: true })
      .subscribe(() => {
        const updatedFavorites = this.favoritesSubject.getValue().filter(fav => fav.id !== favoriteId);
        this.favoritesSubject.next(updatedFavorites);  // Aggiorna la lista dei preferiti
      });
  }


  removeFavoriteFromList(favoriteId: number): void {
    const currentFavorites = this.favoritesSubject.getValue();
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== favoriteId);
    this.favoritesSubject.next(updatedFavorites);  // Update the BehaviorSubject with the updated list
  }
}
