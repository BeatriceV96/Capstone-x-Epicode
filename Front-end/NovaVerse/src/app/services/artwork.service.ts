import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artwork, ArtworkType } from '../Models/artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private baseUrl = 'http://localhost:5034/api/artistArtwork';

  constructor(private http: HttpClient) {}

  // Ottieni tutte le opere per una specifica categoria
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/category/${categoryId}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore durante il caricamento delle opere per la categoria:', error);
          throw error;
        })
      );
  }

  // Ottieni tutte le opere
  getAllArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/all`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore durante il caricamento delle opere:', error);
          throw error;
        })
      );
  }

  // Crea una nuova opera
  createArtwork(formData: FormData): Observable<Artwork> {
    return this.http.post<Artwork>(`${this.baseUrl}/create`, formData, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore durante la creazione dell\'opera:', error);
          throw error;
        })
      );
  }

  // Aggiorna un'opera esistente
  updateArtwork(id: number, formData: FormData): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, formData, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore durante l\'aggiornamento dell\'opera:', error);
          throw error;
        })
      );
  }

  // Elimina un'opera
  deleteArtwork(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Errore durante l\'eliminazione dell\'opera:', error);
          throw error;
        })
      );
  }
}
