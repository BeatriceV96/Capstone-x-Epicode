import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Artwork } from '../Models/artwork';
import { ArtworkResponse } from '../Models/artwork-response';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  private baseUrl = 'http://localhost:5034/api/artistArtwork';
  private artworkSubject = new BehaviorSubject<Artwork[]>([]);  // Inizializza con un array vuoto
  public artworks$: Observable<Artwork[]> = this.artworkSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Ottieni opere per categoria con paginazione
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {        //NON MODIFICARE QUETSO!!!
    return this.http.get<{ $values: Artwork[] }>(`${this.baseUrl}/category/${categoryId}/artworks`, { withCredentials: true }).pipe(
      map(response => response.$values),  // Estrai l'array degli artworks
      catchError(this.handleError)
    );
  }

  // Carica l'immagine separatamente
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return throwError('Tipo di file non supportato. Accettati solo JPEG o PNG.');
    }

    const formData = new FormData();
    formData.append('imageFile', file);

    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/upload-image`, formData, { withCredentials: true });
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
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artworkData, { withCredentials: true }).pipe(
      tap((updatedArtwork: Artwork) => {
        const updatedArtworks = this.artworkSubject.value.map(artwork => artwork.id === id ? updatedArtwork : artwork);
        this.artworkSubject.next(updatedArtworks);
      }),
      catchError(this.handleError)
    );
  }

  // Elimina un'opera
  deleteArtwork(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true }).pipe(
      tap(() => {
        const updatedArtworks = this.artworkSubject.value.filter(artwork => artwork.id !== id);
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
