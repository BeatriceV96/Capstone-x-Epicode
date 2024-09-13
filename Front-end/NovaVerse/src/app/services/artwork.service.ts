import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Artwork } from '../Models/artwork';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  private baseUrl = 'http://localhost:5034/api/artistArtwork';
  private artworkSubject = new BehaviorSubject<Artwork[]>([]);
  public artworks$: Observable<Artwork[]> = this.artworkSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Ottieni tutte le opere associate a una categoria
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/category/${categoryId}/artworks`, { withCredentials: true })
      .pipe(
        tap((artworks: Artwork[]) => this.artworkSubject.next(artworks)),
        catchError(this.handleError)
      );
  }

  // Crea una nuova opera
  createArtwork(artworkData: FormData): Observable<Artwork> {
    return this.http.post<Artwork>(`${this.baseUrl}/create`, artworkData, { withCredentials: true })
      .pipe(
        tap((newArtwork: Artwork) => {
          const updatedArtworks = [...this.artworkSubject.value, newArtwork];
          this.artworkSubject.next(updatedArtworks);
        }),
        catchError(this.handleError)
      );
  }

  // Aggiorna un'opera esistente
  updateArtwork(id: number, artworkData: FormData): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artworkData, { withCredentials: true })
      .pipe(
        tap((updatedArtwork: Artwork) => {
          const updatedArtworks = this.artworkSubject.value.map(artwork => artwork.id === id ? updatedArtwork : artwork);
          this.artworkSubject.next(updatedArtworks);
        }),
        catchError(this.handleError)
      );
  }

  // Elimina un'opera
  deleteArtwork(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true })
      .pipe(
        tap(() => {
          const updatedArtworks = this.artworkSubject.value.filter(artwork => artwork.id !== id);
          this.artworkSubject.next(updatedArtworks);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Errore nel servizio ArtworkService:', error);
    return throwError(error);
  }
}
