import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Artwork } from '../Models/artwork';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  private baseUrl = 'http://localhost:5034/api/artistArtwork';
  private artworkSubject = new BehaviorSubject<Artwork[]>([]);
  public artworks$ = this.artworkSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Ottieni opere per categoria con paginazione
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<{ $values: Artwork[] }>(`${this.baseUrl}/category/${categoryId}/artworks`, { withCredentials: true }).pipe(
      map(response => response.$values),  // Estrai l'array degli artworks
      catchError(this.handleError)
    );
  }

  // Recupera un'opera d'arte per ID
  getArtworkById(id: number): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.baseUrl}/${id}`, { withCredentials: true })
      .pipe(
        tap(artwork => {
          // Aggiorna la lista delle opere d'arte in tempo reale
          const currentArtworks = this.artworkSubject.value;
          const updatedArtworks = currentArtworks.map(a => a.id === artwork.id ? artwork : a);
          this.artworkSubject.next(updatedArtworks);
        }),
        catchError(this.handleError)
      );
  }

  // Crea una nuova opera con l'URL dell'immagine
  createArtwork(artworkData: FormData): Observable<Artwork> {
    return this.http.post<Artwork>(`${this.baseUrl}/create`, artworkData, { withCredentials: true }).pipe(
      tap((newArtwork: Artwork) => {
        this.artworkSubject.next([...this.artworkSubject.value, newArtwork]);
      }),
      catchError(this.handleError)
    );
  }

  // Aggiorna un'opera esistente
  updateArtwork(id: number, artworkData: FormData): Observable<Artwork> {
    // Log per vedere cosa stiamo inviando
    for (let pair of (artworkData as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artworkData, { withCredentials: true })
      .pipe(
        tap((updatedArtwork: Artwork) => {
          const currentArtworks = this.artworkSubject.value.map(artwork =>
            artwork.id === id ? updatedArtwork : artwork
          );
          this.artworkSubject.next(currentArtworks);  // Aggiorna in tempo reale
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
          this.artworkSubject.next(updatedArtworks);  // Rimuove l'opera in tempo reale
        }),
        catchError(this.handleError)
      );
  }

  // Gestione degli errori
  private handleError(error: any): Observable<never> {
    console.error('Errore nel servizio ArtworkService:', error);
    return throwError(error);
  }
}
