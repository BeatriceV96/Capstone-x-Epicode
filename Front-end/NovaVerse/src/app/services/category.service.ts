import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Definisci qui il baseUrl
  private baseUrl = 'http://localhost:5034/api/category'; // Modifica l'URL del backend se necessario

  constructor(private http: HttpClient) {}

  // Ottieni tutte le categorie
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/all`);
  }

  // Crea una nuova categoria (solo per Artist)
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/create`, category, { withCredentials: true });
  }

  // Aggiorna una categoria (solo per Artist)
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/update/${id}`, category);
  }

  // Cancella una categoria (solo per Artist)
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { withCredentials: true });
  }
}
