import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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

  // In artwork.service.ts
  getArtworksByUserId(userId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true }).pipe(
      tap((artworks: Artwork[]) => {
        this.artworkSubject.next(artworks); // Aggiorna la lista delle opere per l'utente
      }),
      catchError(this.handleError)
    );
  }

  getRandomArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/random`, { withCredentials: true }) // Assicurati che la proprietà apiUrl sia corretta
      .pipe(
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
        // Qui usiamo 'updatedArtwork' e non 'updatedArtworks'
        const currentArtworks = this.artworkSubject.value.map(artwork =>
          artwork.id === id ? updatedArtwork : artwork
        );
        // Aggiorna la lista degli artworks in tempo reale
        this.artworkSubject.next(currentArtworks);  // Usa currentArtworks qui
      }),
      catchError(this.handleError)
    );
}


  // Elimina un'opera
// Elimina un'opera
deleteArtwork(id: number): Observable<boolean> {
  return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true })
    .pipe(
      map(() => true),  // Se la chiamata ha successo, ritorna true
      catchError(error => {
        console.error('Errore nel servizio ArtworkService:', error);
        return of(false);  // In caso di errore, ritorna false
      })
    );
}

  // Gestione degli errori
  private handleError(error: any): Observable<never> {
    console.error('Errore nel servizio ArtworkService:', error);
    return throwError(error);
  }
}
