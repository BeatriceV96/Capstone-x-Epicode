import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../Models/category';
import { Artwork } from '../Models/artwork';  // Importa il modello Artwork

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:5034/api/category';

  constructor(private http: HttpClient) {}

  // Ottieni tutte le categorie
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/all`)
      .pipe(
        catchError((error) => {
          console.error('Errore durante il caricamento delle categorie:', error);
          return throwError(error);
        })
      );
  }

  // Ottieni una categoria specifica dall'ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Errore durante il caricamento della categoria:', error);
          return throwError(error);
        })
      );
  }

  // Ottieni opere associate a una categoria specifica
  getArtworksByCategory(categoryId: number): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/${categoryId}/artworks`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Errore durante il caricamento delle opere:', error);
          return throwError(error);
        })
      );
  }

  // Crea una nuova categoria
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/create`, category, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Errore durante la creazione della categoria:', error);
          return throwError(error);
        })
      );
  }

  // Aggiorna una categoria esistente
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/update/${id}`, category, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Errore durante la richiesta di aggiornamento:', error);
          return throwError(error);
        })
      );
  }

  // Cancella una categoria
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Errore durante l\'eliminazione della categoria:', error);
          return throwError(error);
        })
      );
  }
}
