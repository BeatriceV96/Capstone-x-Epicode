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

  // Ottieni opere per categoria
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/category/${categoryId}`, { withCredentials: true }).pipe(
      tap((artworks: Artwork[]) => {
        console.log('Opere recuperate:', artworks); // Log per debug
        this.artworkSubject.next(artworks);
      }),
      catchError(this.handleError)
    );
  }

  // Crea una nuova opera
  createArtwork(formData: FormData): Observable<Artwork> {
    // Log del FormData per il debug
    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    return this.http.post<Artwork>(`${this.baseUrl}/create`, formData, { withCredentials: true }).pipe(
      tap((newArtwork: Artwork) => {
        console.log('Opera creata:', newArtwork); // Log di debug
        const updatedArtworks = [...this.artworkSubject.value, newArtwork]; // Aggiungi la nuova opera all'elenco
        this.artworkSubject.next(updatedArtworks); // Aggiorna l'osservabile
      }),
      catchError(this.handleError)
    );
  }

  // Aggiorna un'opera esistente
  updateArtwork(id: number, formData: FormData): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, formData, { withCredentials: true }).pipe(
      tap((updatedArtwork: Artwork) => {
        console.log('Opera aggiornata:', updatedArtwork); // Log di debug
        const updatedArtworks = this.artworkSubject.value.map((artwork) =>
          artwork.id === id ? updatedArtwork : artwork
        );
        this.artworkSubject.next(updatedArtworks);
      }),
      catchError(this.handleError)
    );
  }

  // Elimina un'opera
  deleteArtwork(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Opera eliminata:', id); // Log di debug
        const updatedArtworks = this.artworkSubject.value.filter((artwork) => artwork.id !== id);
        this.artworkSubject.next(updatedArtworks);
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
