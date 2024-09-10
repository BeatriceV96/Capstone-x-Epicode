import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:5034/api/category';  // URL del backend

  constructor(private http: HttpClient) {}

  // Ottieni tutte le categorie
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/all`);
  }

  // Ottieni una categoria specifica dall'ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  // Crea una nuova categoria
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/create`, category, { withCredentials: true });
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
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Errore durante l\'eliminazione della categoria:', error);
        return of(null);  // Restituisce null in caso di errore
      })
    );
  }
}
