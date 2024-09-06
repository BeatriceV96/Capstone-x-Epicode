import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:5034/api/category';  // URL del backend

  constructor(private http: HttpClient) {}

  // Ottieni tutte le categorie
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  // Crea una nuova categoria
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create`, category, { withCredentials: true });
  }

  // Aggiorna una categoria esistente
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update/${id}`, category, { withCredentials: true });
  }

  // Elimina una categoria
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { withCredentials: true });
  }
}
