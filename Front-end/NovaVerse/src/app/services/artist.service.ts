import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { iUser } from '../Models/i-user';
import { Artwork } from '../Models/artwork';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'http://localhost:5034/api/artistDashboard';
  private artworksSubject = new BehaviorSubject<Artwork[]>([]);
  public artworks$ = this.artworksSubject.asObservable();
  private artistSubject = new BehaviorSubject<iUser | null>(null); // Memorizza i dati dell'artista
  public artist$ = this.artistSubject.asObservable();



  constructor(private http: HttpClient) {}

   // Cerca artisti in api alla query
   searchArtists(query: string): Observable<iUser[]> {
    return this.http.get<{ $values: iUser[] }>(`${this.apiUrl}/search/${query}` , { withCredentials: true })
      .pipe(
        map(response => response.$values || []),  // Assicurati che $values sia estratto correttamente
        catchError(() => of([]))  // In caso di errore, ritorna un array vuoto
      );
  }


   // Correggi il metodo per ottenere un artista per ID
   getArtistById(artistId: number): Observable<iUser> {
    return this.http.get<iUser>(`${this.apiUrl}/artist/${artistId}`, { withCredentials: true })
      .pipe(
        map(artist => artist || {
          id: 0,
          username: 'Unknown User',
          email: '',
          bio: '',
          profilePicture: '',
          createDate: new Date(),
          artworks: [],
          role: 'unknown'
        }),
        catchError(this.handleError)
      );
  }

   // Ottiene le opere per ID dell'utente
getArtworksByUserId(userId: number): Observable<Artwork[]> {
  return this.http.get<{ $values: Artwork[] }>(`http://localhost:5034/api/artistArtwork/user/${userId}`, { withCredentials: true })
    .pipe(
      map(response => response.$values),  // Estrai il valore corretto dalla risposta
      catchError(this.handleError)        // Gestione errori
    );
}


  // Ottiene il profilo utente dal backend
  getUserProfile(): Observable<iUser> {
    return this.http.get<iUser>(`${this.apiUrl}/profile`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)  // Gestione errori
      );
  }

 // Aggiorna la biografia e il profilo
  // Aggiorna la biografia e il profilo
  updateArtistProfile(artist: iUser): Observable<iUser> {
    return this.http.put<iUser>(`${this.apiUrl}/update-profile`, artist, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

// Carica una nuova immagine del profilo
updateProfilePicture(formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/update-profile-picture`, formData);
}

  // Aggiorna la biografia dell'artista
  updateArtistBio(artistId: number, bio: string): Observable<iUser> {
    const updatePayload = { bio };  // Corpo della richiesta per aggiornare la bio
    return this.http.put<iUser>(`${this.apiUrl}/update-profile/${artistId}`, updatePayload, { withCredentials: true }).pipe(
      tap((updatedArtist: iUser) => {
        this.artistSubject.next(updatedArtist);  // Aggiorna i dati locali con la nuova bio
      }),
      catchError(this.handleError)
    );
  }

  // Gestione degli errori
  private handleError(error: any): Observable<never> {
    console.error('Errore nel servizio ArtistService:', error);

    // Mostra un errore dettagliato all'utente
    alert('Si è verificato un errore durante il caricamento dei dati dell\'artista. Riprova più tardi.');

    return throwError(() => new Error(error.message || 'Errore sconosciuto nel servizio ArtistService.'));
  }


  // Chiamata per ottenere il profilo dell'artista loggato
   getArtistProfile(): Observable<iUser> {
    return this.http.get<iUser>(`${this.apiUrl}/profile`);
  }
}
