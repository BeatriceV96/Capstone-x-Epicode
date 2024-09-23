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
        map(artwork => {
          // Assicurati che il nome della categoria sia parte dell'oggetto Artwork
          console.log('Artwork ricevuto:', artwork);  // Log per vedere il contenuto
          if (artwork.createDate) {
            artwork.createDate = new Date(artwork.createDate);  // Converte la data
          }
          return artwork;
        }),
        tap(artwork => {
          // Aggiorna l'elenco degli artwork in tempo reale
          const currentArtworks = this.artworkSubject.value;
          const updatedArtworks = currentArtworks.map(a => a.id === artwork.id ? artwork : a);
          this.artworkSubject.next(updatedArtworks);
        }),
        catchError(this.handleError)
      );
  }

  // Ottieni opere per utente
  getArtworksByUserId(userId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true }).pipe(
      tap((artworks: Artwork[]) => {
        this.artworkSubject.next(artworks); // Aggiorna la lista delle opere per l'utente
      }),
      catchError(this.handleError)
    );
  }

  // Ottieni opere casuali
  getRandomArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/random`, { withCredentials: true }) // Assicurati che la proprietà apiUrl sia corretta
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crea una nuova opera con l'URL dell'immagine
  createArtwork(artworkData: FormData): Observable<Artwork> {
    console.log('Dati inviati per la creazione:', artworkData);  // Log per vedere i dati inviati
    return this.http.post<Artwork>(`${this.baseUrl}/create`, artworkData, { withCredentials: true }).pipe(
      tap((newArtwork: Artwork) => {
        console.log('Nuova opera creata:', newArtwork);  // Log per vedere la nuova opera creata
        this.artworkSubject.next([...this.artworkSubject.value, newArtwork]);
      }),
      catchError(this.handleError)
    );
  }


 // Aggiorna un'opera esistente
updateArtwork(id: number, artworkData: FormData | Partial<Artwork>): Observable<Artwork> {
  const options = { withCredentials: true };

  if (artworkData instanceof FormData) {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artworkData, options)
      .pipe(
        tap((updatedArtwork: Artwork) => {
          const currentArtworks = this.artworkSubject.value.map(artwork =>
            artwork.id === id ? updatedArtwork : artwork
          );
          this.artworkSubject.next(currentArtworks);
        }),
        catchError(this.handleError)
      );
  } else {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artworkData, options)
      .pipe(
        tap((updatedArtwork: Artwork) => {
          const currentArtworks = this.artworkSubject.value.map(artwork =>
            artwork.id === id ? updatedArtwork : artwork
          );
          this.artworkSubject.next(currentArtworks);
        }),
        catchError(this.handleError)
      );
  }
}


  // Elimina un'opera
  deleteArtwork(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true }).pipe(
      map(() => {
        // Rimuovi l'opera eliminata dalla lista corrente
        const updatedArtworks = this.artworkSubject.value.filter(artwork => artwork.id !== id);
        this.artworkSubject.next(updatedArtworks);  // Aggiorna la lista degli artworks

        console.log(`Opera con ID ${id} eliminata con successo.`);  // Log dell'eliminazione
        return true;  // Restituisce true per segnalare il successo
      }),
      catchError(error => {
        console.error('Errore durante l\'eliminazione dell\'opera:', error);  // Log dell'errore
        return of(false);  // Restituisce false in caso di errore
      })
    );
  }


  // Gestione degli errori
  private handleError(error: any): Observable<never> {
    console.error('Errore nel servizio ArtworkService:', error);
    return throwError(error);
  }
}
