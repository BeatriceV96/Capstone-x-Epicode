import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artwork } from '../Models/artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private baseUrl = 'http://localhost:5034/api/artistArtwork';

  constructor(private http: HttpClient) {}

  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/category/${categoryId}`)
      .pipe(
        catchError(error => {
          console.error('Errore durante il caricamento delle opere:', error);
          throw error;
        })
      );
  }


  getAllArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/all`)
      .pipe(
        catchError(error => {
          console.error('Errore durante il caricamento delle opere:', error);
          throw error;
        })
      );
  }


  createArtwork(artwork: Partial<Artwork>): Observable<Artwork> {
    return this.http.post<Artwork>(`${this.baseUrl}/create`, artwork)
      .pipe(
        catchError(error => {
          console.error('Errore durante la creazione dell\'opera:', error);
          throw error;
        })
      );
  }

  updateArtwork(id: number, artwork: Partial<Artwork>): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artwork)
      .pipe(
        catchError(error => {
          console.error('Errore durante l\'aggiornamento dell\'opera:', error);
          throw error;
        })
      );
  }

  deleteArtwork(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`)
      .pipe(
        catchError(error => {
          console.error('Errore durante l\'eliminazione dell\'opera:', error);
          throw error;
        })
      );
  }
}
